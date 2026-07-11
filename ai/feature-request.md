# Feature Request

_Auto-maintained by DNA. Updated 2026-07-11._

## Latest request

> Auto-report DNA platform issues from all installs back to superhumaan/DNA with deduplication and potential code fixes.

## Status

**Shipped** in v0.4.8 — `@superhumaan/dna-feedback`, `dna feedback` CLI, runtime auto-report, maintainer ingest.

## Problem

DNA users encounter DNA CLI, doctor, and runtime failures locally. Issues only landed in each user's own GitHub repo. Maintainers had no consolidated view of DNA-platform bugs across installs.

## Solution delivered

- `feedback` config block (enabled by default, `dna-only` auto-report)
- `dna feedback report|sync|status|ingest` commands
- Runtime pipeline upstream hook for DNA-platform errors
- Fingerprint dedup via GitHub labels on `superhumaan/DNA`
- Offline queue at `.DNA/data/feedback-queue.jsonl`
- Maintainer script `scripts/feedback-ingest.mjs`

## Remaining (future)

- Hosted ingest API at `dna.humaan.app/api/v1/feedback` (client ready)
- Upstream AI repair PRs against DNA monorepo (maintainer workflow)

## Success Criteria

- [x] Backend works (`dna-feedback` package + config schema)
- [x] CLI commands (`dna feedback`)
- [x] Permissions/security (opt-in, redaction, `dna-only` filter)
- [x] Tests pass (185 tests)
- [x] Documentation updated
- [ ] Hosted feedback API (out of scope v0.4.8)
- [ ] npm publish v0.4.8 (separate release step)

---

**Project:** dna-by-humaan
