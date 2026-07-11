# QA — Discipline

DNA treats QA as a **completion gate**, not an afterthought.

## Required for every feature

- Happy path, empty state, permission failure, validation failure
- Regression check on adjacent flows
- `dna quality report --feature` gate PASS
- CI workflow green (lint, test, coverage, audit)

## Documentation

Update `DNA/Impressions/qa/regression-risks.md` when shipping risky changes.
