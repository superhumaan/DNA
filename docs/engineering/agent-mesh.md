# Agent Mesh + Git Guardian

DNA is the agent coordination control plane. Enforcement is **hooks + CLI**, not extra sermons in `AGENTS.md`.

## Why

Parallel Cursor agents invent `feature/*` branches, run raw `git add` / `git commit`, collide on the same files, and leave dirty trees. Fail-closed hooks previously locked the editor when the DNA CLI was missing.

## Registry

SQLite at `.DNA/runtime/agents.db` (`node:sqlite` `DatabaseSync` when available). Otherwise an exclusive lockfile plus JSON fallback at `.DNA/runtime/agents.json`.

| Column | Notes |
|--------|--------|
| `id` | UUID or conversation id |
| `parent_id` | Subagent parent |
| `type` | `primary` \| `subagent` |
| `status` | `active` \| `idle` \| `completed` \| `failed` |
| `task` | What the agent is doing |
| `started_at` / `heartbeat_at` | ISO timestamps |
| `branch` / `worktree` | Git location |
| `claimed_paths` / `modified_paths` | JSON string arrays |
| `last_commit` | SHA after `dna commit` |

Heartbeat TTL defaults to **1800s**. Stale agents are not live claim holders.

## CLI

```bash
dna agents status
dna agents register --type primary --task "…"
dna agents claim path/to/file.ts
dna agents release
dna agents heartbeat
dna agents context
dna agents hook
dna agents install
dna commit -m "[DNA] feat: …"
```

`dna github push` runs `dna commit` and sets `skipLocalCommit` when `DNA_AGENT_ID` is set.

## Cursor hooks (fail-open)

Installed by `dna doctor` / AI injection:

- `.cursor/hooks.json` — `failClosed: false` on every event
- `.cursor/hooks/dna-agent-mesh` — executable runner

| Event | Behaviour |
|-------|-----------|
| `sessionStart` | Register + `additional_context` (`DNA LIVE COORDINATION`) |
| `subagentStart` | Register; **DENY** isolated coding (`generalPurpose`). Explore / cursor-guide / security-review / bugbot / ci-investigator isolated is OK |
| `beforeShellExecution` / `preToolUse` | Git Guardian + path claims |
| `afterFileEdit` | Record modified paths |
| `stop` / `subagentStop` | Dirty tree → `followup_message` **DNA COMMIT GATE FAILED** |

If `dna` is missing or the hook errors, the runner prints `{"permission":"allow"}` and exits **0**. A lockout is worse than fail-open.

## Git Guardian

On trunk deny:

- `git checkout -b`, `git switch -c`, `git branch` create, `git worktree add`
- `git stash`
- `git add .` / `-A` / `--all`, raw `git add`, raw `git commit`
- `git reset --hard`, `git clean -f`

Allow: `dna commit`, `git status` / `diff` / `log`, `dna github push`.

Off-trunk writes are denied only when the current branch is **known** and not `main`/`master` (or `git.integrationBranch`). `git.branchingStrategy: feature-branch` relaxes branch create.

## Path claims

Write/Delete of a file matching another **active** agent's claim → **DNA CONFLICT**. Nested directory claims overlap.

## `dna commit`

1. Exclusive mutex (`.DNA/runtime/agents.lock`)
2. Stage **only** this agent's claimed + modified dirty files
3. Refuse foreign claims
4. Record SHA on the agent
5. Never `git add` all

## Config

```json
{
  "git": { "integrationBranch": "main" },
  "agents": { "mesh": true, "heartbeatTtlSeconds": 1800 }
}
```

Constants: `DNA_AGENTS_DB`, `DNA_AGENTS_LOCK`, `DEFAULT_AGENT_HEARTBEAT_TTL_SECONDS`.

## Messages

- `DENIED BY DNA GIT GUARDIAN — trunk, expected branch, do not create/switch feature branches.`
- `DNA CONFLICT — file claimed by agent X, task, work elsewhere / wait / coordinate.`
- `DNA COMMIT GATE FAILED — must review diff, test, dna commit, verify status; do not abandon.`
