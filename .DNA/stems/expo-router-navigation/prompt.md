> **DNA Prompt Stem:** `expo-router-navigation` — read `.DNA/stems/expo-router-navigation/` (all files) before proceeding.

# Expo Router navigation

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Design or repair **Expo Router**. Match existing screens — do not invent a new IA.

## Rules

- File-based routes under `app/` (or the project's Router root)
- Groups: `(auth)`, `(app)` — unauthenticated users never see app chrome
- Tabs: only for top-level IA that already exists in product
- Android hardware/predictive back must pop the stack; do not hijack BackHandler unless required
- Deep links: `scheme` + associated domains / App Links (hand off `expo-deep-links`)
- Loading/error: `loading.tsx` / error boundaries per segment

## Checklist

- [ ] Current route tree mapped from files
- [ ] Auth gate: redirect vs replace (no flash of protected UI)
- [ ] iOS swipe-back vs Android back tested in plan
- [ ] Shared layouts vs duplicated headers
- [ ] Params typed; no secrets in URLs
- [ ] Tests for auth redirect

## Artifacts

| Artifact | Path |
|----------|------|
| Route map | `.DNA/plans/expo-router.md` |

## Failure modes

| Mode | Response |
|------|----------|
| React Navigation without Router | Do not migrate unless asked; document dual stacks as a risk |
| Protected routes visible before auth | Block; treat as P1 |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
