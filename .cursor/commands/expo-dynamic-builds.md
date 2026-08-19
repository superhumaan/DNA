> **DNA Prompt Stem:** `expo-dynamic-builds` — read `.DNA/stems/expo-dynamic-builds/` (all files) before proceeding.

# Expo dynamic builds

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Configure **dynamic JS updates** (EAS Update / `expo-updates`). This is **not** a substitute for EAS Build when native changes.

## What MAY go over the air

- JS/TS, Metro bundle, most assets declared as update assets
- Feature flags that do not require new native entitlements

## What MUST be a new binary (block OTA-only)

- Native modules, config plugins, permissions, ATS exceptions
- Splash/icon/name that require native resources
- `runtimeVersion` / SDK bump
- Privacy manifests / Gradle target SDK that stores reject

## Checklist

- [ ] `expo-updates` + `eas.json` submit/update config present or planned
- [ ] `runtimeVersion` policy: `appVersion` vs fingerprint vs nativeVersion
- [ ] Channels: production / preview / staging mapped to EAS profiles
- [ ] Rollout: percentage, rollback command documented
- [ ] iOS + Android both receive the same channel policy (call out exceptions)
- [ ] Native compatibility check in CI (fingerprint)
- [ ] Never force users onto a broken update — fatal fallback
- [ ] Secrets: update URL/channel in config, tokens in EAS secrets

## Artifacts

| Artifact | Path |
|----------|------|
| Update policy | `.DNA/plans/expo-dynamic-builds.md` |

## Failure modes

| Mode | Response |
|------|----------|
| Native diff since last binary | Block OTA; run expo-eas-build |
| Missing runtimeVersion | Do not enable updates in production |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
