# Feature Request

_Auto-maintained by DNA. Updated 2026-09-04._

## Latest request

> Ship Agent Mesh + Git Guardian on trunk (`main`). SQLite registry, CLI (`dna agents *` + `dna commit`), fail-open Cursor hooks, path claims, `dna commit` mutex (never `git add` all), doctor/injection install, version 0.6.29. Do not add trunk sermons to AGENTS.md. Enforcement is hooks + CLI.

## Problem

Parallel Cursor agents invent `feature/*` branches, run raw `git add` / `git commit`, collide on the same files, and leave dirty trees. Unpublished fail-closed hooks previously locked the editor when the DNA CLI was missing.

## Pain

- Agents create feature branches on a trunk-based repo
- Two agents write the same path with no coordination
- Sessions stop dirty with no commit gate
- Fail-closed hooks lock Cursor when `dna` is not on PATH

## Users

- DNA maintainers and squads running multiple Cursor agents on one checkout
- Agents that must stay on `main`/`master` (or `git.integrationBranch`)
- Operators installing DNA via `dna doctor`

## Desired behaviour

1. SQLite registry at `.DNA/runtime/agents.db` (DatabaseSync when available; exclusive lockfile + fallback store otherwise)
2. CLI: `dna agents status|register|claim|release|heartbeat|context|hook|install|commit` and top-level `dna commit`
3. Cursor hooks installed by doctor / AI injection — **fail-open** (`{"permission":"allow"}` exit 0) if CLI missing
4. Git Guardian denies branch create, stash, raw add/commit, reset --hard, clean -f on trunk; allow `dna commit`, `git status/diff/log`, `dna github push`
5. Path claims: Write/Delete of another active agent's claim → DNA CONFLICT
6. `dna commit` stages only this agent's files; `dna github push` uses it when `DNA_AGENT_ID` is set
7. Doctor reports Agent Mesh; `dna context cursor` appends live coordination
8. Config: `git.integrationBranch`, `agents.mesh` (default true), `agents.heartbeatTtlSeconds` (default 1800)

## Edge cases

- DNA CLI missing → hooks fail-open, never lock the editor
- Current branch unknown → do not deny off-trunk writes
- Feature-branch config relaxes branch create
- Isolated explore/review/security-review/bugbot/ci-investigator/cursor-guide allowed; isolated coding denied
- Stale heartbeats (TTL) are not active claim holders
- Never `git add .` / `-A` / `--all`

## Acceptance criteria

- [x] Registry schema + fallback store
- [x] CLI surface + `dna commit`
- [x] Fail-open hook runner, `failClosed: false`
- [x] Git Guardian + path claims + commit gate messages
- [x] Doctor, injection, context, version 0.6.29, docs
- [x] Tests in `packages/dna-core/src/agents/*.test.ts` + schema tests
- [x] Hooks + knowledge installed in this repo
