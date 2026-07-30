---
description: Screenshot/layout consistency across Dashboard, Lab, and Settings.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Visual QA pass

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem. Mark stub Impressions as STUB — do not cite as truth.

## Surfaces (default — adapt to repo)

1. Dashboard / home shell
2. Lab (`/labs` or `dna lab serve`)
3. Settings

## Checklist

- [ ] Spacing / typography / density consistency
- [ ] Responsive breakpoints (mobile chrome)
- [ ] Empty / loading / error states
- [ ] Dark/light if both exist
- [ ] No overlap/clip
- [ ] Screenshots or Playwright captures when tooling exists

## Artifacts

| Artifact | Path |
|----------|------|
| Visual QA report | `.DNA/reports/visual-qa.md` or `DNA/Impressions/qa/visual-qa.md` |
| Screenshots | `.DNA/reports/visual-qa/` (if captured) |

## Failure modes

| Mode | Response |
|------|----------|
| Surface missing | N/A row; do not invent UI |
| No screenshot tool | Structured manual notes still required |
| Brand-new design asked | Out of scope — consistency pass only |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; say what is absent; do not invent scaffolding unless asked |
| Ambiguous scope | One clarifying question max, then proceed with stated assumptions |
| Secrets / credentials needed | Never print them; list which env vars / keychain items are required |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
