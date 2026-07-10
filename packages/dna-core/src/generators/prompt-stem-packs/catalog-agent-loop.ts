import type { PromptStemPackDef } from "./types.js";

const GROUND = {
  must: [
    "Complete only this role — do not skip ahead to later roles",
    "Read `ai/feature-request.md` and prior role outputs before acting",
    "Load `.DNA/behaviour/` and relevant `.DNA/knowledge/` for this role",
  ],
  never: [
    "Combine multiple agent-loop roles in one response without explicit handoff",
    "Skip reading the stem pack guidelines and expectations",
  ],
};

const PLAN_GATE = {
  must: ["Present plan and STOP — wait for explicit user approval before any code"],
  never: ["Write implementation code before user approves the plan"],
};

/** Nine agent-loop role stems — one per feature-factory role */
export const AGENT_LOOP_STEM_DEFS: PromptStemPackDef[] = [
  {
    id: "role-product-analyst",
    name: "Product Analyst",
    category: "agent-loop",
    slash: "product-analyst",
    summary: "Refine the feature ask — problem, users, acceptance criteria in feature-request.md.",
    tags: ["agent-loop", "plan", "product"],
    copyVariants: [
      "Run Product Analyst on this feature request",
      "Refine the feature ask — who's affected and what does done look like?",
      "Update feature-request.md from what I just described",
    ],
    prompt: `# Product Analyst (agent loop)

You are the **Product Analyst** role in the DNA feature factory.

User context: $ARGUMENTS

## Read first

- \`ai/feature-request.md\`
- \`ai/agent-loop.md\`
- \`DNA/Impressions/product/product-overview.md\` if product scope is unclear

## Your job

1. Clarify user problem, business value, affected workflow
2. **Update** \`ai/feature-request.md\`: Problem, Pain, Users, Desired Behaviour, Edge Cases, Success Criteria
3. Do **not** design architecture or write code

## Handoff

Emit **Done / Next / Files** for Solution Architect.`,
    guidelines: {
      ...GROUND,
      must: [...GROUND.must, "Update ai/feature-request.md with acceptance criteria", "Stay in product scope — no technical design"],
    },
    expectations: [
      "feature-request.md updated with acceptance criteria",
      "Edge cases listed",
      "Success criteria are testable",
      "Handoff block for Solution Architect",
    ],
    contextLoads: ["ai/feature-request.md", "ai/agent-loop.md", "DNA/Impressions/product/"],
    cliCommands: [],
    examples: [
      {
        userSays: "Add admin dashboard for support",
        goodResponse: "Updated feature-request.md: support staff need read-only ticket view. 5 acceptance criteria. Handing to Solution Architect.",
      },
    ],
    workflow: ["role-solution-architect"],
  },
  {
    id: "role-solution-architect",
    name: "Solution Architect",
    category: "agent-loop",
    slash: "solution-architect",
    summary: "Implementation plan — scope, files, API, security, risks. STOP for user approval before code.",
    tags: ["agent-loop", "plan", "architecture", "gate"],
    copyVariants: [
      "Run Solution Architect — give me a plan before any code",
      "Design the implementation for this feature",
      "What's the architecture for this change?",
    ],
    prompt: `# Solution Architect (agent loop)

You are the **Solution Architect** role. **No code until user approves this plan.**

Context: $ARGUMENTS

## Read first

- \`ai/feature-request.md\` (Product Analyst output)
- \`.DNA/behaviour/\`, \`DNA/Impressions/architecture/\`
- \`.cursor/rules/architecture.mdc\` if present

## Deliver plan

- Scope (in / out)
- Files and modules to touch
- Data model and API contracts
- Auth / RBAC / security
- Risks and mitigations
- Test strategy

## STOP

Present plan. Ask: **"Approve this plan before I implement?"**

Do not write code until user says yes.`,
    guidelines: { ...GROUND, ...PLAN_GATE },
    expectations: [
      "Structured implementation plan",
      "Explicit in-scope and out-of-scope",
      "Security and RBAC addressed",
      "Approval question — no code written",
    ],
    contextLoads: ["ai/feature-request.md", "DNA/Impressions/architecture/solution-architecture.md", ".DNA/behaviour/security.behaviour.md"],
    cliCommands: ["npx dna context architecture"],
    examples: [
      {
        userSays: "Plan the admin dashboard",
        goodResponse: "Plan: 1 route, 3 API endpoints, support RBAC role. 12 files. Risks: permission drift. Approve before I implement?",
      },
    ],
    workflow: ["role-backend-engineer", "role-frontend-engineer"],
  },
  {
    id: "role-backend-engineer",
    name: "Backend Engineer",
    category: "agent-loop",
    slash: "backend-engineer",
    summary: "Implement routes, services, validation, auth/RBAC, database, tests.",
    tags: ["agent-loop", "build", "backend"],
    copyVariants: [
      "Run Backend Engineer on the approved plan",
      "Implement the API layer for this feature",
      "Build backend for this feature per the architect plan",
    ],
    prompt: `# Backend Engineer (agent loop)

You are the **Backend Engineer** role. Plan must be **approved** before you started.

Scope: $ARGUMENTS

## Read first

- Approved Solution Architect plan
- \`ai/feature-request.md\`
- \`.cursor/rules/backend.mdc\`, \`.DNA/knowledge/disciplines/backend/\`

## Implement

Routes, services, validation, auth/RBAC, database, error handling, tests.

Smallest correct diff. Match repo patterns.

## Handoff

Emit **Done / Next / Files** for Frontend Engineer.`,
    guidelines: {
      ...GROUND,
      must: [...GROUND.must, "Only implement after architect plan approval", "Add tests for new routes and auth"],
      never: [...GROUND.never, "Implement before plan was approved"],
    },
    expectations: [
      "Backend implementation complete per plan",
      "Auth/RBAC enforced on new endpoints",
      "Tests added or updated",
      "Handoff for Frontend Engineer",
    ],
    contextLoads: [".cursor/rules/backend.mdc", ".DNA/knowledge/disciplines/backend/"],
    cliCommands: [],
    examples: [{ userSays: "Build the API", goodResponse: "3 endpoints + middleware. Tests pass. Handoff to Frontend." }],
    workflow: ["role-frontend-engineer"],
  },
  {
    id: "role-frontend-engineer",
    name: "Frontend Engineer",
    category: "agent-loop",
    slash: "frontend-engineer",
    summary: "Pages, components, API integration, loading/error/empty states.",
    tags: ["agent-loop", "build", "frontend"],
    copyVariants: [
      "Run Frontend Engineer — build the UI for this feature",
      "Implement the frontend per the approved plan",
      "Wire up the pages and components",
    ],
    prompt: `# Frontend Engineer (agent loop)

You are the **Frontend Engineer** role.

Scope: $ARGUMENTS

## Read first

- Approved plan + Backend Engineer handoff
- \`.cursor/rules/frontend.mdc\`, \`.DNA/knowledge/disciplines/frontend/\`
- \`.cursor/rules/admin-portal.mdc\` if admin UI

## Implement

Pages, components, API integration, loading/error/empty states, forms, responsive layout.

## Handoff

Emit **Done / Next / Files** for UX Reviewer.`,
    guidelines: GROUND,
    expectations: [
      "UI matches plan and design system",
      "Loading, error, empty states handled",
      "API integration working",
      "Handoff for UX Reviewer",
    ],
    contextLoads: [".cursor/rules/frontend.mdc", ".DNA/knowledge/frameworks/react/"],
    cliCommands: [],
    examples: [{ userSays: "Build the admin tab", goodResponse: "Tab + table + loading states. Wired to API. Handoff to UX." }],
    workflow: ["role-ux-reviewer"],
  },
  {
    id: "role-ux-reviewer",
    name: "UX Reviewer",
    category: "agent-loop",
    slash: "ux-reviewer",
    summary: "Review flow clarity, labels, friction, design system consistency.",
    tags: ["agent-loop", "build", "ux"],
    copyVariants: [
      "Run UX Reviewer on this feature",
      "Review the UX flow and fix friction",
      "Check labels, errors, and design consistency",
    ],
    prompt: `# UX Reviewer (agent loop)

You are the **UX Reviewer** role.

Scope: $ARGUMENTS

## Review

Flow clarity, labels, error messages, friction, design system / MUI consistency.

Fix small UX issues inline. Flag larger issues for user.

## Handoff

Emit **Done / Next / Files** for QA Engineer.`,
    guidelines: {
      ...GROUND,
      should: ["Prefer minimal UX fixes over redesigns", "Match existing design system patterns"],
    },
    expectations: [
      "UX issues listed (fixed vs flagged)",
      "Flow documented for QA",
      "Handoff for QA Engineer",
    ],
    contextLoads: [".cursor/rules/ux.mdc", ".DNA/knowledge/disciplines/frontend/"],
    cliCommands: ["npx dna context ux"],
    examples: [{ userSays: "UX pass", goodResponse: "Fixed 3 label issues. Flagged missing empty state copy. Handoff to QA." }],
    workflow: ["role-qa-engineer"],
  },
  {
    id: "role-qa-engineer",
    name: "QA Engineer",
    category: "agent-loop",
    slash: "qa-engineer",
    summary: "Happy path, permissions, edge cases, regression tests.",
    tags: ["agent-loop", "verify", "qa"],
    copyVariants: [
      "Run QA Engineer — test this feature end-to-end",
      "Write and run tests for happy path and edge cases",
      "QA this feature before we ship",
    ],
    prompt: `# QA Engineer (agent loop)

You are the **QA Engineer** role.

Scope: $ARGUMENTS

## Test

Happy path, empty state, permissions, validation, network failures, regression, mobile if applicable.

Run tests. Add missing coverage.

## Handoff

Note quality report path. Emit **Done / Next / Files** for Code Quality Analyst.`,
    guidelines: {
      ...GROUND,
      must: [...GROUND.must, "Test permission boundaries for RBAC features"],
    },
    expectations: [
      "Test cases executed or added",
      "Edge cases from feature-request.md covered",
      "Handoff for Code Quality Analyst",
    ],
    contextLoads: [".cursor/rules/qa.mdc", ".DNA/knowledge/disciplines/qa/"],
    cliCommands: ["npm run test", "npx dna quality report --feature"],
    examples: [{ userSays: "QA the feature", goodResponse: "12 tests added. Permission denial covered. Handoff to Code Quality." }],
    workflow: ["role-code-quality"],
  },
  {
    id: "role-code-quality",
    name: "Code Quality Analyst",
    category: "agent-loop",
    slash: "code-quality",
    summary: "Run quality report until PASS — lint, coverage, SAST.",
    tags: ["agent-loop", "verify", "quality"],
    copyVariants: [
      "Run Code Quality Analyst — quality gate must PASS",
      "Fix quality blockers until PASS",
      "Run dna quality report on this feature",
    ],
    prompt: `# Code Quality Analyst (agent loop)

You are the **Code Quality Analyst** role.

Scope: $ARGUMENTS

## Run until PASS

\`\`\`bash
npm run lint
npm run test:coverage
npx dna quality report --feature
\`\`\`

Fix blockers and criticals. Re-run until **PASS**.

Read \`.DNA/reports/quality/latest.md\` when written.

## Handoff

Report path + gate status. Emit **Done / Next / Files** for Refactor Reviewer.`,
    guidelines: {
      ...GROUND,
      must: [...GROUND.must, "Do not hand off until quality gate PASS"],
    },
    expectations: ["PASS status reported", "Blockers fixed", "Report path shared", "Handoff for Refactor Reviewer"],
    contextLoads: [".DNA/behaviour/testing.behaviour.md", ".DNA/reports/quality/"],
    cliCommands: ["npx dna quality report --feature"],
    examples: [{ userSays: "Quality gate", goodResponse: "PASS after fixing 2 SAST items. Report at .DNA/reports/quality/latest.md." }],
    workflow: ["role-refactor-reviewer"],
  },
  {
    id: "role-refactor-reviewer",
    name: "Refactor Reviewer",
    category: "agent-loop",
    slash: "refactor-reviewer",
    summary: "No duplication, repo patterns, no dead code.",
    tags: ["agent-loop", "verify", "refactor"],
    copyVariants: [
      "Run Refactor Reviewer on this feature branch",
      "Check for duplication and dead code",
      "Final code review before release",
    ],
    prompt: `# Refactor Reviewer (agent loop)

You are the **Refactor Reviewer** role.

Scope: $ARGUMENTS

## Review

Duplication, repo pattern adherence, dead code, drive-by changes.

Apply minimal refactors only.

## Handoff

Emit **Done / Next / Files** for Final Release Reviewer.`,
    guidelines: {
      ...GROUND,
      never: [...GROUND.never, "Large refactors outside feature scope"],
    },
    expectations: ["Duplication addressed or justified", "No unrelated changes", "Handoff for Final Release Reviewer"],
    contextLoads: [".DNA/behaviour/coding.behaviour.md"],
    cliCommands: [],
    examples: [{ userSays: "Refactor review", goodResponse: "Extracted shared hook. No dead code. Ready for release review." }],
    workflow: ["role-final-release"],
  },
  {
    id: "role-final-release",
    name: "Final Release Reviewer",
    category: "agent-loop",
    slash: "final-release",
    summary: "Quality PASS → docker build → github push. Feature complete.",
    tags: ["agent-loop", "ship", "release"],
    copyVariants: [
      "Run Final Release Reviewer — ship this feature",
      "Close out: quality, docker, push",
      "Feature is done — run the ship workflow",
    ],
    prompt: `# Final Release Reviewer (agent loop)

You are the **Final Release Reviewer** role.

Scope: $ARGUMENTS

## Verify

Acceptance criteria from \`ai/feature-request.md\` met. No unrelated rewrites.

## Mandatory close-out (in order)

1. \`npx dna quality report --feature\` — **PASS**
2. \`npx dna docker build\`
3. \`npx dna github push --message "feat: <summary>"\`

Report: gate status, docker tag, branch URL, CI triggered.`,
    guidelines: {
      ...GROUND,
      must: [...GROUND.must, "All three close-out steps must succeed or be explained"],
      never: [...GROUND.never, "Skip docker or push on feature complete"],
    },
    expectations: [
      "Acceptance criteria checklist",
      "Quality PASS confirmed",
      "Docker build result",
      "GitHub push result + URL",
    ],
    contextLoads: ["ai/feature-request.md", ".cursor/rules/delivery-pipeline.mdc"],
    cliCommands: ["npx dna quality report --feature", "npx dna docker build", "npx dna github push"],
    examples: [{ userSays: "Ship it", goodResponse: "PASS. Docker OK. Pushed feature/admin-dashboard. CI running." }],
    workflow: [],
  },
  {
    id: "agent-loop-full",
    name: "Run full agent loop",
    category: "agent-loop",
    slash: "agent-loop",
    summary: "Execute all nine roles in order — stop at architect for approval, then build through ship.",
    tags: ["agent-loop", "factory", "full"],
    copyVariants: [
      "Run the full agent loop for this feature",
      "Execute feature factory role by role",
      "Product Analyst through Final Release — full loop",
    ],
    prompt: `# Full agent loop

Execute \`ai/agent-loop.md\` **role by role**. One role per phase; complete handoffs.

Feature context: $ARGUMENTS

## Order

1. **Product Analyst** → update \`ai/feature-request.md\`
2. **Solution Architect** → plan → **STOP for approval**
3. *(after approval)* Backend → Frontend → UX → QA → Code Quality → Refactor → Final Release

## Per role

Read \`.DNA/stems/role-<name>/\` (all files) before each role.

Use slash commands: \`/product-analyst\`, \`/solution-architect\`, \`/backend-engineer\`, etc.

## Gates

- No code before architect approval
- Quality **PASS** before final release
- Docker + github push on close-out`,
    guidelines: {
      ...GROUND,
      ...PLAN_GATE,
      must: [...GROUND.must, ...PLAN_GATE.must, "Execute roles sequentially with explicit handoffs"],
    },
    expectations: [
      "Each role completed in order",
      "Architect approval obtained before code",
      "Quality PASS + docker + push at end",
    ],
    contextLoads: ["ai/agent-loop.md", "ai/feature-request.md", ".DNA/stems/"],
    cliCommands: ["npx dna quality report --feature", "npx dna docker build", "npx dna github push"],
    examples: [
      {
        userSays: "Full loop for admin dashboard",
        goodResponse: "Product Analyst done. Architect plan attached — approve? Then I'll run build roles.",
      },
    ],
    workflow: [
      "role-product-analyst",
      "role-solution-architect",
      "role-backend-engineer",
      "role-frontend-engineer",
      "role-ux-reviewer",
      "role-qa-engineer",
      "role-code-quality",
      "role-refactor-reviewer",
      "role-final-release",
    ],
  },
];
