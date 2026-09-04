import { chmod } from "node:fs/promises";
import { join } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { fileExists, writeFileEnsured } from "../fs.js";
import { isAgentMeshEnabled } from "./registry.js";

export const AGENT_MESH_HOOK_SCRIPT = `.cursor/hooks/dna-agent-mesh`;
export const AGENT_MESH_HOOKS_JSON = `.cursor/hooks.json`;
export const AGENT_MESH_KNOWLEDGE = `.DNA/knowledge/platforms/dna/agent-mesh.dna.md`;

export const AGENT_MESH_REQUIRED_PATHS = [
  AGENT_MESH_HOOKS_JSON,
  AGENT_MESH_HOOK_SCRIPT,
  AGENT_MESH_KNOWLEDGE,
] as const;

export function agentMeshHookRunnerSource(): string {
  return `#!/usr/bin/env bash
# DNA Agent Mesh — fail-open Cursor hook runner.
# If dna is missing or this script errors, ALWAYS allow (exit 0 + JSON).
# A lockout is worse than fail-open.

fail_open() {
  printf '%s\\n' '{"permission":"allow"}'
  exit 0
}

trap fail_open ERR
set +e

INPUT="$(cat 2>/dev/null || true)"

resolve_dna() {
  if command -v dna >/dev/null 2>&1; then
    command -v dna
    return 0
  fi
  local here root
  here="$(cd "$(dirname "$0")" && pwd)"
  root="$(cd "$here/../.." && pwd)"
  if [ -x "$root/node_modules/.bin/dna" ]; then
    printf '%s\\n' "$root/node_modules/.bin/dna"
    return 0
  fi
  if [ -f "$root/packages/dna-cli/dist/index.js" ]; then
    printf '%s\\n' "node:$root/packages/dna-cli/dist/index.js"
    return 0
  fi
  return 1
}

DNA_BIN="$(resolve_dna)" || fail_open

if [ -z "\${INPUT}" ]; then
  fail_open
fi

if [[ "$DNA_BIN" == node:* ]]; then
  OUT="$(printf '%s' "$INPUT" | node "\${DNA_BIN#node:}" agents hook 2>/dev/null)"
else
  OUT="$(printf '%s' "$INPUT" | "$DNA_BIN" agents hook 2>/dev/null)"
fi
STATUS=$?

if [ "$STATUS" -ne 0 ] || [ -z "$OUT" ]; then
  fail_open
fi

printf '%s\\n' "$OUT"
exit 0
`;
}

export function agentMeshHooksJson(): string {
  const hook = {
    command: "./.cursor/hooks/dna-agent-mesh",
    failClosed: false,
  };
  return `${JSON.stringify(
    {
      version: 1,
      hooks: {
        sessionStart: [hook],
        subagentStart: [hook],
        beforeShellExecution: [hook],
        preToolUse: [hook],
        afterFileEdit: [hook],
        stop: [hook],
        subagentStop: [hook],
      },
    },
    null,
    2,
  )}\n`;
}

export function agentMeshKnowledgeMarkdown(): string {
  return `# Agent Mesh + Git Guardian

DNA is the agent coordination control plane. Enforcement is **hooks + CLI**, not more sermons in AGENTS.md.

## Registry

SQLite at \`.DNA/runtime/agents.db\` (Node \`DatabaseSync\` when available; exclusive lockfile + JSON fallback otherwise).

Schema: \`id\`, \`parent_id\`, \`type\` (primary|subagent), \`status\` (active|idle|completed|failed), \`task\`, \`started_at\`, \`heartbeat_at\`, \`branch\`, \`worktree\`, \`claimed_paths\`, \`modified_paths\`, \`last_commit\`.

## CLI

\`\`\`bash
dna agents status|register|claim|release|heartbeat|context|hook|install|commit
dna commit -m "[DNA] feat: …"
\`\`\`

## Hooks (fail-open)

\`.cursor/hooks.json\` + \`.cursor/hooks/dna-agent-mesh\`

- sessionStart — register + additional_context (\`DNA LIVE COORDINATION\`)
- subagentStart — register; **DENY** isolated coding subagents (explore/review isolated OK)
- beforeShellExecution + preToolUse — Git Guardian + path claims
- afterFileEdit — record modified paths
- stop / subagentStop — dirty tree → followup \`DNA COMMIT GATE FAILED\`

The runner **must** print \`{"permission":"allow"}\` and exit 0 if \`dna\` is missing. \`failClosed\` is **false**.

## Git Guardian

On trunk deny: \`git checkout -b\`, \`switch -c\`, \`git branch\` create, \`worktree add\`, \`stash\`, \`git add .\` / \`-A\` / \`--all\`, raw \`git add\`, raw \`git commit\`, \`reset --hard\`, \`clean -f\`.

Allow: \`dna commit\`, \`git status/diff/log\`, \`dna github push\`.

Off-trunk writes denied only when the current branch is **known** and not main/master. \`git.branchingStrategy: feature-branch\` relaxes branch create.

## Path claims

Write/Delete of a file matching another **active** agent's claim → \`DNA CONFLICT\`.

## dna commit

Mutex, stage **only** this agent's files, refuse foreign claims, record SHA. Never \`git add\` all. \`dna github push\` uses \`dna commit\` when \`DNA_AGENT_ID\` is set.

## Config

\`\`\`json
{
  "git": { "integrationBranch": "main" },
  "agents": { "mesh": true, "heartbeatTtlSeconds": 1800 }
}
\`\`\`
`;
}

export async function installAgentMesh(
  root: string,
  config?: Pick<DnaConfig, "agents"> | null,
): Promise<string[]> {
  if (!isAgentMeshEnabled(config)) return [];

  const written: string[] = [];
  const hooksJson = join(root, AGENT_MESH_HOOKS_JSON);
  const hookScript = join(root, AGENT_MESH_HOOK_SCRIPT);
  const knowledge = join(root, AGENT_MESH_KNOWLEDGE);

  await writeFileEnsured(hooksJson, agentMeshHooksJson());
  written.push(AGENT_MESH_HOOKS_JSON);

  await writeFileEnsured(hookScript, agentMeshHookRunnerSource());
  await chmod(hookScript, 0o755);
  written.push(AGENT_MESH_HOOK_SCRIPT);

  await writeFileEnsured(knowledge, agentMeshKnowledgeMarkdown());
  written.push(AGENT_MESH_KNOWLEDGE);

  return written;
}

export async function agentMeshInstallStatus(root: string): Promise<{
  installed: boolean;
  hooksJson: boolean;
  hookScript: boolean;
  hookExecutable: boolean;
  knowledge: boolean;
  failOpen: boolean;
}> {
  const { stat } = await import("node:fs/promises");
  const { readFile } = await import("node:fs/promises");
  const hooksJson = await fileExists(join(root, AGENT_MESH_HOOKS_JSON));
  const hookScriptPath = join(root, AGENT_MESH_HOOK_SCRIPT);
  const hookScript = await fileExists(hookScriptPath);
  let hookExecutable = false;
  let failOpen = false;
  if (hookScript) {
    try {
      const info = await stat(hookScriptPath);
      hookExecutable = (info.mode & 0o111) !== 0;
      const body = await readFile(hookScriptPath, "utf-8");
      failOpen = body.includes('{"permission":"allow"}') && body.includes("fail_open");
    } catch {
      hookExecutable = false;
    }
  }
  const knowledge = await fileExists(join(root, AGENT_MESH_KNOWLEDGE));
  return {
    installed: hooksJson && hookScript && knowledge,
    hooksJson,
    hookScript,
    hookExecutable,
    knowledge,
    failOpen,
  };
}
