---
description: OWASP/dependency audit triage with minimal safe upgrades.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Security patch dependencies

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem. Mark stub Impressions as STUB — do not cite as truth.

## Checklist

- [ ] Run audit (pnpm/npm audit, DNA OWASP gate, CI security workflow)
- [ ] Triage critical/high first; document ignored noise
- [ ] Minimal upgrades — smallest remediating version; prefer lockfile-only
- [ ] Breakage: typecheck/tests for touched packages
- [ ] Before/after advisory table
- [ ] Hand off `create-pr` when done

## Artifacts

| Artifact | Path |
|----------|------|
| Triage report | `.DNA/reports/security-deps.md` |
| Lockfile / package bumps | As applied |

## Failure modes

| Mode | Response |
|------|----------|
| Only major bump fixes | Stop for approval before majors |
| Dev-only advisory | Downgrade severity with rationale |
| Audit tool unavailable | Use CI logs / lockfile review; state gap |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; say what is absent; do not invent scaffolding unless asked |
| Ambiguous scope | One clarifying question max, then proceed with stated assumptions |
| Secrets / credentials needed | Never print them; list which env vars / keychain items are required |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
