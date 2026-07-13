# Feature Request

_Auto-maintained by DNA. Updated 2026-07-13._

## Problem

Users still had to say "use DNA" because `dna update` only refreshed workbench stems — not `AGENTS.md`, `dna.mdc`, or other always-on rules. Stale injection was not detected or repaired.

## Users

DNA project owners using Cursor and Claude Code.

## Desired Behaviour

- On `dna update`, `dna doctor`, and `dna workbench install`, refresh **all** AI injection layers (rules, AGENTS.md, skills, stems, commands).
- After sync, **verify** required files exist with `alwaysApply: true` and always-on markers.
- `dna doctor` reports injection status (missing / stale).

## Acceptance Criteria

- [x] `syncAiInjection` refreshes AI tool files + feature factory + workbench together
- [x] `verifyAiInjection` checks required paths and always-on content
- [x] `dna update` uses full sync + reports verification
- [x] `dna doctor` shows injection line in report
- [x] Unit tests for sync and stale detection

## Edge Cases

- Workbench disabled → injection check skipped
- Stale rules without always-on text → detected and repaired on sync
