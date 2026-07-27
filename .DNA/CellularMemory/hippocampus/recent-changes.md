# Recent Changes

_Last updated: 2026-07-27_

## 2026-07-27 — Ship v0.6.19 (purpose bundles)

- npm **0.6.19**: marketplace combo install (packs + stems + AI rules), catalog `bundles[]`, Mirth alias fix.
- Docs: CHANGELOG, README, cli-reference, TEAM-TESTING, dna-cli README, current-version-scope, planning.
- DNA-Web: homepage + marketplace bundles-first UX (separate repo `superhumaan/DNA-Web`).

## 2026-07-27 — Marketplace Bundles (Purpose Combos)

- Catalog `bundles[]` (27 purpose combos) with linked knowledge packs + prompt stem ids.
- `dna marketplace install combo/<id>` installs packs, injects stems/slash commands, always-on Cursor rules, and AI workbench context.
- DNA-Web `/marketplace#bundles` + `GET /marketplace/api/v1/bundles`.

## 2026-07-27 — Ship v0.6.18

- npm + docs: Lab APIs reference, deep links, open-auth fix, marketplace richness (~1045 packs).
- Docs synced: CHANGELOG, README, planning, current-version-scope, TEAM-TESTING, cli-reference, lab-apis-reference-0.6.18.

## 2026-07-27 — Lab URL deep links + no Unauthorized toast

- Path routing: `/labs/coverage`, `/labs/issues/:id` via `history.pushState` + `popstate`; `sessionStorage` backup for bare `/labs`.
- 401 on Lab APIs → sign-in view (never toast raw "Unauthorized" on dashboard).
- Shared helpers: `packages/dna-core/src/lab/ui/lab-routes.ts` (+ client mirror in `dashboard.ts`).

## 2026-07-27 — Lab APIs full reference

- `LAB_OPERATIONS` in `collect-apis.ts` documents every Lab route with description, usage, received, sent.
- Lab APIs tab: expandable API reference (not just method/path); OpenAPI project ops enriched similarly.
- Completeness test: `collect-apis.test.ts` locks expected method+path set.

## 2026-07-27 — Long-tail richness floor (0 stubs)

- `finalizeCatalogPacks` + `liftPackToRichness` applied to entire marketplace catalog.
- `packsFromDefs` now emits rich + longtail depth (no more 4-file wave stubs).
- Result: **1045/1045 rich**, stub=0, thin=0 (~346 longtail-lifted). Catalog ~13.2MB.
- CI: `longtail-richness-gate.test.ts`.

## 2026-07-27 — Wave 2 P0 depth (≥12k) + DB/AI/discovery/compliance

- P0 depth pads on all Wave 1+2 packs; CI `meetsP0DepthBar` (≥12000 chars).
- Wave 2 overrides: postgres, redis, mongo, prisma, drizzle, supabase, openai, anthropic, vercel-ai-sdk, langchain, rag-patterns, discovery flagships, gdpr, soc2, hipaa-depth, pci-dss-depth.
- Example: `frameworks/nextjs` 29 files / 14104 chars; `compliance/soc2` 28 files / 12133 chars (was 1 file / 85 chars).

## 2026-07-27 — Wave 1 P0 richness + strategy grounding

- P0 rich overrides: nextjs, react, vite, nestjs, fastify, clerk, stripe, payments overview/connect, GHA, AWS overview, docker.
- Richness CI: `pack-richness-gate.test.ts`.
- Strategy grounding module + STRATEGY_COMPLETE wired into strategy-ladder and product-diagnose.

## 2026-07-27 — Lab title bar → content gap for toasts

- `.lab-toast` now uses `margin-top: var(--admin-header-content-gap)` (16px) so error/success toasts are not flush under the page title bar.
- File: `packages/dna-core/src/lab/ui/styles.ts`.

## 2026-07-24 — Methodology packs expanded (sizes × industries)

- Catalog **965 → 998** packs. Source: `bundled-catalog-methodologies-expanded.ts`.
- **Company sizes:** solo, startup, scale-up, sme, mid-market, enterprise, big-tech, agency, research-lab, nonprofit, travel-scale-up, platform-marketplace (8 docs each).
- **Industry delivery overlays:** healthcare, fintech, gov, ecommerce, edtech, manufacturing, media, logistics, proptech, energy, legal-tech, hospitality, gaming, saas-b2b, insurtech, ai-ml.
- **Process packs added:** lean-startup, xp, dual-track-agile, continuous-delivery, devops, sre-ops, design-ops, product-ops, nexus, scrum-at-scale.
- Purpose combos: `combo/startup-saas`, `combo/enterprise-healthcare`, `combo/agency-fintech`.

