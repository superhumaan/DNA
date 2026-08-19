> **DNA Prompt Stem:** `expo-native-modules` — read `.DNA/stems/expo-native-modules/` (all files) before proceeding.

# Expo native modules

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Decide how to integrate **native** code.

## Options (pick with evidence)

1. Expo SDK module already in the runtime
2. Config plugin + autolinking (preferred for third-party)
3. Local CNG native code (ios/ android) — last resort
4. Reject the library; find an Expo-compatible alternative

## Checklist

- [ ] Does it require custom native? (readme, expo plugin)
- [ ] Dev client required after add
- [ ] OTA: **blocked** until a new binary
- [ ] Permissions stems if the module accesses sensors/PII
- [ ] New Architecture compatibility
- [ ] Who owns upgrades on SDK bumps

## Artifacts

| Artifact | Path |
|----------|------|
| Native impact ADR | `.DNA/plans/expo-native-modules.md` |

## Failure modes

| Mode | Response |
|------|----------|
| npm install then Expo Go | Will crash; require dev client |
| Patching node_modules native | Forbidden; plugin or fork with a path |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
