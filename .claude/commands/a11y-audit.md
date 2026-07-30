---
description: Audit keyboard access, labels, contrast, and prefers-reduced-motion.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Accessibility audit

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem. Mark stub Impressions as STUB — do not cite as truth.

## Checklist

- [ ] **Keyboard** — reachable controls, visible focus, no traps
- [ ] **Labels** — accessible names; icons not nameless
- [ ] **Contrast** — WCAG AA where feasible
- [ ] **Motion** — `prefers-reduced-motion`
- [ ] **Semantics** — headings, landmarks, live regions
- [ ] Tooling: axe / jsx-a11y / Playwright a11y when present

## Artifacts

| Artifact | Path |
|----------|------|
| A11y report | `.DNA/reports/a11y-audit.md` or `DNA/Impressions/qa/a11y-audit.md` |

Findings ranked: blocker / major / minor — each with path + fix hint.

## Failure modes

| Mode | Response |
|------|----------|
| No UI in scope | Stop; ask for route/surface |
| Can't run axe | Manual checklist still required; label tooling gap |
| Contrast subjective | Cite token/CSS values; mark assumption if unmeasured |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; say what is absent; do not invent scaffolding unless asked |
| Ambiguous scope | One clarifying question max, then proceed with stated assumptions |
| Secrets / credentials needed | Never print them; list which env vars / keychain items are required |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |

Hand off remediations to `ship-feature`.
