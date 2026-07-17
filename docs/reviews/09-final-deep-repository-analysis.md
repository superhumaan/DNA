# Stage 9 — Final Deep Repository Analysis

## 1. Executive Summary

* **Status:** PASS WITH DOCUMENTED RISKS
* **Critical unresolved:** 0
* **High unresolved:** 0; unsupported multi-instance file storage now fails closed
* **Decision:** PASS WITH DOCUMENTED RISKS

## 2. Scope Reviewed

Cross-cutting pass over all packages, apps, CI, DNA intelligence, and the Lab live-event readiness claim.

## 3. System Truth (evidence-based)

| Claim | Evidence |
|-------|----------|
| Product is DNA CLI + runtime + Lab | README, packages layout, npm exports |
| Lab is poll-based, not sockets | `dashboard.ts` schedulePoll; no WS server in lab/ |
| Hot path is `GET /api/dna/labs/data` | `server.ts` + client `API + "/data"` |
| 200 concurrent viewers were unsafe | Load BEFORE: p95 ~4.1s, 48 req/s |
| Hardening works | Load AFTER: p95 ~114ms, 5794 req/s, 80% 304, 74KB payload |
| Unit tests green | Vitest PASS |
| Build was broken, now fixed | Example Express `tsc` |

## 4. Findings (rollup)

| ID | Title | Severity | Status |
|----|-------|----------|--------|
| ARCH-01 / PR-01 / FE-01 / BE-01 | Lab poll collapse | High | Fixed |
| BE-02 / SEC-01 | Unbounded POST body | High | Fixed |
| BE-03 | Auth store thrash | Medium | Fixed |
| BE-05 | Example build break | Medium | Fixed |
| ARCH-02 | Legacy dashboard duplicate | Medium | Fixed — compatibility wrappers delegate to Lab |
| BE-04 | Runtime storage mislabeled SQLite | Medium | Fixed — canonical `json`; legacy filename retained for compatibility |
| BE-06 / SEC-04 | Pairing callback auth | Medium | Fixed — HMAC |
| SEC-02 | Dev OTP on wrong NODE_ENV | Medium | Fixed |
| PR-02 | Multi-instance store | High* | Mitigated — declared replicas fail closed |
| QA-01 | Advisory CI | Medium | Accepted OSS default |
| UX-02 | Event history depth | Medium | Trade-off documented |

## 5. Duplicate and Conflicting Implementations

1. **Lab vs legacy dashboard** — one implementation; legacy exports delegate
2. **Cursor vs Claude workbench mirrors** — generated parity (OK)
3. **Marketplace app vs apps/web marketplace** — legacy local API noted in README

## 6. Missing Coverage (prioritised)

1. Playwright Lab smoke
2. Shared state adapter contract/integration tests when an adapter exists

## 7. Changes Made (session)

* `packages/dna-core/src/lab/collect.ts` — trim, getLabData cache
* `packages/dna-core/src/lab/server.ts` — ETag/304, body limit, logout cache clear
* `packages/dna-core/src/lab/auth.ts` — session cache
* `packages/dna-core/src/lab/ui/dashboard.ts` — ETag poll, visibility, jitter
* `packages/dna-core/src/lab/pairing.ts` — HMAC callbacks
* `packages/dna-core/src/dashboard/server.ts` — deprecated compatibility wrappers
* `packages/dna-core/src/generators/ci.ts` — pnpm audit + load gate
* `apps/examples/node-express-app/src/index.ts` — build fix
* Tests + `scripts/lab-load-test.mjs`
* `docs/reviews/*`

## 8. Test Results

See stage 10.

## 9. Residual Risks

No Critical/High issue remains for the supported single-instance topology.
Horizontal replicas are rejected until shared state is implemented.

## 10. Stage Decision

**PASS WITH DOCUMENTED RISKS**
