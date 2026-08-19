# DNA Feature Factory

Default DNA delivery model for OSS and small teams.

## Flow
1. User describes goal in plain language
2. `ai/feature-request.md` updated automatically
3. Agent loop roles: PA → SA → (approval) → BE → FE → UX → QA → CQ → Refactor → Final
4. Quality gate → docker → github push on **trunk** (current line of work)

## Trunk (default)
- Stay on `main`/`master` or one user-chosen short-lived branch
- Never invent `feature/*` remotes or hop branches to "test on preview"
- Opt out: `"git": { "branchingStrategy": "feature-branch" }`

## Artifacts
- **Plan:** Solution Architect plan in chat (approval gate)
- **Tickets:** GitHub issues via `dna github push` / bug loop
- **Docs:** `DNA/Impressions/` updated on architecture changes
