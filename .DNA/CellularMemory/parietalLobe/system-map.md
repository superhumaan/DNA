# System Map

## Components

- `packages/dna-cli` — public npm package, CLI entry points, copied assets
- `packages/dna-core` — scanners, generators, quality engine, marketplace, DNA Lab
- `packages/dna-runtime` — observation pipeline and framework adapters
- `packages/dna-config` — shared schemas and constants
- `packages/dna-{ai,feedback,github,immune,templates,docs}` — bounded support libraries
- `apps/examples/*` — integration examples, not the product frontend
- `.DNA/` — installed project intelligence, runtime data, reports, memory
- `DNA/Impressions/` — human-readable architecture, product, QA, and release intent
- `.github/workflows/` — CI, security, npm publish, and diagnostic retention
- `superhumaan/DNA-Web` — separate public Next.js marketing/marketplace/health site

## Runtime flow

Consumer app → framework adapter → DNA runtime pipeline → atomic runtime JSON →
DNA Lab request-specific polling APIs. Lab auth/session state uses the configured
Lab store backend. GitHub and npm delivery remain separate external boundaries.
