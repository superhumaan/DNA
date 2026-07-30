---
description: Desktop packaging, notarization, auto-update, and signed builds for Tauri apps.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Ship Tauri release

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem. Mark stub Impressions as STUB — do not cite as truth.

## Preconditions

Confirm Tauri / desktop surface exists. If missing — **stop**.

Load desktop-cross-platform + any tauri packs present.

## Checklist

- [ ] Version bump (app + Tauri config) consistent
- [ ] Targets: macOS / Windows / Linux as requested
- [ ] Signing identity present (never print secrets)
- [ ] macOS notarize + staple when shipping macOS
- [ ] Auto-update: endpoint, signature, channel
- [ ] Smoke: cold start, updater check, critical path
- [ ] Notes: hand off `write-release-notes`

## Artifacts

| Artifact | Path |
|----------|------|
| Release matrix | `.DNA/plans/tauri-release.md` or `.DNA/reports/tauri-release.md` |
| Release notes | via `write-release-notes` |

## Failure modes

| Mode | Response |
|------|----------|
| No Tauri project | Stop; do not invent desktop packaging |
| Missing certs | List required secrets by name only; block signed ship |
| Updater unsigned | Block auto-update enablement |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; say what is absent; do not invent scaffolding unless asked |
| Ambiguous scope | One clarifying question max, then proceed with stated assumptions |
| Secrets / credentials needed | Never print them; list which env vars / keychain items are required |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
