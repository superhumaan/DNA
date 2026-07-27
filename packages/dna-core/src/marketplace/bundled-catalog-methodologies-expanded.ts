/**
 * Expanded methodology packs — company sizes, industry delivery overlays,
 * and additional process methodologies. Approved plan: zero stubs / jam full.
 */
import type { KnowledgePack } from "@superhumaan/dna-config";
import { catalogPack } from "./bundled-catalog-helpers.js";

function richMethodology(
  id: string,
  name: string,
  desc: string,
  body: {
    positioning: string;
    hierarchy: string;
    artifacts: string;
    ceremonies: string;
    checklist: string;
    examples: string;
    antiPatterns: string;
    references: string;
  },
  extraTags: string[] = [],
): KnowledgePack {
  const base = `methodologies/${id}`;
  return catalogPack(
    base,
    name,
    "methodologies",
    desc,
    [
      { path: `${base}/positioning.dna.md`, content: body.positioning },
      { path: `${base}/hierarchy.dna.md`, content: body.hierarchy },
      { path: `${base}/artifacts.dna.md`, content: body.artifacts },
      { path: `${base}/ceremonies.dna.md`, content: body.ceremonies },
      { path: `${base}/checklist.dna.md`, content: body.checklist },
      { path: `${base}/examples.dna.md`, content: body.examples },
      { path: `${base}/anti-patterns.dna.md`, content: body.antiPatterns },
      { path: `${base}/references.dna.md`, content: body.references },
    ],
    ["methodology", "catalog", ...extraTags],
  );
}

function richCompany(
  id: string,
  name: string,
  desc: string,
  body: {
    positioning: string;
    sizeFit: string;
    artifacts: string;
    ceremonies: string;
    checklist: string;
    examples: string;
    antiPatterns: string;
    references: string;
  },
  extraTags: string[] = [],
): KnowledgePack {
  const base = `companies/${id}`;
  return catalogPack(
    base,
    name,
    "methodologies",
    desc,
    [
      { path: `${base}/positioning.dna.md`, content: body.positioning },
      { path: `${base}/size-fit.dna.md`, content: body.sizeFit },
      { path: `${base}/artifacts.dna.md`, content: body.artifacts },
      { path: `${base}/ceremonies.dna.md`, content: body.ceremonies },
      { path: `${base}/checklist.dna.md`, content: body.checklist },
      { path: `${base}/examples.dna.md`, content: body.examples },
      { path: `${base}/anti-patterns.dna.md`, content: body.antiPatterns },
      { path: `${base}/references.dna.md`, content: body.references },
    ],
    ["company-archetype", "catalog", ...extraTags],
  );
}

function industryDelivery(
  id: string,
  name: string,
  sector: string,
  hooks: string,
): KnowledgePack {
  return richMethodology(
    `industry-${id}`,
    `${name} Delivery`,
    `Delivery methodology overlay for ${sector} — compliance, rituals, artifacts`,
    {
      positioning: `# ${name} Delivery

Industry overlay for **${sector}**. Pair with a company-size pack (\`companies/*\`) and a base process (\`methodologies/scrum|kanban|shape-up|safe|dna-default\`).

## When to load
- Product is regulated or domain-heavy in ${sector}
- Agency engagements where \`industry.active\` = ${id}
- Roadmaps must reflect domain risk, not generic SaaS velocity

## Pairing
| Layer | Pack |
|-------|------|
| Size | companies/startup … companies/enterprise |
| Process | scrum / kanban / shape-up / safe / dna-default |
| Industry | methodologies/industry-${id} |
| Compliance | install via \`dna plan compliance\` / legal packs |

${hooks}

## Grounding (mandatory)
1. Run DNA CLI analyze/scan before recommending upgrades
2. Read CellularMemory debt/blockers for this domain
3. Impression Guard — stub policies ≠ implemented controls
`,
      hierarchy: `# Hierarchy — ${name}

\`\`\`
initiative → regulated epic → story → task → evidence
\`\`\`

| Level | ${name} note |
|-------|----------------|
| initiative | Must cite domain OKR / patient / revenue / public outcome |
| epic | Flag compliance gate (DPIA, PCI, clinical safety, etc.) |
| story | Acceptance criteria include domain invariants |
| task | Evidence artifact path for audit when required |
| evidence | Test report, ticket, config screenshot — real only |
`,
      artifacts: `# Artifacts — ${name}

## Domain brief
- Users & regulated roles
- Data classes (PII/PHI/PCI/…)
- Non-negotiable controls
- Geographic residency constraints

## Gate checklist
- Compliance pack IDs installed
- Legal advise status (if required)
- Rollback / incident owner
- Data retention note

## Evidence log
Link to tests, logs, approvals — never invent evidence from stub Impressions.

## Upgrade path note
When advising major changes, emit upgrades.md with effort × impact × broken-path risks.
`,
      ceremonies: `# Ceremonies — ${name}

| Ceremony | Purpose |
|----------|---------|
| Domain risk review | Before shaping large bets |
| Compliance gate | Before production change |
| Incident tabletop | Quarterly (regulated sectors) |
| Evidence sync | Align Impressions with real controls |
| Vendor / partner review | When integrations touch sensitive data |
`,
      checklist: `# Checklist — ${name}

- [ ] Company-size pack chosen
- [ ] Base methodology chosen
- [ ] Industry compliance packs installed
- [ ] Impression Guard: no stub policy docs treated as truth
- [ ] DNA CLI / analyze run before major upgrade advice
- [ ] Feature Factory handoff only after grounding
- [ ] On-call / escalation named for production paths
`,
      examples: `# Examples — ${name}

## Good story AC
- Domain invariant stated (e.g. "PHI never logged")
- Test or evidence path named
- Rollback criteria explicit

## Good epic
- Links industry regulation note
- Names compliance pack IDs
- Lists integration partners and failure modes

## Bad (reject)
- "Add dashboard" with no data-class or access model
`,
      antiPatterns: `# Anti-patterns — ${name}

- Applying generic startup velocity to regulated ${sector} without gates
- Inventing compliance posture from stub Impressions
- Skipping audit evidence on "small" changes that touch sensitive data
- Mixing two client industry packs in one codebase without themes/branches
- Shipping without rollback when money, health, or legal risk is involved
`,
      references: `# References — ${name}

- DNA industries pack for this sector when present
- DNA compliance + legal region packs for operating geography
- Official sector standards (load via marketplace search)
- Internal CellularMemory decisions for prior domain incidents
- Purpose combos: combo/* matching this industry when available
`,
    },
    ["industry-delivery", id, sector.replace(/\s+/g, "-").toLowerCase()],
  );
}

