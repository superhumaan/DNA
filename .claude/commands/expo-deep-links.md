---
description: Universal Links (iOS) and App Links (Android) plus custom schemes — Expo Router linking and verified domains.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---
# Expo deep links

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Configure **verified HTTPS links** (preferred) plus a custom scheme for dev.

## Checklist

- [ ] `scheme` in app config
- [ ] iOS associatedDomains + AASA file on the web host
- [ ] Android intentFilters + Digital Asset Links
- [ ] Expo Router: path vs screen map
- [ ] Auth: unauthenticated deep link stored then replayed
- [ ] Cold start vs warm
- [ ] Preview vs prod domains (flavor config)

## Artifacts

| Artifact | Path |
|----------|------|
| Linking plan | `.DNA/plans/expo-deeplinks.md` |

## Failure modes

| Mode | Response |
|------|----------|
| Scheme-only in production | Weak; add verified HTTPS |
| AASA 404 | Block claiming Universal Links work |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
