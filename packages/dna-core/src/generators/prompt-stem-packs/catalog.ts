import type { PromptStemPackDef } from "./types.js";
import { AGENT_LOOP_STEM_DEFS } from "./catalog-agent-loop.js";
import { METHODOLOGY_STEM_DEFS } from "./catalog-methodology.js";

const GROUND = {
  must: [
    "Run real `npx dna` commands in shell — never invent CLI output",
    "Load `.DNA/neuralNetwork.json` and relevant behaviour before acting",
    "Respond in plain English; lead with outcome not command names",
  ],
  never: [
    "Skip reading stem pack guidelines and expectations",
    "Force-push main/master",
    "Commit secrets from env or CLI output",
  ],
};

const FEATURE_GATES = {
  must: [
    "Stop after Solution Architect plan — wait for explicit user approval before code",
    "Run `npx dna quality report --feature` until PASS before marking complete",
  ],
  never: ["Implement before plan approval", "Skip docker build or github push on feature close-out"],
};

const LEGAL_GROUND = {
  must: [
    "Run `npx dna legal advise` or `npx dna plan legal` before regulated features",
    "Load `.DNA/knowledge/legal/` and regional packs for target jurisdictions",
    "Flag counsel sign-off items — never present output as legal advice",
  ],
  never: [
    "Invent legal conclusions or guarantee compliance",
    "Ship banking, healthcare, or cross-border data features without jurisdiction packs",
    "Skip legal matrix updates in CellularMemory",
  ],
};

