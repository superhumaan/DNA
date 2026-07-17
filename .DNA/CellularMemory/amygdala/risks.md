# Risks

## Active (documented 2026-07-17)

| Risk | Severity | Mitigation |
|------|----------|------------|
| Broader monorepo line inventory below 80% | Low | Product-critical generator coverage is enforced ≥80% per file; CLI/Lab I/O covered by integration + Playwright + load gates |
| Optional shared Lab state depends on operator-managed Redis | Medium | File default remains zero-config; incomplete/unreachable Redis fails closed with 503 |

## Closed / mitigated

| Risk | Mitigation |
|------|------------|
| Lab `/data` collapse under ~200 concurrent pollers | getLabData cache, ETag/304, payload trim, client poll hygiene — verified by load harness |
| Legacy dashboard duplicate | Public compatibility exports delegate to Lab; duplicate server removed |
| Pairing callback forgery | HMAC-SHA256 + timing-safe verification; unsigned callbacks return 401 |
| Public development host treated as local / dev OTP leak | Local mode is loopback-only; OTP requires loopback and non-production environments |
| CI npm audit on pnpm | Generator selects package-manager-native audit command |
| vitest/vite/esbuild advisories | Vitest 4.1.10 + esbuild 0.28.1; `pnpm audit` clean |
| Vercel preview deployed this non-deployable root with DNA-Web project IDs | Explicit `ci.pushToPreview: false`; generated workflow removed; Docker remains delivery artifact |
| Failed workflow cleanup erased diagnostics immediately | Cleanup retains failures for 24 hours before scheduled deletion |
| Clean-checkout CI typecheck/tests before workspace build | Generated DNA CI builds packages first; regression locks ordering (#23) |
| Shared Lab state adapter unavailable | Optional Redis-compatible adapter with distributed lock; multi-instance only when fully configured |
| Advisory CI (`continue-on-error`) | `ci.strict: true`, blocking workflow, and strict pre-push `--fail` |
| Repository coverage below enforceable target | Scoped product-critical coverage enforced ≥80% per file (92%+ verified) |
| Lab browser E2E absent | Playwright Chromium smoke covers Lab route, health, and overview |
| Fragmented/stale health evidence | Canonical health report feeds GitHub summary, npm README, and DNA-Web `/health` |
| Stale CellularMemory/Impressions describing MVP React/Postgres | Memory and architecture docs reconciled to the CLI/runtime monorepo |
