# Feature Request

_Auto-maintained by DNA. Updated 2026-07-31._

## Latest request

> Confirm git naming is on npm/GitHub with docs; improve the npm page and the GitHub repo page.

## Problem

Package listing and GitHub about/README lag the product: long npm description, stale verified-results (0.6.16), weak first-screen story, missing project-git-naming and Skeletor/fleet signals.

## Desired behaviour

1. Punchy npm `description` + keywords
2. npm README (packages/dna-cli/README.md) — clear hero, current version proof, why DNA
3. GitHub root README — same first-viewport clarity
4. GitHub repo About description + topics refreshed
5. Patch publish so npm page updates

## Acceptance criteria

- [ ] npm description ≤ ~160 chars, scannable
- [ ] Both READMEs lead with one value prop + one install command
- [ ] Verified/health section not stuck on 0.6.16
- [ ] Project git naming called out
- [ ] `gh` About/topics updated
- [ ] Published as 0.6.24 (README-only surface bump)
