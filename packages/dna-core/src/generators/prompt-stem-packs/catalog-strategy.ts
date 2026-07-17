import type { PromptStemPackDef } from "./types.js";

const STRATEGY_GROUND = {
  must: [
    "Load `.DNA/neuralNetwork.json`, Impressions product/strategy artifacts, and CellularMemory before drafting",
    "Write durable outputs to `DNA/Impressions/` (and CellularMemory when decisions are made) — not chat-only",
    "Stay at the intended altitude of the stem — do not jump to code or Solution Architect implementation",
    "Hand off downstream via workflow stems; end strategy outputs with explicit next stem",
  ],
  never: [
    "Invent market facts, competitor claims, or metrics without labeling them as assumptions",
    "Skip Why (purpose) when running golden-circle or strategy-ladder from scratch",
    "Treat DNA's own docs/product/product-canvas.md as the host project's canvas — build for THIS project",
    "Start the 9-role agent loop or edit product code from a strategy stem",
  ],
  should: [
    "Reuse existing Impressions content; revise rather than duplicate",
    "Flag open questions and validation needs for discovery stems",
    "Keep Now / Next / Later mutually exclusive and outcome-oriented",
  ],
};

export const STRATEGY_STEM_DEFS: PromptStemPackDef[] = [
  {
    id: "strategy-ladder",
    name: "Strategy ladder",
    category: "strategy",
    slash: "strategy-ladder",
    summary:
      "Run the full strategy → canvas → goals (North Star/OKRs/KPIs) → initiative → product → feature → Now-Next-Later ladder.",
    tags: ["strategy", "orchestration", "roadmap", "product", "okrs", "kpis"],
    copyVariants: [
      "Run the strategy ladder for this product",
      "From golden circle through roadmap — do it all",
      "Shape vision down to OKRs, KPIs, and Now / Next / Later",
    ],
    prompt: `# Strategy ladder

Walk purpose → strategy → goals/metrics → product → initiatives → features → roadmap for this project.

Scope: $ARGUMENTS

## Altitude order (do not skip upward without cause)

1. **Golden Circle** — Why / How / What
2. **Business strategy canvas** — pillars, positioning, bets
3. **Product canvas** — users, problems, value, metrics
4. **North Star metric** — single primary product success signal
5. **Define OKRs** — Objectives + Key Results for the period
6. **Define KPIs** — health / operational metrics (distinct from OKRs)
7. **Goal cascade** — company → team → initiative alignment
8. **Define initiative** — outcome-shaped bets
9. **Define product** — scope, ICP, non-goals
10. **Shape feature** — brief ready for feature factory
11. **Roadmap Now / Next / Later** — horizon plan

## Run

\`\`\`bash
npx dna context cursor
\`\`\`

Load Impressions under \`DNA/Impressions/product/\` and any strategy notes. Reuse what exists; fill gaps only.

## Output

For each rung: short filled artifact path + 3–7 bullets. End with:

- Recommended next stem if the user wants to go deeper on one rung
- Open assumptions needing discovery
- Reminder: engineering starts only after \`shape-feature\` → \`plan-feature\` / agent-loop with approval`,
    guidelines: STRATEGY_GROUND,
    expectations: [
      "All rungs addressed or explicitly deferred with reason",
      "Artifact paths written or proposed under DNA/Impressions/",
      "Next stem + discovery gaps listed",
    ],
    contextLoads: [
      "DNA/Impressions/",
      ".DNA/CellularMemory/prefrontalCortex/current-plan.md",
      ".DNA/neuralNetwork.json",
    ],
    cliCommands: ["npx dna context cursor", "npx dna stems show strategy-ladder"],
    examples: [
      {
        userSays: "We're a new B2B SaaS — run the strategy ladder",
        goodResponse:
          "Filled Why/How/What, canvases, North Star, Q3 OKRs, KPI set, 2 initiatives, roadmap. Wrote DNA/Impressions/product/strategy-ladder.md. Next: discovery-setup for unvalidated assumptions.",
      },
    ],
    workflow: [
      "golden-circle",
      "business-strategy-canvas",
      "product-canvas",
      "north-star-metric",
      "define-okrs",
      "define-kpis",
      "goal-cascade",
      "define-initiative",
      "define-product",
      "shape-feature",
      "roadmap-now-next-later",
    ],
  },
  {
    id: "golden-circle",
    name: "Golden Circle",
    category: "strategy",
    slash: "golden-circle",
    summary: "Clarify Why, How, and What for the product or company (Simon Sinek).",
    tags: ["strategy", "purpose", "positioning", "vision"],
    copyVariants: [
      "Run the golden circle for this product",
      "What's our Why / How / What?",
      "Clarify purpose before we roadmap",
    ],
    prompt: `# Golden Circle

Define purpose (Why), approach (How), and offering (What) for this project.

Context: $ARGUMENTS

## Framework

| Ring | Question | Output |
|------|----------|--------|
| **Why** | Belief / cause — why does this exist? | One sentence people can repeat |
| **How** | Differentiated actions / principles | 3–5 principles |
| **What** | Products, services, proofs | Concrete offerings today |

## Rules

- Why is belief, not a feature list
- How must be actionable and distinctive
- What must match reality of the codebase / Impressions — no vapor

## Persist

Write or update \`DNA/Impressions/product/golden-circle.md\`.

## Output

1. Why / How / What tables
2. One-line brand test: does the Why survive without naming the product?
3. Gaps → feed business-strategy-canvas or discovery
4. Next stem: \`business-strategy-canvas\` or \`strategy-ladder\``,
    guidelines: STRATEGY_GROUND,
    expectations: [
      "Why, How, What all filled",
      "Artifact path DNA/Impressions/product/golden-circle.md",
      "Next stem recommended",
    ],
    contextLoads: [
      "DNA/Impressions/product/",
      "DNA/Impressions/product/golden-circle.md",
      ".DNA/neuralNetwork.json",
    ],
    cliCommands: ["npx dna context cursor"],
    examples: [
      {
        userSays: "Golden circle for our clinic OS",
        goodResponse:
          "Why: clinicians deserve calm systems. How: proportionate compliance + local workflows. What: scheduling + notes. Wrote golden-circle.md.",
      },
    ],
    workflow: ["business-strategy-canvas", "product-canvas"],
  },
  {
    id: "business-strategy-canvas",
    name: "Business strategy canvas",
    category: "strategy",
    slash: "business-strategy-canvas",
    summary: "Map vision, pillars, positioning, bets, and success metrics for the business.",
    tags: ["strategy", "canvas", "positioning", "gtm"],
    copyVariants: [
      "Fill the business strategy canvas",
      "What are our strategic pillars and bets?",
      "Positioning and go-to-market canvas",
    ],
    prompt: `# Business strategy canvas

Map how this business wins — grounded in Golden Circle when present.

Context: $ARGUMENTS

## Canvas sections

1. **Vision** — future state (1–2 sentences)
2. **Strategic pillars** — 3–5 non-overlapping bets
3. **Positioning** — vs alternatives / do-nothing (table)
4. **Customer & segments** — who pays / who uses
5. **GTM channels** — how they find you
6. **Moats & risks** — durable advantage + existential risks
7. **Success metrics** — leading + lagging (measurable)
8. **Open assumptions** — what discovery must validate

## Persist

Write \`DNA/Impressions/product/business-strategy-canvas.md\`. Update CellularMemory decisions if pillars change.

## Output

Filled canvas + assumption list + next stem (\`product-canvas\` or \`define-initiative\`).`,
    guidelines: STRATEGY_GROUND,
    expectations: [
      "All eight sections present",
      "Assumptions labeled",
      "Artifact under DNA/Impressions/product/",
    ],
    contextLoads: [
      "DNA/Impressions/product/golden-circle.md",
      "DNA/Impressions/product/business-strategy-canvas.md",
      ".DNA/CellularMemory/prefrontalCortex/decisions.md",
    ],
    cliCommands: ["npx dna context cursor"],
    examples: [
      {
        userSays: "Strategy canvas for open-source CLI + SaaS site",
        goodResponse:
          "Pillars: open default, marketplace scale, runtime observe. GTM: npm + docs. Risks: context quality. Wrote business-strategy-canvas.md.",
      },
    ],
    workflow: ["product-canvas", "north-star-metric", "define-initiative"],
  },
  {
    id: "product-canvas",
    name: "Product canvas",
    category: "strategy",
    slash: "product-canvas",
    summary: "Map users, problems, value proposition, channels, and metrics for the product.",
    tags: ["strategy", "product", "canvas", "metrics"],
    copyVariants: [
      "Fill the product canvas",
      "Map users, problems, and metrics",
      "Product canvas for this app",
    ],
    prompt: `# Product canvas

High-level product map for THIS host project (not DNA's internal docs canvas).

Context: $ARGUMENTS

## Canvas sections

| Section | Fill |
|---------|------|
| **Product name / one-liner** | |
| **Target users / personas** | |
| **Problems / jobs-to-be-done** | |
| **Value proposition** | |
| **Key features (now)** | Top 5 shipped or shipping |
| **Channels** | How users arrive |
| **Success metrics** | Activation, retention, or domain KPIs |
| **Constraints** | Compliance, stack, team capacity |
| **Non-goals** | Explicit out-of-scope |

## Persist

Write \`DNA/Impressions/product/product-canvas.md\`. Cross-link golden-circle and business-strategy-canvas if present.

## Output

Completed canvas + 3 risks + next stem (\`define-initiative\` or \`roadmap-now-next-later\`).`,
    guidelines: STRATEGY_GROUND,
    expectations: [
      "All canvas sections filled",
      "Non-goals stated",
      "Artifact DNA/Impressions/product/product-canvas.md",
    ],
    contextLoads: [
      "DNA/Impressions/product/product-canvas.md",
      "DNA/Impressions/product/golden-circle.md",
      ".DNA/neuralNetwork.json",
    ],
    cliCommands: ["npx dna context cursor", "npx dna analyze"],
    examples: [
      {
        userSays: "Product canvas for our ops console",
        goodResponse:
          "Users: ops leads. JTBD: see blockers before Friday. Metrics: time-to-unblock. Wrote product-canvas.md. Next: define-initiative.",
      },
    ],
    workflow: ["north-star-metric", "define-okrs", "define-initiative", "roadmap-now-next-later"],
  },
  {
    id: "define-initiative",
    name: "Define initiative",
    category: "strategy",
    slash: "define-initiative",
    summary: "Define an outcome-shaped initiative with bets, metrics, and child products/features.",
    tags: ["strategy", "initiative", "outcomes", "roadmap"],
    copyVariants: [
      "Define an initiative for reducing onboarding drop-off",
      "Turn this bet into an initiative",
      "Shape initiatives from the strategy canvas",
    ],
    prompt: `# Define initiative

Create or refine an outcome-shaped initiative (larger than a feature, smaller than company strategy).

Initiative ask: $ARGUMENTS

## Template

- **Name**
- **Outcome** — measurable change in user/business state
- **Why now** — link to strategy pillars / golden-circle Why
- **Bets** — 1–3 approaches to try
- **Success metrics** — target + measurement window
- **In scope / out of scope**
- **Child work** — products or features this unlocks (names only)
- **Risks & assumptions**
- **Horizon** — Now / Next / Later (suggested)

## Persist

Append or update \`DNA/Impressions/product/initiatives.md\` (one section per initiative).

## Output

Filled initiative + suggested Next stem: \`define-product\` or \`shape-feature\` or \`roadmap-now-next-later\`.`,
    guidelines: STRATEGY_GROUND,
    expectations: [
      "Outcome and metrics defined",
      "Horizon suggestion present",
      "initiatives.md updated or proposed",
    ],
    contextLoads: [
      "DNA/Impressions/product/initiatives.md",
      "DNA/Impressions/product/business-strategy-canvas.md",
      "DNA/Impressions/product/product-canvas.md",
    ],
    cliCommands: ["npx dna context cursor"],
    examples: [
      {
        userSays: "Initiative: cut time-to-first-value for new teams",
        goodResponse:
          "Outcome: median TTFV < 30m. Bets: guided init, sample stacks. Horizon: Now. Logged in initiatives.md.",
      },
    ],
    workflow: ["define-product", "shape-feature", "roadmap-now-next-later"],
  },
  {
    id: "define-product",
    name: "Define product",
    category: "strategy",
    slash: "define-product",
    summary: "Define product scope, ICP, surfaces, and non-goals before feature work.",
    tags: ["strategy", "product", "scope", "icp"],
    copyVariants: [
      "Define the product scope and ICP",
      "What is this product — and what is it not?",
      "Product definition for the new admin console",
    ],
    prompt: `# Define product

Lock product identity and scope before feature factory work.

Product: $ARGUMENTS

## Template

- **Name & one-liner**
- **ICP** — ideal customer / user
- **Primary jobs** — top 3
- **Surfaces** — web, API, CLI, admin, etc.
- **Integrations** — must-have vs later
- **Compliance / legal posture** — if regulated, flag plan-legal / plan-compliance
- **Non-goals**
- **Parent initiative** — link to initiatives.md
- **MVP boundary** — smallest lovable slice

## Persist

Write \`DNA/Impressions/product/product-definition.md\` (or per-product file under Impressions).

## Output

Definition + MVP boundary + next stem (\`shape-feature\` or \`roadmap-now-next-later\`).`,
    guidelines: STRATEGY_GROUND,
    expectations: [
      "ICP and non-goals clear",
      "MVP boundary stated",
      "Artifact path given",
    ],
    contextLoads: [
      "DNA/Impressions/product/product-definition.md",
      "DNA/Impressions/product/product-canvas.md",
      "DNA/Impressions/product/initiatives.md",
    ],
    cliCommands: ["npx dna context cursor", "npx dna discovery show"],
    examples: [
      {
        userSays: "Define product for provider phone transcription",
        goodResponse:
          "ICP: clinic providers. Surfaces: mobile + notes API. Non-goals: full EHR. MVP: record → transcript → note draft. Wrote product-definition.md.",
      },
    ],
    workflow: ["shape-feature", "roadmap-now-next-later", "discovery-setup"],
  },
  {
    id: "shape-feature",
    name: "Shape feature",
    category: "strategy",
    slash: "shape-feature",
    summary: "Shape a feature brief from strategy — then hand off to plan-feature / agent loop.",
    tags: ["strategy", "feature", "brief", "feature-factory"],
    copyVariants: [
      "Shape a feature brief for call transcription",
      "Turn this initiative into a feature request",
      "Write the feature brief before we plan",
    ],
    prompt: `# Shape feature

Produce a feature brief ready for DNA feature factory — **no code, no architect plan yet**.

Feature: $ARGUMENTS

## Brief sections

- **Problem** — user pain with evidence or labeled assumption
- **Users** — who benefits
- **Desired behaviour**
- **Success criteria** — testable
- **Parent initiative / product**
- **Scope** — in / out
- **Dependencies** — auth, data, compliance
- **Open questions**

## Persist

Update \`ai/feature-request.md\` (all sections). Optionally add a row to product feature map Impressions.

## Hand-off (mandatory)

1. Next stem: \`plan-feature\` or \`agent-loop-full\` / \`role-product-analyst\`
2. **Stop** — Solution Architect plan requires **user approval** before any code
3. Do not implement from this stem

## Output

Filled brief + confirmation that feature-request.md was updated.`,
    guidelines: {
      must: [
        ...STRATEGY_GROUND.must,
        "Update ai/feature-request.md before suggesting plan-feature",
        "State the approval gate — no code from this stem",
      ],
      never: [
        ...STRATEGY_GROUND.never,
        "Write Solution Architect implementation plans here — that is plan-feature / role-solution-architect",
        "Skip success criteria",
      ],
      should: STRATEGY_GROUND.should,
    },
    expectations: [
      "ai/feature-request.md updated",
      "Success criteria testable",
      "Approval gate stated for engineering",
    ],
    contextLoads: [
      "ai/feature-request.md",
      "DNA/Impressions/product/initiatives.md",
      "DNA/Impressions/product/product-definition.md",
    ],
    cliCommands: ["npx dna context cursor", "npx dna plan feature"],
    examples: [
      {
        userSays: "Shape feature: export roadmap as CSV",
        goodResponse:
          "Updated feature-request.md — problem, users, success criteria. Next: plan-feature; wait for approval before code.",
      },
    ],
    workflow: ["plan-feature", "role-product-analyst", "agent-loop-full"],
  },
  {
    id: "roadmap-now-next-later",
    name: "Roadmap Now / Next / Later",
    category: "strategy",
    slash: "roadmap-now-next-later",
    summary: "Build an outcome roadmap across Now, Next, and Later horizons.",
    tags: ["strategy", "roadmap", "now-next-later", "planning"],
    copyVariants: [
      "Build a Now / Next / Later roadmap",
      "Roadmap our initiatives and features",
      "What should we ship now vs later?",
    ],
    prompt: `# Roadmap — Now / Next / Later

Place initiatives and features on a three-horizon roadmap.

Context: $ARGUMENTS

## Horizons

| Horizon | Meaning | Rule |
|---------|---------|------|
| **Now** | Committed / in flight | Capacity-realistic; outcome + owner |
| **Next** | Queued after Now | Clear trigger to pull forward |
| **Later** | Intentional parking | Not a junk drawer — link to strategy |

## Rules

- Items are **outcomes or features**, not vague themes without a why
- Every Now item links to an initiative or product definition
- Later items must still connect to pillars — drop or park with reason
- Call out dependencies and sequencing

## Persist

Write \`DNA/Impressions/product/roadmap.md\` (Now / Next / Later tables). Sync decisions to CellularMemory when the roadmap commits strategy.

## Output

1. Three tables (item · outcome · parent initiative · notes)
2. Capacity / sequencing risks
3. Suggested discovery or \`shape-feature\` for under-specified Now items
4. Next stems: \`shape-feature\`, \`prioritize-opportunities\`, or \`align-delivery\``,
    guidelines: STRATEGY_GROUND,
    expectations: [
      "Now, Next, Later all populated or explicitly empty with reason",
      "roadmap.md path stated",
      "No orphan Now items without initiative/product link",
    ],
    contextLoads: [
      "DNA/Impressions/product/roadmap.md",
      "DNA/Impressions/product/initiatives.md",
      "DNA/Impressions/product/product-canvas.md",
      ".DNA/CellularMemory/prefrontalCortex/current-plan.md",
    ],
    cliCommands: ["npx dna context cursor"],
    examples: [
      {
        userSays: "Now next later for Q3",
        goodResponse:
          "Now: onboarding TTFV. Next: admin audit log. Later: marketplace themes. Wrote roadmap.md. Shape-feature for audit log.",
      },
    ],
    workflow: ["shape-feature", "prioritize-opportunities", "align-delivery", "define-okrs"],
  },
  {
    id: "north-star-metric",
    name: "North Star metric",
    category: "strategy",
    slash: "north-star-metric",
    summary: "Choose one primary product success metric and the supporting input metrics.",
    tags: ["strategy", "metrics", "north-star", "kpi"],
    copyVariants: [
      "What's our North Star metric?",
      "Pick a North Star for this product",
      "Define North Star and input metrics",
    ],
    prompt: `# North Star metric

Pick the single metric that best represents delivered customer value for THIS product.

Context: $ARGUMENTS

## Framework

| Piece | Rules |
|-------|-------|
| **North Star** | One metric; reflects value delivered, not vanity |
| **Why this one** | Tie to Golden Circle Why + product canvas value prop |
| **Input metrics** | 2–5 leading indicators that move the North Star |
| **Counter-metrics** | What we will not sacrifice (quality, margin, trust) |
| **Baseline / target** | Current + period target — label unknowns |
| **Owners & cadence** | Who reviews weekly/monthly |

## Persist

Write \`DNA/Impressions/product/north-star.md\`.

## Output

North Star definition + inputs + counter-metrics + next stem (\`define-okrs\` or \`define-kpis\`).`,
    guidelines: STRATEGY_GROUND,
    expectations: [
      "Exactly one North Star named",
      "Input + counter metrics listed",
      "Artifact DNA/Impressions/product/north-star.md",
    ],
    contextLoads: [
      "DNA/Impressions/product/north-star.md",
      "DNA/Impressions/product/product-canvas.md",
      "DNA/Impressions/product/golden-circle.md",
    ],
    cliCommands: ["npx dna context cursor"],
    examples: [
      {
        userSays: "North Star for our clinic OS",
        goodResponse:
          "North Star: weekly active providers completing a note. Inputs: TTFV, note completion rate. Counter: documentation quality score. Wrote north-star.md.",
      },
    ],
    workflow: ["define-okrs", "define-kpis", "goal-cascade"],
  },
  {
    id: "define-okrs",
    name: "Define OKRs",
    category: "strategy",
    slash: "define-okrs",
    summary: "Write Objectives and Key Results for a period — outcomes, not task lists.",
    tags: ["strategy", "okrs", "goals", "objectives"],
    copyVariants: [
      "Write OKRs for this quarter",
      "Define company and product OKRs",
      "Turn our strategy into OKRs",
    ],
    prompt: `# Define OKRs

Create Objectives and Key Results for the stated period. OKRs are **outcomes**; leave tasks for roadmap/features.

Period / scope: $ARGUMENTS

## Rules

- **Objective** — qualitative, inspiring, time-bound (usually 1–3 per level)
- **Key Results** — 2–4 per Objective; quantitative; verifiable; not a to-do list
- Stretch but not fantasy; label confidence
- Align to North Star, strategy pillars, and initiatives
- Explicitly separate from KPIs (health metrics live in \`define-kpis\`)

## Template (repeat per Objective)

\`\`\`
### O#: <objective>
Why: <link to pillar / North Star>
KR1: <metric> from <baseline> → <target> by <date>
KR2: …
Owner: <role>
Initiatives that feed this: <names>
\`\`\`

## Levels

Fill what applies: Company → Product/Squad → optional Team. Use \`goal-cascade\` for full alignment map.

## Persist

Write \`DNA/Impressions/product/okrs.md\` (include period in H1).

## Output

OKR set + confidence notes + next stem (\`define-kpis\`, \`goal-cascade\`, or \`roadmap-now-next-later\`).`,
    guidelines: {
      must: [
        ...STRATEGY_GROUND.must,
        "Key Results must be measurable — reject task-shaped KRs (\"launch X\", \"ship Y\") unless framed as outcome metrics",
      ],
      never: [
        ...STRATEGY_GROUND.never,
        "Confuse OKRs with KPI dashboards — link to define-kpis for health metrics",
        "Invent baselines; mark unknown baselines as TBD assumptions",
      ],
      should: STRATEGY_GROUND.should,
    },
    expectations: [
      "At least one Objective with 2+ Key Results",
      "Period stated",
      "Artifact DNA/Impressions/product/okrs.md",
    ],
    contextLoads: [
      "DNA/Impressions/product/okrs.md",
      "DNA/Impressions/product/north-star.md",
      "DNA/Impressions/product/business-strategy-canvas.md",
      "DNA/Impressions/product/initiatives.md",
    ],
    cliCommands: ["npx dna context cursor"],
    examples: [
      {
        userSays: "Q3 OKRs for onboarding initiative",
        goodResponse:
          "O1: New teams reach value fast. KR1: median TTFV 45m→30m. KR2: week-1 retention 40%→55%. Wrote okrs.md. Next: define-kpis for funnel health.",
      },
    ],
    workflow: ["define-kpis", "goal-cascade", "roadmap-now-next-later", "define-initiative"],
  },
  {
    id: "define-kpis",
    name: "Define KPIs",
    category: "strategy",
    slash: "define-kpis",
    summary: "Define operational and health KPIs with owners, thresholds, and review cadence.",
    tags: ["strategy", "kpi", "metrics", "scorecard"],
    copyVariants: [
      "Define our product KPIs",
      "Build a KPI scorecard",
      "What health metrics should we watch weekly?",
    ],
    prompt: `# Define KPIs

Define **health / operational** metrics the team reviews continuously. KPIs are not OKRs — they monitor the business; OKRs drive change for a period.

Scope: $ARGUMENTS

## For each KPI

| Field | Content |
|-------|---------|
| **Name** | |
| **Definition** | Formula / event definition |
| **Type** | Leading / lagging |
| **Baseline** | Current or TBD |
| **Target / thresholds** | Green / amber / red |
| **Cadence** | Daily / weekly / monthly |
| **Owner** | Role |
| **Source** | Analytics, SQL, tool |
| **Related OKR / North Star** | Optional link |

## Suggested buckets

Acquisition · Activation · Engagement · Retention · Revenue · Reliability/Quality · Compliance (if regulated)

Prefer 8–15 KPIs at product level — not a metrics landfill.

## Persist

Write \`DNA/Impressions/product/kpis.md\`.

## Output

KPI table + what we deliberately omit + next stem (\`goal-cascade\` or \`north-star-metric\` if missing).`,
    guidelines: {
      must: [
        ...STRATEGY_GROUND.must,
        "State definition/formula for every KPI — no vague labels like \"engagement\"",
      ],
      never: [
        ...STRATEGY_GROUND.never,
        "Replace OKRs with a KPI list — keep period outcomes in okrs.md",
        "Propose dozens of vanity metrics without pruning",
      ],
      should: STRATEGY_GROUND.should,
    },
    expectations: [
      "KPI table with definition, owner, cadence",
      "Thresholds or targets present or TBD-labeled",
      "Artifact DNA/Impressions/product/kpis.md",
    ],
    contextLoads: [
      "DNA/Impressions/product/kpis.md",
      "DNA/Impressions/product/north-star.md",
      "DNA/Impressions/product/okrs.md",
      "DNA/Impressions/product/product-canvas.md",
    ],
    cliCommands: ["npx dna context cursor"],
    examples: [
      {
        userSays: "KPIs for the ops console",
        goodResponse:
          "12 KPIs across activation, reliability, support. Red if p95 load >2s. Wrote kpis.md linked to North Star.",
      },
    ],
    workflow: ["goal-cascade", "north-star-metric", "define-okrs"],
  },
  {
    id: "goal-cascade",
    name: "Goal cascade",
    category: "strategy",
    slash: "goal-cascade",
    summary: "Align company → product → team goals so OKRs, KPIs, and initiatives connect.",
    tags: ["strategy", "okrs", "alignment", "cascade"],
    copyVariants: [
      "Cascade goals from company to teams",
      "Are our OKRs and initiatives aligned?",
      "Build a goal cascade map",
    ],
    prompt: `# Goal cascade

Map how purpose and strategy flow into measurable goals and work — find misalignment gaps.

Context: $ARGUMENTS

## Cascade map

\`\`\`
Why (Golden Circle)
  → Strategic pillars
    → North Star
      → Company OKRs
        → Product / squad OKRs
          → Initiatives (Now/Next/Later)
            → Features (shape-feature)
      → KPIs (health — continuous)
\`\`\`

## Checklist

- [ ] Every Company KR has at least one child OKR or initiative
- [ ] Every Now roadmap item ties to an OKR or explicit KPI improvement
- [ ] Orphan goals / orphan work called out
- [ ] Conflicting targets flagged

## Persist

Write \`DNA/Impressions/product/goal-cascade.md\`.

## Output

1. Cascade diagram or table (parent → child → metric)
2. Gaps and conflicts
3. Recommended fixes (new OKR, kill orphan feature, move Later → Now)
4. Next stems: \`define-okrs\`, \`roadmap-now-next-later\`, or \`shape-feature\``,
    guidelines: STRATEGY_GROUND,
    expectations: [
      "Cascade links purpose → OKRs → work",
      "Orphans and conflicts listed",
      "Artifact DNA/Impressions/product/goal-cascade.md",
    ],
    contextLoads: [
      "DNA/Impressions/product/goal-cascade.md",
      "DNA/Impressions/product/okrs.md",
      "DNA/Impressions/product/kpis.md",
      "DNA/Impressions/product/north-star.md",
      "DNA/Impressions/product/initiatives.md",
      "DNA/Impressions/product/roadmap.md",
    ],
    cliCommands: ["npx dna context cursor"],
    examples: [
      {
        userSays: "Check if Q3 work matches OKRs",
        goodResponse:
          "2 Now features had no OKR link; 1 Company KR had no owner. Updated goal-cascade.md; suggest drop themed Later item.",
      },
    ],
    workflow: ["define-okrs", "define-kpis", "roadmap-now-next-later", "define-initiative"],
  },
];
