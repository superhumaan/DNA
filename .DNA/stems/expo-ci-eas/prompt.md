> **DNA Prompt Stem:** `expo-ci-eas` — read `.DNA/stems/expo-ci-eas/` (all files) before proceeding.

# Expo CI EAS

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Wire **CI** that respects OTA vs binary.

## Recommended pipeline

- PR: lint, typecheck, unit tests (no full EAS unless native fingerprint changed)
- Fingerprint / `npx expo-updates` compatibility: fail OTA job if native changed
- Main: EAS Update to preview channel; production binary on tag/release
- Secrets: EXPO_TOKEN, not in logs

## Checklist

- [ ] Existing dna-ci.yml — extend, don't fork a parallel mobile CI without reason
- [ ] Cache node modules
- [ ] Who pays EAS minutes
- [ ] Maestro in CI optional (macOS runners cost)

## Artifacts

| Artifact | Path |
|----------|------|
| CI plan | `.DNA/plans/expo-ci.md` |

## Failure modes

| Mode | Response |
|------|----------|
| eas build on every JS PR | Too slow/costly; use fingerprint |
| Token in workflow YAML | Block |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
