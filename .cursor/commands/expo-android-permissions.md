> **DNA Prompt Stem:** `expo-android-permissions` — read `.DNA/stems/expo-android-permissions/` (all files) before proceeding.

# Expo Android permissions

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Audit **Android** permissions. Runtime request in context. Match Play Photo/Video/Notifications policies (13+).

## Checklist

- [ ] Manifest permissions vs actually used
- [ ] Notifications: POST_NOTIFICATIONS on 13+
- [ ] Photos: partial access / photo picker vs READ_MEDIA_*
- [ ] Location: foreground vs background (background is a store minefield)
- [ ] Exact alarms / foreground services — justify
- [ ] Denied UX + settings intent
- [ ] iOS twin listed (expo-ios-permissions) — do not copy iOS strings blindly

## Artifacts

| Artifact | Path |
|----------|------|
| Android permission matrix | `.DNA/plans/expo-android-permissions.md` |

## Failure modes

| Mode | Response |
|------|----------|
| Background location without product need | Remove; Play will reject |
| Permissions in manifest unused | Strip plugins |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
