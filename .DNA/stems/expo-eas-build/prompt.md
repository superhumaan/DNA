> **DNA Prompt Stem:** `expo-eas-build` — read `.DNA/stems/expo-eas-build/` (all files) before proceeding.

# Expo EAS Build

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Plan or run **EAS Build**. Profiles: **development** (dev client), **preview** (internal distribution), **production** (store).

## Checklist

- [ ] `eas.json` profiles: development / preview / production
- [ ] Resource class / image pinned; SDK aligned
- [ ] iOS: bundle identifier, entitlements, provisioning via EAS credentials (names only)
- [ ] Android: applicationId, Play App Signing, keystore on EAS
- [ ] Env: `EXPO_PUBLIC_*` vs secret EAS env
- [ ] Native directories: CNG vs committed
- [ ] Build numbers / versionCode auto-increment strategy
- [ ] Artifact: who downloads .ipa / .aab
- [ ] Never log credentials

## Artifacts

| Artifact | Path |
|----------|------|
| Build matrix | `.DNA/plans/expo-eas-build.md` |

## Failure modes

| Mode | Response |
|------|----------|
| Missing Apple/Play account | List required roles; do not fake a build URL |
| Build failed on EAS | Quote error class (signing, Gradle, CocoaPods) + next probe |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
