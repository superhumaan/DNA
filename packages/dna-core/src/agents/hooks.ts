import type { DnaConfig } from "@superhumaan/dna-config";
import { isIntegrationBranch } from "@superhumaan/dna-config";
import { git } from "@superhumaan/dna-github";
import { findClaimConflict } from "./claims.js";
import { formatLiveCoordination } from "./context.js";
import { evaluateGitGuardian } from "./guardian.js";
import {
  detectCurrentBranch,
  isAgentMeshEnabled,
  listLiveAgents,
  recordModifiedPaths,
  registerAgent,
  resolveHeartbeatTtl,
} from "./registry.js";
import {
  COMMIT_GATE_FAILED,
  GIT_GUARDIAN_DENIED,
  isReadOnlySubagentType,
  type AgentHookPayload,
  type HookDecision,
} from "./types.js";

const ALLOW: HookDecision = { permission: "allow" };

function eventName(payload: AgentHookPayload): string {
  return (payload.hook_event_name ?? "").trim();
}

function extractPaths(payload: AgentHookPayload): string[] {
  const paths: string[] = [];
  if (typeof payload.file_path === "string") paths.push(payload.file_path);
  const input = payload.tool_input ?? {};
  for (const key of ["path", "file_path", "target_notebook", "filePath"]) {
    const value = input[key];
    if (typeof value === "string") paths.push(value);
  }
  return paths;
}

function extractCommand(payload: AgentHookPayload): string {
  if (typeof payload.command === "string" && payload.command.trim()) return payload.command;
  const input = payload.tool_input ?? {};
  if (typeof input.command === "string") return input.command;
  return "";
}

function isWriteTool(payload: AgentHookPayload): boolean {
  const name = (payload.tool_name ?? "").toLowerCase();
  return (
    name === "write" ||
    name === "delete" ||
    name === "streplace" ||
    name === "strreplace" ||
    name === "editnotebook" ||
    name === "applypatch" ||
    name.includes("write") ||
    name.includes("delete")
  );
}

function isIsolated(payload: AgentHookPayload): boolean {
  return payload.is_isolated === true;
}

export function parseHookPayload(raw: string): AgentHookPayload {
  if (!raw.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as AgentHookPayload;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function denyIfClaimed(
  root: string,
  agentId: string | undefined,
  paths: string[],
  config?: Pick<DnaConfig, "agents"> | null,
): Promise<HookDecision | null> {
  if (!paths.length) return null;
  const live = await listLiveAgents(root, config);
  for (const path of paths) {
    const conflict = findClaimConflict(live, path, agentId);
    if (conflict) {
      return {
        permission: "deny",
        user_message: conflict.message,
        agent_message: conflict.message,
      };
    }
  }
  return null;
}

async function guardianForCommand(
  command: string,
  root: string,
  payload: AgentHookPayload,
  config?: Pick<DnaConfig, "git"> | null,
): Promise<HookDecision> {
  if (process.env.DNA_AGENT_COMMIT === "1") return ALLOW;
  let branch = payload.git_branch ?? null;
  let known = Boolean(branch);
  if (!known) {
    const detected = await detectCurrentBranch(root);
    branch = detected.branch;
    known = detected.known;
  }
  const decision = evaluateGitGuardian(command, {
    currentBranch: branch,
    branchKnown: known,
    config,
  });
  if (decision.permission === "deny") {
    return {
      permission: "deny",
      user_message: decision.user_message ?? GIT_GUARDIAN_DENIED,
      agent_message: decision.agent_message ?? GIT_GUARDIAN_DENIED,
    };
  }
  return ALLOW;
}

export async function handleAgentHook(options: {
  root: string;
  payload: AgentHookPayload | string;
  config?: Pick<DnaConfig, "agents" | "git"> | null;
}): Promise<HookDecision> {
  try {
    const payload =
      typeof options.payload === "string" ? parseHookPayload(options.payload) : options.payload;
    const { root, config } = options;
    if (!isAgentMeshEnabled(config)) return ALLOW;

    const event = eventName(payload);
    const agentId =
      process.env.DNA_AGENT_ID?.trim() ||
      payload.conversation_id ||
      payload.session_id ||
      payload.subagent_id ||
      undefined;

    if (event === "sessionStart" || event === "session_start") {
      await registerAgent({
        root,
        config,
        id: agentId,
        type: "primary",
        task: payload.composer_mode || "session",
        worktree: payload.cwd || root,
      });
      return {
        permission: "allow",
        additional_context: await formatLiveCoordination(root, config),
      };
    }

    if (event === "subagentStart" || event === "subagent_start") {
      const isolated = isIsolated(payload);
      const kind = payload.subagent_type ?? "";
      const branch = payload.git_branch ?? (await detectCurrentBranch(root)).branch;
      const coding = !isReadOnlySubagentType(kind);
      const onTrunk = Boolean(branch) && isIntegrationBranch(branch, config);
      if (isolated && coding && !onTrunk) {
        return {
          permission: "deny",
          user_message: GIT_GUARDIAN_DENIED,
          agent_message:
            "DENIED BY DNA AGENT MESH — coding subagents must stay on the integration branch. Explore/review subagents are allowed off trunk. Claim paths before writing.",
        };
      }

      await registerAgent({
        root,
        config,
        id: payload.subagent_id || agentId,
        parentId: payload.parent_conversation_id ?? payload.conversation_id ?? null,
        type: "subagent",
        task: kind || "subagent",
        branch,
        worktree: payload.cwd || root,
      });
      return ALLOW;
    }

    if (event === "beforeShellExecution" || event === "before_shell_execution") {
      const command = extractCommand(payload);
      const guarded = await guardianForCommand(command, root, payload, config);
      if (guarded.permission === "deny") return guarded;
      return ALLOW;
    }

    if (event === "preToolUse" || event === "pre_tool_use") {
      const command = extractCommand(payload);
      if (command) {
        const guarded = await guardianForCommand(command, root, payload, config);
        if (guarded.permission === "deny") return guarded;
      }
      if (isWriteTool(payload)) {
        const claimed = await denyIfClaimed(root, agentId, extractPaths(payload), config);
        if (claimed) return claimed;
      }
      return ALLOW;
    }

    if (event === "afterFileEdit" || event === "after_file_edit") {
      const paths = extractPaths(payload);
      if (agentId && paths.length) {
        await recordModifiedPaths(root, agentId, paths);
      }
      return ALLOW;
    }

    if (event === "stop" || event === "subagentStop" || event === "subagent_stop") {
      try {
        const status = await git(root).status();
        if (status.files.length > 0) {
          return {
            permission: "allow",
            followup_message: COMMIT_GATE_FAILED,
          };
        }
      } catch {
        return ALLOW;
      }
      return ALLOW;
    }

    return ALLOW;
  } catch {
    return ALLOW;
  }
}

export function failOpenAllow(): HookDecision {
  return ALLOW;
}

export { resolveHeartbeatTtl };
