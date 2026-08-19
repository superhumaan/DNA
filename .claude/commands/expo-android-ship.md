---
description: Ship Expo to Play Console — AAB, Play App Signing, tracks, target SDK, and Android-only policy.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---
# Expo Android ship

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Ship **Android only**. Prefer **AAB** to Play. EAS Submit.

## Checklist

- [ ] applicationId + versionCode
- [ ] Play App Signing (EAS keystore names only)
- [ ] Tracks: internal / closed / production
- [ ] Target API level per current Play policy
- [ ] Data safety form matches SDKs
- [ ] 16 KB page size / 64-bit as required by current Play rules
- [ ] Predictive back / edge-to-edge if targeting new SDKs
- [ ] Proguard/R8 mapping for crash symbolication
- [ ] Review: demo account, screenshots without PII

## Artifacts

| Artifact | Path |
|----------|------|
| Android ship matrix | `.DNA/plans/expo-android-ship.md` |

## Failure modes

| Mode | Response |
|------|----------|
| APK uploaded when AAB required | Stop; produce AAB |
| Target SDK too old | Block production track; bump via Expo SDK / gradle |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
