---
description: Custom development builds — expo-dev-client, internal distribution, and why Expo Go is not enough.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---
# Expo dev client

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Install and distribute a **custom development client** so native modules and config plugins work on device.

## Checklist

- [ ] `expo-dev-client` dependency
- [ ] eas.json development profile (`developmentClient: true`)
- [ ] iOS: register devices / internal dist; Android: install APK/AAB
- [ ] Launch: `npx expo start --dev-client`
- [ ] Team onboarding: how to install the binary once, then OTA JS
- [ ] Do not tell the team to use Expo Go if plugins require native

## Artifacts

| Artifact | Path |
|----------|------|
| Dev client notes | `.DNA/plans/expo-dev-client.md` |

## Failure modes

| Mode | Response |
|------|----------|
| Simulator-only team | Still produce Android path; do not drop Android |
| Go QR habits | Retrain: scan/open the **dev client**, not Go |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
