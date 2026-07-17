# Stage 2 — Backend Engineering Review

## 1. Executive Summary

* **Status:** PASS WITH DOCUMENTED RISKS
* **Critical:** 0
* **High:** 2 fixed (poll collapse; unbounded POST body)
* **Decision:** PASS WITH DOCUMENTED RISKS

## 2. Scope Reviewed

* `packages/dna-core/src/lab/server.ts`, `auth.ts`, `storage.ts`, `collect.ts`, `pairing.ts`, `middleware.ts`, `fastify.ts`
* `packages/dna-core/src/storage/runtime-db.ts`
* `packages/dna-runtime/**` (adapters)
* `apps/examples/node-express-app`
* `apps/marketplace` API

## 3. Implementation Map

Lab requests enter via Express middleware / Fastify plugin / standalone `startLabServer` → `handleLabRequest`:

1. Classify route (page vs API)
2. Resolve local vs production auth
3. Public allowlist for pairing/auth OTP
4. Protected `GET /data` → `getLabData` (cache) → JSON or 304
5. Mutations under `lab-store.json` mutex with atomic rename writes

Runtime observer appends to `runtime.db` (JSON, capped 2000 events/issues) under its own mutex.

## 4. Findings

### BE-01 — `/data` recomputed on every poll (no coalesce)

* **Severity:** High → Fixed
* **Evidence:** `collectLabData` called directly from `server.ts` (pre-fix); load test BEFORE 48 req/s @ 200 concurrency
* **Fix:** `getLabData` with 2s TTL + single-flight; server uses ETag/304
* **Tests:** `collect.test.ts`, `server.test.ts`
* **Fixed:** Yes

### BE-02 — Unbounded JSON body on Lab POSTs

* **Severity:** High → Fixed
* **Evidence:** `readJsonBody` buffered entire stream with no size check (`server.ts`)
* **Impact:** Memory exhaustion via crafted POST to public pairing/auth endpoints
* **Fix:** `LAB_MAX_BODY_BYTES = 64KiB` + 413 response
* **Fixed:** Yes

### BE-03 — Auth session resolution hits store twice per request

* **Severity:** Medium → Fixed
* **Evidence:** `resolveLabAuth` → `findLabSession` + `findLabUserById` (each acquires store lock)
* **Fix:** 5s session context cache; invalidated on logout
* **Fixed:** Yes

### BE-04 — `runtime.db` is JSON misnamed as “sqlite”

* **Severity:** Medium
* **Status:** Fixed without a breaking file migration
* **Evidence:** `DNA_RUNTIME_DB = ".DNA/data/runtime.db"` but implementation is pretty-printed JSON (`runtime-db.ts`)
* **Fix:** Canonical config value is now `json`; historical `sqlite` configs normalize to `json`; docs call `runtime.db` a compatibility filename
* **Fixed:** Yes (filename retained to avoid breaking existing installs)

### BE-05 — Example Express app failed `tsc` build

* **Severity:** Medium → Fixed
* **Evidence:** unused `createLabFastifyPlugin`; partial config missing `DnaConfig` fields
* **Fix:** remove unused import; cast partial lab config
* **Fixed:** Yes

### BE-06 — Pairing callback is unauthenticated

* **Severity:** Medium
* **Status:** Fixed
* **Evidence:** `POST /pairing/callback` is public; marks local pairing verified
* **Impact:** On a reachable local Lab, an attacker who knows a pairingId could mark verified (still needs OTP+password for account)
* **Fix:** HMAC-SHA256 bound to pairingId + verified state using the pairing code hash; timing-safe comparison; unsigned callbacks return 401
* **Fixed:** Yes

## 5. Duplicate / Conflicting

* Legacy dashboard exports now delegate to Lab; duplicate collection/server removed

## 6. Missing Coverage

* No multi-process store race test
* Limited Fastify plugin integration tests

## 7. Changes Made

| Change | Why | Risk | Validation |
|--------|-----|------|------------|
| `getLabData` + ETag | Concurrent poll safety | Stale ≤2s | Unit + load |
| Session cache | Auth path cost | 5s revocation lag | Logout invalidates |
| Body limit | DoS | Legitimate large payloads rejected | Manual size bound |
| Pairing HMAC | Prevent forged local verification | Compatibility with old callback senders | Unit + server 401/200 |
| Storage naming | Truthful operator model | Legacy configs | Schema normalization tests |
| Example build | CI build green | None | `pnpm build` |

## 8. Test Results

```
pnpm exec vitest run packages/dna-core/src/lab  → 25 passed
pnpm run build                                 → PASS
```

## 9. Residual Risks

* Shared state across independent replicas remains unsupported and fails closed

## 10. Stage Decision

**PASS WITH DOCUMENTED RISKS**
