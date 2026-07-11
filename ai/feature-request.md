# Feature Request

_Auto-maintained by DNA. Updated 2026-07-11. The user does not fill this in manually._

## Latest request

> Look at innovation teams, discovery teams, create processes for research, UX all the way to product market fit, etc. This will help people shape their products and update DNA with relevant data about what they are building, the product lifecycle they are chasing, and all the features we should be building and in what way. Has a huge impact. I need packs installed by default and additional packs for each type of research, research method, process, and event.

## Problem

DNA today excels at **delivery** (methodology packs, ticket writing, feature factory, engineering quality gates) but has almost no structured support for the **upstream product work** that happens before code:

- Innovation labs and discovery squads run research, synthesis, and validation — DNA has no first-class model for this
- No marketplace packs for product discovery, UX research, PMF, or lifecycle stages (search returns zero matches)
- `DNA/Impressions/product/` is thin (`product-overview.md`, empty `feature-map.md`) — no place for opportunities, assumptions, research insights, or PMF signals
- `config.stage` (`new` | `mvp` | `scaling` | …) describes **engineering maturity**, not **product lifecycle** (ideation → validation → PMF → growth)
- Teams using Continuous Discovery, Design Sprints, JTBD, OST, or dual-track agile cannot configure DNA to match how they actually shape products
- Research findings don't flow into `ai/feature-request.md`, CellularMemory, or feature prioritisation — discovery and delivery are disconnected

## Current Pain

- Product managers and designers describe goals in plain language; DNA jumps straight to Solution Architect / code planning
- No guidance on *which* research method to use for a given question (generative vs evaluative, qual vs quant)
- Innovation teams rotate through discovery events (sprints, workshops, synthesis) with no DNA ceremonies or artifact templates
- PMF and validation work (Sean Ellis survey, assumption tests, prototype tests) isn't captured in project intelligence
- `dna marketplace search "ux research"` returns nothing — teams can't install domain knowledge
- Agency and startup archetypes cover delivery tone but not discovery team models

## Proposed Solution

Introduce a **Product Discovery system** — parallel to the existing Delivery Methodology system — with default foundation packs, installable extensions per research type/method/process/event, config surface, CLI, Impressions sync, and AI stem packs.

### Discovery profile (config)

New `discovery` block in `.DNA/config.dna.json`:

| Field | Purpose |
|-------|---------|
| `lifecycleStage` | Where the product is: `ideation` → `problem-validation` → `solution-validation` → `pmf` → `growth` → `scale` |
| `teamModel` | How the team is organised: `innovation-lab`, `discovery-squad`, `embedded-triad`, `dual-track`, `none` |
| `activeProcesses` | e.g. `continuous-discovery`, `double-diamond`, `lean-startup` |
| `activeMethods` | e.g. `user-interviews`, `usability-testing`, `surveys` |
| `activeEvents` | e.g. `design-sprint`, `discovery-sprint`, `story-mapping` |
| `customProfile` | `.DNA/discovery/profile.md` — team-specific overrides |

### Default packs (installed on `dna init` / `dna doctor`)

| Pack | Purpose |
|------|---------|
| `discovery/overview` | Product lifecycle map, dual-track agile, discovery ↔ delivery handoff |
| `discovery/continuous-discovery` | Teresa Torres — weekly touchpoints, OST, assumption tests |
| `discovery/opportunity-solution-tree` | OST framework, prioritisation, outcome mapping |
| `discovery/product-market-fit` | PMF signals, Sean Ellis test, retention benchmarks |
| `discovery/ux-research-foundations` | When to use qual/quant, ethics, recruitment basics |
| `discovery/handoff-to-delivery` | Bridge validated opportunities → `ai/feature-request.md` + feature factory |

### Extension packs (marketplace install per need)

**Team models** (`discovery/teams/*`)
- `innovation-lab`, `discovery-squad`, `embedded-triad`, `dual-track-squad`, `design-ops`

**Lifecycle stages** (`discovery/lifecycle/*`)
- `ideation`, `problem-validation`, `solution-validation`, `pmf`, `growth`, `scale`

**Research types** (`discovery/research-types/*`)
- `generative`, `evaluative`, `attitudinal`, `behavioral`, `mixed-methods`

**Research methods** (`discovery/methods/*`)
- `user-interviews`, `contextual-inquiry`, `usability-testing`, `surveys`, `card-sorting`, `tree-testing`, `diary-studies`, `prototype-testing`, `concept-testing`, `jobs-to-be-done`, `ethnography`, `analytics-review`, `competitive-analysis`, `pricing-research`, `a-b-testing`, `heatmap-session-replay`

**Processes** (`discovery/processes/*`)
- `design-thinking`, `double-diamond`, `lean-startup`, `jtbd-framework`, `value-proposition-canvas`, `lean-ux`, `outcome-driven-innovation`

**Events / ceremonies** (`discovery/events/*`)
- `design-sprint`, `discovery-sprint`, `kickoff-workshop`, `story-mapping`, `assumption-mapping`, `opportunity-mapping`, `synthesis-session`, `prioritization-workshop`, `pivot-review`, `research-readout`

