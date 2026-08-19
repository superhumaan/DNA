# Trunk-Based Development

Integrate to `main` at least daily. Branches live < 2 days or use feature flags.

## Practices
- Feature flags for incomplete work (`disciplines/feature-flags`)
- Small PRs with tests
- Main always deployable
- DNA default: `git.branchingStrategy: trunk` — `dna github push` stays on the current branch

## Agent rules
- Never invent `feature/*` remotes or hop branches to "test on preview"
- Never dual-track the same feature across multiple remotes
- Match existing patterns — no invented slogans under page headers
