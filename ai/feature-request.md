# Feature Request

_Auto-maintained by DNA. Updated 2026-07-17. The user does not fill this in manually._

## Latest request

> Fix every still-documented residual risk and any CellularMemory problems;
> expand automated test reporting; publish current test results on GitHub and
> an npm-facing summary; add a complete `/Health` project report page to
> DNA-Web; then update package versions and all affected documentation.

## Problem

The hardening release still documented four unresolved risks: no shared Lab
state adapter, advisory rather than blocking CI, repository coverage below the
80% target, and no browser E2E suite. Test evidence was fragmented across review
Markdown and workflow logs instead of being visible to GitHub, npm users, and
the DNA-Web product site.

## Current Pain

Operators could not confidently assess current project health from one canonical
source. Multi-instance Lab deployments were blocked, CI could hide gate
failures, coverage was below policy, browser behavior was not exercised, and
CellularMemory had become stale relative to verified results.

## Proposed Solution

Close the residuals with a shared Lab state design, strict CI, materially
increased automated coverage, and browser E2E smoke tests. Produce a
machine-readable canonical health report, expose it through GitHub reporting
and npm documentation, render it on DNA-Web at `/Health`, reconcile
CellularMemory, and version/release all affected packages and docs.

## Users

DNA operators, contributors, npm consumers, maintainers reviewing GitHub
checks, and visitors evaluating project health on DNA-Web.

## Desired Behaviour

All enforced quality gates pass on clean runners; test and load results are
generated rather than hand-copied; npm and GitHub show concise current
summaries; `/Health` presents the complete project status accessibly and
responsively; memory and version documentation agree with shipped evidence.

## Edge Cases

Unavailable shared-state infrastructure, stale or missing report artifacts,
forked PR permissions, partial workflow failures, report schema changes,
DNA-Web fetch failures, mobile rendering, package version skew, and preserving
historical test results without presenting them as current.

## Success Criteria

- [x] Shared Lab state supports the intended production instance topology
- [x] CI is strict and fails when required quality/security gates fail
- [x] Automated coverage reaches and enforces the agreed target
- [x] Browser E2E smoke coverage protects the Lab's critical journeys
- [x] Test/load/security results are emitted as canonical machine-readable data
- [x] GitHub presents a durable test summary and downloadable reports
- [x] npm-facing README/package documentation contains the latest verified summary
- [x] DNA-Web `/Health` renders complete current reports with resilient states
- [x] CellularMemory and review docs contain no stale or contradictory status
- [x] Package versions, changelog, lockfile, roadmap, and release docs agree
- [x] Both repositories pass their full quality/build/release gates and are pushed

---

**Project:** dna-by-humaan
