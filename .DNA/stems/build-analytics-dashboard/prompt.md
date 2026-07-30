> **DNA Prompt Stem:** `build-analytics-dashboard` — read `.DNA/stems/build-analytics-dashboard/` (all files) before proceeding.

# Build analytics dashboard

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem. Mark stub Impressions as STUB — do not cite as truth.

## Pattern (Issues / Projects / Lab density)

1. **KPI grid** — 3–6 headline metrics (value, delta, health)
2. **Panels** — one job each (trend, distribution, status)
3. **Hot lists** — ranked actionable rows (errors, open items, care signals)
4. **States** — empty / loading / error per surface
5. **Permissions** — who sees which metrics

## Checklist

- [ ] Inventory existing dashboard/table/KPI primitives in-repo
- [ ] Data sources named (API, runtime DB, GitHub, store) — no parallel analytics DB unless justified
- [ ] KPI definitions (numerator/denominator, refresh)
- [ ] Hot-list sort + deep-link targets
- [ ] Mobile/responsive behaviour if shell has mobile chrome
- [ ] feature-request.md + architect plan → **STOP** → implement → quality

## Artifacts

| Artifact | Path |
|----------|------|
| Feature request | `ai/feature-request.md` |
| Dashboard plan | `.DNA/plans/analytics-dashboard.md` |
| Optional Impression | `DNA/Impressions/product/analytics-dashboard.md` |

## Failure modes

| Mode | Response |
|------|----------|
| No data API | Plan read-model / probe endpoints first |
| Metric undefined | Refuse vanity KPIs; require definition or mark assumption |
| Design-system cards | Prefer existing Lab density — avoid generic card grids unless DS requires |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; say what is absent; do not invent scaffolding unless asked |
| Ambiguous scope | One clarifying question max, then proceed with stated assumptions |
| Secrets / credentials needed | Never print them; list which env vars / keychain items are required |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |

## Output

Plan with KPI table + panel map + hot lists → approval → `ship-feature`.
