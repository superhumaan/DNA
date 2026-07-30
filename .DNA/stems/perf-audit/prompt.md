> **DNA Prompt Stem:** `perf-audit` — read `.DNA/stems/perf-audit/` (all files) before proceeding.

# Performance audit

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem. Mark stub Impressions as STUB — do not cite as truth.

## Surfaces (as applicable)

1. **Web** — LCP, INP, CLS; bundle; waterfalls
2. **Tauri** — cold start → interactive; window show; updater cost
3. **Scan / Lab** — jank for large tables, scan loops, charts

## Checklist

- [ ] Budget table: metric → target → observed → status
- [ ] Measurement method named (Lighthouse, bench, Instruments, Performance panel)
- [ ] Unmeasured rows labeled **assumption**
- [ ] Top 3 fixes by impact
- [ ] Artifact written

## Artifacts

| Artifact | Path |
|----------|------|
| Perf report | `.DNA/reports/perf-audit.md` or `DNA/Impressions/qa/perf-audit.md` |

## Failure modes

| Mode | Response |
|------|----------|
| No tooling | Qualitative jank notes + assumed budgets; do not invent Lighthouse scores |
| Tauri absent | Skip desktop rows; note N/A |
| Micro-optimizations only | Prefer architectural fixes tied to evidence |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; say what is absent; do not invent scaffolding unless asked |
| Ambiguous scope | One clarifying question max, then proceed with stated assumptions |
| Secrets / credentials needed | Never print them; list which env vars / keychain items are required |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