/** Company size / org archetype packs (replaces thin companies/* stubs). */
export const COMPANY_SIZE_PACKS: KnowledgePack[] = [
  richCompany(
    "solo",
    "Solo / Indie",
    "One founder-builder — issue→PR, almost no ceremony",
    {
      positioning: `# Solo / Indie

One person (or pair) shipping. Optimise for focus and shipping cadence, not process theatre.

## Delivery
- Backlog = GitHub issues or a single Linear project
- Docs live in repo README + \`DNA/Impressions/\`
- Ship when ready; no sprint obligation

## AI tone
Ultra-short tickets. Prefer Shape Up small batches or DNA Feature Factory with tiny scopes.`,
      sizeFit: `# Size fit

| Headcount | Fit |
|-----------|-----|
| 1–2 | Ideal |
| 3–5 | Still works; add weekly sync |
| 6+ | Graduate to companies/startup |

## Pair with
- methodologies/dna-default or shape-up
- methodologies/kanban if continuous flow preferred`,
      artifacts: `# Artifacts

## Issue
Title + ≤3 AC bullets

## Ship note
What changed / how to verify / known gaps`,
      ceremonies: `# Ceremonies

| Ceremony | Cadence |
|----------|---------|
| Plan gate | Per feature (DNA SA approval) |
| Ship | Continuous |
| Retro | Monthly optional |`,
      checklist: `# Checklist

- [ ] Scope fits <1 week
- [ ] No invented compliance from stubs
- [ ] Quality report before push`,
      examples: `# Examples

\`\`\`
Title: feat: export CSV of invoices
AC:
- [ ] Columns match finance sheet
- [ ] Empty state when no rows
\`\`\``,
      antiPatterns: `# Anti-patterns

- Adopting SAFe/Scrum-of-Scrums with one engineer
- Writing 10-page PRDs for weekend features`,
      references: `# References

- methodologies/dna-default
- methodologies/shape-up
- Indie Hackers / solo founder ops notes (community)`,
    },
    ["size-solo"],
  ),
  richCompany(
    "startup",
    "Startup",
    "Small product team — ship fast, light ceremony, DNA Feature Factory default",
    {
      positioning: `# Startup

Early product-market exploration. Bias to action; process only when it prevents rework.

## Delivery
- Minimal hierarchy: issue → PR
- Optional weekly retro
- DNA Feature Factory for multi-file changes

## AI tone
Short tickets. Skip enterprise ceremony unless regulated industry overlay is active.`,
      sizeFit: `# Size fit

| Headcount | Fit |
|-----------|-----|
| 2–15 | Ideal |
| 15–40 | Add squads → companies/scale-up |
| Regulated | Keep startup cadence + industry-* overlay |

## Pair with
- methodologies/dna-default, scrum (1–2 week), or shape-up
- methodologies/industry-* when domain-heavy`,
      artifacts: `# Artifacts

## Issue
Title + 3–5 AC

## Weekly note
Shipped / Learning / Next

## Feature request
\`ai/feature-request.md\` for anything spanning API+UI`,
      ceremonies: `# Ceremonies

| Ceremony | Cadence |
|----------|---------|
| Standup | Daily async or 10 min |
| Planning | Weekly or per Shape Up cycle |
| Retro | Biweekly optional |
| SA approval | Per non-trivial feature |`,
      checklist: `# Checklist

- [ ] PMF hypotheses listed (discovery packs if exploring)
- [ ] Stub Impressions not treated as strategy truth
- [ ] Quality + docker before ship`,
      examples: `# Examples

Weekly note:
- Shipped: invite links
- Learning: 40% drop at OAuth
- Next: magic link fallback`,
      antiPatterns: `# Anti-patterns

- Premature SAFe / PI planning
- Hiring process before product signal
- Ignoring industry compliance because "we're early"`,
      references: `# References

- methodologies/dna-default, lean-startup, shape-up
- discovery/product-market-fit
- The Lean Startup (Ries); Inspired (Cagan) selective read`,
    },
    ["size-startup"],
  ),
  richCompany(
    "scale-up",
    "Scale-up",
    "Growing multi-squad org — tribes optional, quarterly bets, stronger QA",
    {
      positioning: `# Scale-up

Product works; organisation is the bottleneck. Introduce lightweight multi-team alignment without full enterprise ceremony.

## Delivery
- Squads (or pods) own slices
- Quarterly OKRs
- Shared platform / DNA Lab for quality

## AI tone
Name squad owners. Flag cross-squad dependencies early.`,
      sizeFit: `# Size fit

| Headcount | Fit |
|-----------|-----|
| 40–250 | Ideal |
| <40 | Prefer startup |
| >250 | Consider enterprise / big-tech |

## Pair with
- methodologies/spotify-model, scrum, shape-up, less
- companies/travel-scale-up for travel-specific patterns`,
      artifacts: `# Artifacts

## Initiative
Quarter, OKR link, owning squads

## Epic
Dependencies, rollout plan, experiment flag

## Labels
\`squad-*\`, \`platform\`, \`customer-facing\``,
      ceremonies: `# Ceremonies

| Ceremony | Cadence |
|----------|---------|
| Squad planning | Sprint or cycle |
| Multi-squad sync | Weekly |
| OKR check-in | Monthly |
| Architecture review | Per cross-cutting change |`,
      checklist: `# Checklist

- [ ] Owning squad named
- [ ] Dependency board updated
- [ ] Observability pack loaded for production paths`,
      examples: `# Examples

Initiative: Reduce checkout drop-off Q3
- Squad: payments
- KR: +3pp completion
- Depends: fraud squad rate-limit change`,
      antiPatterns: `# Anti-patterns

- Copying Big Tech launch review for every CSS tweak
- Matrix management without clear product ownership`,
      references: `# References

- methodologies/spotify-model, less, shape-up
- Team Topologies (Skelton/Pais)`,
    },
    ["size-scale-up"],
  ),
  richCompany(
    "sme",
    "SME",
    "Small-medium business — stable product, lean IT, vendor-heavy",
    {
      positioning: `# SME

Established revenue, limited engineering bench. Prefer boring technology, clear SOPs, and vendor platforms where build cost exceeds benefit.

## Delivery
- Kanban or short Scrum
- Strong change tickets for production
- Docs that accountants and ops can read
- Prefer buy-vs-build with documented vendor decisions

## AI tone
Plain language for ops stakeholders. Flag cost and support burden of custom builds.`,
      sizeFit: `# Size fit

| Signal | Fit |
|--------|-----|
| <100 employees, <10 engineers | Ideal |
| Heavy compliance | Add industry-* + compliance packs |
| Rapid product pivots | Prefer startup |
| Multiple product lines | Graduate to mid-market |

## Pair with
- methodologies/kanban or dna-default
- methodologies/industry-* for vertical risk
- combo packs for payments/auth only when needed`,
      artifacts: `# Artifacts

## Change request
Business reason, rollback, approver, downtime window

## SOP
Step list for ops (billing, support, month-end)

## Vendor decision log
Why bought vs built, contract renewal date, data residency

## Backup / restore note
Last successful restore test date`,
      ceremonies: `# Ceremonies

| Ceremony | Cadence |
|----------|---------|
| Change advisory | Weekly or per release |
| Backlog grooming | Weekly |
| Vendor review | Quarterly |
| Access review | Quarterly |`,
      checklist: `# Checklist

- [ ] Rollback documented
- [ ] Backup verified this month
- [ ] Access review current
- [ ] Vendor DPAs filed when processing personal data
- [ ] Stub Impressions not treated as live SOPs`,
      examples: `# Examples

Change request: Upgrade payment gateway
- Reason: 3DS mandate
- Rollback: previous container tag
- Approver: Ops lead
- Downtime: none (blue/green)

Vendor log: Chose Xero over custom ledger — 2 FTE avoided`,
      antiPatterns: `# Anti-patterns

- Rebuilding SaaS you could buy
- Undocumented production hotfixes
- Single admin account shared across staff
- Skipping restore tests because "backup job is green"`,
      references: `# References

- methodologies/kanban, dna-default
- ITIL lite change practices
- companies/mid-market when growing past SME constraints
- compliance packs for geography served`,
    },
    ["size-sme"],
  ),
  richCompany(
    "mid-market",
    "Mid-market",
    "Multi-department product company — formal backlog, security reviews",
    {
      positioning: `# Mid-market

Several product lines or departments. Need predictable delivery, security reviews, and clearer prioritisation than a startup.

## Delivery
- Scrum or SAFe essentialism (not full SAFe)
- Design docs for cross-team work
- DNA quality gates in CI`,
      sizeFit: `# Size fit

| Headcount | Fit |
|-----------|-----|
| 250–2000 | Ideal |
| Public company / heavy audit | Prefer enterprise |`,
      artifacts: `# Artifacts

## PRD
Problem, goals, non-goals, metrics

## Security review
Threat notes, data classes, owners

## Release train notes
What's in / out of next release`,
      ceremonies: `# Ceremonies

| Ceremony | Cadence |
|----------|---------|
| Sprint planning | 1–2 weeks |
| Stakeholder demo | Sprint end |
| Security review | Per sensitive epic |
| Portfolio prioritisation | Monthly |`,
      checklist: `# Checklist

- [ ] Data classification named
- [ ] On-call owner for release
- [ ] Compliance packs for markets served |`,
      examples: `# Examples

PRD non-goals: "No mobile app this quarter"
Security: "Customer PII encrypted at rest; access via SCIM"`,
      antiPatterns: `# Anti-patterns

- Shadow IT integrations without security review
- Infinite backlog with no kill criteria`,
      references: `# References

- methodologies/scrum, safe (lite), document-writing
- industries/* matching vertical`,
    },
    ["size-mid-market"],
  ),
  richCompany(
    "enterprise",
    "Enterprise",
    "Large regulated org — stage gates, audit evidence, programme management",
    {
      positioning: `# Enterprise

Multiple portfolios, audit requirements, long-lived systems. Process protects correctness and evidence — not theatre for its own sake.

## Delivery
- Programme epics, stage gates
- ADR + design docs mandatory for shared platforms
- Impression Guard: never treat stub policies as implemented controls`,
      sizeFit: `# Size fit

| Signal | Fit |
|--------|-----|
| 2000+ employees or multi-region regulated | Ideal |
| Need agility inside enterprise | Pair with dual-track-agile / less inside units |`,
      artifacts: `# Artifacts

## Business case
Cost, benefit, risk, compliance impact

## Stage gate pack
Design → Build → UAT → Prod evidence

## RACI
Responsible / Accountable named humans`,
      ceremonies: `# Ceremonies

| Ceremony | Cadence |
|----------|---------|
| Steering committee | Monthly |
| CAB / change board | Per release train |
| Audit evidence sync | Continuous |
| Architecture review board | Per platform change |`,
      checklist: `# Checklist

- [ ] Legal/compliance signed off when required
- [ ] Evidence paths real (tests, tickets, configs)
- [ ] DNA CLI scan before architecture advice |`,
      examples: `# Examples

Stage gate: UAT sign-off ticket #4821 + test report link
RACI: Accountable = VP Eng; Responsible = platform squad`,
      antiPatterns: `# Anti-patterns

- Fake evidence from stub Impressions
- Waiving security review under schedule pressure without risk accept`,
      references: `# References

- methodologies/safe, less, document-writing
- compliance/* + legal/regions/*
- ITIL / COBIT selective`,
    },
    ["size-enterprise"],
  ),
  richCompany(
    "big-tech",
    "Big Tech",
    "OKR cascade, design docs, launch reviews, experimentation culture",
    {
      positioning: `# Big Tech

Hyperscale patterns: OKRs, design docs, launch reviews, strong platform teams.

## Delivery
- Design doc before large builds
- Experimentation + kill criteria
- Privacy / SRE / a11y launch checklist`,
      sizeFit: `# Size fit

| Signal | Fit |
|--------|-----|
| Global consumer or developer platform at scale | Ideal |
| Small team pretending to be Big Tech | Prefer startup/scale-up |`,
      artifacts: `# Artifacts

## Design doc
Summary, goals/non-goals, alternatives, rollout

## OKR
Objective + measurable KRs

## Launch checklist
Privacy, security, SRE, i18n, a11y`,
      ceremonies: `# Ceremonies

| Ceremony | Cadence |
|----------|---------|
| Design review | Per major change |
| Launch review | Pre-prod user-facing |
| OKR grading | Quarterly |
| Incident review | Post-sev |`,
      checklist: `# Checklist

- [ ] Rollback plan tested
- [ ] Quota/load assumptions documented
- [ ] Experiment metrics pre-registered |`,
      examples: `# Examples

OKR: Improve cold-start p95 → KR: p95 < 200ms for 99% regions
Launch: privacy review ID + SRE sign-off`,
      antiPatterns: `# Anti-patterns

- Design doc theatre with no decision
- Shipping without experiment kill criteria`,
      references: `# References

- methodologies/document-writing, sre-ops, dual-track-agile
- Google SRE books; Working Backwards (selective)`,
    },
    ["size-big-tech"],
  ),
  richCompany(
    "agency",
    "Agency",
    "Client SOW, milestones, adaptive industry packs per engagement",
    {
      positioning: `# Agency

Client delivery with SOW boundaries. Industry and brand rotate — load industry packs per engagement.

## Delivery
- SOW → milestones → deliverables
- Client approval gates
- \`dna plan industry <sector>\` at kickoff`,
      sizeFit: `# Size fit

| Signal | Fit |
|--------|-----|
| Billable engagements, multiple clients | Ideal |
| Single product company | Prefer startup/scale-up |`,
      artifacts: `# Artifacts

## SOW milestone
Deliverable, acceptance, hours budget

## Client spec
Non-technical summary + engineering appendix

## Engagement config
\`industry.active\` + installed compliance packs`,
      ceremonies: `# Ceremonies

| Ceremony | Cadence |
|----------|---------|
| Kickoff | Per engagement |
| Client review | Milestone |
| Internal retro | Per engagement end |`,
      checklist: `# Checklist

- [ ] Industry pack installed
- [ ] Brand vs DNA admin theme decided
- [ ] Scope traps from agency-notes reviewed |`,
      examples: `# Examples

Milestone: CMS go-live
- Acceptance: editors trained + redirect map live
- Industry: healthcare → methodologies/industry-healthcare`,
      antiPatterns: `# Anti-patterns

- Mixing two client design systems in one deployable
- Estimating before industry compliance scan`,
      references: `# References

- methodologies/industry-* 
- industries/* agency-notes
- methodologies/ticket-writing`,
    },
    ["size-agency"],
  ),
  richCompany(
    "research-lab",
    "Research Lab",
    "Eval-driven iteration, lightweight specs, experiment IDs",
    {
      positioning: `# Research Lab

Hypothesis and eval first. Specs stay short; reproducibility and safety matter.

## Delivery
- Eval plan before build
- Experiment IDs for model/prompt versions
- Fast kill criteria`,
      sizeFit: `# Size fit

| Signal | Fit |
|--------|-----|
| AI/ML research or applied research squads | Ideal |
| Pure product CRUD | Prefer startup |`,
      artifacts: `# Artifacts

## Spec
Hypothesis, eval, safety, rollback

## Experiment ticket
Experiment ID, model/version, dashboard link`,
      ceremonies: `# Ceremonies

| Ceremony | Cadence |
|----------|---------|
| Eval review | Per experiment |
| Safety review | Per user-facing model change |
| Paper/result sync | Weekly |`,
      checklist: `# Checklist

- [ ] Eval dataset versioned
- [ ] Safety constraints listed
- [ ] Kill criteria numeric |`,
      examples: `# Examples

Experiment: prompt-v12-rag
- Metric: answer faithfulness ≥ 0.85
- Kill: toxicity > 0.02`,
      antiPatterns: `# Anti-patterns

- Shipping model changes without eval
- Irreproducible notebook-only knowledge`,
      references: `# References

- methodologies/industry-ai-ml (if present)
- ai/ai-evals, ai/guardrails packs
- combo/ai-rag-product`,
    },
    ["size-research"],
  ),
  richCompany(
    "nonprofit",
    "Nonprofit / NGO",
    "Mission outcomes, grant reporting, frugal ops",
    {
      positioning: `# Nonprofit / NGO

Optimise for mission outcomes and grant accountability, not vanity velocity.

## Delivery
- Outcome metrics for beneficiaries
- Transparent change logs for funders
- Frugal stack; prefer proven vendors`,
      sizeFit: `# Size fit

| Signal | Fit |
|--------|-----|
| Mission-driven, grant or donation funded | Ideal |
| Commercial SaaS with nonprofit customers | Use industry + startup/SME |`,
      artifacts: `# Artifacts

## Outcome brief
Beneficiary impact metric

## Grant report excerpt
What shipped this period

## Volunteer/ops SOP`,
      ceremonies: `# Ceremonies

| Ceremony | Cadence |
|----------|---------|
| Outcome review | Monthly |
| Funder update | Per grant cycle |
| Security basics | Quarterly |`,
      checklist: `# Checklist

- [ ] Impact metric named
- [ ] Data minimization for beneficiaries
- [ ] Access control for volunteer accounts |`,
      examples: `# Examples

Outcome: +20% appointment show-rate for clinic partners
Grant note: shipped SMS reminders in EN/ES`,
      antiPatterns: `# Anti-patterns

- Collecting more beneficiary PII than needed
- Overbuilding custom systems when CRM grants exist`,
      references: `# References

- methodologies/kanban, dna-default
- gov/public-sector adjacent packs when public funding`,
    },
    ["size-nonprofit"],
  ),
  richCompany(
    "travel-scale-up",
    "Travel Scale-up",
    "Tribe/squad travel/booking orgs — conversion metrics, Jira-heavy",
    {
      positioning: `# Travel Scale-up

Patterns common in large travel/booking companies.

## Org
- Tribes on journey stages (search, book, pay, post-booking)
- Squads own vertical slices
- Conversion and look-to-book obsessed`,
      sizeFit: `# Size fit

| Signal | Fit |
|--------|-----|
| Travel/marketplace scale-up | Ideal |
| Generic scale-up | companies/scale-up |`,
      artifacts: `# Artifacts

## Initiative
Tribe, quarter, conversion impact

## Epic
Experiment plan, dark launch → % traffic

## Labels
\`tribe-*\`, \`squad-*\`, \`experiment\``,
      ceremonies: `# Ceremonies

| Ceremony | Cadence |
|----------|---------|
| Tribe sync | Weekly |
| Experiment review | Per test |
| Incident / payment success | Continuous |`,
      checklist: `# Checklist

- [ ] Payment success monitored
- [ ] Experiment ethics/privacy checked
- [ ] Rollback for fare/cache bugs |`,
      examples: `# Examples

Epic: Express checkout
- KR: +2pp mobile conversion
- Dark launch 5% APAC`,
      antiPatterns: `# Anti-patterns

- Shipping pricing changes without experiment + audit log
- Ignoring FX/tax edge cases`,
      references: `# References

- methodologies/spotify-model
- industries/travel-hospitality
- payments/* packs`,
    },
    ["size-scale-up", "travel"],
  ),
  richCompany(
    "platform-marketplace",
    "Platform / Marketplace",
    "Multi-sided markets — chicken-egg metrics, trust & safety, ops tools",
    {
      positioning: `# Platform / Marketplace

Two-or-more-sided markets. Delivery must balance liquidity, trust & safety, and operator tooling.

## Delivery
- Separate roadmaps: supply, demand, trust, monetisation
- Strong admin/backoffice (DNA admin portal patterns)
- Experiment carefully — network effects cut both ways`,
      sizeFit: `# Size fit

| Signal | Fit |
|--------|-----|
| Multi-sided marketplace or platform | Ideal |
| Single-player SaaS | Prefer startup/SME |`,
      artifacts: `# Artifacts

## Liquidity brief
Supply/demand health metrics

## Trust & safety playbook
Abuse cases, enforcement ladder

## Operator admin spec
Moderation queues, appeals`,
      ceremonies: `# Ceremonies

| Ceremony | Cadence |
|----------|---------|
| Liquidity review | Weekly |
| T&S triage | Daily |
| Pricing/take-rate review | Monthly |`,
      checklist: `# Checklist

- [ ] Both sides of market considered
- [ ] Admin RBAC enforced (not UI-only)
- [ ] Appeals path documented |`,
      examples: `# Examples

Story: Seller verification
- AC: documents encrypted; admin queue; SLA 24h`,
      antiPatterns: `# Anti-patterns

- Optimising only demand acquisition while supply collapses
- Trust actions without audit trail`,
      references: `# References

- industries/ecommerce-retail, saas-b2b
- platforms marketplace patterns; admin-portal knowledge`,
    },
    ["size-platform"],
  ),
  richCompany(
    "consultancy",
    "Software Consultancy",
    "Outcome-based consulting engagements — strategy through delivery squads",
    {
      positioning: `# Software Consultancy

Similar to agency but often longer retainers, embedded squads, and architecture ownership. Load client industry packs per engagement.`,
      sizeFit: `# Size fit

| Signal | Fit |
|--------|-----|
| Multi-month embedded teams | Ideal |
| Pure staff aug without process | Prefer agency |`,
      artifacts: `# Artifacts

SOW, RACI, architecture runway, weekly steering deck`,
      ceremonies: `# Ceremonies

Steering · demo · risk review · knowledge transfer milestone`,
      checklist: `# Checklist

- [ ] Exit/knowledge transfer planned
- [ ] Client DoD agreed
- [ ] Industry pack installed`,
      examples: `# Examples

Embedded squad delivering payments migration under consultancy SOW`,
      antiPatterns: `# Anti-patterns

- Leaving without runbooks
- Shadow IT architecture undocumented`,
      references: `# References

- companies/agency
- methodologies/kanban, scrum`,
    },
    ["size-consultancy"],
  ),
  richCompany(
    "bootstrapped",
    "Bootstrapped Product",
    "Profit-constrained indie/bootstrapped SaaS — cash runway is the constraint",
    {
      positioning: `# Bootstrapped

No VC theatre. Ship revenue features, keep burn tiny, prefer Shape Up / Kanban over heavy process.`,
      sizeFit: `# Size fit

| Signal | Fit |
|--------|-----|
| Self-funded / profitable | Ideal |
| Raising Series A aggressively | Prefer startup |`,
      artifacts: `# Artifacts

Revenue experiments, support inbox themes, cash runway note`,
      ceremonies: `# Ceremonies

Weekly revenue review · support tag triage`,
      checklist: `# Checklist

- [ ] Feature ties to revenue or retention
- [ ] Support load considered`,
      examples: `# Examples

Pitch: reduce churn with billing self-serve — appetite 2 weeks`,
      antiPatterns: `# Anti-patterns

- Building platform for imaginary enterprise
- Ignoring support as product signal`,
      references: `# References

- companies/solo, startup
- methodologies/shape-up, lean-startup`,
    },
    ["size-bootstrapped"],
  ),
  richCompany(
    "unicorn",
    "Hypergrowth / Unicorn",
    "Hypergrowth product org — tribes, platform teams, and controlled chaos",
    {
      positioning: `# Hypergrowth / Unicorn

Scale-up on adrenaline. Need Spotify/LeSS-like structure before SAFe. Invest in platform + DoD or quality collapses.`,
      sizeFit: `# Size fit

| Signal | Fit |
|--------|-----|
| Headcount doubling yearly | Ideal |
| Stable enterprise | Prefer enterprise |`,
      artifacts: `# Artifacts

Tribe missions, platform golden paths, incident reviews`,
      ceremonies: `# Ceremonies

Tribe sync · incident review · hiring bar calibration`,
      checklist: `# Checklist

- [ ] Platform team exists for golden paths
- [ ] DoD not optional
- [ ] On-call sustainable`,
      examples: `# Examples

Migration: monolith → services with strangler + platform paved road`,
      antiPatterns: `# Anti-patterns

- Hiring without onboarding DoD
- Every team invents CI`,
      references: `# References

- companies/scale-up, big-tech
- methodologies/spotify-model, less`,
    },
    ["size-unicorn"],
  ),
  richCompany(
    "government-digital",
    "Government Digital Team",
    "In-house public-sector digital — accessibility, procurement, service standards",
    {
      positioning: `# Government Digital

In-house delivery (not vendor-only). Pair \`industries/gov-public-sector\` and strong a11y/security packs.`,
      sizeFit: `# Size fit

| Signal | Fit |
|--------|-----|
| Public service teams | Ideal |
| Vendor agency on gov contract | Prefer agency + gov industry |`,
      artifacts: `# Artifacts

Service standard assessments, accessibility reports, procurement evidence`,
      ceremonies: `# Ceremonies

Show & tells · service assessment · security CAB`,
      checklist: `# Checklist

- [ ] WCAG evidence
- [ ] Open source policy checked
- [ ] User research with actual citizens`,
      examples: `# Examples

Service: renew license online — GDS-like assessment before public beta`,
      antiPatterns: `# Anti-patterns

- Big-bang rewrite without user research
- PDF-only "digital"`,
      references: `# References

- industries/gov-public-sector
- methodologies/industry-gov
- compliance/wcag-22`,
    },
    ["size-gov-digital"],
  ),
];

