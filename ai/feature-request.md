# Feature Request

_Auto-maintained by DNA. Updated 2026-07-24. The user does not fill this in manually._

## Latest request

> In /labs overview, please make it much more useful, it's supposed to be an analytics dashboard of overall performance, graphs, charts, batteries, cards, tables, it needs to be extremely informative

## Problem

The Lab `/labs` Overview tab is a thin summary (4 KPI cards, one error bar chart, one issues table). Operators cannot see overall system performance at a glance — they must hop between Issues, Events, Performance, Quality, and Releases.

## Current Pain

- Overview does not surface performance, quality, CI, coverage, or release health already available in `GET /api/dna/labs/data`
- Charts are minimal (single error series; no severity mix, latency, or quality trend on Overview)
- No battery/gauge-style health meters for gate scores (doctor, error rate, coverage, quality, CI)
- Dense cross-domain tables (slow endpoints, recent events, CI) live only on other tabs

## Proposed Solution

Rebuild Overview as an **analytics command center** that composes existing `LabDashboardData` into:

1. **KPI cards** — expanded operational strip (issues, errors, rate, latency/slow, memory, third-party, coverage, CI)
2. **Health batteries** — fill gauges for Doctor, Error-rate health, Coverage, Quality gate, CI success
3. **Charts** — error+traffic timeline, severity distribution, quality score trend, slow-endpoint latency bars
4. **Tables** — top issues, slow endpoints, recent CI runs, recent events (deep-links into existing tabs)

Prefer **client-side aggregation** from the current payload; only extend the API if a needed series is missing.

## Users

DNA Lab operators monitoring runtime health locally (`dna lab serve`) or in production after lab pairing.

## Desired Behaviour

- Opening Overview answers: “Is the system healthy?” and “Where is pain?” without leaving the page
- Batteries and cards use clear ok / warn / bad thresholds
- Charts render empty states when data is missing
- Rows deep-link to Issues / Performance / Quality / Events where useful
- Layout stays within existing Humaan admin Lab chrome (gutters, panels, tokens)

## Acceptance Criteria

- [x] Overview shows ≥6 KPI cards covering runtime + delivery signals
- [x] Overview shows ≥4 battery/gauge meters (doctor, error health, coverage, quality and/or CI)
- [x] Overview shows ≥3 charts (timeline, severity mix, quality or latency)
- [x] Overview shows ≥3 data tables (issues + slow endpoints + CI or events)
- [x] Empty / zero-data states remain readable (no broken canvas)
- [x] No regression on other Lab tabs; Refresh still reloads Overview charts
- [x] Existing Lab tests pass; add/adjust UI or aggregate unit coverage where practical

## Edge Cases

- No runtime.db / empty events → cards show zeros, charts show empty labels, tables show empty rows
- Coverage / quality reports missing → batteries show “—” / empty, not fake 100%
- CI billing blocker present → keep existing banner; reflect in CI battery as warn/bad
- Narrow viewports → grids stack; charts remain full-width and readable
- Large issue/event lists → Overview tables stay capped (top N), full lists remain on dedicated tabs
