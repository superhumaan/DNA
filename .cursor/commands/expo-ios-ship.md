> **DNA Prompt Stem:** `expo-ios-ship` — read `.DNA/stems/expo-ios-ship/` (all files) before proceeding.

# Expo iOS ship

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Ship **iOS only** (use expo-android-ship for Play). EAS Submit or Transporter.

## Checklist

- [ ] Version + build number vs App Store Connect
- [ ] Signing via EAS credentials (names only)
- [ ] Privacy nutrition labels + privacy manifest (PrivacyInfo.xcprivacy)
- [ ] ATT only if tracking; usage strings present
- [ ] Encryption / export compliance answered truthfully
- [ ] Review notes: demo login, no production PII in screenshots
- [ ] TestFlight groups
- [ ] Universal links associated domains
- [ ] Push: APNs key on EAS
- [ ] Hand off release notes

## Artifacts

| Artifact | Path |
|----------|------|
| iOS ship matrix | `.DNA/plans/expo-ios-ship.md` |

## Failure modes

| Mode | Response |
|------|----------|
| Missing usage string | Block submit; add Info.plist / plugin |
| Review rejection | Record reason; do not guess a resubmit without a fix |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
