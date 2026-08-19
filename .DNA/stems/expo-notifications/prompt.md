> **DNA Prompt Stem:** `expo-notifications` — read `.DNA/stems/expo-notifications/` (all files) before proceeding.

# Expo push notifications

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Implement or repair **push**. iOS = APNs, Android = FCM (via Expo push or your server).

## Checklist

- [ ] Dev client required (not Expo Go for production-quality push)
- [ ] Permission: iOS prompt + Android 13 POST_NOTIFICATIONS
- [ ] Android channels
- [ ] Token registration → **your backend/BFF**, not only Expo's service if you need control
- [ ] Cold start: last notification response → Router
- [ ] Payload: no PII/PHI; ids only
- [ ] Foreground handling — don't spam
- [ ] EAS credentials: APNs key, FCM google-services (names / files in secrets)

## Artifacts

| Artifact | Path |
|----------|------|
| Push plan | `.DNA/plans/expo-notifications.md` |

## Failure modes

| Mode | Response |
|------|----------|
| Token in app logs | Remove; treat as leak |
| Go-only testing | Not production-representative |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
