# Stage 10 — Final Full CI Verification

## 1. Executive Summary

* **Status:** PASS WITH DOCUMENTED RISKS
* **Local CI-equivalent gates:** lint, typecheck, unit tests, build — **all PASS**
* **Load verification:** 200 concurrent Lab viewers — **PASS** (0 errors)
* **Dependency audit:** **PASS** — no known vulnerabilities
* **Decision:** PASS WITH DOCUMENTED RISKS

## 2. Scope Reviewed

Commands from `docs/reviews/ci-command-map.md` executed locally on 2026-07-17.

## 3. Architecture of Verification

```
pnpm install --frozen-lockfile
→ build → lint → typecheck → test → coverage
→ node scripts/lab-load-test.mjs (200 users)
→ pnpm audit --audit-level=high
```

GitHub Actions DNA CI remains advisory; this stage treats local gate results as the release signal.

## 4. Findings

### CI-01 — `npm audit` in DNA CI fails on pnpm repos

* **Severity:** Medium
* **Status:** Fixed
* **Evidence:** `npm audit --audit-level=high` → `ENOLOCK` (no package-lock.json)
* **Impact:** OWASP job does not actually audit dependencies
* **Fix:** Generator and checked-in workflow now use `pnpm audit --audit-level=high`; generator tests cover package-manager selection
* **Fixed:** Yes

### CI-02 — DevDependency advisories (vitest / vite / esbuild)

* **Severity:** Critical advisory present (Vitest UI arbitrary file read); High (vite Windows fs.deny)
* **Status:** Fixed
* **Evidence:** `pnpm audit` — 6 vulns (1 critical, 1 high, 3 moderate, 1 low), all via test/build tooling paths
* **User impact:** Production Lab/runtime packages are zero/low dependency; risk is developer machines running Vitest UI / Vite dev server
* **Fix:** Vitest/coverage 4.1.10 plus esbuild 0.28.1 override; deterministic four-worker test configuration
* **Fixed:** Yes — `pnpm audit` reports no known vulnerabilities

## 5. Duplicate / Conflicting

N/A for this stage.

## 6. Missing Coverage

* Browser E2E remains absent
* Repository-wide line coverage is ~54.6%; advisory CI reports it but does not block until `ci.strict` is enabled

## 7. Changes Made

* pnpm-native audit generation
* 200-viewer CI load gate
* patched test/build toolchain and deterministic Vitest worker cap
* clean-checkout CI ordering: build before typecheck/tests/coverage (#23)

## 8. Test Results

| Command | Exit | Notes |
|---------|------|-------|
| `pnpm run lint` | 0 | PASS |
| `pnpm run typecheck` | 0 | PASS |
| `pnpm run test` | 0 | PASS (includes CI generator ordering regression) |
| `pnpm run test:coverage` | 0 | ~54.6% lines; advisory target remains 80% |
| `pnpm run build` | 0 | PASS including example Express app |
| `pnpm run test:load:lab` | 0 | AFTER p95 **163ms**, **4684 req/s**, **800×304**, **0 errors** |
| `pnpm audit` | 0 | No known vulnerabilities |
| `npx dna quality report --feature` | 0 | **PASS**, blocker=0, critical=0 |
| `npx dna docker build` | 0 | `dna-app:local` built |

### Load test detail (final run)

```
BEFORE  collectLabData per request (no cache)
  requests=1000  throughput=47 req/s  wall=21139ms
  latency  avg=2971ms  p50=2974ms  p95=4133ms  p99=4313ms

AFTER   HTTP /data (micro-cache + ETag/304)
  requests=1000  throughput=4684 req/s  wall=213ms
  latency  avg=38ms  p50=8ms  p95=163ms  p99=167ms
  200=200  304=800  errors=0
```

## 9. Residual Risks

* Advisory CI mode (`continue-on-error` still reports green even when a step fails — enforce locally / `ci.strict` for blocking)
* Repository coverage remains below the configured 80% target
* No browser E2E suite

## 10. Stage Decision

**PASS WITH DOCUMENTED RISKS**
