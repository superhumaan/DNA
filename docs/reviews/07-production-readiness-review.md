# Stage 7 — Production Readiness Review

## 1. Executive Summary

* **Status:** PASS WITH DOCUMENTED RISKS
* **Critical:** 0
* **High:** Lab concurrency under live viewing — fixed and load-tested
* **Decision:** PASS WITH DOCUMENTED RISKS

## 2. Scope Reviewed

* Lab polling model (no sockets — by design)
* Docker / compose
* Preview / Vercel workflows
* Observability (Lab itself + runtime observer)
* Multi-instance constraints

## 3. Implementation Map

Production Lab is mounted in the consumer app (or `dna lab serve` locally). Clients poll `GET /api/dna/labs/data`. There is **no WebSocket channel** — freshness is interval-based. After this review:

* Server coalesces concurrent polls (2s TTL, single-flight)
* Clients send `If-None-Match` and accept 304
* Background tabs do not poll
* Payload is capped/slimmed (~74KB typical vs ~1MB before)

## 4. Findings

### PR-01 — Live-event concurrency collapse

* **Severity:** High → Fixed + verified
* **Evidence:** Load harness 200 users × 5 polls
  * BEFORE: p95 ~4105ms, 48 req/s
  * AFTER: p95 ~114ms, 5794 req/s, 800/1000 → 304, 0 errors
* **Fixed:** Yes

### PR-02 — Multi-instance Lab store not shared

* **Severity:** High (if horizontally scaled without sticky sessions)
* **Status:** Mitigated / fail-closed
* **Evidence:** `lab-store.json` + in-memory caches are per-process
* **Impact:** Sessions / pairing / data cache diverge across instances
* **Fix:** `DNA_LAB_INSTANCE_COUNT` / `WEB_CONCURRENCY` values above one return 503; `/health` exposes the active `single-instance-file` topology; docs prohibit independent replicas
* **Fixed:** Unsafe silent operation is fixed. Horizontal scaling remains unsupported until a shared adapter exists.

### PR-03 — Advisory CI vs production ship confidence

* **Severity:** Medium
* **Status:** Open — intentional OSS default
* **Mitigation:** Run full local suite before release; publish workflow separate

### PR-04 — Health endpoint for Lab

* **Severity:** Low
* **Status:** Fixed
* **Evidence:** Example app has `/health`; Lab API has no dedicated liveness beyond `/bootstrap`
* **Fix:** `GET /api/dna/labs/health` returns liveness and state topology without reading protected data

## 5. Duplicate / Conflicting

* Preview provider Vercel vs Docker gate — both present; OK for dual deploy stories

## 6. Missing Coverage

* Shared-store adapter integration tests (adapter not yet implemented)
* Browser E2E tests

## 7. Changes Made

* Poll architecture + load harness (see stages 1–3)
* Body limit for production DoS posture
* CI capacity gate, fail-closed replica topology, and health endpoint
* On-demand full event retrieval so polling remains slim without losing detail

## 8. Test Results

```
node scripts/lab-load-test.mjs --users 200 --polls 5 --events 2000
→ AFTER p95 ≈114ms · 120× throughput · 80% 304 · 0 errors
```

## 9. Residual Risks

* Horizontal scale is explicitly unsupported and rejected until a shared adapter exists
* Advisory CI
* Browser E2E coverage

## 10. Stage Decision

**PASS WITH DOCUMENTED RISKS**
