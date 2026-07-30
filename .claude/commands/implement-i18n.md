---
description: Add locales, RTL, and copy — locale routing, translation files, fallback locale.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Implement i18n

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem. Mark stub Impressions as STUB — do not cite as truth.

## Loads

- Neural intent `implement_multilingual`
- `.DNA/knowledge/languages/stem-bridge/`
- Existing framework i18n in-repo

## Checklist

- [ ] Locales + fallback
- [ ] Routing strategy (path / domain / cookie) matching stack
- [ ] Message file layout + missing-key policy
- [ ] RTL: `dir` + layout for RTL locales
- [ ] Extract hard-coded strings; preserve technical terms
- [ ] Tests: switch, fallback, RTL smoke
- [ ] Plan → **STOP** → implement → quality → optional `a11y-audit`

## Artifacts

| Artifact | Path |
|----------|------|
| i18n plan | `.DNA/plans/i18n.md` |
| Feature request | `ai/feature-request.md` |
| Locale files | Per stack (e.g. `locales/`, `messages/`) — listed in plan |

## Failure modes

| Mode | Response |
|------|----------|
| No i18n lib chosen | Prefer existing stack convention; otherwise recommend one with rationale |
| Partial strings | Phase 1 critical paths; backlog remainder |
| RTL ignored for ar/he/fa | Block ship of those locales until RTL plan exists |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; say what is absent; do not invent scaffolding unless asked |
| Ambiguous scope | One clarifying question max, then proceed with stated assumptions |
| Secrets / credentials needed | Never print them; list which env vars / keychain items are required |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
