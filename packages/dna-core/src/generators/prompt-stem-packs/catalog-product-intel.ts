import type { PromptStemPackDef } from "./types.js";

/**
 * Product intelligence stems — diagnose product, competitors, and high-leverage upgrades.
 * Quality bar: code + DNA CLI + CellularMemory first; stub Impressions are not truth.
 */
export const PRODUCT_INTEL_GROUND = {
  must: [
    "Run evidence bootstrap before drafting: `npx dna analyze` and `npx dna scan` (add `npx dna document --from-code` when architecture docs are missing or stubby)",
    "Load `.DNA/neuralNetwork.json`, CellularMemory (system-map, decisions, blockers, debt, repeated failures/patterns), README, CHANGELOG, and real package/app entrypoints",
    "Treat DNA Impressions as stubs until proven otherwise — if a file is placeholder, empty, or generic boilerplate, say so and ground elsewhere",
    "Cite concrete evidence (paths, packages, routes, APIs, tests, debt notes) for every strength, weakness, and upgrade claim",
    "Label market, competitor, and user claims without primary research as **assumptions**",
    "Persist filled artifacts under `DNA/Impressions/product/` so stubs become real project truth",
    "Stay at product/competitive/upgrade altitude — hand off via `shape-feature` / agent-loop; do not implement code from these stems",
  ],
  never: [
    "Treat stub or template Impressions as product truth",
    "Invent competitor features, pricing, market share, or metrics — research or label as assumption",
    "Give upgrade advice without tying it to architecture evidence or known debt",
    "Start the 9-role agent loop or edit product application code from these stems",
    "Produce generic SWOT / competitor / roadmap text that could apply to any SaaS",
  ],
  should: [
    "Prefer thin-slice / strangler upgrades that reuse existing patterns in-repo",
    "Score effort × impact with explicit rationale (files touched, risk, reuse)",
    "End every stem with next stem in the product-intel ladder and open questions",
    "When Impressions were stubs, list which files you created or replaced",
  ],
};

const EVIDENCE_BOOTSTRAP = `## Evidence bootstrap (mandatory — run first)

\`\`\`bash
npx dna analyze
npx dna scan
\`\`\`

Then load (skip nothing that exists):

1. **Code** — package manifests, app entrypoints, routes/APIs, tests, config
2. **CellularMemory** — \`.DNA/CellularMemory/parietalLobe/system-map.md\`, \`prefrontalCortex/decisions.md\`, \`amygdala/blockers.md\`, debt / repeated-failures / previous-solutions
3. **Docs** — README, CHANGELOG, \`DNA/Impressions/architecture/\` **only if non-stub**
4. **Product Impressions** — if stub/placeholder → note \`STUB\` and do not cite as evidence

If architecture Impressions are missing or stubby:

\`\`\`bash
npx dna document --from-code
\`\`\`

## Stub test

For each Impression you open: if it is empty, "TODO", or could belong to any product → mark **STUB** and ground in code/memory instead. After analysis, **write** the real artifact.`;

