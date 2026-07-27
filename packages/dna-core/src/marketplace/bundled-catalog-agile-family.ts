/**
 * Agile family — Scrum, LeSS, SAFe, Kanban, Shape Up, Spotify + companions.
 * Jam to richness bar (docs + assets/). Replaces thin 4-file methodology stubs.
 */
import type { KnowledgePack } from "@superhumaan/dna-config";
import { richCatalogPack, type RichDocSet } from "./pack-richness.js";

function agile(
  id: string,
  name: string,
  desc: string,
  docs: RichDocSet,
  tags: string[] = [],
  repos?: [string, string, string],
): KnowledgePack {
  return richCatalogPack(
    `methodologies/${id}`,
    name,
    "methodologies",
    desc,
    docs,
    ["methodology", "agile-family", id, ...tags],
    {
      repos: repos ?? ["scrum/scrum-guide", "less/less.works", "agilealliance/agilealliance.org"],
      fixtureName: `${id}-sample`,
    },
  );
}

export const AGILE_FAMILY_PACKS: KnowledgePack[] = [
  agile(
    "scrum",
    "Scrum",
    "Time-boxed sprints, Product Owner, Scrum Master, Developers, Definition of Done",
    {
      positioning: `# Scrum

Empirical process control for complex product work. Fixed-length **sprints** (usually 1–2 weeks) produce a usable **Increment**.

## Roles (accountabilities)
- **Product Owner** — Product Goal, Product Backlog order, stakeholder value
- **Scrum Master** — Scrum effectiveness, coaching, impediment removal
- **Developers** — plan Sprint Backlog, quality, Definition of Done

## When to use
- Cross-functional team can ship an Increment each sprint
- Stakeholders can inspect at Sprint Review
- Work is uncertain enough that waterfall plans fail

## Pair with
- \`companies/*\` size pack · \`methodologies/industry-*\` for regulated domains
- Companions: \`definition-of-done\`, \`user-stories\`, \`estimation-planning-poker\`

## DNA rule
Write user stories + AC. Respect sprint boundary. Never invent velocity from stub Impressions — read CellularMemory + runtime evidence.
`,
      architecture: `# Architecture — Scrum hierarchy

\`\`\`
Product Goal
  └── Product Backlog (ordered)
        └── Sprint Backlog (forecast + plan)
              └── Increment (Done)
\`\`\`

| Level | Owner | Notes |
|-------|-------|-------|
| Product Goal | PO | Multi-sprint North Star |
| Epic / theme | PO | Optional grouping |
| Product Backlog Item | PO + team | Ready when refined |
| Sprint Goal | whole Scrum Team | One coherent outcome |
| Task | Developers | Optional decomposition |

## Ready (Definition of Ready — team policy)
- Clear value + AC
- Dependencies known
- Fits one sprint when sliced
`,
      integration: `# Integration — Scrum with DNA

| DNA artifact | Scrum mapping |
|--------------|---------------|
| \`ai/feature-request.md\` | Product Backlog Item / epic brief |
| Solution Architect plan | Sprint Planning input (approval gate) |
| GitHub issues / tickets | Sprint Backlog items |
| \`dna quality report\` | DoD quality gate |
| Impressions update | Architecture change → Done |

## Ticket systems
Respect \`delivery.ticketSystem\` — Jira / Linear / GitHub. Do not default to GitHub if config says otherwise.

## Scaling path
1 team → Scrum · 2–8 teams → LeSS / Nexus · many ARTs → SAFe
`,
      checklist: `# Checklist — Scrum

## Sprint Planning
- [ ] Product Goal visible
- [ ] Sprint Goal crafted
- [ ] Capacity known (holidays, on-call)
- [ ] PBIs Ready enough
- [ ] DoD agreed

## During sprint
- [ ] Daily Scrum ≤15m — plan next 24h
- [ ] Impediments escalated
- [ ] No silent scope add without PO

## Sprint Review
- [ ] Demo Done Increment only
- [ ] Stakeholders invited
- [ ] Backlog adapted from feedback

## Retro
- [ ] One improvement experiment owned
`,
      examples: `# Examples — Scrum

## User story
\`\`\`
As a clinic admin
I want to export audit logs for a date range
So that we can evidence access reviews

AC:
- [ ] Given a range ≤90 days, When I export, Then CSV downloads
- [ ] Given >90 days, Then validation error
- [ ] Access audited
\`\`\`

## Sprint Goal
"Clinicians can complete ambient note review without leaving the chart."

## Spillover handling
Move unfinished PBI back to Product Backlog; re-estimate; do not silently carry fake "90% done".
`,
      antiPatterns: `# Anti-patterns — Scrum

- **Zombie Scrum** — ceremonies without empiricism or Done Increments
- **Proxy PO** — committee cannot order the backlog
- **Mini-waterfall sprints** — analysis week + build week + test week
- **Points as deadlines** — story points ≠ calendar commitments
- **Skipping Review** — no stakeholder feedback loop
- Inventing compliance evidence from stub Impressions
`,
      references: `# References — Scrum

1. Scrum Guide (https://scrumguides.org)
2. Scrum.org learning path
3. Agile Alliance glossary
4. Pair: \`methodologies/definition-of-done\`, \`methodologies/user-stories\`
5. Scaling: \`methodologies/less\`, \`methodologies/nexus\`, \`methodologies/scrum-at-scale\`
`,
      extras: {
        ceremonies: `# Ceremonies — Scrum

| Event | Time-box (2w sprint) | Purpose |
|-------|----------------------|---------|
| Sprint Planning | ≤8h | Sprint Goal + Sprint Backlog |
| Daily Scrum | 15m | Developers plan next day |
| Sprint Review | ≤4h | Inspect Increment + adapt backlog |
| Sprint Retrospective | ≤3h | Improve process/quality |
| Backlog Refinement | ongoing (~10%) | Ready PBIs |
`,
        artifacts: `# Artifacts — Scrum

- **Product Backlog** — single ordered list
- **Sprint Backlog** — plan to achieve Sprint Goal
- **Increment** — Done sum of all prior Increments
- **Definition of Done** — quality shared by org/team
`,
      },
    },
    ["scrum"],
  ),

  agile(
    "less",
    "LeSS (Large-Scale Scrum)",
    "One Product Backlog, feature teams, system thinking — scale Scrum without adding layers",
    {
      positioning: `# LeSS — Large-Scale Scrum

Scale **Scrum** with feature teams, one Product Owner (or PO team), and whole-product focus — not a portfolio bureaucracy.

## Flavours
- **LeSS** — 2–8 teams
- **LeSS Huge** — see \`methodologies/less-huge\` (Requirement Areas)

## Principles
- Empirical process control at product scale
- More with less (descaling first)
- Feature teams over component teams
- Customer-centric

## When to use
- Multiple teams on one product
- Willing to share one Sprint length and one Definition of Done
- Can invest in real multi-team Product Backlog Refinement
`,
      architecture: `# Architecture — LeSS

\`\`\`
One Product Owner
  └── One Product Backlog
        ├── Feature Team A
        ├── Feature Team B
        └── Feature Team C
              └── One integrated Increment / Sprint
\`\`\`

| Concept | Rule |
|---------|------|
| Feature team | Cross-functional, can deliver end-to-end |
| Component team | Avoid — creates queues |
| Sprint | Same length, synchronized |
| DoD | Stronger at scale — includes integration |
`,
      integration: `# Integration — LeSS + DNA

- Stories must name **cross-team impacts**
- System Demo = integrated Increment only
- Architecture work is product backlog (not side channel)
- Use \`methodologies/scrum-of-scrums\` lightly — prefer multi-team PBR
`,
      checklist: `# Checklist — LeSS

- [ ] One Product Backlog (not per-team fake backlogs)
- [ ] Feature teams staffed
- [ ] Shared Sprint calendar
- [ ] Overall PBR scheduled
- [ ] Continuous integration green before System Demo
- [ ] Overall Retrospective actions owned
`,
      examples: `# Examples — LeSS

## Multi-team story
Title: "Checkout tax calculation for EU VAT"
Teams: Payments + Tax + Storefront
Integration: contract tests on tax API; System Demo shows EU cart end-to-end
`,
      antiPatterns: `# Anti-patterns — LeSS

- Fake LeSS: per-team Product Owners with no real product focus
- Component teams renamed "feature teams"
- Integration only at release train end
- Scrum of Scrums as status meeting theatre
`,
      references: `# References — LeSS

1. https://less.works
2. LeSS rules & guides
3. Pair: \`methodologies/scrum\`, \`methodologies/less-huge\`, \`methodologies/scrum-of-scrums\`
`,
      extras: {
        ceremonies: `# Ceremonies — LeSS

| Ceremony | Purpose |
|----------|---------|
| Sprint Planning One | Common Product Backlog selection |
| Sprint Planning Two | Team-level planning |
| Overall PBR | Multi-team refinement |
| System Demo | Integrated Increment |
| Overall Retrospective | Cross-team improvement |
`,
      },
    },
    ["less", "scaling"],
    ["less/less.works", "scrum/scrum-guide", "craiglarman/scaling-lean-agile"],
  ),

  agile(
    "less-huge",
    "LeSS Huge",
    "Requirement Areas for very large products — LeSS beyond ~8 teams",
    {
      positioning: `# LeSS Huge

When one Product Backlog cannot be refined by all teams, split into **Requirement Areas** each with an Area Product Owner — still one real product.

## Guardrails
- Prefer descaling before Huge
- Areas are customer-centric, not architectural layers
`,
      architecture: `# Architecture — LeSS Huge

\`\`\`
Product Owner
  ├── Area PO — Area A backlog view
  ├── Area PO — Area B
  └── Area PO — Area C
\`\`\`

Undivided Product Backlog remains the source of truth; areas are views.
`,
      integration: `# Integration

Pair with \`methodologies/less\`. System-wide DoD still applies. Area goals must not create permanent silos.
`,
      checklist: `# Checklist — LeSS Huge

- [ ] Areas mapped to customer value, not components
- [ ] Undivided Product Backlog exists
- [ ] Area POs align weekly with Product Owner
- [ ] Cross-area dependencies visible
`,
      examples: `# Example

Product: marketplace · Areas: Buyer experience · Seller tools · Trust & safety
`,
      antiPatterns: `# Anti-patterns

- Areas = frontend / backend / DB (component silos)
- Area backlogs diverge forever from product strategy
`,
      references: `# References

1. less.works — LeSS Huge
2. \`methodologies/less\`
`,
    },
    ["less", "scaling"],
  ),

  agile(
    "kanban",
    "Kanban",
    "Visualise flow, limit WIP, manage cycle time — continuous delivery without fixed sprints",
    {
      positioning: `# Kanban

Optimise **flow**. Pull work when capacity exists. Optional classes of service (expedite, fixed date, standard).

## When to use
- Interrupt-driven ops / platform teams
- Uneven arrival of work
- Want metrics (lead time, WIP, throughput) over sprint theatre
`,
      architecture: `# Architecture — Kanban board

Typical columns: Inbox → Ready → In progress → Review → Done  
Policies per column are explicit. WIP limits enforced.
`,
      integration: `# Integration — DNA

Map columns to ticket statuses. Measure cycle time from Ready→Done. Pair with \`methodologies/continuous-delivery\` and \`methodologies/sre-ops\`.
`,
      checklist: `# Checklist — Kanban

- [ ] WIP limits set and respected
- [ ] Explicit entry/exit policies
- [ ] Aging WIP visible
- [ ] Service classes defined
`,
      examples: `# Example

Expedite lane for Sev1 production bugs — WIP 1 — interrupts standard work.
`,
      antiPatterns: `# Anti-patterns

- Kanban with infinite WIP
- Columns without policies
- Using Kanban to hide lack of Product Goal
`,
      references: `# References

1. Kanban Guide for Scrum Teams / Anderson Kanban Method
2. \`methodologies/continuous-delivery\`
`,
    },
    ["kanban", "flow"],
  ),

  agile(
    "safe",
    "SAFe (Scaled Agile Framework)",
    "ARTs, Program Increments, WSJF, features & enablers for enterprise portfolios",
    {
      positioning: `# SAFe

Enterprise scaling with **Agile Release Trains (ARTs)** and **Program Increments (PIs)**. Use when many teams need synchronized planning and portfolio lean governance.

## Prefer lighter first
Try LeSS / Nexus before SAFe unless enterprise already mandates SAFe.
`,
      architecture: `# Architecture — SAFe levels

Theme → Epic → Feature → Story → Task  
Enablers sit beside Features. WSJF prioritises Features.
`,
      integration: `# Integration

Tag DNA work as feature | enabler | bug. Reference PI objective. Pair \`methodologies/wsjf\`, \`methodologies/scrum\`.
`,
      checklist: `# Checklist — SAFe PI

- [ ] PI objectives drafted
- [ ] Dependencies mapped on program board
- [ ] Capacity allocated for unplanned
- [ ] System Demo cadence set
`,
      examples: `# Example — Feature

Benefit hypothesis: Reduce onboarding drop-off 15%  
AC + NFRs listed · ART: Growth · PI: 2026.3
`,
      antiPatterns: `# Anti-patterns

- SAFe ceremony without System Demo
- Enablers never scheduled (architecture starves)
- WSJF gamed as politics
`,
      references: `# References

1. scaledagileframework.com
2. \`methodologies/wsjf\`
`,
    },
    ["safe", "scaling", "enterprise"],
  ),

  agile(
    "shape-up",
    "Shape Up",
    "Appetite-driven bets, pitches, cool-down — Basecamp delivery pattern",
    {
      positioning: `# Shape Up

6-week cycles: shaping → betting table → build → cool-down. **Appetite** replaces estimates. No infinite backlog grooming.
`,
      architecture: `# Architecture

Bet → Scope slices → Build tasks  
Rabbit holes and no-gos are first-class.
`,
      integration: `# Integration — DNA

Output **pitches** not user stories by default. Map bets to \`ai/feature-request.md\`. Pair \`companies/startup\` or \`companies/sme\`.
`,
      checklist: `# Checklist

- [ ] Appetite stated
- [ ] Rabbit holes listed
- [ ] No-gos explicit
- [ ] Betting table decision recorded
`,
      examples: `# Pitch skeleton

Problem · Appetite (2 weeks / 6 weeks) · Solution breadboard · Rabbit holes · No-gos
`,
      antiPatterns: `# Anti-patterns

- Shape Up with a classic sprint backlog underneath
- Appetite ignored when scope expands
`,
      references: `# References

1. basecamp.com/shapeup
2. \`methodologies/lean-startup\`
`,
    },
    ["shape-up"],
    ["basecamp/handbook", "scrum/scrum-guide", "openpractice/library"],
  ),

  agile(
    "spotify-model",
    "Spotify Model",
    "Squads, tribes, chapters, guilds — autonomy with alignment",
    {
      positioning: `# Spotify Model

Org pattern (not a formal framework). Squads own missions; chapters own craft; tribes align related squads.
`,
      architecture: `# Architecture

Initiative → Epic → Story  
Label tribe + squad on every item.
`,
      integration: `# Integration

Common for scale-ups and travel tech. Pair \`companies/scale-up\`, \`companies/travel-scale-up\`.
`,
      checklist: `# Checklist

- [ ] Squad mission clear
- [ ] Chapter standards documented
- [ ] Cross-squad dependencies negotiated
`,
      examples: `# Example

Tribe: Checkout · Squad: Payments resilience · Chapter: Backend
`,
      antiPatterns: `# Anti-patterns

- Matrix without decision rights
- Guilds as mandatory bureaucracy
`,
      references: `# References

1. Spotify engineering culture talks (historical)
2. Prefer empiricism over cargo-cult labels
`,
    },
    ["spotify", "org-design"],
  ),

  agile(
    "scrum-of-scrums",
    "Scrum of Scrums",
    "Lightweight multi-team coordination — not a status theatre",
    {
      positioning: `# Scrum of Scrums

Ambassadors from each Scrum team sync on **integration risks and impediments**. Prefer LeSS Overall PBR when possible.
`,
      architecture: `# Architecture

Each team → ambassador → SoS · Output: dependency board + decisions
`,
      integration: `# Integration

Use with \`methodologies/scrum\` or \`methodologies/less\`. Keep ≤15–30m.
`,
      checklist: `# Checklist

- [ ] Ambassadors empowered
- [ ] Focus on blockers/integration not status
- [ ] Actions owned with dates
`,
      examples: `# Prompt

What will we integrate before System Demo? What is blocked across teams?
`,
      antiPatterns: `# Anti-patterns

- Managers attending as reporters
- SoS replaces multi-team refinement
`,
      references: `# References

1. Scrum.org scaling articles
2. \`methodologies/less\`
`,
    },
    ["scrum", "scaling"],
  ),

  agile(
    "definition-of-done",
    "Definition of Done",
    "Shared quality contract for Increments — engineering + product + compliance",
    {
      positioning: `# Definition of Done

The DoD is the **Increment quality contract**. If it is not Done, it is not releasable — no silent exceptions.
`,
      architecture: `# Layers

Team DoD ⊆ Organizational DoD. Scaling frameworks strengthen DoD (integration, security, a11y).
`,
      integration: `# Integration — DNA

Include \`dna quality report --feature\` PASS and docs/Impressions updates when architecture changes.
`,
      checklist: `# Org DoD starter

- [ ] Reviewed · tests · no Sev1/2 · a11y smoke · secrets scanned · deployed to agreed env · observability
`,
      examples: `# Example delta

Regulated healthcare adds: audit log verified · BAA subprocessors checked · PHI paths reviewed
`,
      antiPatterns: `# Anti-patterns

- "Done except tests"
- Per-person private DoD
`,
      references: `# References

1. Scrum Guide — Increment / DoD
2. \`methodologies/scrum\`
`,
    },
    ["scrum", "quality"],
  ),

  agile(
    "user-stories",
    "User Stories",
    "Persona + outcome + acceptance criteria — INVEST slicing",
    {
      positioning: `# User Stories

Small vertical slices of value. Format is optional; **clarity + AC + testability** are not.
`,
      architecture: `# INVEST

Independent · Negotiable · Valuable · Estimable · Small · Testable
`,
      integration: `# Integration

Map to ticket system fields. Pair \`methodologies/ticket-writing\`, \`methodologies/estimation-planning-poker\`.
`,
      checklist: `# Story ready

- [ ] User + outcome clear
- [ ] AC in Given/When/Then or checklist
- [ ] Non-goals listed
- [ ] Fits one sprint / appetite slice
`,
      examples: `# Template

As a … I want … So that …  
AC: …  
Non-goals: …
`,
      antiPatterns: `# Anti-patterns

- Technical tasks disguised as stories without user value
- Epics dumped into a sprint unsplit
`,
      references: `# References

1. Cohn — User Stories Applied
2. \`methodologies/scrum\`
`,
    },
    ["scrum", "product"],
  ),

  agile(
    "estimation-planning-poker",
    "Estimation & Planning Poker",
    "Relative sizing, planning poker, capacity — never fake precision",
    {
      positioning: `# Estimation

Relative sizing (points / t-shirt) beats hours for complex work. Re-estimate when learning changes the item.
`,
      architecture: `# Flow

Refine → estimate → capacity check → forecast (not commitment theatre)
`,
      integration: `# Integration

Story points ≠ deadlines. Velocity is a forecast input after several sprints of evidence.
`,
      checklist: `# Poker session

- [ ] Same understanding of AC
- [ ] Outliers discuss
- [ ] Spike if unknown > threshold
`,
      examples: `# Scales

1,2,3,5,8,13 · or S/M/L/XL with XL = split
`,
      antiPatterns: `# Anti-patterns

- Management forcing points down
- Comparing velocity across teams
`,
      references: `# References

1. Mountain Goat estimation guidance
2. \`methodologies/user-stories\`
`,
    },
    ["scrum", "estimation"],
  ),

  agile(
    "wsjf",
    "WSJF Prioritisation",
    "Weighted Shortest Job First — SAFe / lean portfolio prioritisation",
    {
      positioning: `# WSJF

WSJF ≈ Cost of Delay / Job Size. Use for Features/epics when many valuable options compete.
`,
      architecture: `# Cost of Delay components

User/business value + time criticality + risk reduction / opportunity enablement
`,
      integration: `# Integration

Pair \`methodologies/safe\`. Record assumptions — do not invent CoD from stub Impressions.
`,
      checklist: `# WSJF pass

- [ ] Job size relative
- [ ] CoD factors scored consistently
- [ ] Dependencies noted separately
`,
      examples: `# Sheet columns

Item | BV | TC | RR/OE | Size | WSJF
`,
      antiPatterns: `# Anti-patterns

- Scoring after the political decision
- Ignoring operational risk reduction
`,
      references: `# References

1. SAFe WSJF
2. \`methodologies/safe\`
`,
    },
    ["safe", "prioritisation"],
  ),

  agile(
    "tdd",
    "Test-Driven Development",
    "Red-green-refactor — tests as design feedback",
    {
      positioning: `# TDD

Write a failing test → make it pass → refactor. Improves design feedback loops inside Scrum/XP/Kanban.
`,
      architecture: `# Cycle

Red → Green → Refactor · Keep tests fast and behavioural where valuable
`,
      integration: `# Integration

Pair \`methodologies/xp\`, \`methodologies/definition-of-done\`. CI must run the suite.
`,
      checklist: `# TDD habit

- [ ] One failing test first
- [ ] Minimal code to pass
- [ ] Refactor with green bar
`,
      examples: `# Example

API contract test before handler implementation.
`,
      antiPatterns: `# Anti-patterns

- Testing implementation details only
- Skipping refactor step
`,
      references: `# References

1. Beck — TDD by Example
2. \`methodologies/xp\`
`,
    },
    ["xp", "quality"],
  ),

  agile(
    "bdd",
    "Behaviour-Driven Development",
    "Given/When/Then collaboration — living examples of behaviour",
    {
      positioning: `# BDD

Shared examples of behaviour between product and engineering. Complements user stories and DoD.
`,
      architecture: `# Artifacts

Feature files / example mapping sessions → automated checks where ROI is clear
`,
      integration: `# Integration

Pair \`methodologies/user-stories\`, \`methodologies/scrum\`.
`,
      checklist: `# Example mapping

- [ ] Rule · examples · questions captured
- [ ] Ambiguities returned to PO
`,
      examples: `# Gherkin

Given a verified user  
When they request password reset  
Then a single-use link is emailed
`,
      antiPatterns: `# Anti-patterns

- Gherkin for unit-level noise
- Examples never automated or never read
`,
      references: `# References

1. Cucumber / example mapping
2. \`methodologies/user-stories\`
`,
    },
    ["quality", "product"],
  ),

  agile(
    "pair-mob-programming",
    "Pair & Mob Programming",
    "Collaborative coding — XP practice for hard or risky work",
    {
      positioning: `# Pair & Mob

Two or more developers at one problem. Use for complex domains, onboarding, and high-risk changes.
`,
      architecture: `# Styles

Driver/navigator pair · mob with rotating driver · strong-style pairing
`,
      integration: `# Integration

Pair \`methodologies/xp\`. Still respects DoD and review policy (mob may satisfy review if policy allows).
`,
      checklist: `# Session

- [ ] Goal for the hour clear
- [ ] Rotate roles
- [ ] Commit small
`,
      examples: `# When to pair

Auth, payments, migrations, incident fixes, unfamiliar codebase areas
`,
      antiPatterns: `# Anti-patterns

- Silent passenger
- Pairing as punishment
`,
      references: `# References

1. XP pairing guidance
2. \`methodologies/xp\`
`,
    },
    ["xp", "collaboration"],
  ),

  agile(
    "okr-delivery",
    "OKRs for Delivery",
    "Objectives & Key Results aligned to Product Goals and sprint/PI outcomes",
    {
      positioning: `# OKRs for Delivery

Connect strategy to delivery without turning OKRs into a task list. Key Results are outcomes, not output counts.
`,
      architecture: `# Linkage

Company OKR → Product Goal → Sprint/PI Goals → PBIs
`,
      integration: `# Integration

Pair size packs + \`methodologies/scrum\` / \`methodologies/safe\`. Do not invent KR baselines from stubs.
`,
      checklist: `# OKR hygiene

- [ ] ≤5 objectives
- [ ] KRs measurable
- [ ] Delivery work traced to KR
`,
      examples: `# KR

"Reduce p95 checkout API latency from 800ms → 300ms" — not "ship 12 stories"
`,
      antiPatterns: `# Anti-patterns

- OKRs rewritten weekly to match whatever shipped
- Output vanity metrics as KRs
`,
      references: `# References

1. Google OKR resources / Measure What Matters
2. \`methodologies/scrum\`
`,
    },
    ["strategy", "product"],
  ),

  agile(
    "nexus",
    "Nexus",
    "Scrum.org scaling — Nexus Integration Team, integrated Increment each Sprint",
    {
      positioning: `# Nexus

3–9 Scrum teams; **Nexus Integration Team** owns integration & dependencies. One Product Backlog, one Sprint.
`,
      architecture: `# Architecture

NIT + Scrum Teams → Nexus Sprint Backlog → Integrated Increment
`,
      integration: `# Integration

Alternative to LeSS. Pair \`methodologies/scrum\`, \`methodologies/definition-of-done\`.
`,
      checklist: `# Nexus Sprint

- [ ] Cross-team dependencies identified in Nexus Sprint Planning
- [ ] Integration work visible
- [ ] Nexus Sprint Review on integrated Increment
`,
      examples: `# NIT focus

CI health, shared environments, cross-team refactor coordination
`,
      antiPatterns: `# Anti-patterns

- NIT becomes a project management office
- Teams demo separately and call it integrated
`,
      references: `# References

1. scrum.org — Nexus Guide
2. \`methodologies/scrum\`
`,
    },
    ["scaling", "scrum"],
  ),

  agile(
    "scrum-at-scale",
    "Scrum at Scale",
    "Modular scaling pattern — Scrum of Scrums + MetaScrum for product decisions",
    {
      positioning: `# Scrum at Scale

Jeff Sutherland’s modular scaling: coordinate delivery via SoS networks; coordinate product via MetaScrum.
`,
      architecture: `# Modules

Team → SoS → SoSoS · Product Owner → MetaScrum
`,
      integration: `# Integration

Pair \`methodologies/scrum-of-scrums\`, \`methodologies/scrum\`.
`,
      checklist: `# Checklist

- [ ] Delivery network mapped
- [ ] Product decision cadence clear
- [ ] Impediment removal path exists
`,
      examples: `# MetaScrum

Cross-PO alignment on Product Goal trade-offs for the next sprint window
`,
      antiPatterns: `# Anti-patterns

- Infinite SoS layers with no decision rights
`,
      references: `# References

1. scrumatscale.com
2. \`methodologies/scrum\`
`,
    },
    ["scaling", "scrum"],
  ),
];

/** Ids that replace thin CORE methodology packs — consumers should prefer these. */
export const AGILE_FAMILY_IDS = new Set(AGILE_FAMILY_PACKS.map((p) => p.id));
