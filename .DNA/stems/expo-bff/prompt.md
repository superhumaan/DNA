> **DNA Prompt Stem:** `expo-bff` — read `.DNA/stems/expo-bff/` (all files) before proceeding.

# Expo backend for frontend

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
npx dna stack show
```

Load `.DNA/neuralNetwork.json`, `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem.

Detect: `app.json` / `app.config.ts`, `eas.json`, `expo-router`, `expo-updates`, `ios/`, `android/`. Mark stub Impressions as STUB — do not cite as truth.

Plan a **BFF** for the Expo client. Mobile is not a browser: high latency, spotty networks, certificate pinning later, and OS background limits.

## Why a BFF (must justify)

- Aggregate 2+ domain services into one screen payload
- Hide service-to-service tokens; issue **short-lived** client tokens
- Shape DTOs for lists (cursor pagination, image variants) — not raw domain graphs
- Version `/mobile/v1` independently of web
- Centralize feature flags and kill-switches for store-review builds

## Checklist

- [ ] Client today: direct APIs / Supabase / GraphQL? Evidence from repo
- [ ] BFF host: existing Express/Fastify vs new `apps/mobile-bff`
- [ ] Auth: how refresh works; where refresh token lives on device (secure-store)
- [ ] Endpoints per primary screens (list/detail) — not 1:1 with microservices
- [ ] Error contract: typed codes, retryable vs fatal, offline queue hints
- [ ] Pagination: cursor, not offset, for infinite lists
- [ ] PII: minimize fields; no PHI/secrets in logs
- [ ] iOS ATS / Android cleartext: HTTPS only
- [ ] Tests: contract tests for mobile DTOs
- [ ] Plan only — wait for approval before code

## Artifacts

| Artifact | Path |
|----------|------|
| BFF plan | `.DNA/plans/expo-bff.md` |
| API sketch | include OpenAPI/paths in the plan |

## Failure modes

| Mode | Response |
|------|----------|
| Single BaaS already fits | Recommend **no BFF**; document why; still secure tokens |
| BFF would duplicate an existing GraphQL gateway | Reuse gateway; add mobile schema slice, do not fork |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| No Expo / RN app | Stop; do not invent a mobile app unless the user asked to scaffold (`expo-init`) |
| Ambiguous iOS vs Android scope | Call both out; do not collapse into “mobile” |
| Secrets / credentials needed | List env var / EAS secret **names** only; never print values |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
