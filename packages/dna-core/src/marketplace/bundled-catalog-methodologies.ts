import type { KnowledgePack } from "@superhumaan/dna-config";
import { catalogPack, pack } from "./bundled-catalog-helpers.js";

function methodologyPack(
  id: string,
  name: string,
  desc: string,
  positioning: string,
  hierarchy: string,
  artifacts: string,
  ceremonies: string,
): KnowledgePack {
  return catalogPack(
    `methodologies/${id}`,
    name,
    "methodologies",
    desc,
    [
      { path: `methodologies/${id}/positioning.dna.md`, content: positioning },
      { path: `methodologies/${id}/hierarchy.dna.md`, content: hierarchy },
      { path: `methodologies/${id}/artifacts.dna.md`, content: artifacts },
      { path: `methodologies/${id}/ceremonies.dna.md`, content: ceremonies },
    ],
    ["methodology", id],
  );
}

function companyPack(
  id: string,
  name: string,
  desc: string,
  positioning: string,
  artifacts: string,
): KnowledgePack {
  return catalogPack(
    `companies/${id}`,
    name,
    "methodologies",
    desc,
    [
      { path: `companies/${id}/positioning.dna.md`, content: positioning },
      { path: `companies/${id}/artifacts.dna.md`, content: artifacts },
    ],
    ["company-archetype", id],
  );
}

