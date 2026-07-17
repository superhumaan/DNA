# Code Coverage — CI Integration

DNA generates `.github/workflows/dna-ci.yml` on init.

## CI quality gate steps

1. Lint (`npm run lint`)
2. Typecheck (`npm run typecheck`) when configured
3. Unit tests (`npm test`)
4. Coverage (`npm run test:coverage`) — fails below thresholds
5. Dependency audit (package-manager native: `pnpm audit`, `yarn audit`, or `npm audit`)
6. DNA static analysis (`dna quality scan`)

## Coverage artifacts

CI uploads `coverage/` as a workflow artifact (14-day retention).

## Local parity

Run the same gate locally before pushing:

```bash
npm run lint
npm run typecheck   # if present
npm test
npm run test:coverage
dna quality report --feature
```
