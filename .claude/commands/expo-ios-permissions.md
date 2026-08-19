---
description: iOS permission usage strings, privacy manifest, ATT, and config plugins — rationale before request.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---
# Expo iOS permissions

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Audit **iOS** permissions. Every key needs a **user-facing rationale** that matches real UX. Do not request camera “just in case”.

## Checklist

- [ ] Inventory plugins: camera, photos, location, mic, contacts, bluetooth, tracking
- [ ] NS*UsageDescription strings in config plugin / Info.plist
- [ ] Privacy manifest third-party SDKs
- [ ] ATT: only if tracking; otherwise omit
- [ ] Request **in context** (after tap), not on first launch
- [ ] Denied UX: settings deep link, no crash loop
- [ ] Android counterpart listed but not implemented here (expo-android-permissions)

## Artifacts

| Artifact | Path |
|----------|------|
| iOS permission matrix | `.DNA/plans/expo-ios-permissions.md` |

## Failure modes

| Mode | Response |
|------|----------|
| Generic “we need this” copy | Rewrite to product-specific rationale |
| Permission unused | Remove plugin — stores reject unused sensitive access |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