export const PRODUCT_INTEL_STEM_DEFS: PromptStemPackDef[] = [
  {
    id: "product-diagnose",
    name: "Product diagnose",
    category: "strategy",
    slash: "product-diagnose",
    summary:
      "Orchestrate purpose → SWOT → value → JTBD from real architecture and debt, then hand off to competitor and upgrade stems.",
    tags: ["strategy", "product-intel", "diagnose", "orchestration", "swot"],
    copyVariants: [
      "Diagnose this product — what is it for, strengths, weaknesses",
      "Run a full product intelligence pass on this repo",
      "Ground a product diagnosis in code and debt, not stub Impressions",
    ],
    prompt: `# Product diagnose

Run the product-intelligence ladder for THIS repo. Scope: $ARGUMENTS

${EVIDENCE_BOOTSTRAP}

## Ladder (do in order — short, evidence-backed sections)

1. **Purpose** — What the product is for (from surfaces that exist in code). Optionally deepen with \`product-purpose-audit\`.
2. **Strengths / weaknesses** — Architecture, UX surfaces, delivery maturity, debt. Optionally deepen with \`product-swot\`.
3. **Value delivered** — Gains/pains the codebase actually addresses. Optionally \`product-value-proposition\`.
4. **Jobs** — Top jobs users can complete end-to-end today vs broken/missing.
5. **Confidence** — High / medium / low per claim + what would raise confidence.
6. **Handoff** — Next: \`competitor-landscape\` then \`upgrade-leverage-map\` / \`upgrade-recommend\`.

## Persist

Write \`DNA/Impressions/product/product-diagnose.md\` (and fill stubs you relied on: purpose, swot, etc.).

## Output format

| Section | Finding | Evidence (path / CLI) | Confidence |
|---------|---------|----------------------|------------|
| Purpose | | | |
| Strengths (3–7) | | | |
| Weaknesses (3–7) | | | |
| Jobs done today | | | |
| Jobs broken/missing | | | |
| Stub Impressions replaced | | | |

End with: next stem + 3 open questions. No code. No feature factory yet.`,
    guidelines: PRODUCT_INTEL_GROUND,
    expectations: [
      "Evidence bootstrap commands run and summarized",
      "Stub Impressions explicitly called out",
      "Purpose, strengths, weaknesses each cite paths or CLI findings",
      "Artifact DNA/Impressions/product/product-diagnose.md written or proposed",
      "Next stem named (competitor-landscape or upgrade-*)",
    ],
    contextLoads: [
      ".DNA/neuralNetwork.json",
      ".DNA/CellularMemory/",
      "DNA/Impressions/product/",
      "DNA/Impressions/architecture/",
      "README.md",
      "CHANGELOG.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna scan", "npx dna document --from-code"],
    examples: [
      {
        userSays: "Diagnose this product",
        goodResponse:
          "Impressions/product-overview.md was STUB. From packages/dna-cli + lab server + amygdala debt: purpose = AI co-pilot for engineering teams; strengths = CLI+workbench+runtime; weaknesses = Lab UI debt, stub product docs. Wrote product-diagnose.md. Next: /competitor-landscape.",
      },
    ],
    workflow: [
      "product-purpose-audit",
      "product-swot",
      "product-value-proposition",
      "competitor-landscape",
      "upgrade-leverage-map",
      "upgrade-recommend",
    ],
  },
  {
    id: "product-purpose-audit",
    name: "Product purpose audit",
    category: "strategy",
    slash: "product-purpose-audit",
    summary:
      "Derive Why / How / What and jobs-to-be-done from real surfaces in the codebase — not from stub canvases.",
    tags: ["strategy", "product-intel", "jtbd", "golden-circle", "purpose"],
    copyVariants: [
      "What is this product actually for?",
      "Audit purpose and jobs from the codebase",
      "JTBD + Golden Circle grounded in routes and APIs",
    ],
    prompt: `# Product purpose audit

Derive purpose and jobs from what the system **does**, not what stub docs claim.

Context: $ARGUMENTS

${EVIDENCE_BOOTSTRAP}

## Method (Golden Circle + JTBD)

| Layer | Derive from |
|-------|-------------|
| **What** | Shipable surfaces: apps, CLIs, APIs, admin, docs sites — list with paths |
| **How** | Distinctive mechanisms in code (packs, runtime, gates, marketplace, etc.) |
| **Why** | Belief implied by architecture bets + README mission — mark if inferred |
| **Jobs** | End-to-end user jobs completable today (trigger → action → outcome) |
| **Non-jobs** | What the architecture refuses (non-goals evidenced by absence or guards) |

## Rules

- Every What item needs a path or package
- Why must not be a feature list; if unclear, write candidate Why + validation question
- Cross-check existing \`golden-circle.md\` / \`product-canvas.md\` — overwrite stubs; reconcile conflicts with code winning

## Persist

- \`DNA/Impressions/product/purpose-audit.md\`
- Update \`DNA/Impressions/product/golden-circle.md\` if stub or drifted
- Optionally refresh product-canvas one-liner + jobs rows

## Output

1. Why / How / What table with evidence
2. JTBD table (job · current support · gap)
3. Stub files replaced
4. Next: \`product-swot\` or \`product-diagnose\``,
    guidelines: PRODUCT_INTEL_GROUND,
    expectations: [
      "What/How/Why grounded in code paths",
      "At least 3 jobs with support/gap",
      "purpose-audit.md persisted",
      "Stub golden-circle/canvas handled explicitly",
    ],
    contextLoads: [
      "DNA/Impressions/product/golden-circle.md",
      "DNA/Impressions/product/product-canvas.md",
      ".DNA/CellularMemory/parietalLobe/system-map.md",
      "README.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna scan"],
    examples: [
      {
        userSays: "What is this product for?",
        goodResponse:
          "What: dna CLI + Lab + workbench stems (packages/*). How: knowledge packs + quality gates + runtime DB. Why (inferred): agents should ship with project truth. Jobs: init DNA, analyze gaps, ship with quality. Wrote purpose-audit.md; golden-circle was STUB — replaced.",
      },
    ],
    workflow: ["product-swot", "product-value-proposition", "product-diagnose"],
  },
  {
    id: "product-swot",
    name: "Product SWOT",
    category: "strategy",
    slash: "product-swot",
    summary:
      "SWOT analysis where S/W come from architecture and debt; O/T are labeled when not evidenced.",
    tags: ["strategy", "product-intel", "swot", "strengths", "weaknesses"],
    copyVariants: [
      "Run a SWOT on this product from the codebase",
      "Strengths and weaknesses grounded in architecture debt",
      "SWOT — no stub Impression nonsense",
    ],
    prompt: `# Product SWOT

Build a SWOT that would embarrass a stub canvas.

Scope: $ARGUMENTS

${EVIDENCE_BOOTSTRAP}

## Quadrants

| Quadrant | Source of truth | Rules |
|----------|-----------------|-------|
| **Strengths** | Code, tests, delivery, unique mechanisms | Must cite path/package/CLI finding |
| **Weaknesses** | Debt, blockers, missing tests, stub docs, UX gaps, fragility | Must cite memory or code smell |
| **Opportunities** | Competitor gaps, unmet jobs, platform leverage | Label **assumption** unless evidenced |
| **Threats** | Market, dependency, compliance, talent, platform risk | Label **assumption** unless evidenced |

## Persist

Write \`DNA/Impressions/product/swot.md\`.

## Output

1. Four tables (item · evidence · confidence)
2. Top 3 weaknesses that block major upgrades
3. Top 3 strengths to lean on for low-effort wins
4. Next: \`competitor-landscape\` or \`upgrade-leverage-map\``,
    guidelines: PRODUCT_INTEL_GROUND,
    expectations: [
      "Each strength/weakness has evidence citation",
      "O/T assumptions labeled",
      "swot.md written",
      "Upgrade-relevant weaknesses highlighted",
    ],
    contextLoads: [
      ".DNA/CellularMemory/amygdala/",
      ".DNA/CellularMemory/parietalLobe/",
      "DNA/Impressions/architecture/",
      "DNA/Impressions/product/product-diagnose.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna scan", "npx dna quality report --feature"],
    examples: [
      {
        userSays: "SWOT this repo",
        goodResponse:
          "S: monorepo CLI+core, stem catalog, CI gates (cite packages/). W: product Impressions STUB, Lab coverage page debt (cite blockers). O/T labeled assumptions. Wrote swot.md. Next: upgrade-leverage-map.",
      },
    ],
    workflow: ["competitor-landscape", "upgrade-leverage-map", "product-value-proposition"],
  },
  {
    id: "product-value-proposition",
    name: "Product value proposition",
    category: "strategy",
    slash: "product-value-proposition",
    summary:
      "Value Proposition Canvas — customer jobs/pains/gains vs what the product actually delivers in code.",
    tags: ["strategy", "product-intel", "value-proposition", "vpc"],
    copyVariants: [
      "Map our value proposition from what we actually ship",
      "Value proposition canvas grounded in the product",
      "Pains and gains vs real features in code",
    ],
    prompt: `# Product value proposition

Value Proposition Canvas for THIS product — products & services must map to real surfaces.

Context: $ARGUMENTS

${EVIDENCE_BOOTSTRAP}

## Canvas

**Customer profile (jobs / pains / gains)** — from ICP in README/Impressions if non-stub; else infer from who the UX/CLI addresses; label inferences.

**Value map**

| Block | Fill with evidence |
|-------|-------------------|
| Products & services | Packages, apps, commands that exist |
| Pain relievers | How code removes specific pains |
| Gain creators | How code creates specific gains |
| Fit gaps | Pains with no reliever; services with no job |

## Persist

\`DNA/Impressions/product/value-proposition.md\`

## Output

Filled canvas + worst fit gaps + next stem (\`product-kano-scan\` or \`upgrade-recommend\`).`,
    guidelines: PRODUCT_INTEL_GROUND,
    expectations: [
      "Products/services cite real surfaces",
      "Fit gaps listed",
      "value-proposition.md persisted",
    ],
    contextLoads: [
      "DNA/Impressions/product/purpose-audit.md",
      "DNA/Impressions/product/product-canvas.md",
      "README.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna scan"],
    examples: [
      {
        userSays: "Value prop for this product",
        goodResponse:
          "Services: CLI, Lab, stems, marketplace. Pain reliever: quality gates before push. Fit gap: stub product docs vs 'project truth' claim. Wrote value-proposition.md.",
      },
    ],
    workflow: ["product-kano-scan", "competitor-feature-matrix", "upgrade-recommend"],
  },
  {
    id: "product-kano-scan",
    name: "Product Kano scan",
    category: "strategy",
    slash: "product-kano-scan",
    summary:
      "Classify capabilities as must-be, performance, or delighters using shipped features and obvious gaps.",
    tags: ["strategy", "product-intel", "kano", "prioritization"],
    copyVariants: [
      "Run a Kano scan on our features",
      "Which features are must-have vs delighters?",
      "Kano model from what we shipped",
    ],
    prompt: `# Product Kano scan

Classify product capabilities with the Kano model — grounded in shipped reality.

Scope: $ARGUMENTS

${EVIDENCE_BOOTSTRAP}

## Categories

| Category | Meaning | How to detect in-repo |
|----------|---------|----------------------|
| **Must-be** | Expected; absence angers | Core flows broken/missing; baseline hygiene (auth, install, docs) |
| **Performance** | More → more satisfaction | Speed, coverage, depth of packs, Lab insight quality |
| **Delighters** | Unexpected joy | Unique mechanisms competitors lack (cite assumption if comparing) |
| **Indifferent / reverse** | Low value or annoyance | Dead features, noise, ceremony without payoff |

## Persist

\`DNA/Impressions/product/kano.md\`

## Output

1. Table: capability · Kano class · evidence · upgrade implication
2. Must-be failures to fix first (often cheapest trust wins)
3. Delighters to double down on
4. Next: \`upgrade-leverage-map\``,
    guidelines: PRODUCT_INTEL_GROUND,
    expectations: [
      "Capabilities classified with evidence",
      "Must-be failures called out",
      "kano.md written",
    ],
    contextLoads: [
      "DNA/Impressions/product/feature-map.md",
      "DNA/Impressions/product/value-proposition.md",
      "CHANGELOG.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna scan"],
    examples: [
      {
        userSays: "Kano scan",
        goodResponse:
          "Must-be: init/doctor working (ok), product Impressions non-stub (fail). Performance: analyze depth. Delighter: stem packs with guidelines. Wrote kano.md.",
      },
    ],
    workflow: ["upgrade-leverage-map", "competitor-feature-matrix"],
  },
  {
    id: "competitor-landscape",
    name: "Competitor landscape",
    category: "strategy",
    slash: "competitor-landscape",
    summary:
      "Map category alternatives, do-nothing, and positioning axes — assumptions labeled; our side grounded in code.",
    tags: ["strategy", "product-intel", "competitor", "landscape", "positioning"],
    copyVariants: [
      "Map the competitive landscape for this product",
      "Who are we competing with — including do-nothing?",
      "Competitor landscape from our actual category",
    ],
    prompt: `# Competitor landscape

Map the competitive field for THIS product. Our capabilities come from code; theirs from named research or **assumptions**.

Scope / known competitors: $ARGUMENTS

${EVIDENCE_BOOTSTRAP}

## Landscape

1. **Category** — one sentence (what buying decision are we in?)
2. **Alternatives** — direct / indirect / substitute / **do-nothing**
3. **Axes** — 2–3 positioning dimensions that matter (e.g. agent-native vs IDE plugin; OSS vs closed)
4. **Players** — table: name · type · hypothesized position · evidence level (known / assumed)
5. **Our position** — where code + purpose-audit place us on those axes
6. **White space** — opportunities (assumption-labeled)

## Research rule

- If user named competitors or asked for web research → use tools and cite sources
- Otherwise → category reasoning + ask one clarifying question for missing names
- Never invent pricing, ARR, or feature checklists for competitors

## Persist

\`DNA/Impressions/product/competitor-landscape.md\`

## Output

Landscape + our position + next \`competitor-feature-matrix\` or \`competitor-positioning\`.`,
    guidelines: PRODUCT_INTEL_GROUND,
    expectations: [
      "Do-nothing included",
      "Our position evidenced from code",
      "Competitor claims labeled known vs assumed",
      "competitor-landscape.md written",
    ],
    contextLoads: [
      "DNA/Impressions/product/purpose-audit.md",
      "DNA/Impressions/product/swot.md",
      "DNA/Impressions/product/business-strategy-canvas.md",
      "README.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna scan"],
    examples: [
      {
        userSays: "Competitor landscape",
        goodResponse:
          "Category: AI engineering co-pilots / repo intelligence. Alternatives: Cursor rules alone, Copilot, internal wiki, do-nothing. Our axis: pack+CLI+runtime observability. Competitors assumed pending names. Wrote competitor-landscape.md.",
      },
    ],
    workflow: ["competitor-feature-matrix", "competitor-positioning", "upgrade-leverage-map"],
  },
  {
    id: "competitor-feature-matrix",
    name: "Competitor feature matrix",
    category: "strategy",
    slash: "competitor-feature-matrix",
    summary:
      "Battlecard-style feature matrix — our rows proven in code; competitor cells researched or assumed.",
    tags: ["strategy", "product-intel", "competitor", "battlecard", "features"],
    copyVariants: [
      "Build a competitor feature matrix",
      "Battlecard us vs competitors on capabilities",
      "Feature comparison grounded in what we actually ship",
    ],
    prompt: `# Competitor feature matrix

Build a capability matrix for competitive decisions.

Competitors: $ARGUMENTS

${EVIDENCE_BOOTSTRAP}

## Matrix rules

| Column | Rule |
|--------|------|
| **Capability** | User-valued job or feature theme |
| **Us** | \`shipped\` / \`partial\` / \`absent\` + path evidence |
| **Competitor N** | \`yes\` / \`partial\` / \`no\` / \`unknown\` + source or **assumption** |
| **Gap type** | parity / differentiate / ignore |

Pick 8–15 capabilities max — from purpose-audit jobs + Kano must-bes + SWOT weaknesses.

## Persist

\`DNA/Impressions/product/competitor-feature-matrix.md\`

## Output

1. Matrix
2. Parity gaps worth closing (high user value, feasible)
3. Differentiate bets (lean on strengths)
4. Explicit ignore list
5. Next: \`upgrade-leverage-map\``,
    guidelines: PRODUCT_INTEL_GROUND,
    expectations: [
      "Every 'Us' cell has evidence or absent",
      "Competitor cells sourced or assumed",
      "Parity vs differentiate vs ignore called out",
      "Matrix artifact written",
    ],
    contextLoads: [
      "DNA/Impressions/product/competitor-landscape.md",
      "DNA/Impressions/product/kano.md",
      "DNA/Impressions/product/feature-map.md",
      "CHANGELOG.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna scan"],
    examples: [
      {
        userSays: "Feature matrix vs Cursor rules-only and Copilot",
        goodResponse:
          "Us: stems+guidelines shipped (packages/.../prompt-stem-packs). Copilot: coding assist yes (assumed). Parity gap: product Impressions quality. Differentiate: DNA runtime+quality gates. Wrote matrix.md.",
      },
    ],
    workflow: ["competitor-positioning", "upgrade-leverage-map", "upgrade-recommend"],
  },
  {
    id: "competitor-positioning",
    name: "Competitor positioning",
    category: "strategy",
    slash: "competitor-positioning",
    summary:
      "Positioning statement and perceptual map — our proof points from architecture; competitor placement labeled.",
    tags: ["strategy", "product-intel", "competitor", "positioning", "messaging"],
    copyVariants: [
      "Write our competitive positioning",
      "Where do we sit vs alternatives?",
      "Positioning map and statement from product truth",
    ],
    prompt: `# Competitor positioning

Produce a crisp positioning statement and map.

Context: $ARGUMENTS

${EVIDENCE_BOOTSTRAP}

## Deliverables

1. **Positioning statement** — For [ICP] who [job], [product] is [category] that [key benefit]. Unlike [alternative], we [proof from architecture].
2. **Proof points** — 3–5 claims each backed by a path or mechanism in-repo
3. **Perceptual map** — place us + alternatives on 2 axes from landscape
4. **Traps** — messaging we must not use because code does not support it yet
5. **Moves** — product changes that would unlock stronger positioning (feed upgrade stems)

## Persist

\`DNA/Impressions/product/competitor-positioning.md\`

## Output

Statement + map + traps + next \`upgrade-recommend\`.`,
    guidelines: PRODUCT_INTEL_GROUND,
    expectations: [
      "Positioning statement complete",
      "Proof points cite code",
      "Unsupported messaging traps listed",
      "Artifact written",
    ],
    contextLoads: [
      "DNA/Impressions/product/competitor-landscape.md",
      "DNA/Impressions/product/competitor-feature-matrix.md",
      "DNA/Impressions/product/value-proposition.md",
      "DNA/Impressions/product/golden-circle.md",
    ],
    cliCommands: ["npx dna analyze"],
    examples: [
      {
        userSays: "Position us",
        goodResponse:
          "For teams using Cursor/Claude who need project-true agents, DNA is repo intelligence that packs behaviour+quality gates. Unlike prompt paste alone, we install stems+runtime. Trap: claiming filled product Impressions while stubs exist. Wrote positioning.md.",
      },
    ],
    workflow: ["upgrade-recommend", "upgrade-leverage-map", "shape-feature"],
  },
  {
    id: "upgrade-leverage-map",
    name: "Upgrade leverage map",
    category: "strategy",
    slash: "upgrade-leverage-map",
    summary:
      "Effort × impact map for major upgrades with minimal effort — scored from debt, SWOT, and competitor gaps.",
    tags: ["strategy", "product-intel", "upgrade", "leverage", "effort-impact"],
    copyVariants: [
      "Map high-leverage upgrades for this project",
      "Effort vs impact — major gains, minimal effort",
      "Where can we upgrade with the least work for the most effect?",
    ],
    prompt: `# Upgrade leverage map

Find **major upgrades with minimal effort** — 80/20 moves grounded in debt and competitive gaps.

Scope: $ARGUMENTS

${EVIDENCE_BOOTSTRAP}

Also load (if present): swot.md, competitor-feature-matrix.md, kano.md, blockers, repeated-failures, previous-solutions.

## Scoring

For each candidate change:

| Field | Rule |
|-------|------|
| **Outcome** | User/business state change — not a task name |
| **Why** | Tie to weakness, parity gap, or must-be failure |
| **Evidence** | Paths / debt / matrix cells |
| **Impact** | H / M / L + rationale |
| **Effort** | H / M / L — files, risk, reuse of existing patterns |
| **Leverage** | Prefer high impact + low/medium effort |
| **Approach** | Thin-slice / strangler / config-only / docs-truth |

## Quadrants

Place 8–12 candidates on Effort × Impact. Highlight the **leverage cluster** (high impact, low–med effort).

## Persist

\`DNA/Impressions/product/upgrade-leverage-map.md\`

## Output

1. Scored table
2. Top leverage cluster (3–5)
3. Explicitly deferred high-effort items
4. Next: \`upgrade-modernization\` (sequence) or \`upgrade-recommend\` (top picks)`,
    guidelines: PRODUCT_INTEL_GROUND,
    expectations: [
      "Candidates scored with evidence",
      "Leverage cluster identified",
      "Effort justified by blast radius",
      "upgrade-leverage-map.md written",
    ],
    contextLoads: [
      "DNA/Impressions/product/swot.md",
      "DNA/Impressions/product/competitor-feature-matrix.md",
      "DNA/Impressions/product/kano.md",
      ".DNA/CellularMemory/amygdala/",
      ".DNA/CellularMemory/temporalLobe/previous-solutions.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna scan", "npx dna quality report --feature"],
    examples: [
      {
        userSays: "High leverage upgrades?",
        goodResponse:
          "Leverage: replace stub product Impressions via purpose-audit (L effort, H trust impact); Lab deep-coverage already in flight. Deferred: full rewrite. Wrote upgrade-leverage-map.md.",
      },
    ],
    workflow: ["upgrade-modernization", "upgrade-recommend", "shape-feature"],
  },
  {
    id: "upgrade-modernization",
    name: "Upgrade modernization",
    category: "strategy",
    slash: "upgrade-modernization",
    summary:
      "Sequence upgrades as thin slices / strangler steps — quick wins, platform bets, later — without boiling the ocean.",
    tags: ["strategy", "product-intel", "upgrade", "modernization", "strangler"],
    copyVariants: [
      "Sequence a modernization plan with thin slices",
      "Strangler-style upgrade plan from our leverage map",
      "Major upgrade path with minimal disruption",
    ],
    prompt: `# Upgrade modernization

Turn leverage candidates into a sequenced modernization path.

Scope: $ARGUMENTS

${EVIDENCE_BOOTSTRAP}

Load \`upgrade-leverage-map.md\` if present; otherwise run scoring inline.

## Sequencing model

| Wave | Intent | Rules |
|------|--------|-------|
| **Wave 0 — Truth** | Docs/Impressions/memory match code | Unblocks every later decision |
| **Wave 1 — Quick wins** | High leverage, low risk | Ship in days; reuse patterns |
| **Wave 2 — Platform** | Shared capability that multiplies features | Thin interface; strangler around old path |
| **Wave 3 — Later** | High effort or speculative | Park with trigger to pull forward |

For each item: dependency, rollback, reuse target (existing module), success signal.

## Persist

\`DNA/Impressions/product/upgrade-modernization.md\`

## Output

Wave plan + risks + next \`upgrade-recommend\` or \`shape-feature\` for Wave 1 item #1. No code.`,
    guidelines: PRODUCT_INTEL_GROUND,
    expectations: [
      "Waves 0–3 populated or explicitly empty",
      "Each Wave 1 item has success signal and reuse target",
      "modernization artifact written",
    ],
    contextLoads: [
      "DNA/Impressions/product/upgrade-leverage-map.md",
      "DNA/Impressions/architecture/solution-architecture.md",
      ".DNA/CellularMemory/prefrontalCortex/current-plan.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna scan"],
    examples: [
      {
        userSays: "Modernization sequence",
        goodResponse:
          "Wave 0: fill product Impressions from diagnose. Wave 1: Lab coverage + stem product-intel install. Wave 2: shared intelligence APIs. Wrote upgrade-modernization.md.",
      },
    ],
    workflow: ["upgrade-recommend", "roadmap-now-next-later", "shape-feature"],
  },
  {
    id: "upgrade-recommend",
    name: "Upgrade recommend",
    category: "strategy",
    slash: "upgrade-recommend",
    summary:
      "Top upgrade recommendations with why, evidence, effort, and handoff into shape-feature — major impact, minimal effort.",
    tags: ["strategy", "product-intel", "upgrade", "recommend", "handoff"],
    copyVariants: [
      "Recommend what we should change and why",
      "Top upgrades for maximum impact, minimum effort",
      "What should we change next — with evidence?",
    ],
    prompt: `# Upgrade recommend

Synthesize the product-intel ladder into **actionable** upgrade recommendations.

Focus: $ARGUMENTS

${EVIDENCE_BOOTSTRAP}

Prefer existing artifacts: product-diagnose, swot, competitor-*, kano, upgrade-leverage-map, upgrade-modernization.

## Deliver top 5 recommendations

For each:

1. **Change** — outcome-shaped (not "refactor everything")
2. **Why now** — weakness, parity gap, must-be, or positioning trap
3. **Evidence** — paths / debt / matrix
4. **Impact / Effort** — H/M/L
5. **Minimal approach** — smallest slice that unlocks the outcome
6. **Risks**
7. **Next stem** — usually \`shape-feature\` (then plan-feature / agent-loop with **approval gate**)

## Rules

- Order by leverage (impact ÷ effort), not by excitement
- Refuse recommendations that ignore active blockers if they are prerequisites
- If Impressions were stubs at start, include at least one "make truth durable" recommendation if still open

## Persist

\`DNA/Impressions/product/upgrade-recommendations.md\`

## Output

Ranked top 5 + explicitly not recommended + reminder: **no code until Solution Architect plan is approved**.`,
    guidelines: {
      must: [
        ...PRODUCT_INTEL_GROUND.must,
        "Hand off implementation only via shape-feature / plan-feature — state the approval gate",
      ],
      never: [
        ...PRODUCT_INTEL_GROUND.never,
        "Write Solution Architect implementation plans or patches in this stem",
      ],
      should: PRODUCT_INTEL_GROUND.should,
    },
    expectations: [
      "Top 5 with why, evidence, impact, effort, minimal approach",
      "Approval gate stated",
      "upgrade-recommendations.md written",
      "Not-recommended list present",
    ],
    contextLoads: [
      "DNA/Impressions/product/upgrade-leverage-map.md",
      "DNA/Impressions/product/upgrade-modernization.md",
      "DNA/Impressions/product/swot.md",
      "DNA/Impressions/product/competitor-feature-matrix.md",
      "ai/feature-request.md",
    ],
    cliCommands: ["npx dna analyze", "npx dna scan"],
    examples: [
      {
        userSays: "What should we change and why?",
        goodResponse:
          "1) Fill product Impressions via diagnose (trust). 2) Ship product-intel stems (differentiate). 3) Lab coverage depth (performance Kano). Evidence cited. Next: shape-feature for #2 — approval before code. Wrote upgrade-recommendations.md.",
      },
    ],
    workflow: ["shape-feature", "plan-feature", "roadmap-now-next-later", "agent-loop-full"],
  },
];
