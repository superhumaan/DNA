---
description: User-facing changelog from commits and Impressions — not raw commit dumps.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Write release notes

Version / scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem. Mark stub Impressions as STUB — do not cite as truth.

## Sources

1. `git log` / tags since previous release
2. `CHANGELOG.md` Unreleased
3. `DNA/Impressions/release-notes/` + product Impressions (skip stubs)
4. Shipped roadmap rows when relevant

## Checklist

- [ ] Version / range stated
- [ ] Sections: New / Improved / Fixed / Security (omit empty)
- [ ] Plain language — no internal stem IDs unless user-facing
- [ ] Breaking changes + migration
- [ ] Update CHANGELOG and/or Impressions release notes

## Artifacts

| Artifact | Path |
|----------|------|
| User-facing notes | `DNA/Impressions/release-notes/<version>.md` |
| Changelog | `CHANGELOG.md` (Unreleased or version section) |

## Failure modes

| Mode | Response |
|------|----------|
| Empty commit range | Say so; do not invent features |
| Stub Impressions only | Ground in git log + CHANGELOG |
| Internal-only commits | Fold into user benefit or omit |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; say what is absent; do not invent scaffolding unless asked |
| Ambiguous scope | One clarifying question max, then proceed with stated assumptions |
| Secrets / credentials needed | Never print them; list which env vars / keychain items are required |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