/** Industry delivery overlays. */
export const INDUSTRY_METHODOLOGY_PACKS: KnowledgePack[] = [
  industryDelivery("healthcare", "Healthcare", "clinical / health-tech", "## Domain hooks\n- PHI boundaries, clinical safety, audit logs\n- Pair: healthcare/*, compliance/hipaa-depth, combo/healthcare-us"),
  industryDelivery("fintech", "Fintech", "payments / banking / lending", "## Domain hooks\n- Ledger correctness, PCI/AML/KYC gates\n- Pair: payments/*, industries/fintech, combo/fintech-open-banking"),
  industryDelivery("gov", "Gov / Public Sector", "government digital services", "## Domain hooks\n- Accessibility, procurement, auditability\n- Pair: industries/gov-public-sector, gov/*, compliance/wcag-22"),
  industryDelivery("ecommerce", "Ecommerce / Retail", "commerce & retail", "## Domain hooks\n- Catalog, checkout, inventory, returns\n- Pair: ecommerce/*, combo/ecommerce-storefront"),
  industryDelivery("edtech", "EdTech", "education technology", "## Domain hooks\n- Student data privacy, LTI/SCORM, academic integrity\n- Pair: edtech/*, industries/edtech"),
  industryDelivery("manufacturing", "Manufacturing", "industrial / MES / IoT ops", "## Domain hooks\n- OT/IT boundary, downtime risk, traceability\n- Pair: iot/*, industries/energy-utilities adjacent"),
  industryDelivery("media", "Media / Entertainment", "content & streaming", "## Domain hooks\n- Rights, CDN, audience metrics\n- Pair: media/*, industries/media-entertainment"),
  industryDelivery("logistics", "Logistics", "supply chain & freight", "## Domain hooks\n- Tracking SLAs, partner EDI, exception ops\n- Pair: logistics/*, industries/logistics-supply-chain"),
  industryDelivery("proptech", "PropTech", "real estate technology", "## Domain hooks\n- Listings accuracy, transactions, local regulation\n- Pair: industries/real-estate-proptech"),
  industryDelivery("energy", "Energy / Utilities", "energy & grid software", "## Domain hooks\n- Safety, outage comms, regulated reporting\n- Pair: industries/energy-utilities, energy/*"),
  industryDelivery("legal-tech", "Legal Tech", "legal practice technology", "## Domain hooks\n- Privilege, retention, matter security\n- Pair: industries/legal-tech, legal/*"),
  industryDelivery("hospitality", "Hospitality", "hotels / venues / guest ops", "## Domain hooks\n- PMS integrations, guest PII, channel managers\n- Pair: hospitality/*, industries/travel-hospitality"),
  industryDelivery("gaming", "Gaming", "games & interactive", "## Domain hooks\n- Liveops, anti-cheat, platform certifications\n- Pair: gaming/*"),
  industryDelivery("saas-b2b", "B2B SaaS", "multi-tenant B2B products", "## Domain hooks\n- Tenancy, RBAC, billing, enterprise SSO\n- Pair: industries/saas-b2b, combo/saas-billing, combo/auth-rbac"),
  industryDelivery("insurtech", "InsurTech", "insurance technology", "## Domain hooks\n- Claims workflows, underwriting evidence, fraud\n- Pair: insurance/*, industries/insurtech"),
  industryDelivery("ai-ml", "AI / ML Products", "ML-powered product surfaces", "## Domain hooks\n- Evals, drift, human oversight, model cards\n- Pair: ai/*, combo/ai-rag-product, companies/research-lab"),
  industryDelivery("cybersecurity", "Cybersecurity", "security products & SecOps platforms", "## Domain hooks\n- Detection quality, least privilege, evidence\n- Pair: industries/cybersecurity, compliance/soc2"),
  industryDelivery("climate-tech", "Climate Tech", "climate / ESG / carbon software", "## Domain hooks\n- Emission factor provenance, CSRD-ready exports\n- Pair: industries/climate-tech"),
  industryDelivery("agritech", "AgriTech", "agriculture & farm software", "## Domain hooks\n- Offline-first, geospatial, seasonal urgency\n- Pair: industries/agritech"),
  industryDelivery("aerospace-defense", "Aerospace & Defense", "high-assurance / defense digital", "## Domain hooks\n- Traceability, air-gap, export controls\n- Pair: industries/aerospace-defense"),
  industryDelivery("automotive-mobility", "Automotive & Mobility", "connected vehicle & mobility", "## Domain hooks\n- OTA risk, safety cases, location privacy\n- Pair: industries/automotive-mobility"),
  industryDelivery("telecom", "Telecom", "telecom BSS/OSS adjacent products", "## Domain hooks\n- Idempotent provisioning, rating, NOC UX\n- Pair: industries/telecom"),
  industryDelivery("crypto-web3", "Crypto / Web3", "wallets, exchanges, on-chain apps", "## Domain hooks\n- Tx simulation, custody, VASP rules\n- Pair: industries/crypto-web3"),
  industryDelivery("hr-tech", "HR Tech", "HRIS / ATS / people platforms", "## Domain hooks\n- Employee data, hiring AI bias controls\n- Pair: industries/hr-tech"),
  industryDelivery("martech", "MarTech", "marketing & ad platforms", "## Domain hooks\n- Consent, identity, attribution honesty\n- Pair: industries/martech"),
  industryDelivery("biotech", "Biotech", "lab / life-sciences software", "## Domain hooks\n- Chain of custody, GxP validation\n- Pair: industries/biotech"),
  industryDelivery("construction-tech", "Construction Tech", "jobsite & contractor platforms", "## Domain hooks\n- Offline mobile, safety evidence\n- Pair: industries/construction-tech"),
  industryDelivery("sports-fitness", "Sports & Fitness", "fitness / fan / club software", "## Domain hooks\n- Biometric minimization, seasonal peaks\n- Pair: industries/sports-fitness"),
  industryDelivery("developer-tools", "Developer Tools", "devtools & DX products", "## Domain hooks\n- Time-to-hello-world, changelog discipline\n- Pair: industries/developer-tools"),
  industryDelivery("marketplace-platforms", "Marketplace Platforms", "multi-sided marketplaces", "## Domain hooks\n- Liquidity, T&S, admin portal first-class\n- Pair: industries/marketplace-platforms, companies/platform-marketplace"),
  industryDelivery("nonprofit-civic", "Nonprofit & Civic", "mission / civic software", "## Domain hooks\n- Accessibility, plain language, grant cadence\n- Pair: industries/nonprofit-civic, companies/nonprofit"),
];

