> **DNA Prompt Stem:** `plan-fleet-scan` — read `.DNA/stems/plan-fleet-scan/` (all files) before proceeding.

# Plan fleet scan

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem. Mark stub Impressions as STUB — do not cite as truth.

## Intent

Multi-project (portfolio / parent-folder) scan — not a single-repo `dna scan`.

## Checklist

- [ ] Inventory projects (paths, DNA present?)
- [ ] Cache strategy (what, TTL, invalidation)
- [ ] Care signals: blockers, drift, runtime fingerprints, stale Impressions
- [ ] Kit / DNA health: doctor gaps, pack versions, workbench currency
- [ ] Roll-up summary + per-project P1
- [ ] Prioritized next repair target
- [ ] Plan vs execute: plan by default; execute only if user asks

## Commands (per project / root)

```bash
npx dna scan
npx dna doctor
npx dna analyze
npx dna platform projects
```

## Artifacts

| Artifact | Path |
|----------|------|
| Fleet plan / report | `.DNA/plans/fleet-scan.md` or `.DNA/reports/fleet-scan.md` |
| Care roll-up | Table inside report |

## Failure modes

| Mode | Response |
|------|----------|
| Single repo only | Say so; still emit mini fleet of 1 + cache notes |
| No platform API | Fall back to directory walk for `.DNA/` |
| Stale cache | Document TTL; offer force refresh |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; say what is absent; do not invent scaffolding unless asked |
| Ambiguous scope | One clarifying question max, then proceed with stated assumptions |
| Secrets / credentials needed | Never print them; list which env vars / keychain items are required |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
