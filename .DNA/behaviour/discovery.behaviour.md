<!-- DNA Behaviour — DNA by Humaan -->
<!-- Do not edit unless explicitly requested. Managed by DNA. -->

# Discovery Behaviour

## Profile

- **Lifecycle stage:** Ideation (`ideation`)
- **Team model:** None (`none`)
- **Active processes:** continuous-discovery
- **Active methods:** (none)
- **Active events:** (none)
- **Custom overrides:** `.DNA/discovery/profile.md`

## Rules — product shaping

1. **Before product or UX work:** run `dna context discovery` or read `.DNA/knowledge/discovery/`
2. **Match lifecycle stage** — methods and artifacts should fit `ideation`
3. **Sync findings** — after research, run `dna sync discovery` to update Impressions
4. **Validated opportunities** — hand off to delivery via `discovery/handoff-to-delivery` → `ai/feature-request.md`
5. **Custom profile wins** — if `.DNA/discovery/profile.md` conflicts with packs, follow custom profile
6. **Code gates unchanged** — discovery shapes *what* to build; DNA still requires tests, coverage, quality report, docker, push

## Impressions targets

- `DNA/Impressions/product/discovery-log.md` — research activity log
- `DNA/Impressions/product/opportunity-tree.md` — opportunities and solutions
- `DNA/Impressions/product/assumptions-risks.md` — assumption register
- `DNA/Impressions/product/research-insights.md` — synthesised findings
- `DNA/Impressions/product/pmf-signals.md` — PMF metrics and signals

## Stem packs

- `/discovery-setup` — configure discovery profile
- `/plan-research` — plan a research study
- `/synthesize-research` — cluster findings into opportunities
- `/prioritize-opportunities` — rank what to pursue next
- `/pmf-check` — review product–market fit signals
- `/handoff-to-engineering` — validated opportunity → feature request
