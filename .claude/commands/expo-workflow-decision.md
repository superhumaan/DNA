---
description: Choose Expo Go vs development build vs CNG prebuild vs bare — and when a native rebuild is mandatory.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---
# Expo workflow decision

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Decide the **developer and release workflow**. Do not mix Expo Go constraints with production native capabilities.

## Decision tree

- **Expo Go** — JS-only, Expo SDK modules already in Go. Never for custom native code, custom fonts via native, or non-Go config plugins.
- **Development build (dev client)** — default for real apps. `eas build --profile development`. Supports config plugins + local native.
- **CNG / prebuild** — `npx expo prebuild` generates ios/android when needed; prefer **not** committing them unless you must.
- **Bare / checked-in native** — only if you already own native trees or need native code Expo cannot generate.

## Checklist

- [ ] Inventory: expo plugins, native modules, permissions, push, IAP, bluetooth, etc.
- [ ] Go-compatible? If any plugin requires native — **dev client**
- [ ] eas.json profiles: development / preview / production exist or planned
- [ ] CI: who builds what (local vs EAS)
- [ ] Upgrade path documented (SDK bump + prebuild)
- [ ] ADR snippet written

## Artifacts

| Artifact | Path |
|----------|------|
| Workflow decision | `.DNA/plans/expo-workflow.md` |

## Failure modes

| Mode | Response |
|------|----------|
| Team already on Go + needs notifications | Switch to dev client; do not patch Go |
| ios/ and android/ already committed | Document ownership; do not delete without approval |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