/** Additional process methodologies. */
export const PROCESS_METHODOLOGY_PACKS: KnowledgePack[] = [
  richMethodology(
    "lean-startup",
    "Lean Startup",
    "Build-Measure-Learn loops, validated learning, pivot/persevere",
    {
      positioning: `# Lean Startup

Validated learning over vanity shipping. Every feature is an experiment until metrics say otherwise.

## AI rule
State hypothesis + metric before implementation. Prefer MVP slices.`,
      hierarchy: `# Hierarchy

\`\`\`
hypothesis → experiment → learning → pivot|persevere
\`\`\``,
      artifacts: `# Artifacts

## Hypothesis card
Belief, test, metric, kill criteria

## Learning log
Result → decision`,
      ceremonies: `# Ceremonies

| Ceremony | Purpose |
|----------|---------|
| Experiment design | Before build |
| Learning review | After data |`,
      checklist: `# Checklist

- [ ] Metric pre-registered
- [ ] Sample size / timebox set
- [ ] Pivot criteria explicit`,
      examples: `# Examples

Hypothesis: Magic link raises activation +10pp in 14 days`,
      antiPatterns: `# Anti-patterns

- Building full platform before first learning
- Ignoring negative results`,
      references: `# References

- The Lean Startup (Ries)
- discovery/lifecycle/*, discovery/product-market-fit`,
    },
    ["process"],
  ),
  richMethodology(
    "xp",
    "Extreme Programming (XP)",
    "TDD, pairing, continuous integration, small releases",
    {
      positioning: `# Extreme Programming

Engineering practices as the methodology: TDD, pairing, CI, collective ownership.

## AI rule
Prefer red-green-refactor. Keep changes small and continuously integrated.`,
      hierarchy: `# Hierarchy

\`\`\`
user story → engineering task → commit
\`\`\``,
      artifacts: `# Artifacts

## Story card
Customer-facing language + AC

## Pairing note
Optional — who paired, decisions`,
      ceremonies: `# Ceremonies

| Ceremony | Purpose |
|----------|---------|
| Planning game | Select stories |
| Pairing | Daily |
| CI monitor | Continuous |`,
      checklist: `# Checklist

- [ ] Test first for logic changes
- [ ] CI green before merge
- [ ] Refactor after green`,
      examples: `# Examples

Story: As a member I can reset password
Tasks: failing test → implementation → refactor`,
      antiPatterns: `# Anti-patterns

- Giant PRs without tests
- Skipping refactor step`,
      references: `# References

- Extreme Programming Explained (Beck)
- methodologies/continuous-delivery`,
    },
    ["process"],
  ),
  richMethodology(
    "dual-track-agile",
    "Dual-track Agile",
    "Discovery and delivery tracks in parallel",
    {
      positioning: `# Dual-track Agile

Discovery (problem/solution validation) runs beside delivery. Prevents building the wrong thing fast.

## AI rule
Label work as discovery vs delivery. Discovery outputs feed shaped delivery bets.`,
      hierarchy: `# Hierarchy

\`\`\`
opportunity → solution validation → delivery epic → story
\`\`\``,
      artifacts: `# Artifacts

## Opportunity brief
- Evidence links
- Opportunity solution tree node

## Delivery ready checklist
Validated enough to build`,
      ceremonies: `# Ceremonies

| Ceremony | Purpose |
|----------|---------|
| Discovery review | Weekly |
| Delivery planning | Sprint/cycle |
| Handoff | When validated |`,
      checklist: `# Checklist

- [ ] Discovery artifact linked
- [ ] Delivery scope not speculative
- [ ] Impression Guard on research notes`,
      examples: `# Examples

Discovery: 8 interviews → opportunity "faster onboarding"
Delivery: epic "progressive profile"`,
      antiPatterns: `# Anti-patterns

- Discovery theatre with no decision
- Delivery starting before any validation on high-risk bets`,
      references: `# References

- Teresa Torres Continuous Discovery
- discovery/* packs; methodologies/shape-up`,
    },
    ["process", "discovery"],
  ),
  richMethodology(
    "continuous-delivery",
    "Continuous Delivery",
    "Always-releasable trunk, automated pipelines, progressive delivery",
    {
      positioning: `# Continuous Delivery

Main branch always releasable. Automate validation; separate deploy from release when needed.

## AI rule
Prefer trunk-based small merges. Feature flags over long-lived branches.`,
      hierarchy: `# Hierarchy

\`\`\`
change → pipeline → prod (flagged) → release
\`\`\``,
      artifacts: `# Artifacts

## Pipeline definition
Stages, gates, owners

## Flag plan
Default, audience, kill switch`,
      ceremonies: `# Ceremonies

| Ceremony | Purpose |
|----------|---------|
| Pipeline review | On breakage trends |
| Release train | Optional cadence |`,
      checklist: `# Checklist

- [ ] Automated tests in CI
- [ ] Rollback path
- [ ] Flag owner named`,
      examples: `# Examples

Flag: new_checkout_v2 — 5% → 25% → 100% with error budget`,
      antiPatterns: `# Anti-patterns

- Hotfixing prod without pipeline
- Flags without cleanup`,
      references: `# References

- Continuous Delivery (Humble/Farley)
- disciplines/continuous-delivery`,
    },
    ["process", "devops"],
  ),
  richMethodology(
    "devops",
    "DevOps",
    "You build it you run it — shared ownership of delivery and operations",
    {
      positioning: `# DevOps

Collapse wall between build and run. Platform enables product teams; product teams own SLOs.

## AI rule
Every feature names observability and on-call impact.`,
      hierarchy: `# Hierarchy

\`\`\`
capability → service → change → incident feedback
\`\`\``,
      artifacts: `# Artifacts

## SLO / error budget
- SLI, target, window

## Runbook
Symptoms → actions → escalate`,
      ceremonies: `# Ceremonies

| Ceremony | Purpose |
|----------|---------|
| Ops review | Weekly |
| Incident review | Post-sev |
| Capacity planning | Monthly |`,
      checklist: `# Checklist

- [ ] Dashboards exist before launch
- [ ] On-call rotation current
- [ ] Runbook linked from alert |`,
      examples: `# Examples

SLO: checkout success 99.9% / 30d
Alert: page if burn rate 2h`,
      antiPatterns: `# Anti-patterns

- "Throw over wall to ops"
- Alerts without runbooks`,
      references: `# References

- The Phoenix Project / DevOps Handbook
- combo/observability-sre; methodologies/sre-ops`,
    },
    ["process"],
  ),
  richMethodology(
    "sre-ops",
    "SRE",
    "Error budgets, toil reduction, reliability as a product",
    {
      positioning: `# Site Reliability Engineering

Reliability is a feature with an error budget. Balance velocity vs stability with data.

## AI rule
Propose SLOs with features. Treat toil reduction as real work.`,
      hierarchy: `# Hierarchy

\`\`\`
SLO → error budget → work prioritisation
\`\`\``,
      artifacts: `# Artifacts

## SLO doc
User journey, SLI, objective

## Postmortem
Blameless timeline, actions`,
      ceremonies: `# Ceremonies

| Ceremony | Purpose |
|----------|---------|
| Error budget review | Weekly |
| Postmortem | After sev |
| Toil review | Monthly |`,
      checklist: `# Checklist

- [ ] SLI is user-centric
- [ ] Budget policy agreed
- [ ] Action items have owners |`,
      examples: `# Examples

If budget burned: freeze features, reliability sprint`,
      antiPatterns: `# Anti-patterns

- SLOs only on CPU
- Punitive postmortems`,
      references: `# References

- Google SRE books
- disciplines/sli-slo; observability/*`,
    },
    ["process"],
  ),
  richMethodology(
    "design-ops",
    "Design Ops",
    "Design system operations, research ops, quality of craft at scale",
    {
      positioning: `# Design Ops

Scale design quality: systems, research repository, tooling, and handoff standards.

## AI rule
Reuse design-system components; link research insights; avoid one-off UI snowflakes.`,
      hierarchy: `# Hierarchy

\`\`\`
design system → pattern → screen → handoff
\`\`\``,
      artifacts: `# Artifacts

## Pattern proposal
Problem, API, a11y notes

## Research insight card
Insight, evidence, product implication`,
      ceremonies: `# Ceremonies

| Ceremony | Purpose |
|----------|---------|
| Design critique | Weekly |
| System governance | Biweekly |
| Research synthesis | Per study |`,
      checklist: `# Checklist

- [ ] A11y considered
- [ ] Tokens used
- [ ] Handoff specs complete |`,
      examples: `# Examples

Pattern: EmptyState — props title, action, illustration`,
      antiPatterns: `# Anti-patterns

- Pixel push without system contribution
- Research that never reaches delivery`,
      references: `# References

- disciplines/design-systems, accessibility
- discovery/ux-research-foundations`,
    },
    ["process", "design"],
  ),
  richMethodology(
    "product-ops",
    "Product Ops",
    "Product process quality — prioritisation hygiene, roadmap ops, toolchains",
    {
      positioning: `# Product Ops

Make product organisations effective: prioritisation, roadmap coherence, tooling, and decision quality.

## AI rule
Connect work to outcomes. Keep Now/Next/Later honest; surface decision debt.`,
      hierarchy: `# Hierarchy

\`\`\`
strategy → roadmap → initiative → delivery
\`\`\``,
      artifacts: `# Artifacts

## Prioritisation scorecard
Reach, impact, confidence, effort (or local rubric)

## Decision log
Date, decision, owner, revisit date`,
      ceremonies: `# Ceremonies

| Ceremony | Purpose |
|----------|---------|
| Roadmap review | Biweekly |
| Intake triage | Daily/weekly |
| Outcome review | Monthly |`,
      checklist: `# Checklist

- [ ] Outcome metric named
- [ ] Owner named
- [ ] Kill/revisit date set |`,
      examples: `# Examples

Decision: Pause chat widget — revisit after NPS wave`,
      antiPatterns: `# Anti-patterns

- Roadmap as feature dump
- No owners on decisions`,
      references: `# References

- Product Operations (Mallough et al.) themes
- methodologies/document-writing; discovery/*`,
    },
    ["process", "product"],
  ),
  richMethodology(
    "nexus",
    "Nexus (Scrum scaling)",
    "3–9 Scrum teams with Nexus Integration Team",
    {
      positioning: `# Nexus

Scrum scaling for 3–9 teams on one Product Backlog with a Nexus Integration Team.

## AI rule
One Product Owner voice. Integration issues are first-class backlog items.`,
      hierarchy: `# Hierarchy

\`\`\`
product backlog → team sprint backlog → integrated increment
\`\`\``,
      artifacts: `# Artifacts

## Nexus Sprint Goal
Shared outcome across teams

## Integration backlog
Cross-team dependencies`,
      ceremonies: `# Ceremonies

| Ceremony | Purpose |
|----------|---------|
| Nexus Sprint Planning | Align teams |
| Nexus Daily Scrum | Integration focus |
| Nexus Review/Retro | Combined |`,
      checklist: `# Checklist

- [ ] Single Product Backlog
- [ ] Integration owner clear
- [ ] Definition of Done includes integrated |`,
      examples: `# Examples

Nexus Goal: End-to-end checkout recoverable after payment timeout`,
      antiPatterns: `# Anti-patterns

- Multiple conflicting Product Owners
- Integration only at the end`,
      references: `# References

- Official Nexus Guide (Scrum.org)
- methodologies/scrum, less`,
    },
    ["process", "scaling"],
  ),
  richMethodology(
    "scrum-at-scale",
    "Scrum@Scale",
    "Modular Scrum scaling — Chief Product Owner, Scrum of Scrums",
    {
      positioning: `# Scrum@Scale

Scale Scrum via repeating patterns: Scrum of Scrums, Executive MetaScrum, Chief Product Owner.

## AI rule
Keep team Scrum intact; scale coordination, not ceremony bloat inside teams.`,
      hierarchy: `# Hierarchy

\`\`\`
meta-backlog → team backlog → sprint increment
\`\`\``,
      artifacts: `# Artifacts

## MetaScrum backlog
Organisation priorities

## Impediment board
Escalations from SoS`,
      ceremonies: `# Ceremonies

| Ceremony | Purpose |
|----------|---------|
| Scrum of Scrums | Cross-team sync |
| MetaScrum | Priority alignment |`,
      checklist: `# Checklist

- [ ] Team DoD intact
- [ ] SoS has decision power
- [ ] Metrics on delivery, not vanity |`,
      examples: `# Examples

SoS impediment: shared auth service latency blocking 3 teams`,
      antiPatterns: `# Anti-patterns

- Status-meeting SoS with no decisions
- Breaking team autonomy for central control`,
      references: `# References

- Scrum@Scale Guide
- methodologies/scrum, safe`,
    },
    ["process", "scaling"],
  ),
];

export const METHODOLOGY_EXPANDED_PACKS: KnowledgePack[] = [
  ...COMPANY_SIZE_PACKS,
  ...INDUSTRY_METHODOLOGY_PACKS,
  ...PROCESS_METHODOLOGY_PACKS,
];
