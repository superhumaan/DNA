# Code Coverage — DNA Default

DNA scaffolds **Vitest + v8 coverage** with CI-enforced thresholds.

## Default thresholds

| Metric | Minimum |
|--------|---------|
| Lines | 70% |
| Branches | 60% |
| Functions | 70% |
| Statements | 70% |

Configured in `vitest.config.ts` (generated on `dna init` when missing).

## Scripts

- `npm test` — unit tests (must pass before PR)
- `npm run test:coverage` — tests + threshold gate (runs in CI)

## Agent rules

Feature factory agents must:
1. Add tests for new business logic and API endpoints
2. Run `dna quality report --feature` before marking complete
3. Not reduce coverage on touched files without justification