export const METHODOLOGY_PACKS: KnowledgePack[] = [
  methodologyPack(
    "dna-default",
    "DNA Feature Factory",
    "DNA default delivery — feature request, agent loop, GitHub, Impressions",
    `# DNA Feature Factory

Default DNA delivery model for OSS and small teams.

## Flow
1. User describes goal in plain language
2. \`ai/feature-request.md\` updated automatically
3. Agent loop roles: PA → SA → (approval) → BE → FE → UX → QA → CQ → Refactor → Final
4. Quality gate → docker → github push

## Artifacts
- **Plan:** Solution Architect plan in chat (approval gate)
- **Tickets:** GitHub issues via \`dna github push\` / bug loop
- **Docs:** \`DNA/Impressions/\` updated on architecture changes`,
    `# Hierarchy — DNA Default

\`\`\`
feature → story → task
\`\`\`

| Level | DNA artifact |
|-------|--------------|
| feature | \`ai/feature-request.md\` |
| story | Implementation plan sections |
| task | Commits / PR checklist items |`,
    `# Artifacts — DNA Default

## Feature request
Sections: Problem, Users, Desired behaviour, Edge cases, Success criteria

## Plan
Scope, files, API, security, tests, risks — **no code until approval**

## Close-out
Quality PASS, docker build, github push, manual QA checklist`,
    `# Ceremonies — DNA Default

- **Plan** — Solution Architect produces plan; user approves
- **Implement** — Backend → Frontend → UX
- **Quality gate** — \`dna quality report --feature\`
- **Ship** — docker build + github push`,
  ),
  methodologyPack(
    "scrum",
    "Scrum",
    "Time-boxed sprints, product backlog, story points, Definition of Done",
    `# Scrum

Iterative delivery in fixed-length sprints (typically 2 weeks).

## Roles
- Product Owner — backlog priority, acceptance
- Scrum Master — process, impediments
- Developers — delivery, estimates

## AI rule
Write **user stories** with acceptance criteria. Estimate in story points when team uses them. Respect sprint boundary — flag spillover.`,
    `# Hierarchy — Scrum

\`\`\`
product backlog → sprint backlog → story → subtask
\`\`\`

Optional **epic** groups related stories across sprints.

| Level | Typical fields |
|-------|----------------|
| epic | summary, description, target quarter |
| story | As a / I want / So that, AC, points, sprint |
| subtask | technical steps, assignee, hours |`,
    `# Artifacts — Scrum

## User story template
\`\`\`
As a [persona]
I want [capability]
So that [outcome]

Acceptance criteria:
- [ ] Given … When … Then …

Definition of Done:
- [ ] Code reviewed
- [ ] Tests pass
- [ ] Deployed to staging
\`\`\`

## Sprint goal
One sentence — what the sprint achieves

## Retro notes
Start / Stop / Continue format`,
    `# Ceremonies — Scrum

| Ceremony | Purpose |
|----------|---------|
| Sprint planning | Select backlog → sprint; define sprint goal |
| Daily standup | What did / will do / blockers (15 min) |
| Refinement | Split/clarify upcoming stories; estimate |
| Sprint review | Demo done work to stakeholders |
| Retro | Process improvement |`,
  ),
  methodologyPack(
    "kanban",
    "Kanban",
    "Flow-based delivery, WIP limits, cycle time — no fixed sprints",
    `# Kanban

Optimise flow, not time boxes. Pull work when capacity exists.

## Core practices
- Visualise workflow (columns)
- Limit WIP per column
- Manage flow — measure cycle time and throughput
- Explicit policies per column

## AI rule
No sprint numbers. Focus on **priority order** and **WIP**. Suggest splitting items that exceed WIP policy.`,
    `# Hierarchy — Kanban

\`\`\`
initiative → epic → story → task
\`\`\`

Work flows through columns, e.g.:
\`Backlog → Ready → In Progress → Review → Done\`

| Policy | Example |
|--------|---------|
| WIP limit | Max 3 in In Progress per team |
| Entry criteria | Story has AC before Ready |
| Exit criteria | Tests pass before Done |`,
    `# Artifacts — Kanban

## Card (story)
- Title, description, AC
- Class of service: standard / expedite / fixed-date
- Blocked reason if blocked

## Metrics (reference in tickets)
- Cycle time, throughput, aging WIP`,
    `# Ceremonies — Kanban

| Ceremony | Purpose |
|----------|---------|
| Replenishment | Fill Ready column from backlog |
| Delivery review | Inspect flow metrics, bottlenecks |
| Risk review | Blocked items, dependencies |
| Daily standup | Optional — focus on flow blockers |`,
  ),
  methodologyPack(
    "less",
    "LeSS (Large-Scale Scrum)",
    "Feature teams, system thinking, integration across Scrum teams",
    `# LeSS — Large-Scale Scrum

Scale Scrum with **feature teams** (not component teams) and **one product backlog**.

## Principles
- Whole-product focus each sprint
- Same sprint length across teams
- Integration at least once per sprint

## AI rule
Stories must name **cross-team impacts**. Flag architectural work as system-wide.`,
    `# Hierarchy — LeSS

\`\`\`
product backlog → area backlog → story
\`\`\`

**Initiative/epic** spans teams. One PO (or PO team) owns product backlog.

| Level | Notes |
|-------|-------|
| epic | May require multiple feature teams |
| story | Completable by one feature team in one sprint |
| task | Internal to team |`,
    `# Artifacts — LeSS

## Multi-team story
- Teams involved
- Integration approach
- System demo criteria

## Overall PBR
Product Backlog Refinement across teams — outcome per epic`,
    `# Ceremonies — LeSS

| Ceremony | Purpose |
|----------|---------|
| Overall retro | Cross-team improvement |
| Multi-team PBR | Refine epics spanning teams |
| System demo | Integrated increment demo |
| Scrum of Scrums | Coordination (lightweight) |`,
  ),
  methodologyPack(
    "safe",
    "SAFe",
    "Scaled Agile — PI planning, ARTs, enablers, program increments",
    `# SAFe

Enterprise scaling: **Agile Release Trains (ARTs)**, **Program Increments (PIs)**.

## Work types
- **Features** — user-facing, WSJF prioritised
- **Enablers** — architecture, infrastructure, exploration
- **Bugs** — production defects

## AI rule
Tag work as feature/enabler/bug. Reference **PI objective** when known. Use WSJF language if team uses it.`,
    `# Hierarchy — SAFe

\`\`\`
theme → epic → feature → story → task
\`\`\`

| Level | SAFe term |
|-------|-----------|
| theme | Strategic theme (horizon) |
| epic | Portfolio epic or ART epic |
| feature | Deliverable in PI |
| story | Team backlog item |`,
    `# Artifacts — SAFe

## Feature
- Benefit hypothesis
- Acceptance criteria
- Non-functional requirements
- ART / PI assignment

## Enabler
- Exploration / architecture / infrastructure subtype
- Expected learning outcome

## PI objective
Business + technical objectives for the increment`,
    `# Ceremonies — SAFe

| Ceremony | Purpose |
|----------|---------|
| PI planning | 2-day planning event per PI |
| Scrum of Scrums | ART sync |
| System demo | Integrated solution demo |
| Inspect & adapt | PI retrospective |`,
  ),
  methodologyPack(
    "spotify-model",
    "Spotify Model",
    "Squads, tribes, chapters, guilds — autonomous teams with alignment",
    `# Spotify Model

Organisation pattern (not a formal framework). Common at scale-ups and travel tech.

## Structure
- **Squad** — autonomous mini-team (6–12), owns a mission
- **Tribe** — collection of squads in related area
- **Chapter** — functional excellence (e.g. all backend engineers)
- **Guild** — community of interest across tribes

## AI rule
Label work with **tribe** and **squad**. Squads own end-to-end delivery. Avoid centralised handoffs.`,
    `# Hierarchy — Spotify / Tribes

\`\`\`
initiative → epic → story
\`\`\`

| Level | Typical owner |
|-------|---------------|
| initiative | Tribe leadership / product area |
| epic | Squad or cross-squad |
| story | Squad |

Common in travel/booking companies (e.g. Agoda-like orgs).`,
    `# Artifacts — Spotify Model

## Epic
- Tribe, squad(s)
- Mission alignment
- Success metrics (conversion, latency, etc.)

## Story
- Squad owner
- Chapter review if cross-cutting (e.g. security chapter)

## Tribe sync doc
Quarterly priorities, dependencies between squads`,
    `# Ceremonies — Spotify Model

| Ceremony | Purpose |
|----------|---------|
| Tribe sync | Align squads within tribe |
| Squad demo | Show squad increment |
| Chapter sync | Functional standards, hiring, craft |
| Guild meetup | Optional knowledge sharing |`,
  ),
  methodologyPack(
    "shape-up",
    "Shape Up",
    "Appetite-driven bets, pitches, no backlog grooming — Basecamp pattern",
    `# Shape Up

6-week **cycles**: 2-week cool-down + two 3-week **bets**.

## Concepts
- **Appetite** — how much time willing to spend (not estimates)
- **Pitch** — shaped solution with breadboard and fat-marker sketches
- **Bet** — committed pitch for a cycle
- **Scope** — must-haves vs nice-to-haves within appetite

## AI rule
No infinite backlog. Output **pitches** not user stories. State appetite explicitly. Identify **rabbit holes** and **no-gos**.`,
    `# Hierarchy — Shape Up

\`\`\`
bet → scope → task
\`\`\`

| Level | Shape Up term |
|-------|---------------|
| bet | Committed pitch for cycle |
| scope | Must-have slices within bet |
| task | Build tasks during cycle |

No epics or sprints — cycles and bets instead.`,
    `# Artifacts — Shape Up

## Pitch template
- **Problem** — raw idea, use cases
- **Appetite** — e.g. "6 weeks", "small batch"
- **Solution** — breadboard, key flows
- **Rabbit holes** — risks to avoid
- **No-gos** — explicitly out of scope

## Cool-down
Bug fixes, small improvements, exploration — not new bets`,
    `# Ceremonies — Shape Up

| Ceremony | Purpose |
|----------|---------|
| Shaping | Senior designers/engineers define pitches |
| Betting table | Leadership picks bets for next cycle |
| Cool-down | Pay down debt, relax between cycles |`,
  ),
  pack(
    "methodologies/ticket-writing",
    "Ticket Writing",
    "methodologies",
    "Cross-methodology ticket templates for Jira, Linear, GitHub, Azure DevOps",
    [
      {
        path: "methodologies/ticket-writing/positioning.dna.md",
        content: `# Ticket Writing

DNA loads methodology + ticket system before writing work items.

## Rule
**Never default to GitHub issues** unless \`delivery.ticketSystem\` is \`github\`.

Read \`delivery.behaviour.md\` and custom profile for field overrides.`,
      },
      {
        path: "methodologies/ticket-writing/ticket-templates.dna.md",
        content: `# Ticket Templates by System

## Jira
\`\`\`
Summary: [verb] [object] — [outcome]
Issue type: Story | Bug | Epic | Spike
Description:
  ## Context
  ## Acceptance criteria
  ## Technical notes
Labels: tribe-*, squad-*
Components: [service name]
Story points: [if scrum]
Sprint: [if scrum]
\`\`\`

## Linear
\`\`\`
Title: concise imperative
Description: markdown with AC checklist
Priority: urgent | high | medium | low
Labels: [team labels]
Project: [cycle or team]
Estimate: [points if used]
\`\`\`

## GitHub Issues
\`\`\`
Title: feat|fix|docs: summary
Body: ## Problem / ## Solution / ## Acceptance criteria
Labels: enhancement | bug
Milestone: [if used]
\`\`\`

## Azure DevOps
\`\`\`
Work item type: User Story | Bug | Feature
Title, Description, Acceptance Criteria field
Area Path, Iteration Path
Story Points
\`\`\``,
      },
    ],
  ),
  pack(
    "methodologies/document-writing",
    "Document Writing",
    "methodologies",
    "Cross-methodology spec and design doc templates",
    [
      {
        path: "methodologies/document-writing/positioning.dna.md",
        content: `# Document Writing

Specs and design docs must match \`delivery.docSystem\` and methodology.

## Systems
- **impressions** — \`DNA/Impressions/\` markdown (DNA default)
- **confluence** — page hierarchy, macros, labels
- **notion** — database properties, linked pages
- **google-docs** — comment-based review, suggesting mode`,
      },
      {
        path: "methodologies/document-writing/document-templates.dna.md",
        content: `# Document Templates

## PRD (product)
1. Problem & context
2. Goals & non-goals
3. Users & personas
4. Requirements (MoSCoW)
5. Success metrics
6. Risks & dependencies
7. Open questions

## Design doc (engineering)
1. Summary (1 paragraph)
2. Background
3. Goals / Non-goals
4. Proposed design
5. Alternatives considered
6. Security & privacy
7. Rollout plan
8. Test plan

## RFC (cross-team)
1. Motivation
2. Detailed design
3. Drawbacks
4. Unresolved questions

## ADR (architecture decision)
1. Status, Context, Decision, Consequences

## Shape Up pitch
See \`methodologies/shape-up/artifacts.dna.md\`

## Scrum epic brief
Problem, outcome, stories list, success metrics, target PI/sprint`,
      },
    ],
  ),
  companyPack(
    "travel-scale-up",
    "Travel Scale-up",
    "Tribe/squad orgs, quarterly initiatives, Jira-heavy delivery",
    `# Travel Scale-up Archetype

Patterns common in large travel/booking companies (Agoda-like).

## Org
- Tribes aligned to customer journey (search, booking, payments, post-booking)
- Squads own vertical slices
- Heavy Jira usage, quarterly planning

## AI tone
Business metrics matter: conversion, look-to-book, payment success rate.`,
    `# Artifacts — Travel Scale-up

## Initiative
- Tribe, quarter, OKR link
- Revenue/conversion impact estimate

## Epic
- Squad owner(s)
- A/B experiment plan if applicable
- Rollout: dark launch → % traffic → full

## Labels
\`tribe-*\`, \`squad-*\`, \`experiment\`, \`tech-debt\``,
  ),
  companyPack(
    "big-tech",
    "Big Tech",
    "OKR-driven planning, design docs, launch reviews",
    `# Big Tech Archetype

Patterns common at Google-scale engineering orgs.

## Planning
- OKRs cascade: company → org → team
- Design docs reviewed before large builds
- Launch reviews for user-facing changes

## AI tone
Emphasise scalability, privacy review, experimentation, rollback plans.`,
    `# Artifacts — Big Tech

## Design doc
Required for cross-team or high-risk changes. Reviewers assigned explicitly.

## OKR
Objective + 3–5 key results with measurable targets

## Launch checklist
Privacy, security, SRE, localization, accessibility`,
  ),
  companyPack(
    "research-lab",
    "Research Lab",
    "Fast iteration, eval-driven, lightweight specs",
    `# Research Lab Archetype

Patterns common at AI research companies (OpenAI-like).

## Delivery
- Short specs, fast iteration
- Eval-driven: define success metrics before build
- Experiment IDs track model/prompt versions

## AI tone
Precise about evals, safety constraints, and reproducibility.`,
    `# Artifacts — Research Lab

## Spec (lightweight)
- Hypothesis
- Eval plan
- Safety constraints
- Rollback / kill criteria

## Experiment ticket
- Experiment ID
- Model/version
- Metrics dashboard link`,
  ),
  companyPack(
    "agency",
    "Agency",
    "Client SOW deliverables, time tracking, client-facing specs",
    `# Agency Archetype

## Delivery
- SOW → milestones → deliverables
- Client approval gates
- Time tracking (Harvest, etc.)

## AI tone
Client-readable language in external docs. Internal tickets can be technical.`,
    `# Artifacts — Agency

## SOW milestone
- Deliverable description
- Acceptance sign-off
- Hours budget

## Client spec
Non-technical summary + appendix for engineering detail`,
  ),
  companyPack(
    "startup",
    "Startup",
    "Small team, minimal ceremony, ship fast",
    `# Startup Archetype

## Delivery
- Minimal hierarchy: issue → PR
- Docs in Notion or GitHub wiki
- Ship daily, retro weekly optional

## AI tone
Bias to action. Short tickets. Skip ceremony unless user asks.`,
    `# Artifacts — Startup

## Issue
Title + 3 bullet AC max

## Weekly note
Shipped / Learning / Next`,
  ),
];
