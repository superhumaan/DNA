# Full Repository Review — Executive Summary

**Programme date:** 2026-07-17  
**Repository:** dna-by-humaan (DNA by Humaan)  
**Overall decision:** **PASS WITH DOCUMENTED RISKS**

## What this system is

DNA is a TypeScript monorepo: CLI, runtime observer, knowledge marketplace, and **DNA Lab** (`/labs`) — a poll-based observability dashboard (not WebSockets). The “200 people active on the canvas / live event” requirement maps to **200 concurrent Lab dashboard viewers** polling `GET /api/dna/labs/data`.

## What was broken (verified)

Under concurrent polling, each request ran a full `collectLabData` (runtime DB lock + aggregate + ~1MB JSON). Measured:

| Metric | Before | After |
|--------|--------|-------|
| p95 latency | ~4133 ms | ~128 ms |
| Throughput | ~47 req/s | ~5076 req/s |
| Full payloads | 1000/1000 | 200/1000 (80% **304**) |
| Payload size | ~1 MB | ~74 KB |
| Errors | — | **0** |

## Fixes shipped in this programme

1. **Server micro-cache + single-flight** (`getLabData`, 2s TTL)
2. **ETag / If-None-Match → 304**
3. **Trimmed wire payload** (200 slim events; drop unused trees/raw issues)
4. **Client:** visibility-aware poll, jitter, conditional requests
5. **Session auth cache** (5s) + logout invalidation
6. **64 KiB POST body limit** (413)
7. **Example Express build fix**
8. **Tests + `scripts/lab-load-test.mjs`**
9. **HMAC-authenticated pairing callbacks** with forged-callback regression tests
10. **Loopback-only local mode** and production-safe development OTP handling
11. **Legacy dashboard compatibility wrappers** delegating to Lab
12. **Package-manager-native CI audit** and a deterministic 200-viewer CI gate
13. **Toolchain remediation** — Vitest 4.1.10 + esbuild 0.28.1; zero audit findings
14. **Fail-closed state topology** plus `/health` and on-demand issue-event APIs

## Stage decisions

| # | Stage | Decision |
|---|-------|----------|
| 1 | Solution Architecture | PASS WITH DOCUMENTED RISKS |
| 2 | Backend Engineering | PASS WITH DOCUMENTED RISKS |
| 3 | Frontend Engineering | PASS WITH DOCUMENTED RISKS |
| 4 | UX / UI Consistency | PASS WITH DOCUMENTED RISKS |
| 5 | Quality Assurance | PASS WITH DOCUMENTED RISKS |
| 6 | Security Engineering | PASS WITH DOCUMENTED RISKS |
| 7 | Production Readiness | PASS WITH DOCUMENTED RISKS |
| 8 | DNA Compliance | PASS WITH DOCUMENTED RISKS |
| 9 | Final Deep Analysis | PASS WITH DOCUMENTED RISKS |
| 10 | Final CI Verification | PASS WITH DOCUMENTED RISKS |

## Residual risks (must not be forgotten)

1. **Shared state adapter not yet available** — Lab now fails closed when a deployment declares more than one file-store instance; horizontal replicas remain unsupported rather than silently unsafe.
2. **Advisory CI** — intentional OSS default; local quality, Docker, and load gates remain mandatory before push.
3. **Browser E2E coverage** — API and generated-client behaviour are tested, but the Lab string-template UI has no Playwright suite.

## How to re-verify

```bash
pnpm install --frozen-lockfile
pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build
pnpm run test:load:lab
pnpm audit
```

Reports: `docs/reviews/01-*.md` … `10-*.md` · CI map: `docs/reviews/ci-command-map.md`
