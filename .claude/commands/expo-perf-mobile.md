---
description: Mobile perf — FlashList/FlatList, images, Reanimated UI thread, JS jank, and iOS/Android profiling.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---
# Expo mobile performance

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Profile **before** rewriting. iOS and Android can disagree.

## Checklist

- [ ] Reproduce device class (low-end Android vs iPhone)
- [ ] Lists: FlashList/FlatList windowing; no map() of 1k Views
- [ ] Images: expo-image, size to screen, cache
- [ ] Reanimated worklets vs JS-thread animations
- [ ] Avoid anonymous inline components in hot lists
- [ ] Hermes; bundle size; debug vs release (never profile only in debug)
- [ ] TTI, scroll FPS notes as **measured** or labelled assumption

## Artifacts

| Artifact | Path |
|----------|------|
| Perf notes | `.DNA/reports/expo-perf.md` |

## Failure modes

| Mode | Response |
|------|----------|
| Debug-only slowness | Re-measure release |
| Premature Recoil/Zustand rewrite | Reject unless evidence |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
