# Agent Loop

_Auto-executed when the user describes a feature. The user never runs this manually._

Work through each role sequentially. Complete one role before moving to the next.

## Product Analyst

From the user's latest message (and `ai/feature-request.md`):

- Clarify user problem, business value, affected workflow, acceptance criteria
- **Update** `ai/feature-request.md` with refined Problem, Pain, Users, Desired Behaviour, Edge Cases

**Output:** Confirmed acceptance criteria.

---

## Solution Architect

Decide: data model, API, frontend state, security/permissions, migrations, patterns to reuse.

**Output:** Short implementation plan (scope, files, risks, tests). **Stop — wait for user approval before code.**

---

## Backend Engineer

Routes, services, validation, auth/RBAC, database, errors, tests.

---

## Frontend Engineer

Pages, shared components, API integration, loading/error/empty states, forms, responsive.

---

## UX Reviewer

Flow clarity, labels, errors, friction, UI system consistency.

---

## QA Engineer

Happy path, empty state, permissions, validation, network failures, regression, mobile.

Run `dna quality report --feature` — note report path for handoff.

---

## Code Quality Analyst

Run `dna quality report --feature`. Read `.DNA/reports/quality/latest.md`.

Fix blocker and critical issues. Re-run until gate is **PASS**.

**Output:** Report path + gate status + issues fixed.

---

## Refactor Reviewer

No duplication, repo patterns followed, no dead code.

---

## Final Release Reviewer

No unrelated rewrites, tests/build pass, acceptance criteria met.

**Mandatory close-out (run in order):**

1. `dna quality report --feature` — gate **PASS**
2. `dna docker build` — image builds successfully
3. `dna github push --message "feat: <summary>"` — feature branch on GitHub

**Output:** Docker tag + pushed branch URL + gate status.
