> **DNA Prompt Stem:** `design-onboarding` — read `.DNA/stems/design-onboarding/` (all files) before proceeding.

# Design onboarding

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem. Mark stub Impressions as STUB — do not cite as truth.

## Goals

1. **First-run** — must-complete before product is useful
2. **Kit / DNA install** — doctor, marketplace packs, or product kits
3. **Continue-to-dashboard** — clear exit into main app (no dead-end wizard)
4. **Skip / resume** — returning users skip completed steps

## Checklist

- [ ] Step map (screen → exit criteria → persistence key)
- [ ] Copy outline (headline + one sentence per step — no walls)
- [ ] Failure paths: install fail, offline, auth expired
- [ ] Analytics/events if product already tracks funnels (reuse — do not invent stack)
- [ ] Existing setup screens inventoried before new ones
- [ ] Plan → approval → `ship-feature`

## Artifacts

| Artifact | Path |
|----------|------|
| Onboarding plan | `.DNA/plans/onboarding.md` or `DNA/Impressions/product/onboarding.md` |
| Feature request | `ai/feature-request.md` |

## Failure modes

| Mode | Response |
|------|----------|
| No kit concept | Map to `dna doctor` / marketplace install or product-equivalent |
| Forced tutorial | Prefer progressive disclosure; allow skip when safe |
| Dashboard missing | Define "home" surface that exists in code |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; say what is absent; do not invent scaffolding unless asked |
| Ambiguous scope | One clarifying question max, then proceed with stated assumptions |
| Secrets / credentials needed | Never print them; list which env vars / keychain items are required |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