/** All prompt stem pack definitions — single source of truth */
export const PROMPT_STEM_DEFS: PromptStemPackDef[] = [
  // ─── Session ─────────────────────────────────────────────────────────────
  {
    id: "work-with-dna",
    name: "Work with DNA",
    category: "session",
    slash: "work-with-dna",
    summary: "Start any DNA-aware session — plain language, DNA runs CLI and loads context.",
    tags: ["session", "bootstrap", "core"],
    copyVariants: [
      "Help me with this project using DNA",
      "I just ran dna init — what should we do first?",
      "Use DNA to figure out what this repo needs",
    ],
    prompt: `# Work with DNA

You are in a DNA by Humaan project. The user speaks normally; you run DNA and load intelligence.

User context: $ARGUMENTS

## Steps

1. Restate their goal in one sentence. One clarifying question max if ambiguous.
2. Read \`.DNA/neuralNetwork.json\`, relevant behaviour files in \`.DNA/behaviour/\`, matching knowledge packs.
3. Run the right \`npx dna\` command for their intent (doctor, analyze, context, etc.).
4. Reply with plain-language summary and **one** clear next step.`,
    guidelines: GROUND,
    expectations: [
      "One-sentence restatement of user goal",
      "DNA context loaded (which files/packs)",
      "CLI output summarized — not dumped raw unless decision-critical",
      "Single recommended next action",
    ],
    contextLoads: [".DNA/neuralNetwork.json", ".DNA/behaviour/*.behaviour.md", "DNA/Impressions/product/product-overview.md"],
    cliCommands: ["npx dna doctor", "npx dna analyze", "npx dna context <target>", "npx dna update --check-only"],
    examples: [
      {
        userSays: "I just initialized DNA — now what?",
        goodResponse:
          "DNA is installed. I'll run doctor to verify scaffolding, then analyze to find P1 gaps. Want me to start with a full health check?",
      },
    ],
    workflow: ["health-check", "analyze-project", "ship-feature"],
  },
  {
    id: "load-context",
    name: "Load context",
    category: "session",
    slash: "load-context",
    summary: "Load domain DNA context — security, backend, frontend, QA, compliance.",
    tags: ["session", "context"],
    copyVariants: [
      "Load security context for this session",
      "Give yourself full backend DNA context",
      "Load QA and testing context from DNA",
    ],
    prompt: `# Load DNA context

Load domain-specific intelligence for this session.

Target: $ARGUMENTS

## Run

\`\`\`bash
npx dna context <target>
\`\`\`

Valid targets: cursor, claude, security, backend, frontend, qa, compliance, devops, ux, architecture.

## Apply

Read referenced \`.DNA/knowledge/\` files. Summarize what rules and patterns apply to this session.`,
    guidelines: GROUND,
    expectations: [
      "Context target identified",
      "`dna context` output summarized",
      "Key rules from loaded packs listed (3–7 bullets)",
      "How this context affects upcoming work stated",
    ],
    contextLoads: [".DNA/neuralNetwork.json"],
    cliCommands: ["npx dna context <target>"],
    examples: [
      {
        userSays: "Load security context",
        goodResponse: "Loaded security + GDPR packs. Key gates: auth on all admin routes, no secrets in logs, quality gate before push.",
      },
    ],
  },
  {
    id: "health-check",
    name: "Health check",
    category: "session",
    slash: "health-check",
    summary: "Doctor + validate — scaffold health, hooks, CI, rules, with plain-English results.",
    tags: ["session", "doctor", "validate"],
    copyVariants: [
      "Is DNA healthy?",
      "Check if DNA is set up correctly",
      "Fix my git hooks and CI scaffolding",
    ],
    prompt: `# DNA health check

Verify DNA scaffolding and behaviour compliance.

Scope: $ARGUMENTS

## Run

\`\`\`bash
npx dna doctor
npx dna validate
npx dna update --check-only
\`\`\`

Doctor repairs scaffolding; \`dna update\` upgrades the CLI and refreshes prompt stems from dna.humaan.app.

## Report

For each check: ✓ or ✗ in plain English. Fix gaps (hooks, workflows, rules) when doctor repairs them. Re-run if needed.`,
    guidelines: {
      ...GROUND,
      must: [...GROUND.must, "Explain every ✓ and ✗ — user should not parse raw doctor output alone"],
    },
    expectations: [
      "Doctor summary table in plain English",
      "Validation issues listed with severity",
      "Actions taken by doctor reported",
      "Remaining manual steps if any",
    ],
    contextLoads: [".DNA/config.dna.json", ".DNA/behaviour/*.behaviour.md"],
    cliCommands: ["npx dna doctor", "npx dna validate", "npx dna update --check-only"],
    examples: [
      {
        userSays: "Is DNA healthy?",
        goodResponse:
          "DNA is healthy except git pre-push hook — doctor fixed it. Validation: 2 minor Impressions drift warnings. Want a full analyze next?",
      },
    ],
    workflow: ["keep-dna-current", "analyze-project"],
  },
  {
    id: "keep-dna-current",
    name: "Keep DNA current",
    category: "session",
    slash: "dna-update",
    summary: "Upgrade DNA CLI and refresh workbench stems + knowledge packs.",
    tags: ["session", "update", "upgrade"],
    copyVariants: [
      "Update DNA to the latest version",
      "Refresh prompt stems and knowledge packs",
      "Is there a newer DNA CLI?",
    ],
    prompt: `# Keep DNA current

\`\`\`bash
npx dna update
npx dna update --check-only
\`\`\`

Scope: $ARGUMENTS

Report: CLI version before/after, marketplace pack updates available, workbench stem count refreshed.`,
    guidelines: GROUND,
    expectations: [
      "CLI upgrade status (installed / already current / check-only)",
      "Knowledge pack updates listed",
      "Workbench stem refresh confirmed",
      "Suggest marketplace install for relevant packs",
    ],
    contextLoads: [".DNA/config.dna.json", ".DNA/stems/index.json"],
    cliCommands: ["npx dna update", "npx dna update --check-only", "npx dna marketplace list"],
    examples: [
      {
        userSays: "Update DNA",
        goodResponse: "Upgraded CLI 0.4.7 → 0.4.8. Refreshed 50 prompt stems. 2 knowledge packs have updates — install react positioning?",
      },
    ],
    workflow: ["health-check", "marketplace-install"],
  },

  // ─── Analysis ────────────────────────────────────────────────────────────
  {
    id: "analyze-project",
    name: "Analyze project",
    category: "analysis",
    slash: "analyze-project",
    summary: "Deep analysis — stack, auth, integrations, P1–P3 gaps, ordered next steps.",
    tags: ["analysis", "brownfield", "gaps"],
    copyVariants: [
      "Run a full analysis on my project",
      "Analyze this codebase and tell me what's missing for DNA maturity",
      "What are the P1 gaps in this repo?",
    ],
    prompt: `# Analyze project

Deep understanding through DNA — brownfield, onboarding, or architecture review.

Focus: $ARGUMENTS

## Run

\`\`\`bash
npx dna analyze
npx dna scan
\`\`\`

## Deliver

### Stack & surfaces
Package manager, frontend/backend, routes, APIs, tests.

### Auth & integrations
Patterns and file locations.

### Vertical gaps
**P1 first**, then P2/P3. Each: gap + recommended DNA action.

### Recommended path
Ordered 3–5 next steps.`,
    guidelines: {
      ...GROUND,
      must: [...GROUND.must, "Prioritize P1 gaps before P2/P3", "Never invent findings — only report CLI output"],
    },
    expectations: [
      "Stack summary (frontend, backend, DB, stage)",
      "Surface counts (routes, APIs, tests)",
      "Auth patterns with file paths",
      "P1/P2/P3 gap list with actions",
      "3–5 ordered next steps",
      "Offer to execute top priority (IVF, shared library, feature)",
    ],
    contextLoads: ["DNA/Impressions/architecture/solution-architecture.md", ".DNA/CellularMemory/parietalLobe/system-map.md"],
    cliCommands: ["npx dna analyze", "npx dna scan"],
    examples: [
      {
        userSays: "Run full analysis",
        goodResponse:
          "React + 80 API routes. P1: no shared UI library (→ packages/humaan-ui), missing build rules on MUI. P2: CellularMemory live. Next: IVF shared-library dry-run or capture build rules — which first?",
      },
    ],
    workflow: ["what-next-after-analyze", "plan-ivf", "ivf-shared-library"],
  },
  {
    id: "what-next-after-analyze",
    name: "What next after analyze?",
    category: "analysis",
    slash: "what-next",
    summary: "Turn analyze output into an actionable plan — P1 gaps, IVF, shared library, features.",
    tags: ["analysis", "planning", "p1"],
    copyVariants: [
      "I ran analyze. React, 80 API routes, P1 shared library gap, P1 build rules missing. What do I do next?",
      "Here's my analyze output — what should we tackle first?",
      "What do I do next with this analysis?",
    ],
    prompt: `# What next after analyze?

The user has analysis output (or will paste it). Turn gaps into an actionable plan.

User context / analyze output: $ARGUMENTS

## Interpret

1. Explain **P1 gaps in plain English** — not a raw CLI dump.
2. Map each P1 to a DNA action:
   - Shared library → \`npx dna ivf shared-library --dry-run\`, scaffold \`packages/humaan-ui\`
   - Build rules → capture MUI/patterns into \`.DNA/knowledge/\`
   - Behaviour restructure → \`npx dna validate\`, update behaviour files
   - Impressions drift → \`npx dna plan impressions-sync\` or \`npx dna scan --open-pr\`
   - Platform features → \`npx dna generate feature <id>\` (sso, multi-tenant, feature-flags, gradual-rollout, audit-logging)
   - Team memory → \`npx dna memory sync\`
3. Optional: \`npx dna plan ivf\` for phased migration.

## Ask

Present 2–3 paths. User picks one. Then execute or hand off to the right stem (ship-feature, ivf-run, etc.).`,
    guidelines: {
      ...GROUND,
      must: [
        ...GROUND.must,
        "Explain gaps in business terms — 'no shared component library' not 'Vertical gaps [P1] Shared Library'",
        "Always offer a choice — never start big-bang rewrites without approval",
      ],
    },
    expectations: [
      "P1 gaps explained in plain English",
      "Each gap mapped to specific DNA command + outcome",
      "2–3 prioritized paths with trade-offs",
      "Explicit question: which path to start?",
    ],
    contextLoads: [".DNA/behaviour/*.behaviour.md", "DNA/Impressions/architecture/solution-architecture.md"],
    cliCommands: [
      "npx dna ivf shared-library --dry-run",
      "npx dna plan ivf",
      "npx dna plan impressions-sync",
      "npx dna validate",
    ],
    examples: [
      {
        userSays: "P1 shared library and build rules — what now?",
        goodResponse:
          "Two P1 items: (1) Extract UI to packages/humaan-ui — I'll dry-run extraction first. (2) Capture your MUI patterns as build rules so agents stop improvising. Start with shared library or build rules?",
      },
    ],
    workflow: ["ivf-shared-library", "plan-ivf", "ship-feature"],
  },
  {
    id: "scan-project",
    name: "Scan project",
    category: "analysis",
    slash: "scan-project",
    summary: "Quick stack scan — dependencies, tests, CI, Impressions drift score.",
    tags: ["analysis", "scan", "drift"],
    copyVariants: ["Quick scan of this project", "Check for Impressions drift", "What's the drift score?"],
    prompt: `# Scan project

Quick DNA scan — stack detection, hosting signals, and doc drift.

\`\`\`bash
npx dna scan
npx dna scan --open-pr
\`\`\`

Drift thresholds live in \`.DNA/config.dna.json\` (\`impressions.driftThreshold\`, \`impressions.autoPrThreshold\`). Use \`--open-pr\` when drift exceeds auto-PR threshold.

Summarize: stack, hosting, test/CI presence, drift score, top 3 drift items.`,
    guidelines: GROUND,
    expectations: [
      "Drift score vs configured thresholds",
      "Hosting detection (preview CI only for Vercel/Netlify)",
      "Top drift items",
      "Quick stack summary",
      "Suggest impressions-sync or scan --open-pr if drift high",
    ],
    contextLoads: ["DNA/Impressions/", ".DNA/config.dna.json"],
    cliCommands: ["npx dna scan", "npx dna scan --open-pr"],
    examples: [
      {
        userSays: "Scan the repo",
        goodResponse: "Drift 34%. Hosting: none detected — preview CI skipped. Missing test-plan update. Run impressions-sync?",
      },
    ],
    workflow: ["sync-impressions", "impressions-drift-pr"],
  },
  {
    id: "stack-hosting",
    name: "Stack & hosting",
    category: "analysis",
    slash: "stack-hosting",
    summary: "Show detected stack, hosting, and which CI workflows DNA scaffolds.",
    tags: ["analysis", "stack", "hosting", "ci"],
    copyVariants: [
      "What stack did DNA detect?",
      "Are we on Vercel — will preview CI install?",
      "Show hosting and database detection",
    ],
    prompt: `# Stack & hosting

\`\`\`bash
npx dna stack show
npx dna scan
\`\`\`

Explain detected stack, hosting provider, database signals, and whether \`dna-preview.yml\` applies (Vercel/Netlify only — not guessed).`,
    guidelines: GROUND,
    expectations: [
      "Stack archetype and key dependencies",
      "Hosting provider or 'not detected'",
      "Preview CI gating explained",
      "Config overrides in config.dna.json if any",
    ],
    contextLoads: [".DNA/config.dna.json", ".DNA/neuralNetwork.json"],
    cliCommands: ["npx dna stack show", "npx dna scan"],
    examples: [
      {
        userSays: "What hosting?",
        goodResponse: "No hosting signals — DNA did not guess Vercel. Preview workflow not scaffolded. Set stack.hosting in config if you deploy to Vercel.",
      },
    ],
    workflow: ["ci-install", "recommend-architecture"],
  },
  {
    id: "recommend-architecture",
    name: "Recommend architecture",
    category: "analysis",
    slash: "recommend-stack",
    summary: "Solution architecture and stack recommendations from DNA.",
    tags: ["analysis", "architecture", "stack"],
    copyVariants: [
      "Recommend a stack for this greenfield project",
      "What architecture should we use?",
      "Run DNA recommend for this app",
    ],
    prompt: `# Recommend architecture

\`\`\`bash
npx dna recommend
npx dna stack show
npx dna stack recommend
\`\`\`

Present archetype, rationale, knowledge packs to install, and risks.`,
    guidelines: GROUND,
    expectations: ["Recommended archetype", "Rationale tied to project signals", "Packs to install", "Migration notes if brownfield"],
    contextLoads: [".DNA/neuralNetwork.json"],
    cliCommands: ["npx dna recommend", "npx dna stack show", "npx dna stack recommend"],
    examples: [{ userSays: "What stack?", goodResponse: "pwa-react-vite archetype — Vite + React + PWA pack. Install platforms/pwa?" }],
  },
  {
    id: "security-audit",
    name: "Security audit",
    category: "analysis",
    slash: "security-audit",
    summary: "Security-focused analysis — auth patterns, secrets, OWASP alignment.",
    tags: ["analysis", "security"],
    copyVariants: [
      "Run a security audit on this codebase",
      "Check auth patterns and secrets handling",
      "Are we following DNA security behaviour?",
    ],
    prompt: `# Security audit

1. \`npx dna context security\`
2. \`npx dna analyze\` — focus auth patterns
3. Read \`.DNA/behaviour/security.behaviour.md\`

Report: auth coverage, secret handling, admin route protection, top 5 risks, fixes.`,
    guidelines: { ...GROUND, never: [...GROUND.never, "Dismiss security findings as low priority without user consent"] },
    expectations: ["Auth pattern inventory", "Behaviour compliance check", "Top risks ranked", "Remediation plan"],
    contextLoads: [".DNA/behaviour/security.behaviour.md", ".DNA/knowledge/disciplines/security/"],
    cliCommands: ["npx dna context security", "npx dna analyze"],
    examples: [{ userSays: "Security audit", goodResponse: "4 auth patterns found. Gap: 2 admin routes lack middleware. P1 fix list attached." }],
  },

  // ─── Features ────────────────────────────────────────────────────────────
  {
    id: "ship-feature",
    name: "Ship a feature",
    category: "features",
    slash: "ship-feature",
    summary: "Plain-language feature → agent loop → plan approval → implement → quality → push.",
    tags: ["features", "agent-loop", "factory"],
    copyVariants: [
      "Add an admin portal for support staff",
      "Build RBAC for managers and HR",
      "I want providers to record phone calls and transcribe notes",
    ],
    prompt: `# Ship a feature (DNA feature factory)

User request: $ARGUMENTS

## Phase 1 — Capture
Write \`ai/feature-request.md\` (Problem, Users, Behaviour, Edge Cases, Success Criteria).

## Phase 2 — Agent loop (\`ai/agent-loop.md\`)
Product Analyst → Solution Architect → **STOP for approval** → Backend → Frontend → UX → QA → Quality → Refactor → Final Review

## Phase 3 — Close-out
\`npx dna quality report --feature\` PASS → \`npx dna docker build\` → \`npx dna github push\``,
    guidelines: { ...GROUND, ...FEATURE_GATES },
    expectations: [
      "feature-request.md written",
      "Architect plan presented before code",
      "All agent-loop roles completed after approval",
      "Quality PASS + docker + push reported",
    ],
    contextLoads: ["ai/agent-loop.md", "ai/feature-request.md", ".cursor/rules/product-process.mdc"],
    cliCommands: ["npx dna quality report --feature", "npx dna docker build", "npx dna github push"],
    examples: [
      {
        userSays: "Add admin dashboard tab for support",
        goodResponse: "Captured in feature-request.md. Architect plan: 1 new route, RBAC support role, 3 API endpoints. Approve before I implement?",
      },
    ],
    workflow: ["role-product-analyst", "agent-loop-full", "quality-gate", "github-push"],
  },
  {
    id: "plan-feature",
    name: "Plan feature",
    category: "features",
    slash: "plan-feature",
    summary: "Plan a platform feature from requirements — no implementation yet.",
    tags: ["features", "planning"],
    copyVariants: ["Plan the audit logging feature", "DNA plan feature for notifications", "Scope this feature before we build"],
    prompt: `# Plan feature

\`\`\`bash
npx dna plan feature "<featureId or description>"
\`\`\`

User scope: $ARGUMENTS

Output plan only — no code. Include scope, files, API, security, tests, risks.`,
    guidelines: { ...GROUND, must: [...GROUND.must, "Plan only — no implementation"] },
    expectations: ["Structured plan document", "Scope boundaries", "Security/RBAC notes", "Test strategy", "Explicit out-of-scope list"],
    contextLoads: ["DNA/Impressions/product/feature-map.md"],
    cliCommands: ["npx dna plan feature"],
    examples: [{ userSays: "Plan audit logging", goodResponse: "Plan: middleware hook, audit table, admin viewer. 4 phases. No code until approved." }],
    workflow: ["ship-feature", "generate-feature"],
  },
  {
    id: "plan-rbac",
    name: "Plan RBAC",
    category: "features",
    slash: "plan-rbac",
    summary: "Plan RBAC and zero-trust from plain-language requirements.",
    tags: ["features", "rbac", "security"],
    copyVariants: [
      "Plan RBAC for admin and support roles",
      "Design zero-trust access for this API",
      "Who should see what in the admin portal?",
    ],
    prompt: `# Plan RBAC

\`\`\`bash
npx dna plan rbac "<requirement>"
\`\`\`

Requirement: $ARGUMENTS

Deliver: roles, permissions matrix, route guards, API checks, migration plan.`,
    guidelines: GROUND,
    expectations: ["Roles defined", "Permission matrix", "Route + API enforcement points", "Migration/seed plan"],
    contextLoads: [".DNA/knowledge/disciplines/security/", "DNA/Impressions/security/security-baseline.md"],
    cliCommands: ["npx dna plan rbac"],
    examples: [{ userSays: "Admin vs support RBAC", goodResponse: "Roles: admin (full), support (read+ticket write). Matrix + middleware plan attached." }],
    workflow: ["ship-feature"],
  },
  {
    id: "generate-feature",
    name: "Generate feature scaffold",
    category: "features",
    slash: "generate-feature",
    summary: "Generate code scaffold for a DNA platform feature (audit-logging, etc.).",
    tags: ["features", "scaffold"],
    copyVariants: ["Generate audit logging scaffold", "Scaffold the notifications platform feature"],
    prompt: `# Generate feature scaffold

\`\`\`bash
npx dna generate feature <featureId>
\`\`\`

Feature IDs: \`audit-logging\`, \`sso\`, \`multi-tenant\`, \`feature-flags\`, \`gradual-rollout\`.

Feature: $ARGUMENTS

Review generated files. Integrate — do not leave orphan scaffolds.`,
    guidelines: GROUND,
    expectations: ["Scaffold files listed", "Integration steps", "Tests to add", "Quality gate before complete"],
    contextLoads: ["DNA/Impressions/product/feature-map.md"],
    cliCommands: ["npx dna generate feature <featureId>"],
    examples: [{ userSays: "Generate audit-logging", goodResponse: "Scaffolded middleware + model + routes. Next: wire into app and add tests." }],
    workflow: ["platform-codegen", "ship-feature", "quality-gate"],
  },
  {
    id: "platform-codegen",
    name: "Platform codegen",
    category: "features",
    slash: "platform-codegen",
    summary: "Scaffold SSO, multi-tenant, feature flags, gradual rollout, or audit logging.",
    tags: ["features", "scaffold", "platform"],
    copyVariants: [
      "Scaffold SSO for this app",
      "Add multi-tenant middleware",
      "Generate feature flags scaffold",
      "Set up gradual rollout per tenant",
    ],
    prompt: `# Platform codegen

\`\`\`bash
npx dna generate feature audit-logging
npx dna generate feature sso
npx dna generate feature multi-tenant
npx dna generate feature feature-flags
npx dna generate feature gradual-rollout
\`\`\`

Target: $ARGUMENTS

Pick the matching feature ID. Review \`.DNA/plans/\` output. Wire scaffolds into the app — pair gradual-rollout with feature-flags when needed.`,
    guidelines: GROUND,
    expectations: [
      "Correct feature ID chosen",
      "Generated paths listed",
      "Integration checklist",
      "Impressions/security docs to update",
    ],
    contextLoads: ["DNA/Impressions/product/feature-map.md", ".DNA/plans/"],
    cliCommands: [
      "npx dna generate feature audit-logging",
      "npx dna generate feature sso",
      "npx dna generate feature multi-tenant",
      "npx dna generate feature feature-flags",
      "npx dna generate feature gradual-rollout",
    ],
    examples: [
      {
        userSays: "Add SSO with Okta",
        goodResponse: "Scaffolded src/auth/sso + middleware stub. Plan at .DNA/plans/sso-<feature>.md. Next: register Okta adapter and protect admin routes.",
      },
    ],
    workflow: ["ship-feature", "quality-gate"],
  },

  // ─── Quality ─────────────────────────────────────────────────────────────
  {
    id: "quality-gate",
    name: "Quality gate",
    category: "quality",
    slash: "quality-gate",
    summary: "Pre-ship lint, coverage, SAST — must PASS before push.",
    tags: ["quality", "gate", "sast"],
    copyVariants: ["Are we ready to push?", "Run the quality gate on my changes", "Check if this feature passes DNA quality"],
    prompt: `# Quality gate

Scope: $ARGUMENTS

\`\`\`bash
npx dna quality report --feature
\`\`\`

Fix blockers until PASS. Then offer docker + github push.`,
    guidelines: { ...GROUND, must: [...GROUND.must, "Do not mark work complete until quality PASS"] },
    expectations: ["PASS/FAIL status", "Blocker list if FAIL", "Fixes applied", "Ready-to-ship confirmation"],
    contextLoads: [".DNA/behaviour/testing.behaviour.md"],
    cliCommands: ["npx dna quality report --feature"],
    examples: [{ userSays: "Ready to push?", goodResponse: "Quality PASS. Lint clean, coverage 78%. Run docker build and push?" }],
    workflow: ["docker-build", "github-push"],
  },
  {
    id: "quality-scan",
    name: "Quality scan",
    category: "quality",
    slash: "quality-scan",
    summary: "Quick quality scan to stdout — no report file.",
    tags: ["quality", "scan"],
    copyVariants: ["Quick quality scan", "Any SAST issues right now?"],
    prompt: `# Quality scan

\`\`\`bash
npx dna quality scan --feature
\`\`\`

Summarize findings. Suggest fixes for critical items.`,
    guidelines: GROUND,
    expectations: ["Issue count by severity", "Top 3 issues", "Quick fix suggestions"],
    contextLoads: [],
    cliCommands: ["npx dna quality scan --feature"],
    examples: [{ userSays: "Quick scan", goodResponse: "2 medium SAST findings in auth middleware. Fix before push." }],
    workflow: ["quality-gate"],
  },
  {
    id: "pre-push-review",
    name: "Pre-push review",
    category: "quality",
    slash: "pre-push-review",
    summary: "Final review before push — quality, scope, secrets, commit hygiene.",
    tags: ["quality", "review", "ship"],
    copyVariants: ["Review my changes before I push", "Pre-push checklist"],
    prompt: `# Pre-push review

1. \`npx dna quality report --feature\` — must PASS
2. Review diff scope — no unrelated changes
3. No secrets, no debug logs
4. Tests pass

Scope: $ARGUMENTS`,
    guidelines: FEATURE_GATES,
    expectations: ["Quality status", "Scope review", "Secret scan", "Go/no-go for push"],
    contextLoads: [".DNA/behaviour/coding.behaviour.md"],
    cliCommands: ["npx dna quality report --feature"],
    examples: [{ userSays: "Review before push", goodResponse: "PASS. 12 files, all feature-scoped. Safe to push." }],
    workflow: ["github-push"],
  },

  // ─── Compliance ──────────────────────────────────────────────────────────
  {
    id: "plan-compliance",
    name: "Plan compliance",
    category: "compliance",
    slash: "plan-compliance",
    summary: "Tiered GDPR, HIPAA, ISO 27001, SOC 2, PCI — plan, packs, checklist.",
    tags: ["compliance", "gdpr", "hipaa"],
    copyVariants: [
      "Are we GDPR ready?",
      "Plan HIPAA controls for this app",
      "What compliance do we need for EU B2B SaaS?",
    ],
    prompt: `# Plan compliance

\`\`\`bash
npx dna compliance list
npx dna plan compliance
\`\`\`

Context: $ARGUMENTS

Map tier → frameworks → controls → marketplace packs → engineering checklist.`,
    guidelines: GROUND,
    expectations: ["Org tier identified", "Frameworks mapped", "Control gaps", "Packs to install", "Implementation order"],
    contextLoads: [".DNA/knowledge/compliance/", "DNA/Impressions/compliance/compliance-overview.md"],
    cliCommands: ["npx dna compliance list", "npx dna plan compliance"],
    examples: [{ userSays: "GDPR for UK SaaS", goodResponse: "Tier: corporate. UK GDPR + SOC2 roadmap. 12 controls gap. Install compliance/gdpr pack?" }],
    workflow: ["compliance-documents", "ship-feature"],
  },
  {
    id: "compliance-documents",
    name: "Compliance documents",
    category: "compliance",
    slash: "compliance-documents",
    summary: "UK GDPR document catalog and scrubbed templates.",
    tags: ["compliance", "gdpr", "documents"],
    copyVariants: ["List required GDPR documents", "Generate compliance document pack"],
    prompt: `# Compliance documents

\`\`\`bash
npx dna compliance documents
\`\`\`

List required docs. Scaffold from templates where available. Never commit PII in examples.`,
    guidelines: { ...GROUND, never: [...GROUND.never, "Include real customer data in templates"] },
    expectations: ["Document catalog", "Status per document", "Scaffold paths", "Customization notes"],
    contextLoads: [".DNA/knowledge/compliance/gdpr/"],
    cliCommands: ["npx dna compliance documents"],
    examples: [{ userSays: "GDPR docs needed?", goodResponse: "14 documents required. 6 exist, 8 to scaffold from DNA templates." }],
  },
  {
    id: "gdpr-engineering",
    name: "GDPR engineering checklist",
    category: "compliance",
    slash: "gdpr-engineering",
    summary: "Engineering checklist for GDPR — consent, retention, DSAR, logging.",
    tags: ["compliance", "gdpr", "engineering"],
    copyVariants: ["GDPR engineering checklist for this feature", "Check consent and retention on this flow"],
    prompt: `# GDPR engineering

Load \`.DNA/knowledge/compliance/gdpr/engineering-checklist.dna.md\`.

Review feature/flow: $ARGUMENTS

Check: lawful basis, consent UI, retention, DSAR, logging, subprocessors.`,
    guidelines: GROUND,
    expectations: ["Checklist per item", "Gaps flagged", "UX + backend fixes needed"],
    contextLoads: [".DNA/knowledge/compliance/gdpr/engineering-checklist.dna.md"],
    cliCommands: ["npx dna context compliance"],
    examples: [{ userSays: "GDPR on signup", goodResponse: "Missing: consent granularity, privacy link. Retention OK." }],
  },
  {
    id: "plan-legal",
    name: "Plan legal",
    category: "legal",
    slash: "plan-legal",
    summary: "Jurisdiction + sector legal plan — privacy, banking, healthcare, IP, regional law.",
    tags: ["legal", "privacy", "pdpa", "jurisdiction"],
    copyVariants: [
      "What legal gates do we need for Singapore payments?",
      "Plan legal considerations before we launch in EU",
      "We're building healthcare in Thailand — what law applies?",
      "Banking app with PDPA — plan legal before we ship",
    ],
    prompt: `# Plan legal

\`\`\`bash
npx dna legal list
npx dna plan legal
\`\`\`

Context: $ARGUMENTS

Map domains → jurisdictions → counsel gates → regional packs → engineering checklist.

Pair with \`npx dna plan compliance\` for ISO/SOC2/HIPAA controls.`,
    guidelines: LEGAL_GROUND,
    expectations: [
      "Domains identified (privacy, banking, healthcare, IP, etc.)",
      "Jurisdictions mapped with regional packs",
      "Counsel sign-off checklist",
      "Legal matrix written to CellularMemory",
      "Engineering rules per sector",
    ],
    contextLoads: [
      ".DNA/knowledge/legal/",
      ".DNA/CellularMemory/prefrontalCortex/legal-considerations-matrix.md",
      ".DNA/workflows/legal.workflow.md",
    ],
    cliCommands: ["npx dna legal list", "npx dna plan legal", "npx dna context legal"],
    examples: [
      {
        userSays: "Launch fintech with health data in Singapore",
        goodResponse:
          "Domains: banking, healthcare, privacy. Jurisdiction: sg. Install legal/regions/sg-pdpa. 8 counsel gates. Engineering: PCI tokenisation, no PHI in logs, PDPA consent records.",
      },
      {
        userSays: "EU B2B SaaS storing employee data",
        goodResponse:
          "Domains: privacy, employment. Jurisdictions: eu. Packs: legal/regions/eu-gdpr. Counsel: DPA, SCCs, works council if monitoring. Then dna plan compliance --frameworks gdpr.",
      },
    ],
    workflow: ["legal-advise", "plan-compliance", "ship-feature"],
  },
  {
    id: "legal-advise",
    name: "Legal advise",
    category: "legal",
    slash: "legal-advise",
    summary: "Engineering legal considerations for a product question (not legal advice).",
    tags: ["legal", "advisor", "privacy", "banking"],
    copyVariants: [
      "Should we store health records in Thailand?",
      "What legal risks if we add open banking in Singapore?",
      "Can we use user data to train our AI model in the EU?",
      "Legal check before we launch payments in Malaysia",
    ],
    prompt: `# Legal advise

\`\`\`bash
npx dna legal advise --quote "$ARGUMENTS"
\`\`\`

Question: $ARGUMENTS

Summarize: detected domains, jurisdictions, priority recommendations, engineering rules, counsel checklist.

**Not legal advice** — flag items needing qualified counsel.`,
    guidelines: LEGAL_GROUND,
    expectations: [
      "Real CLI output from legal advise",
      "Domains and jurisdictions named",
      "Recommendations in priority order",
      "Counsel sign-off items listed",
      "Disclaimer included",
    ],
    contextLoads: [".DNA/knowledge/legal/advisor-process.dna.md", ".DNA/knowledge/legal/disclaimers.dna.md"],
    cliCommands: ['npx dna legal advise --quote "$ARGUMENTS"'],
    examples: [
      {
        userSays: "Store patient payment data in Singapore and Thailand",
        goodResponse:
          "CRITICAL: sg + th PDPA packs. Banking + healthcare domains. Engineering: segregate financial/health data, BAA/KYC vendors, consent records. Counsel: MAS TRM, cross-border transfer. Not legal advice.",
      },
    ],
    workflow: ["plan-legal"],
  },
  {
    id: "legal-list",
    name: "Legal catalog",
    category: "legal",
    slash: "legal-list",
    summary: "List legal domains and supported jurisdictions (PDPA, GDPR, CCPA, etc.).",
    tags: ["legal", "catalog", "jurisdiction"],
    copyVariants: ["What legal domains does DNA cover?", "List supported countries for privacy law"],
    prompt: `# Legal catalog

\`\`\`bash
npx dna legal list
npx dna marketplace search --query pdpa --category legal
\`\`\`

Context: $ARGUMENTS

Show domains table and jurisdictions. Suggest packs to install for user's markets.`,
    guidelines: GROUND,
    expectations: ["Domain catalog", "Jurisdiction catalog", "Relevant pack IDs for user's markets"],
    contextLoads: [".DNA/knowledge/legal/regions/overview.dna.md"],
    cliCommands: ["npx dna legal list", "npx dna marketplace search --query legal --category legal"],
    examples: [
      {
        userSays: "What APAC privacy laws are covered?",
        goodResponse: "SG PDPA, TH PDPA, MY PDPA, AU Privacy Act, JP APPI, KR PIPA, ID PDP, PH DPA, VN PDPD, HK PDPO, TW PDPA. Install via legal/regions/* packs.",
      },
    ],
    workflow: ["plan-legal"],
  },
  {
    id: "legal-engineering",
    name: "Legal engineering checklist",
    category: "legal",
    slash: "legal-engineering",
    summary: "Sector legal engineering checklist — privacy, banking, healthcare before shipping a feature.",
    tags: ["legal", "engineering", "banking", "healthcare"],
    copyVariants: [
      "Legal engineering checklist for this payment flow",
      "Check banking and privacy law on this feature",
      "Healthcare legal gates before we ship telehealth",
    ],
    prompt: `# Legal engineering

\`\`\`bash
npx dna context legal --quote "$ARGUMENTS"
\`\`\`

Feature / flow: $ARGUMENTS

Load domain packs under \`.DNA/knowledge/legal/domains/\` and regional checklists.

Check: lawful basis, consent, sector rules (PCI, PHI, AML), IP, counsel gates.`,
    guidelines: LEGAL_GROUND,
    expectations: [
      "Checklist per domain in scope",
      "Regional pack items for launch markets",
      "Engineering blockers vs counsel items separated",
      "Gaps flagged before implementation",
    ],
    contextLoads: [
      ".DNA/knowledge/legal/domains/privacy.dna.md",
      ".DNA/knowledge/legal/domains/banking-finance.dna.md",
      ".DNA/knowledge/legal/domains/healthcare.dna.md",
      ".DNA/knowledge/legal/matrices/domain-by-sector.dna.md",
    ],
    cliCommands: ["npx dna context legal", "npx dna legal advise --quote"],
    examples: [
      {
        userSays: "Add Stripe checkout for EU customers",
        goodResponse: "Privacy: lawful basis, cookie consent. Banking: PCI SAQ A via Stripe. Consumer: refund terms. EU pack: SCCs if US subprocessors. Counsel: ToS update.",
      },
    ],
    workflow: ["legal-advise", "plan-legal"],
  },

  // ─── Debug ───────────────────────────────────────────────────────────────
  {
    id: "debug-issue",
    name: "Debug issue",
    category: "debug",
    slash: "debug-issue",
    summary: "Runtime error → classify → fix → test → quality → push.",
    tags: ["debug", "runtime", "fix"],
    copyVariants: [
      "Users get 403 on the admin API — debug it",
      "Fix this production error with DNA context",
    ],
    prompt: `# Debug issue

Symptom: $ARGUMENTS

1. Check runtime: \`npx dna dashboard\` or \`.DNA/data/runtime.db\`
2. Classify against Immune System + Behaviour
3. Root-cause fix + tests
4. \`npx dna quality report --feature\` PASS
5. Push when green`,
    guidelines: GROUND,
    expectations: ["Root cause identified", "Fix with tests", "Quality PASS", "Regression notes"],
    contextLoads: [".DNA/immuneSystem/", ".DNA/behaviour/runtime.behaviour.md"],
    cliCommands: ["npx dna dashboard", "npx dna quality report --feature"],
    examples: [{ userSays: "403 on admin API", goodResponse: "Missing permission check on POST /admin/users. Fixed middleware. Tests added." }],
    workflow: ["quality-gate", "ai-repair"],
  },
  {
    id: "ai-repair",
    name: "AI repair",
    category: "debug",
    slash: "ai-repair",
    summary: "DNA AI repair workflow for classified runtime issues.",
    tags: ["debug", "ai", "repair"],
    copyVariants: ["Run DNA AI repair on this issue", "Classify and propose fix for this runtime error"],
    prompt: `# AI repair

\`\`\`bash
npx dna ai repair --issue '<json or description>'
\`\`\`

Issue: $ARGUMENTS

Human review required before merge. Never auto-merge repair PRs.`,
    guidelines: { ...GROUND, never: [...GROUND.never, "Auto-merge AI repair PRs"] },
    expectations: ["Classification", "Proposed fix", "Human review reminder", "Test plan"],
    contextLoads: [".DNA/workflows/ai-repair.workflow.md"],
    cliCommands: ["npx dna ai repair"],
    examples: [{ userSays: "Repair timeout errors", goodResponse: "Classified: P2 performance. Proposed connection pool fix. Review before merge." }],
  },
  {
    id: "runtime-investigate",
    name: "Runtime investigate",
    category: "debug",
    slash: "runtime-investigate",
    summary: "Investigate runtime observer data and immune system classifications.",
    tags: ["debug", "runtime", "observer"],
    copyVariants: ["What errors has DNA captured?", "Show runtime incidents from DNA observer"],
    prompt: `# Runtime investigate

\`\`\`bash
npx dna dashboard --port 3200
\`\`\`

Open http://localhost:3200 — live feed refreshes every 5s. Quality trend chart shows recent gate history.

Summarize recent incidents, classifications, patterns. Link to Behaviour fixes.`,
    guidelines: GROUND,
    expectations: [
      "Dashboard URL shared",
      "Incident summary from live feed",
      "Classification breakdown",
      "Top recurring issues",
      "Recommended fixes",
    ],
    contextLoads: [".DNA/immuneSystem/issue-classifier.json", ".DNA/behaviour/runtime.behaviour.md"],
    cliCommands: ["npx dna dashboard --port 3200"],
    examples: [
      {
        userSays: "Recent errors?",
        goodResponse: "12 incidents this week (live feed). 60% auth-related. Quality trend: 2 FAILs last sprint. See debug-issue stem for top fix.",
      },
    ],
    workflow: ["dashboard-monitor", "debug-issue"],
  },
  {
    id: "dashboard-monitor",
    name: "Dashboard monitor",
    category: "debug",
    slash: "dashboard-monitor",
    summary: "Open DNA dashboard — live runtime feed and quality trends.",
    tags: ["debug", "dashboard", "monitoring"],
    copyVariants: [
      "Open the DNA dashboard",
      "Show quality trends and runtime feed",
      "Monitor DNA observer data live",
    ],
    prompt: `# Dashboard monitor

\`\`\`bash
npx dna dashboard --port 3200
\`\`\`

Panels: runtime incidents, doctor health, Impressions drift, CellularMemory, quality reports. Data API refreshes every 5 seconds.

Summarize what the user should watch and any anomalies.`,
    guidelines: GROUND,
    expectations: ["URL and port", "Live feed explained", "Quality trend interpretation", "Action items if anomalies"],
    contextLoads: [".DNA/immuneSystem/", ".DNA/CellularMemory/"],
    cliCommands: ["npx dna dashboard --port 3200"],
    examples: [
      {
        userSays: "Open dashboard",
        goodResponse: "http://localhost:3200 — live feed shows 3 new runtime errors in the last hour. Quality trend improving since Tuesday.",
      },
    ],
    workflow: ["runtime-investigate", "debug-issue"],
  },

  // ─── Docs ────────────────────────────────────────────────────────────────
  {
    id: "sync-impressions",
    name: "Sync Impressions",
    category: "docs",
    slash: "sync-impressions",
    summary: "Reconcile DNA/Impressions/ with codebase when docs drift.",
    tags: ["docs", "impressions", "drift"],
    copyVariants: [
      "Our docs are out of date with the code",
      "Sync Impressions with the codebase",
    ],
    prompt: `# Sync Impressions

\`\`\`bash
npx dna scan
npx dna plan impressions-sync
\`\`\`

Scope: $ARGUMENTS

Update or generate Impressions from code. Use \`npx dna scan --open-pr\` for draft PR when drift exceeds \`impressions.autoPrThreshold\` in config.`,
    guidelines: GROUND,
    expectations: ["Drift items listed", "Threshold vs score", "Files to update", "Changes made or PR opened"],
    contextLoads: ["DNA/Impressions/", ".DNA/config.dna.json"],
    cliCommands: ["npx dna scan", "npx dna scan --open-pr", "npx dna plan impressions-sync"],
    examples: [
      {
        userSays: "Docs outdated",
        goodResponse: "Drift 41%. Updated architecture + API docs from code analysis. autoPrThreshold 50% — no PR yet.",
      },
    ],
    workflow: ["impressions-drift-pr"],
  },
  {
    id: "impressions-drift-pr",
    name: "Impressions drift PR",
    category: "docs",
    slash: "drift-pr",
    summary: "Open a draft GitHub PR when Impressions drift exceeds threshold.",
    tags: ["docs", "impressions", "drift", "github"],
    copyVariants: [
      "Open a PR to fix doc drift",
      "Impressions are stale — automate a sync PR",
      "Scan and open PR if drift is critical",
    ],
    prompt: `# Impressions drift PR

\`\`\`bash
npx dna scan
npx dna scan --open-pr
npx dna plan impressions-sync --open-pr
\`\`\`

Check \`.DNA/config.dna.json\` → \`impressions.driftThreshold\`, \`impressions.autoPrThreshold\`.

If drift exceeds threshold: run \`scan --open-pr\` to open a draft PR with sync plan. Summarize PR URL and files touched.`,
    guidelines: GROUND,
    expectations: [
      "Drift score vs thresholds",
      "PR opened or reason skipped",
      "Sync plan summary",
      "Manual follow-up if PR not opened",
    ],
    contextLoads: ["DNA/Impressions/", ".DNA/config.dna.json"],
    cliCommands: ["npx dna scan --open-pr", "npx dna plan impressions-sync --open-pr"],
    examples: [
      {
        userSays: "Open drift PR",
        goodResponse: "Drift 62% > autoPrThreshold 50%. Draft PR #42 opened with impressions-sync plan.",
      },
    ],
    workflow: ["sync-impressions", "github-push"],
  },
  {
    id: "document-from-code",
    name: "Document from code",
    category: "docs",
    slash: "document-code",
    summary: "Generate or update documentation from codebase analysis.",
    tags: ["docs", "generate"],
    copyVariants: ["Generate docs from this codebase", "Update architecture docs from code"],
    prompt: `# Document from code

\`\`\`bash
npx dna document
npx dna document --from-code
\`\`\`

Focus: $ARGUMENTS`,
    guidelines: GROUND,
    expectations: ["Docs generated/updated", "Paths listed", "Gaps remaining"],
    contextLoads: ["DNA/Impressions/"],
    cliCommands: ["npx dna document", "npx dna document --from-code"],
    examples: [{ userSays: "Document the API", goodResponse: "Generated integration-map.md from 80 routes." }],
    workflow: ["sync-impressions"],
  },

  // ─── IVF ─────────────────────────────────────────────────────────────────
  {
    id: "plan-ivf",
    name: "Plan IVF",
    category: "ivf",
    slash: "plan-ivf",
    summary: "Integrating Vertical Functions plan — phased brownfield integration.",
    tags: ["ivf", "brownfield", "plan"],
    copyVariants: [
      "Create an IVF plan for this monolith",
      "How do we integrate DNA without a rewrite?",
    ],
    prompt: `# Plan IVF

\`\`\`bash
npx dna plan ivf
\`\`\`

Context: $ARGUMENTS

Phased plan only — no big-bang rewrite. Phase 1 must be shippable alone.`,
    guidelines: { ...GROUND, never: [...GROUND.never, "Propose full rewrites without phased migration"] },
    expectations: ["Phases with scope", "Phase 1 deliverables", "Risk per phase", "DNA artifacts per phase"],
    contextLoads: ["DNA/Impressions/architecture/solution-architecture.md", ".DNA/workflows/"],
    cliCommands: ["npx dna plan ivf"],
    examples: [{ userSays: "IVF for legacy React", goodResponse: "4 phases. Phase 1: shared library extraction + build rules. 2 weeks." }],
    workflow: ["ivf-run", "ivf-shared-library"],
  },
  {
    id: "ivf-run",
    name: "Run IVF",
    category: "ivf",
    slash: "ivf-run",
    summary: "Brownfield IVF — analyze, document, plan, wire DNA into existing projects.",
    tags: ["ivf", "brownfield"],
    copyVariants: [
      "Run IVF on this brownfield project",
      "Integrate DNA into this legacy codebase",
    ],
    prompt: `# Run IVF

\`\`\`bash
npx dna ivf run
npx dna ivf run --quote "<goal>"
\`\`\`

Goal: $ARGUMENTS

Execute current IVF phase only. Update CellularMemory as you go.`,
    guidelines: GROUND,
    expectations: ["IVF phase executed", "Artifacts updated", "Next phase identified"],
    contextLoads: [".DNA/CellularMemory/", "DNA/Impressions/architecture/"],
    cliCommands: ["npx dna ivf run"],
    examples: [{ userSays: "Run IVF", goodResponse: "Phase 1 complete: humaan-ui package scaffolded, 3 components migrated." }],
    workflow: ["plan-ivf", "ivf-shared-library"],
  },
  {
    id: "ivf-shared-library",
    name: "IVF shared library",
    category: "ivf",
    slash: "ivf-shared-library",
    summary: "Shared library extraction — analyze, dry-run, scaffold packages/humaan-ui.",
    tags: ["ivf", "shared-library", "ui"],
    copyVariants: [
      "Extract a shared UI library",
      "Dry-run shared library extraction to packages/humaan-ui",
      "We have no shared component library — fix that",
    ],
    prompt: `# IVF shared library

\`\`\`bash
npx dna ivf shared-library --dry-run
npx dna ivf shared-library --scaffold
npx dna ivf shared-library --execute
\`\`\`

Scope: $ARGUMENTS

Dry-run first. \`--execute\` copies components, rewires imports, runs tests, rolls back on failure — only after approval.`,
    guidelines: { ...GROUND, must: [...GROUND.must, "Dry-run before scaffold or execute"] },
    expectations: ["Dry-run report", "Duplicate components identified", "Migration order", "Execute rollback plan if tests fail"],
    contextLoads: ["DNA/Impressions/architecture/solution-architecture.md"],
    cliCommands: [
      "npx dna ivf shared-library --dry-run",
      "npx dna ivf shared-library --scaffold",
      "npx dna ivf shared-library --execute",
    ],
    examples: [
      {
        userSays: "No shared library — P1 gap",
        goodResponse: "Dry-run: 23 duplicate UI patterns. Recommend packages/humaan-ui. Migrate Button, Modal first. Scaffold?",
      },
    ],
    workflow: ["ivf-shared-library-execute", "ship-feature", "quality-gate"],
  },
  {
    id: "ivf-shared-library-execute",
    name: "IVF shared library execute",
    category: "ivf",
    slash: "ivf-execute",
    summary: "Execute shared library extraction — copy, rewire imports, test, rollback on failure.",
    tags: ["ivf", "shared-library", "execute"],
    copyVariants: [
      "Execute the shared library migration",
      "Run ivf shared-library --execute",
      "Migrate duplicate UI components into packages/humaan-ui",
    ],
    prompt: `# IVF shared library execute

Requires prior \`--dry-run\` approval.

\`\`\`bash
npx dna ivf shared-library --execute
\`\`\`

Scope: $ARGUMENTS

Report: files copied, imports rewired, test result. If tests fail, confirm rollback completed.`,
    guidelines: { ...GROUND, must: [...GROUND.must, "Confirm dry-run was reviewed before execute"] },
    expectations: [
      "Execute summary",
      "Test pass/fail",
      "Rollback status if failed",
      "Next migration batch if partial",
    ],
    contextLoads: ["DNA/Impressions/architecture/solution-architecture.md"],
    cliCommands: ["npx dna ivf shared-library --execute"],
    examples: [
      {
        userSays: "Execute migration",
        goodResponse: "Migrated 8 components to packages/humaan-ui. Tests PASS. 15 components remain for phase 2.",
      },
    ],
    workflow: ["quality-gate", "github-push"],
  },

  // ─── Delivery ────────────────────────────────────────────────────────────
  {
    id: "docker-build",
    name: "Docker build",
    category: "delivery",
    slash: "docker-build",
    summary: "Build Docker image — mandatory feature factory close-out gate.",
    tags: ["delivery", "docker"],
    copyVariants: ["Build the Docker image", "Run docker build gate"],
    prompt: `# Docker build

\`\`\`bash
npx dna docker build
\`\`\`

Report image tag, build success/failure, fix blockers if failed.`,
    guidelines: GROUND,
    expectations: ["Build status", "Image identifier", "Failure logs summarized if failed"],
    contextLoads: [],
    cliCommands: ["npx dna docker build"],
    examples: [{ userSays: "Docker build", goodResponse: "Build succeeded. Image dna-app:latest." }],
    workflow: ["github-push"],
  },
  {
    id: "github-push",
    name: "GitHub push",
    category: "delivery",
    slash: "github-push",
    summary: "Commit and push feature branch after quality PASS.",
    tags: ["delivery", "github", "push"],
    copyVariants: ["Push this feature to GitHub", "Commit and push the branch"],
    prompt: `# GitHub push

Prerequisite: quality PASS.

\`\`\`bash
npx dna github push --message "feat: <summary>"
\`\`\`

Message context: $ARGUMENTS`,
    guidelines: FEATURE_GATES,
    expectations: ["Quality confirmed PASS", "Branch pushed", "PR URL if created", "CI triggered"],
    contextLoads: [],
    cliCommands: ["npx dna github push"],
    examples: [{ userSays: "Push it", goodResponse: "Pushed feature/admin-dashboard. CI running: github.com/..." }],
  },
  {
    id: "ci-install",
    name: "CI install",
    category: "delivery",
    slash: "ci-install",
    summary: "Scaffold GitHub Actions — lint, test, coverage, security.",
    tags: ["delivery", "ci", "github-actions"],
    copyVariants: ["Install DNA CI workflows", "Set up GitHub Actions for this project"],
    prompt: `# CI install

\`\`\`bash
npx dna ci install
\`\`\`

Workflows: lint/test/coverage (\`dna-ci.yml\`), security (\`dna-security.yml\`), preview (\`dna-preview.yml\` only when hosting is Vercel or Netlify — not guessed).

Summarize workflows created. Verify with doctor.`,
    guidelines: GROUND,
    expectations: ["Workflows listed", "Preview CI gating explained", "What each gate checks", "Doctor CI check status"],
    contextLoads: [".github/workflows/"],
    cliCommands: ["npx dna ci install", "npx dna doctor"],
    examples: [{ userSays: "Add CI", goodResponse: "Installed dna-ci.yml, dna-security.yml, dna-preview.yml." }],
  },

  // ─── Marketplace ─────────────────────────────────────────────────────────
  {
    id: "marketplace-search",
    name: "Marketplace search",
    category: "marketplace",
    slash: "marketplace-search",
    summary: "Search DNA knowledge packs by keyword.",
    tags: ["marketplace", "search"],
    copyVariants: ["Search marketplace for React packs", "Find GDPR knowledge packs"],
    prompt: `# Marketplace search

\`\`\`bash
npx dna marketplace search "<query>"
\`\`\`

Query: $ARGUMENTS

Present top matches with install commands.`,
    guidelines: GROUND,
    expectations: ["Top 5–10 matches", "Install command per pack", "Recommendation which to install first"],
    contextLoads: [".DNA/marketplace/installed.json"],
    cliCommands: ["npx dna marketplace search"],
    examples: [{ userSays: "Find React packs", goodResponse: "frameworks/react, tools/mui. Install frameworks/react?" }],
    workflow: ["marketplace-install"],
  },
  {
    id: "marketplace-install",
    name: "Marketplace install",
    category: "marketplace",
    slash: "marketplace-install",
    summary: "Install a knowledge pack into .DNA/knowledge/.",
    tags: ["marketplace", "install"],
    copyVariants: ["Install the React knowledge pack", "Add GDPR compliance pack to DNA"],
    prompt: `# Marketplace install

\`\`\`bash
npx dna marketplace install <packId>
\`\`\`

Pack: $ARGUMENTS

Load installed files. Summarize what rules now apply.`,
    guidelines: GROUND,
    expectations: ["Pack installed", "Files written", "Summary of new knowledge", "Suggest load-context target"],
    contextLoads: [".DNA/marketplace/installed.json"],
    cliCommands: ["npx dna marketplace install <packId>"],
    examples: [{ userSays: "Install react pack", goodResponse: "Installed frameworks/react. Load frontend context for session?" }],
    workflow: ["load-context"],
  },

  // ─── Memory ──────────────────────────────────────────────────────────────
  {
    id: "memory-export",
    name: "Memory export",
    category: "memory",
    slash: "memory-export",
    summary: "Export CellularMemory segments to JSON.",
    tags: ["memory", "export"],
    copyVariants: ["Export CellularMemory", "Backup DNA memory to JSON"],
    prompt: `# Memory export

\`\`\`bash
npx dna memory export --out .DNA/exports/memory.json
\`\`\`

Confirm export path and segment count.`,
    guidelines: GROUND,
    expectations: ["Export path", "Segments included", "File size / record count"],
    contextLoads: [".DNA/CellularMemory/"],
    cliCommands: ["npx dna memory export"],
    examples: [{ userSays: "Export memory", goodResponse: "Exported 7 segments to .DNA/exports/memory.json." }],
  },
  {
    id: "memory-import",
    name: "Memory import",
    category: "memory",
    slash: "memory-import",
    summary: "Import CellularMemory from export file with merge.",
    tags: ["memory", "import"],
    copyVariants: ["Import DNA memory from backup", "Merge CellularMemory from export file"],
    prompt: `# Memory import

\`\`\`bash
npx dna memory import <file> --merge
npx dna memory import <file> --on-conflict newest
\`\`\`

Conflict strategies: \`newest\` (default), \`keep-local\`, \`keep-remote\`.

File: $ARGUMENTS

Confirm merge result. Never overwrite without user consent.`,
    guidelines: { ...GROUND, never: [...GROUND.never, "Overwrite memory without explicit user consent"] },
    expectations: ["Import file validated", "Merge summary", "Conflicts resolved per strategy"],
    contextLoads: [".DNA/CellularMemory/"],
    cliCommands: [
      "npx dna memory import <file> --merge",
      "npx dna memory import <file> --on-conflict newest",
    ],
    examples: [{ userSays: "Import memory backup", goodResponse: "Merged 3 segments. 1 conflict resolved (newest)." }],
    workflow: ["memory-sync"],
  },
  {
    id: "memory-sync",
    name: "Memory sync",
    category: "memory",
    slash: "memory-sync",
    summary: "Sync CellularMemory from team registry — export, import, conflict resolution.",
    tags: ["memory", "sync", "team"],
    copyVariants: [
      "Sync DNA memory with the team registry",
      "Pull latest CellularMemory from shared path",
      "Merge team memory into this project",
    ],
    prompt: `# Memory sync

\`\`\`bash
npx dna memory sync
npx dna memory sync --registry <path>
npx dna memory import <file> --on-conflict keep-remote
\`\`\`

Registry path: from \`memory.teamRegistry\` in config or $ARGUMENTS.

Summarize segments synced, conflicts, and resolution strategy.`,
    guidelines: GROUND,
    expectations: [
      "Registry path used",
      "Segments imported/merged count",
      "Conflict strategy applied",
      "Remaining manual steps",
    ],
    contextLoads: [".DNA/CellularMemory/", ".DNA/config.dna.json"],
    cliCommands: ["npx dna memory sync", "npx dna memory export --out .DNA/exports/memory.json"],
    examples: [
      {
        userSays: "Sync team memory",
        goodResponse: "Synced from //team/.DNA/registry/memory.json. Merged 5 segments, 0 conflicts.",
      },
    ],
    workflow: ["memory-export", "memory-import"],
  },

  ...AGENT_LOOP_STEM_DEFS,
  ...METHODOLOGY_STEM_DEFS,
];
