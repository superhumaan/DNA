# CI Command Map — dna-by-humaan

**Generated:** 2026-07-17  
**Source of truth:** `.github/workflows/*`, root `package.json`, `.DNA/config.dna.json`, DNA delivery rules

## Existing CI workflows

| Workflow | File | Trigger | Mode |
|----------|------|---------|------|
| DNA CI | `.github/workflows/dna-ci.yml` | push (all branches), PR | Advisory (`continue-on-error: true` on gates) |
| DNA Security (ZAP) | `.github/workflows/dna-security.yml` | weekly + dispatch | Only if `vars.STAGING_URL` set |
| DNA Preview | `.github/workflows/dna-preview.yml` | push/PR | Vercel preview |
| Publish npm | `.github/workflows/publish-npm.yml` | dispatch | Requires `NPM_TOKEN` secret |
| Cleanup failed runs | `.github/workflows/cleanup-failed-runs.yml` | schedule | Billing-aware |

Config: `.DNA/config.dna.json` → `"ci": { "strict": false, "coverageThreshold": 80, "owasp": true }`.

## Commands run by CI (`dna-ci.yml`)

| Step | Command | Blocking? |
|------|---------|-----------|
| Install | `pnpm install --frozen-lockfile` | Yes |
| Lint | `pnpm run lint` | No (advisory) |
| Typecheck | `pnpm run typecheck` | No |
| Unit tests | `pnpm run test` | No |
| Coverage | `pnpm run test:coverage` | No |
| Per-file ≥80% | node script on `coverage/coverage-summary.json` | No |
| Build | `pnpm run build` | No |
| Lab capacity | `pnpm run test:load:lab` | No (advisory) |
| DNA quality | `npx @superhumaan/dna-by-humaan quality report` | No |
| Docker | `docker build -t dna-app:ci .` (if Dockerfile) | No |
| OWASP audit | `pnpm audit --audit-level=high` | No |

## Commands missing from CI

| Gap | Local equivalent | Notes |
|-----|------------------|-------|
| Format check | `pnpm exec prettier --check "**/*.{ts,tsx,json,md}"` | Format script only writes |
| E2E / Playwright | — | No browser e2e suite for Lab UI |
| Secret scanning | — | Rely on GitHub push protection / Socket |
| Container scan | — | Docker builds only |
| Integration against live Postgres | — | Stack declares postgres; Lab uses JSON store |

## Local equivalents (recommended order)

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm run test:load:lab
pnpm audit --audit-level=high
npx dna quality report --feature   # or: pnpm dna quality report --feature
pnpm run docker:build              # or: dna docker build
```

## Required environment

| Item | Requirement |
|------|-------------|
| Node | ≥20 (CI uses 22) |
| pnpm | 9.x |
| Lockfile | `pnpm-lock.yaml` committed |
| Services | None for unit tests |
| Test DB | None — Lab/runtime use JSON files under `.DNA/data/` |
| Browser | Not required for current suite |
| Secrets | None for local unit/CI quality job |

## Package manager note

Workspace root uses **pnpm**. Always install with `--frozen-lockfile` in CI.

## Verified baseline (2026-07-17, this review)

| Gate | Result |
|------|--------|
| `pnpm run lint` | PASS |
| `pnpm run typecheck` | PASS (14 packages with typecheck scripts) |
| `pnpm run test` | PASS — final count recorded in Stage 10 |
| `pnpm run build` | Was FAIL (`apps/examples/node-express-app`); **fixed** → PASS |
| Lab load 200 users | Gate PASS; p95 <1500ms, throughput >500 req/s, 0 errors |
| `pnpm audit` | No known vulnerabilities |
