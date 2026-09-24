import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { stripInappropriateLanguage, type DnaConfig } from "@superhumaan/dna-config";
import { git } from "@superhumaan/dna-github";
import { findClaimConflict, pathsOverlap } from "./claims.js";
import { listLiveAgents, recordLastCommit, withStore } from "./registry.js";
import { withAgentLock } from "./db.js";
import { conflictMessage } from "./types.js";

const execFileAsync = promisify(execFile);

export interface AgentCommitOptions {
  root: string;
  agentId: string;
  message: string;
  config?: Pick<DnaConfig, "agents" | "git"> | null;
}

export interface AgentCommitResult {
  committed: boolean;
  sha: string | null;
  staged: string[];
  skipped: string[];
  message: string;
}

async function gitOutput(root: string, args: string[]): Promise<string> {
  const { stdout } = await execFileAsync("git", args, {
    cwd: root,
    env: { ...process.env, DNA_AGENT_COMMIT: "1" },
    maxBuffer: 10 * 1024 * 1024,
    encoding: "utf-8",
  });
  return stdout.trim();
}

export function filesForAgentCommit(
  claimed: string[],
  modified: string[],
  dirty: string[],
): string[] {
  const owned = [...claimed, ...modified].map((p) => p.replace(/\\/g, "/"));
  if (owned.length === 0) return [];
  return dirty.filter((path) => {
    const normalized = path.replace(/\\/g, "/");
    return owned.some((ownedPath) => pathsOverlap(ownedPath, normalized));
  });
}

export async function commitAgentWork(options: AgentCommitOptions): Promise<AgentCommitResult> {
  const { root, agentId, config } = options;
  const message = stripInappropriateLanguage(options.message);
  if (!agentId.trim()) {
    throw new Error("DNA_AGENT_ID is required for dna commit");
  }
  if (!message.trim()) {
    throw new Error("Commit message is required");
  }

  return withAgentLock(root, async () => {
    const agent = await withStore(root, (store) => store.get(agentId));
    if (!agent) {
      throw new Error(`Unknown agent ${agentId} — run dna agents register`);
    }

    const g = git(root);
    if (!(await g.checkIsRepo())) {
      throw new Error("Not a git repository");
    }

    const status = await g.status();
    const dirty = status.files.map((f) => f.path);
    const staged = filesForAgentCommit(agent.claimed_paths, agent.modified_paths, dirty);
    const skipped = dirty.filter((p) => !staged.includes(p));

    const live = await listLiveAgents(root, config);
    for (const path of staged) {
      const conflict = findClaimConflict(live, path, agentId);
      if (conflict) {
        throw new Error(conflict.message);
      }
    }

    for (const path of dirty) {
      const conflict = findClaimConflict(live, path, agentId);
      if (conflict && staged.includes(path)) {
        throw new Error(conflictMessage(conflict.agent.id, conflict.agent.task, path));
      }
    }

    if (staged.length === 0) {
      return {
        committed: false,
        sha: agent.last_commit,
        staged: [],
        skipped,
        message: "Nothing to commit for this agent (no claimed/modified dirty files).",
      };
    }

    await execFileAsync("git", ["add", "--", ...staged], {
      cwd: root,
      env: { ...process.env, DNA_AGENT_COMMIT: "1" },
      maxBuffer: 10 * 1024 * 1024,
    });
    await execFileAsync("git", ["commit", "-m", message, "--", ...staged], {
      cwd: root,
      env: { ...process.env, DNA_AGENT_COMMIT: "1" },
      maxBuffer: 10 * 1024 * 1024,
    });
    const sha = await gitOutput(root, ["rev-parse", "HEAD"]);
    await recordLastCommit(root, agentId, sha);

    return {
      committed: true,
      sha,
      staged,
      skipped,
      message: `Committed ${staged.length} file(s) as ${sha.slice(0, 7)}`,
    };
  });
}

export function resolveAgentId(explicit?: string): string | undefined {
  return explicit?.trim() || process.env.DNA_AGENT_ID?.trim() || undefined;
}
