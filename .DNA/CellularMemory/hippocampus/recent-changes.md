# Recent Changes

_Last updated: 2026-07-17_

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
