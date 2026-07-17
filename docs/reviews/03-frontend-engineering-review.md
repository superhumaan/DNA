# Stage 3 — Frontend Engineering Review

## 1. Executive Summary

* **Status:** PASS WITH DOCUMENTED RISKS
* **Critical:** 0
* **High:** 1 fixed (unconditional 5s poll stampede)
* **Decision:** PASS WITH DOCUMENTED RISKS

## 2. Scope Reviewed

* Lab client: `packages/dna-core/src/lab/ui/dashboard.ts`, `shell.ts`, `styles.ts`
* `apps/web` (marketing / marketplace / intelligence)
* Example Vite app under `apps/examples`

## 3. Implementation Map

Lab UI is a single inline JS string (`LAB_CLIENT_JS`) served from `/api/dna/labs/client.js`. It:

1. Bootstraps via `/bootstrap`
2. On auth/local → `refreshData()` → `/data`
3. Renders overview / issues / events / performance / releases / quality via `innerHTML`
4. Polls on an interval (now visibility-aware + jittered + ETag)

`apps/web` is a separate Vite/React site for dna.humaan.app — not the Lab canvas.

## 4. Findings

### FE-01 — Fixed 5s poll with no visibility / ETag / jitter

* **Severity:** High → Fixed
* **Evidence:** `setInterval(..., 5000)` always called `refreshData` (`dashboard.ts` L693 pre-fix)
* **Impact:** 200 open tabs → ~40 req/s baseline, synchronized thundering herd
* **Fix:** ETag/`If-None-Match`, pause when `document.hidden`, jitter 5–7s, skip re-render on 304
* **Fixed:** Yes

### FE-02 — Full DOM re-render on every data refresh

* **Severity:** Medium
* **Status:** Open
* **Evidence:** `refreshData` → `render()` rebuilds entire `#app` innerHTML
* **Impact:** UI jank on large issue lists; search caret preserved manually
* **Recommended fix:** Diff-based updates for tables, or virtualize; at least skip render when ETag unchanged (done for 304)
* **Fixed:** Partially (304 skips render)

### FE-03 — Client-side XSS mitigated via `esc()`

* **Severity:** Informational (positive)
* **Evidence:** `esc()` used on user/runtime strings before HTML interpolation
* **Risk:** New templates must keep using `esc` — no framework auto-escaping

### FE-04 — No component test / Playwright coverage for Lab UI

* **Severity:** Medium
* **Status:** Open
* **Evidence:** Lab UI is a string template; no browser tests
* **Recommended fix:** Minimal Playwright smoke: bootstrap → overview renders stats

## 5. Duplicate / Conflicting

* Humaan admin CSS patterns duplicated into Lab styles (intentional parity)
* Legacy dashboard HTML in `dashboard/server.ts` is a second UI — unused by product path

## 6. Missing Coverage

* No component / a11y / e2e tests for Lab
* No visual regression

## 7. Changes Made

* Poll loop: visibility, jitter, ETag-aware refresh
* Validated by server 304 test + load harness (client headers exercised via HTTP)

## 8. Test Results

| Command | Result |
|---------|--------|
| Lab unit tests | PASS |
| Load test (HTTP client simulating polls) | PASS — 80% 304 |

## 9. Residual Risks

* String-template UI remains fragile for complex interactions
* Full re-render path still used on payload changes

## 10. Stage Decision

**PASS WITH DOCUMENTED RISKS**
