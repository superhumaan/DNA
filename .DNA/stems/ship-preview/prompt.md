> **DNA Prompt Stem:** `ship-preview` — read `.DNA/stems/ship-preview/` (all files) before proceeding.

# Ship preview

Scope: $ARGUMENTS

**Only when the user explicitly asks for preview.** Not a substitute for `ship-feature` or `trunk-based-delivery`. Not a recovery strategy for dual-tracked branches.

Use when work is **already implemented** on the **current line of work** (trunk / user-chosen branch).

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem. Mark stub Impressions as STUB — do not cite as truth.

## Close-out (order)

1. `npx dna quality report --feature` — PASS
2. `npx dna docker build` — success when Dockerfile present
3. Push the **current branch** (trunk by default — CI may deploy preview from that push)

```bash
npx dna quality report --feature
npx dna docker build
npx dna github push --message "[DNA] chore: preview <summary>"
```

## Checklist

- [ ] User explicitly asked for preview (not agent-invented)
- [ ] Quality PASS (report path noted)
- [ ] Docker status
- [ ] Pushed **same** branch already in use — no new `feature/*` hop
- [ ] CI/preview URL if available
- [ ] No unplanned feature factory

## Artifacts

| Artifact | Path |
|----------|------|
| Quality report | `.DNA/reports/quality/` (latest feature report) |
| Push notes | Branch URL + CI link in reply |

## Failure modes

| Mode | Response |
|------|----------|
| Quality FAIL | Fix or stop — never "just push" |
| No Dockerfile | Skip docker with explicit note |
| Agent tempted to create a new remote "for preview" | Refuse — stay on trunk / current branch; use `/trunk-based-delivery` |
| Dual-tracked WIP across feature remotes | Stop; consolidate on one line; do not hop |
| User asks for new feature mid-flight | Redirect to `ship-feature` |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; say what is absent; do not invent scaffolding unless asked |
| Ambiguous scope | One clarifying question max, then proceed with stated assumptions |
| Secrets / credentials needed | Never print them; list which env vars / keychain items are required |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
