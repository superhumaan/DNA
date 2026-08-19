---
description: Mobile auth — secure token storage, biometric lock, refresh, and logout on both iOS and Android.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---
# Expo auth secure storage

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Harden **auth on device**. Tokens are secrets.

## Rules

- Access/refresh tokens: `expo-secure-store` (or Keychain/Keystore wrappers). **Never AsyncStorage**
- Prefer BFF cookie+refresh or short-lived access tokens
- Biometric: optional gate to unlock the session, not a replacement for server auth
- Logout: delete secure items + query cache
- Certificate pinning: only if the org already has a pinning programme — do not invent pins

## Checklist

- [ ] Find current token storage (grep AsyncStorage, MMKV, secure-store)
- [ ] Refresh race: single-flight
- [ ] 401 → logout vs retry
- [ ] iOS Keychain accessibility when device locked
- [ ] Android: avoid backup of secrets
- [ ] Tests: mock secure-store; never real tokens in fixtures

## Artifacts

| Artifact | Path |
|----------|------|
| Auth storage plan | `.DNA/plans/expo-auth.md` |

## Failure modes

| Mode | Response |
|------|----------|
| Tokens in AsyncStorage | P1 migrate; treat as leaked if this shipped |
| Service role in extra | P0 rotate |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
