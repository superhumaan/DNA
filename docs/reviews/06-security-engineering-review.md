# Stage 6 — Security Engineering Review

## 1. Executive Summary

* **Status:** PASS WITH DOCUMENTED RISKS
* **Critical:** 0 unresolved
* **High:** all identified High findings fixed
* **Decision:** PASS WITH DOCUMENTED RISKS

## 2. Scope Reviewed

* Lab auth/pairing/crypto/CSP
* Gateway allowlist
* Runtime data paths / gitignore
* Package-manager-native dependency audit
* Socket.dev / SECURITY.md posture

## 3. Implementation Map

Production Lab access:

1. Local CLI generates 148-digit pairing code → hash stored
2. Operator pastes code on production Lab → verify
3. Register with email/password + OTP → HttpOnly session cookie
4. Subsequent API calls require session (except public allowlist)

CSP for Lab HTML is explicit (`LAB_DOCUMENT_CSP`) and overrides host Helmet defaults for the document.

## 4. Findings

### SEC-01 — Unbounded request body on public POSTs

* **Severity:** High → Fixed
* **Evidence:** Pre-fix `readJsonBody` had no cap
* **Fix:** 64 KiB limit → 413
* **Fixed:** Yes

### SEC-02 — OTP returned in JSON when `NODE_ENV !== "production"`

* **Severity:** Medium
* **Status:** Fixed
* **Evidence:** `server.ts` returns `devOtp` outside production
* **Impact:** Mis-set `NODE_ENV` on a public deploy leaks OTPs
* **Fix:** Return development OTPs only for a literal loopback request when both process and DNA runtime environments are non-production
* **Fixed:** Yes

### SEC-03 — Password hashing uses custom scrypt-style path

* **Severity:** Informational / review note
* **Evidence:** `lab/crypto.ts` — `hashPassword` / `verifyPassword`
* **Status:** Inspected; uses salt + hash (not plaintext). Keep under review vs argon2id for future.

### SEC-04 — Pairing callback unauthenticated

* **Severity:** Medium
* **Status:** Fixed
* **Fix:** HMAC-SHA256 over pairing ID + verified state using the already-shared pairing code hash; timing-safe verification; 401 on forged callbacks

### SEC-05 — Local mode trusts Host / loopback heuristics

* **Severity:** Medium
* **Status:** Fixed
* **Evidence:** `is-local.ts` gates `openLocalWithoutAuth`
* **Impact:** Misconfigured reverse proxy that forwards internal Host could open Lab without auth
* **Fix:** Environment labels no longer establish trust; only literal loopback hosts enter local mode

### SEC-06 — Document CSP allows `'unsafe-inline'` scripts

* **Severity:** Low
* **Status:** Accepted (inline Lab architecture)
* **Evidence:** `LAB_DOCUMENT_CSP` script-src includes `'unsafe-inline'`
* **Mitigation:** Lab is first-party only; no user HTML rendering without `esc()`

## 5. Duplicate / Conflicting

* Gateway public paths documented in markdown + constants — keep in sync via generator

## 6. Missing Coverage

* Brute-force timing tests for login
* ZAP only when `STAGING_URL` set

## 7. Changes Made

* Body size limit
* Session cache invalidation on logout (prevents stale auth after sign-out within TTL)
* HMAC callback authentication
* Public-development-host 401 and OTP non-disclosure tests

## 8. Test Results

```
pnpm exec vitest run packages/dna-core/src/lab → PASS
pnpm audit → no known vulnerabilities
```

## 9. Residual Risks

* External gateway correctness remains deployment-specific; ZAP requires `STAGING_URL`.

## 10. Stage Decision

**PASS WITH DOCUMENTED RISKS**
