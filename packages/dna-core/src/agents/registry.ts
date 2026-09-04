import type { DnaConfig } from "@superhumaan/dna-config";
import { DEFAULT_AGENT_HEARTBEAT_TTL_SECONDS } from "@superhumaan/dna-config";
import { git } from "@superhumaan/dna-github";
import {
  createAgentRecord,
  nowIso,
  openAgentStore,
  withAgentLock,
  type AgentStore,
} from "./db.js";
import { activeAgents, findClaimConflict, mergeUniquePaths, type ClaimConflict } from "./claims.js";
import type { AgentRecord, AgentStatus, AgentType } from "./types.js";

export function resolveHeartbeatTtl(config?: Pick<DnaConfig, "agents"> | null): number {
  const ttl = config?.agents?.heartbeatTtlSeconds;
  return typeof ttl === "number" && ttl > 0 ? ttl : DEFAULT_AGENT_HEARTBEAT_TTL_SECONDS;
}

export function isAgentMeshEnabled(config?: Pick<DnaConfig, "agents"> | null): boolean {
  return config?.agents?.mesh !== false;
}

export async function detectCurrentBranch(root: string): Promise<{ branch: string | null; known: boolean }> {
  try {
    const status = await git(root).status();
    const branch = status.current?.trim() || null;
    return { branch, known: Boolean(branch) };
  } catch {
    return { branch: null, known: false };
  }
}

export interface RegisterAgentInput {
  root: string;
  config?: Pick<DnaConfig, "agents" | "git"> | null;
  id?: string;
  parentId?: string | null;
  type?: AgentType;
  task?: string;
  branch?: string | null;
  worktree?: string | null;
}

export async function registerAgent(input: RegisterAgentInput): Promise<AgentRecord> {
  const { root, config } = input;
  return withAgentLock(root, async () => {
    const store = await openAgentStore(root);
    try {
      if (input.id) {
        const existing = await store.get(input.id);
        if (existing) {
          const detected = input.branch !== undefined ? { branch: input.branch } : await detectCurrentBranch(root);
          const updated = await store.update(input.id, {
            status: "active",
            heartbeat_at: nowIso(),
            task: input.task ?? existing.task,
            parent_id: input.parentId ?? existing.parent_id,
            type: input.type ?? existing.type,
            branch: detected.branch ?? existing.branch,
            worktree: input.worktree ?? existing.worktree ?? root,
          });
          return updated ?? existing;
        }
      }
      const detected = input.branch !== undefined ? { branch: input.branch } : await detectCurrentBranch(root);
      const record = createAgentRecord({
        id: input.id,
        parent_id: input.parentId ?? null,
        type: input.type ?? "primary",
        task: input.task ?? "",
        branch: detected.branch ?? null,
        worktree: input.worktree ?? root,
      });
      void config;
      return await store.upsert(record);
    } finally {
      store.close();
    }
  });
}

export async function heartbeatAgent(root: string, agentId: string): Promise<AgentRecord | null> {
  return withAgentLock(root, async () => {
    const store = await openAgentStore(root);
    try {
      return store.update(agentId, { heartbeat_at: nowIso(), status: "active" });
    } finally {
      store.close();
    }
  });
}

export async function releaseAgent(
  root: string,
  agentId: string,
  status: AgentStatus = "completed",
): Promise<AgentRecord | null> {
  return withAgentLock(root, async () => {
    const store = await openAgentStore(root);
    try {
      return store.update(agentId, { status, heartbeat_at: nowIso() });
    } finally {
      store.close();
    }
  });
}

export async function claimPaths(
  root: string,
  agentId: string,
  paths: string[],
  config?: Pick<DnaConfig, "agents"> | null,
): Promise<{ agent: AgentRecord; conflicts: ClaimConflict[] }> {
  return withAgentLock(root, async () => {
    const store = await openAgentStore(root);
    try {
      const ttl = resolveHeartbeatTtl(config);
      const all = await store.list();
      const live = activeAgents(all, ttl);
      const conflicts: ClaimConflict[] = [];
      for (const path of paths) {
        const conflict = findClaimConflict(live, path, agentId);
        if (conflict) conflicts.push(conflict);
      }
      if (conflicts.length) {
        const agent = (await store.get(agentId)) ?? createAgentRecord({ id: agentId });
        return { agent, conflicts };
      }
      let agent = await store.get(agentId);
      if (!agent) {
        agent = await store.upsert(createAgentRecord({ id: agentId, worktree: root }));
      }
      const updated = await store.update(agentId, {
        claimed_paths: mergeUniquePaths(agent.claimed_paths, paths),
        heartbeat_at: nowIso(),
        status: "active",
      });
      return { agent: updated ?? agent, conflicts: [] };
    } finally {
      store.close();
    }
  });
}

export async function recordModifiedPaths(root: string, agentId: string, paths: string[]): Promise<AgentRecord | null> {
  return withAgentLock(root, async () => {
    const store = await openAgentStore(root);
    try {
      let agent = await store.get(agentId);
      if (!agent) {
        agent = await store.upsert(createAgentRecord({ id: agentId, worktree: root }));
      }
      return store.update(agentId, {
        modified_paths: mergeUniquePaths(agent.modified_paths, paths),
        claimed_paths: mergeUniquePaths(agent.claimed_paths, paths),
        heartbeat_at: nowIso(),
        status: "active",
      });
    } finally {
      store.close();
    }
  });
}

export async function recordLastCommit(root: string, agentId: string, sha: string): Promise<AgentRecord | null> {
  return withAgentLock(root, async () => {
    const store = await openAgentStore(root);
    try {
      return store.update(agentId, { last_commit: sha, heartbeat_at: nowIso() });
    } finally {
      store.close();
    }
  });
}

export async function listAgents(root: string): Promise<AgentRecord[]> {
  const store = await openAgentStore(root);
  try {
    return store.list();
  } finally {
    store.close();
  }
}

export async function getAgent(root: string, agentId: string): Promise<AgentRecord | null> {
  const store = await openAgentStore(root);
  try {
    return store.get(agentId);
  } finally {
    store.close();
  }
}

export async function listLiveAgents(
  root: string,
  config?: Pick<DnaConfig, "agents"> | null,
): Promise<AgentRecord[]> {
  const agents = await listAgents(root);
  return activeAgents(agents, resolveHeartbeatTtl(config));
}

export function formatAgentStatus(agents: AgentRecord[], ttl: number): string {
  const lines = ["DNA Agent Mesh", "==============", ""];
  if (agents.length === 0) {
    lines.push("No registered agents.");
    return lines.join("\n");
  }
  const live = new Set(activeAgents(agents, ttl).map((a) => a.id));
  for (const agent of agents) {
    const freshness = live.has(agent.id) ? "live" : "stale";
    lines.push(
      `${agent.id}  ${agent.type}/${agent.status}  ${freshness}  ${agent.task || "(no task)"}`,
    );
    lines.push(
      `  branch=${agent.branch ?? "-"}  claims=${agent.claimed_paths.length}  modified=${agent.modified_paths.length}  last=${agent.last_commit ?? "-"}`,
    );
    if (agent.claimed_paths.length) {
      lines.push(`  claimed: ${agent.claimed_paths.join(", ")}`);
    }
  }
  return lines.join("\n");
}

export async function withStore<T>(root: string, fn: (store: AgentStore) => Promise<T>): Promise<T> {
  const store = await openAgentStore(root);
  try {
    return await fn(store);
  } finally {
    store.close();
  }
}
