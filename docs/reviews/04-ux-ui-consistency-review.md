# Stage 4 — UX and UI Consistency Review

## 1. Executive Summary

* **Status:** PASS WITH DOCUMENTED RISKS
* **Critical / High:** 0 unresolved
* **Decision:** PASS WITH DOCUMENTED RISKS

## 2. Scope Reviewed

* Lab shell/CSS/client (`lab/ui/*`)
* Humaan admin parity notes in CellularMemory / CHANGELOG
* Auth / pairing / dashboard flows

## 3. Implementation Map

Lab mirrors Humaan admin portal patterns: icon-only DNA brand, accordion sidebar (Monitor / Delivery), primary pills, list toolbar (search → tabs → table), severity badges, empty states. Auth uses Soli-style atmosphere shell.

## 4. Findings

### UX-01 — Refresh is manual + silent background poll

* **Severity:** Low
* **Status:** Accepted
* **Evidence:** Header Refresh button + background poll; no last-updated toast on 304
* **Impact:** Operators may not know data is live
* **Recommended fix:** Show `lastRefresh` relative time in header (state already tracks it)

### UX-02 — Issue detail loses related events older than cap

* **Severity:** Medium
* **Status:** Open (trade-off of payload trim)
* **Evidence:** Wire payload caps `runtimeEvents` at 200 slim rows; `eventsForIssue` filters client-side
* **Impact:** Older related events may not appear in detail for noisy projects
* **Mitigation:** `issueGroups.latestEvent` still carries full detail for the latest occurrence
* **Recommended fix:** Optional `GET /api/dna/labs/issues/:id/events` for on-demand history

### UX-03 — Empty states and search are consistent

* **Severity:** Informational (positive)
* **Evidence:** Shared `emptyState`, `listToolbar`, `tableEmptyRow` helpers

## 5. Duplicate / Conflicting

* Legacy dashboard UI (minimal pre/HTML) conflicts with Lab Humaan parity — do not surface to users

## 6. Missing Coverage

* No accessibility audit (keyboard nav for accordion/tabs; focus management on full re-render)
* No UX screenshot baseline

## 7. Changes Made

* None UX-copy specific; poll behaviour improved responsiveness under load (perceived performance)

## 8. Test Results

Manual inspection of client source + load latency metrics (p50 ~8ms on revalidate).

## 9. Residual Risks

* Full innerHTML re-render can drop focus outside search handling
* Event history depth trade-off after payload trim

## 10. Stage Decision

**PASS WITH DOCUMENTED RISKS**
