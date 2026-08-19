---
description: EAS Submit to App Store Connect and Play Console — both stores, metadata, and no secret leakage.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---
# Expo store submit

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Submit **both stores** (or the one in $ARGUMENTS). Pair with expo-ios-ship / expo-android-ship checklists.

## Checklist

- [ ] Binaries from expo-eas-build exist
- [ ] eas.json submit profiles
- [ ] Metadata: screenshots, privacy, ratings — match existing brand; no invented slogans
- [ ] Review accounts
- [ ] Phased release optional
- [ ] Same marketing version on both OS unless argued

## Artifacts

| Artifact | Path |
|----------|------|
| Submit matrix | `.DNA/plans/expo-store-submit.md` |

## Failure modes

| Mode | Response |
|------|----------|
| Binary missing | Run expo-eas-build first |
| Metadata mismatch vs in-app permissions | Align before submit |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
