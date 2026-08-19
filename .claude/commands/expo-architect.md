---
description: Architecture decision record for Expo iOS/Android — workflow, Router, BFF, state, auth storage, and what must stay native.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---
# Expo architect

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Produce a **decision record**, not code. Stop after the ADR unless the user already approved implementation.

## Decision questions (must answer)

1. **Surface** — Expo managed / CNG prebuild / checked-in native trees / RN CLI. Why.
2. **Runtime** — Expo Go vs **dev client** vs production binary. Why (native modules, config plugins).
3. **Navigation** — Expo Router (file-based) vs React Navigation only. Deep links / universal links.
4. **BFF** — mobile Backend-for-Frontend vs direct BaaS vs existing public API. Payload shaping, auth exchange, versioning.
5. **State** — server state (Query) vs client (Zustand/context). Offline queue yes/no.
6. **Auth secrets** — expo-secure-store + biometric gate; never AsyncStorage for tokens.
7. **UI** — existing `platforms/mobile-ui` theme; do not invent a second design system.
8. **Updates** — EAS Update channels vs store binary. `runtimeVersion` policy.
9. **iOS vs Android deltas** — permissions, back button, predictive back, adaptive icons, ATT.

## Checklist

- [ ] Repo evidence: expo SDK version, router, eas.json, plugins
- [ ] ADR: options considered + chosen + rejected (with why)
- [ ] BFF boundary sketched (client → BFF → domain services)
- [ ] Native-vs-JS split: what can OTA vs what needs EAS Build
- [ ] iOS + Android constraints listed separately
- [ ] Out of scope explicit
- [ ] Approval gate before scaffold/code

## Artifacts

| Artifact | Path |
|----------|------|
| ADR | `.DNA/plans/expo-architecture.md` |
| Decision echo | `.DNA/CellularMemory/prefrontalCortex/decisions.md` (append) |
| Feature request | `ai/feature-request.md` if this becomes a build |

## Failure modes

| Mode | Response |
|------|----------|
| Web React only, no mobile | Stop; recommend-stack if they want mobile |
| Conflicting plugins / SDK | Record blockers; do not guess compatibility |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
