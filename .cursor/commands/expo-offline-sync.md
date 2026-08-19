> **DNA Prompt Stem:** `expo-offline-sync` — read `.DNA/stems/expo-offline-sync/` (all files) before proceeding.

# Expo offline sync

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Plan **offline**. Do not fake an always-online SPA.

## Checklist

- [ ] Which screens are read-offline vs write-offline
- [ ] Persistence: SQLite / Watermelon / persist Query — pick one already in repo if present
- [ ] Outbox queue: idempotency keys
- [ ] Conflicts: last-write-wins vs server-wins vs user prompt
- [ ] NetInfo + UX banners (existing patterns, no invented slogans)
- [ ] Background fetch: iOS vs Android limits — do not promise web-like workers
- [ ] Sensitive data at rest encrypted if required

## Artifacts

| Artifact | Path |
|----------|------|
| Offline plan | `.DNA/plans/expo-offline.md` |

## Failure modes

| Mode | Response |
|------|----------|
| “Sync later” with no queue | Block; that is data loss |
| Background sync promised like a server | Correct the product copy |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
