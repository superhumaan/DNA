> **DNA Prompt Stem:** `expo-testing-mobile` — read `.DNA/stems/expo-testing-mobile/` (all files) before proceeding.

# Expo mobile testing

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Plan tests that **run**. Prefer the repo's existing runner.

## Layers

- Unit/component: Jest + @testing-library/react-native
- E2E: Maestro (simple YAML) or Detox if already adopted — do not add both
- Manual: permission deny, airplane mode, cold start from push / universal link

## Checklist

- [ ] Existing test script detected
- [ ] Secure-store + NetInfo mocked
- [ ] No real tokens in fixtures
- [ ] E2E smoke: launch, login, one critical path × iOS and Android
- [ ] Deep link + push cold start on the critical path
- [ ] CI: who runs simulators (EAS / GH macOS / local)

## Artifacts

| Artifact | Path |
|----------|------|
| Test plan | `.DNA/plans/expo-testing.md` |

## Failure modes

| Mode | Response |
|------|----------|
| Detox + Maestro both new | Pick Maestro unless Detox already exists |
| E2E only on iOS sim | Call out Android gap |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
