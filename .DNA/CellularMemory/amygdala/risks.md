# Risks

## Active (documented 2026-07-17)

| Risk | Severity | Mitigation |
|------|----------|------------|
| Shared Lab state adapter unavailable | Medium | Single-instance topology is explicit; declared replicas fail closed with 503 |
| Advisory CI (`continue-on-error`) | Medium | Intentional OSS default; enforce locally before publish |
| Repository line coverage 54.55% vs 80% target | Medium | Quality report is advisory; add tests before enabling strict CI |
| Lab browser E2E absent | Low | API/client contracts covered; add Playwright smoke when UI becomes a standalone app |

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
