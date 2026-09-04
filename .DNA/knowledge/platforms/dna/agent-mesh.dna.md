# Agent Mesh + Git Guardian

DNA is the agent coordination control plane. Enforcement is **hooks + CLI**, not more sermons in AGENTS.md.

## Registry

SQLite at `.DNA/runtime/agents.db` (Node `DatabaseSync` when available; exclusive lockfile + JSON fallback otherwise).

Schema: `id`, `parent_id`, `type` (primary|subagent), `status` (active|idle|completed|failed), `task`, `started_at`, `heartbeat_at`, `branch`, `worktree`, `claimed_paths`, `modified_paths`, `last_commit`.

## CLI

```bash
dna agents status|register|claim|release|heartbeat|context|hook|install|commit
dna commit -m "[DNA] feat: …"
```

## Hooks (fail-open)

`.cursor/hooks.json` + `.cursor/hooks/dna-agent-mesh`

- sessionStart — register + additional_context (`DNA LIVE COORDINATION`)
- subagentStart — register; **DENY** isolated coding subagents (explore/review isolated OK)
- beforeShellExecution + preToolUse — Git Guardian + path claims
- afterFileEdit — record modified paths
- stop / subagentStop — dirty tree → followup `DNA COMMIT GATE FAILED`

The runner **must** print `{"permission":"allow"}` and exit 0 if `dna` is missing. `failClosed` is **false**.

## Git Guardian

On trunk deny: `git checkout -b`, `switch -c`, `git branch` create, `worktree add`, `stash`, `git add .` / `-A` / `--all`, raw `git add`, raw `git commit`, `reset --hard`, `clean -f`.

Allow: `dna commit`, `git status/diff/log`, `dna github push`.

Off-trunk writes denied only when the current branch is **known** and not main/master. `git.branchingStrategy: feature-branch` relaxes branch create.

## Path claims

Write/Delete of a file matching another **active** agent's claim → `DNA CONFLICT`.

## dna commit

Mutex, stage **only** this agent's files, refuse foreign claims, record SHA. Never `git add` all. `dna github push` uses `dna commit` when `DNA_AGENT_ID` is set.

## Config

```json
{
  "git": { "integrationBranch": "main" },
  "agents": { "mesh": true, "heartbeatTtlSeconds": 1800 }
}
```
