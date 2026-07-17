# Feature Request

_Auto-maintained by DNA. Updated 2026-07-17. The user does not fill this in manually._

## Latest request

> Complete every residual item from the full repository review: security, CI,
> dependency, multi-instance, legacy dashboard, API load, documentation,
> verification, commit, and push.

## Problem

The review proved 200-viewer polling capacity after hardening but identified
remaining trust-boundary, CI, dependency, topology, and compatibility risks.

## Current Pain

Unsafe configurations could leak OTPs, accept forged callbacks, silently split
session state, skip dependency auditing, or regress under concurrent polling.

## Proposed Solution

Close each feasible risk with compatible fail-closed controls, regression
tests, a deterministic load gate, truthful documentation, and verified release
gates.

## Users

DNA operators, developers, and teams monitoring live production events.

## Desired Behaviour

Specific request polling remains responsive for 200 concurrent viewers; full
event detail loads only when requested; security and topology failures reject
safely; generated CI performs real package auditing and load verification.

## Edge Cases

Public previews running development builds, forged callbacks, stale configs
using the historical `sqlite` label, declared multi-worker deployments,
unchanged ETag polls, hidden tabs, and heavy filesystem test concurrency.

## Success Criteria

- [x] Pairing callbacks authenticate and reject forged callbacks
- [x] Public development hosts require auth and never receive dev OTPs
- [x] Legacy dashboard exports delegate safely to Lab
- [x] CI uses pnpm-native auditing and a deterministic 200-viewer load gate
- [x] Toolchain advisories are remediated (`pnpm audit`: clean)
- [x] Supported Lab state topology is explicit, observable, and fail-closed
- [x] Full issue events load through a specific on-demand API
- [x] Unit, integration, load, quality, Docker, and full build gates pass
- [x] Review reports and CellularMemory reflect verified final state
- [x] Changes committed and pushed to GitHub

---

**Project:** dna-by-humaan
