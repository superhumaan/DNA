> **DNA Prompt Stem:** `expo-init` — read `.DNA/stems/expo-init/` (all files) before proceeding.

# Expo init

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Scaffold or repair Expo **only after** architect/workflow decisions exist (or capture them now in a short ADR).

## Defaults (unless the repo already chose otherwise)

- `npx create-expo-app` (latest SDK) + TypeScript
- Expo Router file-based routes
- `expo-secure-store`, `expo-system-ui`, safe-area
- Theme from `platforms/mobile-ui` (Paper/MD3 or the repo's existing system — do not add a second)
- `eas.json` with development / preview / production
- No checked-in `ios/` `android/` unless workflow decision says so

## Checklist

- [ ] ADR or expo-architect notes loaded
- [ ] App name, slug, scheme, bundle IDs (iOS) + applicationId (Android) planned — do not invent brands
- [ ] TS paths, lint, tests (Jest + RNTL or project's runner)
- [ ] `.env` example with public keys only (`EXPO_PUBLIC_*`)
- [ ] Gitignore: native build artifacts, credentials
- [ ] DNA: load mobile knowledge; do not copy web CSS layout 1:1
- [ ] Approval before running create-expo-app if the folder is not empty

## Artifacts

| Artifact | Path |
|----------|------|
| Init notes | `.DNA/plans/expo-init.md` |

## Failure modes

| Mode | Response |
|------|----------|
| Repo already has Expo | Repair/align; do not create a second app |
| User wanted Flutter | Stop; do not init Expo |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
