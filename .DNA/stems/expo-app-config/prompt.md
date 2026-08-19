> **DNA Prompt Stem:** `expo-app-config` — read `.DNA/stems/expo-app-config/` (all files) before proceeding.

# Expo app config

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Design **dynamic** `app.config.ts` (or `app.config.js`) for flavors: development / preview / production.

## Rules

- `EXPO_PUBLIC_*` only in the client bundle
- Bundle ID / applicationId suffixes for preview (`.preview`) so TestFlight and prod can coexist
- Plugins listed explicitly; order matters
- Icons/splash per flavor if product requires — do not invent marketing slogans
- `updates.url` / runtimeVersion aligned with expo-dynamic-builds

## Checklist

- [ ] Static app.json vs dynamic config — pick one source of truth
- [ ] Scheme, associated domains placeholders
- [ ] iOS infoPlist + Android permissions mirrored in config plugins
- [ ] New Architecture / edge-to-edge flags documented
- [ ] No API secrets in extra that get baked into the binary

## Artifacts

| Artifact | Path |
|----------|------|
| Config map | `.DNA/plans/expo-app-config.md` |

## Failure modes

| Mode | Response |
|------|----------|
| Secret in extra | Remove; rotate if already shipped |
| Duplicate app.json + app.config | Consolidate |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
