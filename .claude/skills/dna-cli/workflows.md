# DNA CLI — workflow chains

Agents must follow these sequences unless the user explicitly overrides.

## New project / first clone

1. `/dna-doctor` — scaffold and repair everything
2. `/dna-analyze` — understand structure and gaps
3. `/dna-context cursor` or `/dna-context claude` — load AI context
4. Begin feature work via plain language (auto factory) or `/dna-feature`

## Brownfield / existing codebase

1. `/dna-analyze`
2. `/dna-document` (with `--from-code`)
3. `/dna-plan-ivf` or `/dna-ivf`
4. Implement phases — never big-bang rewrite

## Feature factory (every feature)

1. User describes feature OR `/dna-feature "<quote>"`
2. Agent loop through roles — **stop after Solution Architect for approval**
3. Implement Backend → Frontend → UX → QA
4. `/dna-quality-report` — **must PASS**
5. `/dna-docker-build`
6. `/dna-github-push`

## Regulated / compliance work

1. `/dna-compliance-list`
2. `/dna-plan-compliance` with tier + frameworks
3. `/dna-marketplace-install` for compliance packs
4. `/dna-context compliance`

## Regulated / legal work (banking, healthcare, APAC/EU/US)

1. `/dna-legal-list` or `/legal-list`
2. `/dna-legal-advise --quote "..."` or `/legal-advise`
3. `/dna-plan-legal` with domains + jurisdictions
4. `/dna-marketplace-install` for `legal/regions/*` packs
5. `/dna-context legal` or `/legal-engineering`
6. `/dna-plan-compliance` for control frameworks (pair with legal)

Follow `.DNA/workflows/legal.workflow.md`.

## Health check / drift

1. `/dna-scan` — drift score
2. If drift critical: `/dna-plan-impressions-sync`
3. `/dna-validate` — behaviour compliance

## Hard gates (never skip)

| Gate | Command | Block if FAIL |
|------|---------|---------------|
| Quality | `/dna-quality-report` | Push, feature complete |
| Docker | `/dna-docker-build` | Feature factory close-out |
| GitHub | `/dna-github-push` | Only after quality PASS |
| Repair merge | `/dna-ai-repair` | Human review always |
