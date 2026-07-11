<!-- DNA Behaviour — DNA by Humaan -->
<!-- Do not edit unless explicitly requested. Managed by DNA. -->

# Testing Behaviour

## Framework

Primary test framework: vitest

## Coverage (DNA default)

- Minimum thresholds: **80%** per file AND overall (lines, branches, functions, statements)
- Enforced via `npm run test:coverage` locally and in `.github/workflows/dna-ci.yml`
- OWASP dependency audit runs on every push

## Rules

- Write tests for all new features and bug fixes
- Include unit tests for business logic
- Include integration tests for API endpoints
- Name test files with .test.ts or .spec.ts convention
- Tests must pass before creating a PR — CI blocks merge on failure
- Run `dna quality report --feature` before marking features complete
- Document regression risks in DNA/Impressions/qa/regression-risks.md