## 2026-07-24 — Knowledge pack zero-stubs plan approved

- User approved per-pack advancement canvas + strategy grounding blueprint.
- Plan persisted: `ai/feature-request.md`, `docs/engineering/knowledge-pack-zero-stubs-plan.md`,
  CellularMemory prefrontal current-plan / decisions / next-actions.
- Wave 1 started: `purpose-combos.ts` + install resolver (required + preferred).

## 2026-07-17 — Production health & residual closure (v0.6.13)

- Shared Lab Redis-compatible state adapter with fail-closed topology.
- Strict CI + blocking pre-push; Playwright Lab smoke; scoped ≥80% coverage.
- Canonical health report feeds GitHub Step Summary, npm README, DNA-Web `/health`.
- CellularMemory/Impressions reconciled away from stale React/Postgres MVP copy.
- DNA-Web sync defaults corrected to `../DNA-Web`.

## 2026-07-17 — Lab poll hardening (200 concurrent viewers)

Verified with `scripts/lab-load-test.mjs --users 200 --polls 5 --events 2000`:

- **Problem:** `GET /api/dna/labs/data` ran full `collectLabData` per poll (no sockets — interval poll). 200 viewers → p95 ~4.1s, ~47 req/s, ~1MB payloads.
- **Fix:** `getLabData` micro-cache + single-flight (2s TTL); ETag/304; trim payload (200 slim events); client visibility/jitter + `If-None-Match`; session auth cache; 64KiB POST body limit.
- **After:** p95 ~128ms, ~5076 req/s, 80% 304, ~74KB payload, 0 errors.
- Also fixed `apps/examples/node-express-app` `tsc` build (unused Fastify import + partial DnaConfig cast).
- Closed review residuals: pairing callback HMAC, loopback-only local trust,
  dev OTP non-disclosure, legacy dashboard delegation, Lab `/health`,
  on-demand issue events, fail-closed replica topology, pnpm-native CI audit,
  200-viewer CI gate, and patched Vitest/esbuild toolchain.
- Canonical runtime storage name is now `json`; historical `sqlite` configs
  normalize safely while the `runtime.db` compatibility filename remains.
- Final gates: 84 files / 310 tests, quality PASS, Docker PASS, audit clean;
  latest 200-viewer gate p95 168ms / 4423 req/s / 0 errors.
- Delivery follow-up: disabled the invalid root Vercel preview (the configured
  `dna` project belongs to DNA-Web), made preview opt-out remove generated
  workflows, and retained failed Action logs for 24 hours before cleanup.
- CI clean-checkout fix (#23): generated DNA CI builds workspace packages
  before typecheck/tests/coverage so runners no longer depend on stale local
  `dist/`. Verified run 29553119408 with all quality steps succeeding.
- Review artefacts: `docs/reviews/`.

## 2026-07-14 — v0.6.8 Lab CI billing blocker

- Lab classifies GitHub Actions billing/spending-limit failures; Overview + Quality banner
- Cleanup workflow skips billing instant failures; `continue-on-error`
- Docs: upgrade requires API restart (npx alone does not refresh Lab)

## 2026-07-14 — v0.6.7 Lab UI Humaan parity

- Lab UI: DNA icon-only brand, Humaan primary pills + large pill tabs, list search → tabs → always-on tables, sidebar accordion, base font 16px
- Docs: `docs/engineering/lab-ui-humaan-0.6.7.md`, CHANGELOG, roadmap, scope

## 2026-07-14 — v0.6.3 ship

- **Aggressive Repair Loop** — fingerprints, CellularMemory blockers, GitHub dedup, `dna ai force-repair` (PR #20)
- **Lab CJS Express wire** — `.DNA/lab/express-wire.cjs` dynamic import (fixes `ERR_REQUIRE_ESM` under `node --watch`)
- **Lab `/data` hang** — `runDoctorLite` + cache/timeout; `Promise.allSettled` collect
- **runtime.db** — atomic writes, mutex, quarantine corrupt JSON
- Docs: `docs/engineering/lab-and-repair-0.6.3.md`, CHANGELOG, roadmap, scope

## 2026-07-13 — Lab v0.6.0–0.6.2

- DNA Lab at `/labs`, Vite proxy + Vercel rewrites, CSP / helmet mount order

## Initial Setup

- DNA initialised on 2026-07-11
- Project: dna-by-humaan
