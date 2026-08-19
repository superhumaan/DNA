---
description: Default ship mode: stay on trunk, small merges, no preview-branch hopping, no invented remotes.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---
# Trunk-based delivery

Scope: $ARGUMENTS

**Default DNA ship mode.** Integrate to `main`/`master` (or the one short-lived branch the user already chose). Do not invent parallel remotes.

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem. Mark stub Impressions as STUB — do not cite as truth.

Also load:

- `.DNA/knowledge/disciplines/trunk-based-development/`
- `.DNA/config.dna.json` → `git.branchingStrategy` (default `trunk`)
- CellularMemory: `hippocampus/recent-changes.md`, `temporalLobe/previous-solutions.md`, `amygdala/blockers.md`

## Rules (hard)

1. **Stay on one line of work** — trunk, or a single user-chosen short-lived branch (< 2 days)
2. **Never invent** `feature/*` remotes or hop branches "to test on preview"
3. **Never dual-track** the same feature across multiple remotes
4. **Match existing patterns** — no invented slogans under headers, no parallel architectures
5. Feature flags for incomplete work when needed (`disciplines/feature-flags`)

## Close-out (order)

1. `npx dna quality report --feature` — PASS
2. `npx dna docker build` — when Dockerfile present
3. `npx dna github push --message "[DNA] feat: <summary>"` — pushes **current** branch (trunk mode does not auto-create `feature/*`)

```bash
npx dna quality report --feature
npx dna docker build
npx dna github push --message "[DNA] feat: <summary>"
```

Opt into legacy hop only if the user set `"git": { "branchingStrategy": "feature-branch" }` or passed `--create-branch` explicitly.

## Checklist

- [ ] CellularMemory loaded (no repeated forgotten work)
- [ ] On trunk or one user-chosen branch — not agent-invented
- [ ] Quality PASS
- [ ] Docker status
- [ ] Push stayed on the same line of work
- [ ] No invented UI slogans / off-pattern chrome in the diff

## Artifacts

| Artifact | Path |
|----------|------|
| Quality report | `.DNA/reports/quality/` |
| Push notes | Branch + CI URL in reply |
| Memory updates | CellularMemory when architecture or delivery decisions change |

## Failure modes

| Mode | Response |
|------|----------|
| Agent wants a new remote "just for preview" | Refuse — stay on trunk; CI previews the push of the current branch |
| Concurrent WIP already split across remotes | Stop; consolidate; do not hop each branch |
| User asks for long-lived feature branch | Confirm once; use `feature-branch` strategy or explicit `--create-branch` |
| Quality FAIL | Fix or stop |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; say what is absent; do not invent scaffolding unless asked |
| Ambiguous scope | One clarifying question max, then proceed with stated assumptions |
| Secrets / credentials needed | Never print them; list which env vars / keychain items are required |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
