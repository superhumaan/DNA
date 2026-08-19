---
description: VoiceOver, TalkBack, hit targets, Dynamic Type / font scaling, and labels on iOS and Android.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---
# Expo mobile accessibility

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Audit **iOS VoiceOver** and **Android TalkBack** separately. Web a11y stems do not replace this.

## Checklist

- [ ] accessibilityLabel / Role on tappable non-text
- [ ] Hit target ≥ 44×44 (iOS) / 48×48 (Android) — existing UI system
- [ ] Font scaling: don't clip; test large text
- [ ] Contrast on theme tokens (mobile-ui)
- [ ] Reduce motion if you add Reanimated flourishes
- [ ] Form errors announced
- [ ] Do not invent extra header slogans for “clarity”

## Artifacts

| Artifact | Path |
|----------|------|
| A11y report | `.DNA/reports/expo-a11y.md` |

## Failure modes

| Mode | Response |
|------|----------|
| Web-only eslint jsx-a11y | Insufficient; device pass required |
| Unlabelled icon tabs | P1 |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
