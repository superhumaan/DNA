# Feature Request

_Auto-maintained by DNA. Updated 2026-07-11._

## Latest request

> Perform a full security, optimisation, and gap audit of every pack, system, and feature in the DNA monorepo. Deliver a final report, apply auto-updates and fixes, run full end-to-end testing, update all related documentation, publish to npm, and push to GitHub main.

## Problem

DNA needs a comprehensive health pass across CLI packages, knowledge packs, quality gates, CI, and documentation — with fixes shipped and published.

## Current Pain

- Quality scanner was scanning `node_modules` (29k+ false positives)
- Typecheck failures in test fixtures
- Missing `@vitest/coverage-v8`, `.env.example`, and `architecture/overview.md`
- ESLint linting generated `.local-wiki` artifacts

## Proposed Solution

1. Run `dna doctor`, `dna analyze`, `dna scan`, `dna validate`, `dna update`
2. Fix glob ignore, quality scope, typecheck, lint scope, coverage tooling
3. Regenerate audit report; update CHANGELOG and Impressions
4. Bump `@superhumaan/dna-by-humaan` to 0.5.0; publish via GitHub Actions; push main

## Users

- DNA maintainers and OSS consumers installing `@superhumaan/dna-by-humaan`
- Teams using DNA workbench, marketplace packs, and feature factory

## Desired Behaviour

- Quality gate scopes to `packages/` when no feature diff exists
- Nested `node_modules` excluded from scans
- All 232+ unit tests pass; typecheck clean
- Audit report at `.DNA/reports/audit/full-audit-2026-07-11.md`
- npm 0.5.0 published; main branch updated

## Edge Cases

- Monorepo dev install skips CLI auto-upgrade
- Advisory CI by default (`ci.strict: false`)
- Example apps excluded from quality file scan

## Success Criteria

- [x] DNA doctor passes
- [x] Glob/quality fixes applied
- [ ] Typecheck passes
- [ ] Tests + coverage pass
- [ ] Quality report scoped correctly
- [ ] Audit report written
- [ ] Docs updated (CHANGELOG, Impressions, .env.example)
- [ ] Version 0.5.0 published to npm
- [ ] Pushed to GitHub main
