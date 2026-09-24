---
description: Plan a governed assistant fleet: one site app, an optional group console, and an optional operator console, with one model path.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---
# Governed AI fleet

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and this stem's contextLoads. Mark stub Impressions as STUB — do not cite them as truth.

## Preconditions

Read how this repo routes model calls today. If there is no assistant, **stop** unless the user asked to plan one.

A fleet has at most three apps. Add an app only when this repo or the user already distinguishes that role:

1. **Site app** — one tenant talks to the assistant; admins manage people, knowledge, safety rules, and usage.
2. **Group console** — manages many site apps (preferences, templates, guides, usage). It does not replace the site app.
3. **Operator console** — health, versions, and updates across the fleet. It does not replace the group console or the site app.

## Checklist

- [ ] Every live model call goes through the existing governed gateway — no direct vendor calls from a new UI
- [ ] Safety rules, knowledge scope, and usage stay on the site that owns them
- [ ] Missing roles stay missing — do not scaffold a console the user did not ask for
- [ ] Tenant isolation is the isolation model already in the repo
- [ ] Admin actions require the existing admin check on the API, not a hidden button
- [ ] Plan lists files and stops for approval before code (`ship-feature`)
- [ ] Regulated data: hand off to `plan-legal` / `plan-compliance` before build

## Artifacts

| Artifact | Path |
|----------|------|
| Fleet plan | `.DNA/plans/governed-ai-fleet.md` |

## Failure modes

| Mode | Response |
|------|----------|
| No assistant and no request to add one | Stop |
| UI wants to call a model vendor directly | Refuse; route through the gateway |
| User asks for an industry workflow this repo does not have | Treat it as a new product decision; do not invent the domain |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; name what is absent; do not scaffold a new product unless asked |
| Ambiguous scope | One clarifying question, then proceed with stated assumptions |
| Secrets required | Never print them; list env var or keychain names only |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
