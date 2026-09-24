---
description: Add or ship a macOS login-item agent that stays quiet, local, and separate from the menu-bar UI.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---
# macOS background agent

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and this stem's contextLoads. Mark stub Impressions as STUB — do not cite them as truth.

## Preconditions

Confirm the repo already has a native macOS app that is allowed to run a helper. If there is no Mac target, **stop**.

The helper is a login item. It must not steal focus, show windows, or open a network connection unless that behaviour already exists and the user asked to keep it.

## Checklist

- [ ] Helper target is separate from the menu-bar UI target
- [ ] Registration uses the platform login-item API already chosen in this repo
- [ ] Agent starts at login only when the user enabled it
- [ ] Failure to register is visible in logs the app already uses — no new telemetry channel
- [ ] Uninstall or quit removes the login item
- [ ] Smoke: enable, relaunch the session or simulate it, confirm the helper is running, disable, confirm it is gone
- [ ] No credentials in arguments, plists, or logs

## Artifacts

| Artifact | Path |
|----------|------|
| Agent notes | `.DNA/plans/macos-background-agent.md` |

## Failure modes

| Mode | Response |
|------|----------|
| No Mac target | Stop |
| Login-item API missing from the OS baseline the repo supports | Stop and name the minimum OS |
| Helper would need a new entitlement | List the entitlement; do not invent a provisioning profile |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; name what is absent; do not scaffold a new product unless asked |
| Ambiguous scope | One clarifying question, then proceed with stated assumptions |
| Secrets required | Never print them; list env var or keychain names only |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