### Standard pack shape (every discovery pack)

| File | Purpose |
|------|---------|
| `positioning.dna.md` | When to use, lifecycle fit, links to other packs |
| `process.dna.md` | Step-by-step how to run it |
| `artifacts.dna.md` | Templates (research plan, interview guide, synthesis board) |
| `events.dna.md` | Ceremony agenda, participants, timebox, outputs |
| `dna-sync.dna.md` | What to write to Impressions / CellularMemory when done |

### CLI commands

```bash
dna discovery show
dna discovery set --lifecycle pmf --team discovery-squad --process continuous-discovery
dna plan discovery [--quote "..."]
dna context discovery
dna plan research <method> [--quote "..."]
dna sync discovery   # push findings → Impressions + CellularMemory + feature-map
```

### Impressions & CellularMemory (auto-scaffolded)

**Impressions** (`DNA/Impressions/product/`)
- `discovery-log.md` — running research activity log
- `opportunity-tree.md` — OST / opportunity backlog
- `assumptions-risks.md` — assumption register with test status
- `research-insights.md` — synthesised findings
- `pmf-signals.md` — metrics, survey results, qualitative signals
- `feature-map.md` — enriched with discovery evidence column

**CellularMemory** (`.DNA/CellularMemory/prefrontalCortex/`)
- `product-vision.md`, `discovery-decisions.md`
- `research-backlog.md` in hippocampus

### AI integration

- New behaviour: `.DNA/behaviour/discovery.behaviour.md`
- Stem packs: `/discovery-setup`, `/plan-research`, `/synthesize-research`, `/prioritize-opportunities`, `/pmf-check`, `/handoff-to-engineering`
- Neural network intents: `run_product_discovery`, `validate_assumption`, `prioritize_opportunities`
- Feature factory gate: Product Analyst reads active discovery context before refining `ai/feature-request.md`

## Users

| User | Need |
|------|------|
| Product managers | Lifecycle-aware planning, OST, assumption tracking |
| UX researchers | Method selection, study plans, synthesis → DNA sync |
| Innovation / discovery teams | Team model, events, workshops with DNA artifacts |
| Designers | Lean UX, prototype testing, design sprint facilitation |
| Founders / startup teams | PMF validation, lean startup loops |
| Engineering leads | Clear handoff from validated opportunities to feature factory |
| DNA maintainers | Extensible catalog pattern (mirror methodologies) |

## Desired Behaviour

1. `dna init` installs 6 default discovery foundation packs alongside delivery methodology packs
2. `dna discovery show` displays lifecycle stage, team model, active methods/processes/events, installed packs
3. `dna discovery set --lifecycle solution-validation --method usability-testing` installs linked packs
4. `dna plan discovery` writes `.DNA/discovery/discovery-plan.md` and scaffolds Impressions templates
5. `dna plan research user-interviews` outputs interview guide + recruitment plan + sync checklist
6. `dna context discovery` prepends discovery knowledge before product/UX work (not engineering)
7. `dna sync discovery` updates Impressions from a research readout or synthesis session
8. Validated opportunities in `opportunity-tree.md` link to `ai/feature-request.md` when user says "build this"
9. `dna marketplace search discovery` surfaces the full catalog
10. `dna doctor` ensures discovery packs and Impressions scaffolds exist

## Edge Cases

- Team is delivery-only (no discovery) — `teamModel: none` skips optional packs; defaults still install overview + handoff
- B2B enterprise with SAFe delivery + continuous discovery — discovery and delivery profiles compose independently
- Regulated industries — research ethics / consent packs link to compliance (`compliance/gdpr` for participant data)
- AI/ML products — link `discovery/methods/a-b-testing` with `ai/ai-evals` for eval-driven validation
- Agency rotates clients — discovery profile resets per engagement; `discovery-log.md` archives to history
- No research yet at ideation — lifecycle stage drives which methods DNA recommends, not vice versa

## Success Criteria

- [x] 6 default discovery packs install on `dna init` / `dna doctor`
- [x] 55 extension packs in marketplace under `discovery/*` taxonomy
- [x] `discovery` config block with lifecycle, team, processes, methods, events
- [x] CLI: `discovery show|set`, `plan discovery`, `plan research`, `context discovery`, `sync discovery`
- [x] Impressions product folder scaffolded with 5+ discovery artifacts
- [x] 6+ stem packs for discovery workflows
- [ ] Feature factory Product Analyst loads discovery context (handoff pack + stems wired; agent-loop prompt update optional follow-up)
- [x] Tests for catalog, profile resolution, pack install, plan generation
- [x] CHANGELOG updated

## Out of Scope (v1)

- Live integration with Dovetail, Maze, UserTesting, Optimal Workshop
- Automated survey deployment or participant recruitment
- Visual OST editor UI in dashboard
- Replacing Jira/Productboard — DNA shapes artifacts and syncs Impressions, not full PM tool
