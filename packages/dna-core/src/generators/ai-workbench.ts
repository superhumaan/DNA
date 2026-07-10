import { unlink } from "node:fs/promises";
import { join } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { fileExists, writeFileEnsured, writeJsonFile } from "../fs.js";

/** Paths installed by the DNA AI Workbench (prompt-first Cursor + Claude package). */
export const AI_WORKBENCH_PATHS = [
  ".cursor/rules/dna-workbench.mdc",
  ".cursor/skills/dna-workbench/SKILL.md",
  ".cursor/skills/dna-workbench/prompt-patterns.md",
  ".cursor/skills/dna-workbench/dna-session-flow.md",
  ".cursor/commands/work-with-dna.md",
  ".cursor/commands/ship-feature.md",
  ".cursor/commands/analyze-project.md",
  ".cursor/commands/health-check.md",
  ".cursor/commands/quality-gate.md",
  ".cursor/commands/plan-compliance.md",
  ".cursor/commands/debug-issue.md",
  ".cursor/commands/sync-impressions.md",
  ".cursor/commands/load-context.md",
  ".claude/skills/dna-workbench/SKILL.md",
  ".claude/skills/dna-workbench/prompt-patterns.md",
  ".claude/skills/dna-workbench/dna-session-flow.md",
  ".claude/commands/work-with-dna.md",
  ".claude/commands/ship-feature.md",
  ".claude/commands/analyze-project.md",
  ".claude/commands/health-check.md",
  ".claude/commands/quality-gate.md",
  ".claude/commands/plan-compliance.md",
  ".claude/commands/debug-issue.md",
  ".claude/commands/sync-impressions.md",
  ".claude/commands/load-context.md",
] as const;

function mdcRule(description: string, alwaysApply = false): string {
  const lines = [`description: ${description}`];
  if (alwaysApply) lines.push("alwaysApply: true");
  else lines.push('globs: ["**/*"]');
  return `---\n${lines.join("\n")}\n---\n\n`;
}

function buildWorkbenchRule(config: DnaConfig): string {
  return `${mdcRule("DNA Workbench — prompt-first Cursor workflow with DNA CLI as your engineering co-pilot", true)}# DNA Workbench — ${config.projectName}

You are the user's **engineering co-pilot** inside Cursor. DNA is installed. The user speaks in plain language; you handle DNA context, CLI, planning, and implementation.

## How the user works (never break this)

- They **do not** run \`dna\` commands manually unless they choose to.
- They **do not** copy prompts, fill templates, or manage \`.DNA/\` files.
- They describe goals: *"analyze this repo"*, *"add admin portal"*, *"fix the auth bug"*, *"are we GDPR ready?"*
- You **run DNA via shell** (\`npx dna …\`), load project intelligence, then act.

## Session bootstrap (every new task)

1. **Intent** — What does the user want? (health, feature, analysis, compliance, debug, docs)
2. **Context** — Read \`.DNA/neuralNetwork.json\`; load matching \`.DNA/knowledge/\`, \`.DNA/behaviour/\`, \`DNA/Impressions/\`
3. **DNA CLI** — Run the matching command(s) in shell; read real output
4. **Plan** — Short plan before code (mandatory for features)
5. **Execute** — Implement, test, quality gate, ship

## Intent → DNA action (run in shell)

| User intent | Run first | Then |
|-------------|-----------|------|
| Setup / fix DNA / hooks / CI | \`npx dna doctor\` | Summarize ✓/✗; fix gaps |
| Understand codebase / gaps | \`npx dna analyze\` | Prioritize P1 gaps; propose plan |
| Quick stack scan | \`npx dna scan\` | Note drift score |
| New feature / change | Update \`ai/feature-request.md\`; read \`ai/agent-loop.md\` | Stop after architect plan for approval |
| Domain depth (security, QA, etc.) | \`npx dna context <target>\` | Apply output to session |
| Pre-push / done? | \`npx dna quality report --feature\` | PASS required before push |
| Ship feature | quality PASS → \`npx dna docker build\` → \`npx dna github push\` | Report URLs |
| Compliance | \`npx dna plan compliance\` | Install packs; implement controls |
| Docs out of sync | \`npx dna plan impressions-sync\` | Reconcile Impressions |
| Knowledge gap | \`npx dna marketplace search\` / \`install\` | Load new packs |

Prefer \`npx dna\` when \`dna\` is not on PATH.

## Prompt engineering rules (2025–2026)

- **Spec before code** — Restate the ask; list acceptance criteria; get approval on architecture for non-trivial work.
- **Ground in DNA** — Never guess stack, auth, or compliance; read Behaviour and Impressions first.
- **Tool honesty** — Run real shell commands; never invent CLI output.
- **Narrow scope** — Smallest correct diff; no drive-by refactors.
- **Verify loops** — lint → test → \`dna quality report --feature\` → docker → push.
- **One voice** — Plain language summaries for the user; technical depth in code and plans.

## Feature factory (automatic)

When the user describes something to build, add, enable, or fix:

1. Write \`ai/feature-request.md\` from their words
2. Execute \`ai/agent-loop.md\` role by role
3. **Stop after Solution Architect plan — wait for approval**
4. After approval: implement → QA → quality gate → docker → github push

See \`.cursor/rules/product-process.mdc\` and \`.cursor/skills/dna-workbench/dna-session-flow.md\`.

## Slash commands (prompt templates)

Type \`/\` in chat: \`work-with-dna\`, \`ship-feature\`, \`analyze-project\`, \`health-check\`, \`quality-gate\`, etc.

Catalog: https://dna.humaan.app/intelligence

## Hard gates

- Quality **PASS** before marking work complete or pushing
- **Never** force-push \`main\`/\`master\`
- **Never** auto-merge AI repair PRs
- **Never** commit secrets from CLI output
`;
}

function buildPromptPatterns(): string {
  return `# DNA prompt patterns

Patterns for working in Cursor/Claude with DNA. Use these internally; the user stays in plain language.

## 1. Layered context (load bottom-up)

\`\`\`
neuralNetwork.json  →  which knowledge/behaviour/memory to load
behaviour/*.md        →  non-negotiable project rules
.DNA/knowledge/       →  stack + domain packs
DNA/Impressions/      →  human system docs
CellularMemory/       →  project history
\`\`\`

## 2. Plan-then-act (features)

\`\`\`
User quote → feature-request.md → Product Analyst → Solution Architect
→ [STOP for approval] → Backend → Frontend → UX → QA → Quality → Ship
\`\`\`

## 3. CLI-as-tool (not CLI-as-product)

DNA CLI is a **tool you invoke**, like tests or lint. The product experience is conversation in Cursor.

Example internal chain:
- User: "Is DNA set up correctly?"
- You: run \`npx dna doctor\` → parse output → explain in plain English → fix if needed

## 4. Structured handoffs

When switching roles (agent-loop), emit:
- **Done** — what was decided
- **Next** — what the next role needs
- **Files** — paths touched or to read

## 5. Verification prompts (self-check before reply)

- Did I load DNA context or guess?
- Did I run real commands when DNA had a command for this?
- Did I stop for approval before coding a feature?
- Would \`dna quality report --feature\` pass?

## 6. User-facing replies

- Lead with outcome, not command names
- Show DNA output only when it helps decision-making
- Offer one clear next step
`;
}

function buildSessionFlow(): string {
  return `# DNA session flow

## A. First message in a DNA project

1. Acknowledge DNA is active (no lecture).
2. If task is unclear, ask one focused question.
3. Load neuralNetwork + relevant behaviour.
4. Proceed.

## B. "Analyze / understand / audit"

1. \`npx dna analyze\` (and \`npx dna scan\` if drift matters)
2. Summarize: stack, surfaces, auth, integrations, P1–P3 gaps
3. Recommend ordered next steps (IVF, packs, features)

## C. "Build / add / fix" (feature)

1. Capture quote in \`ai/feature-request.md\`
2. Run agent-loop through Solution Architect
3. Present plan; **wait**
4. Implement with role discipline
5. Close: quality → docker → github push

## D. "Ship / push / done"

1. \`npx dna quality report --feature\` — must PASS
2. \`npx dna docker build\`
3. \`npx dna github push\`
4. Confirm CI/preview triggered

## E. "Debug / production error"

1. Check \`.DNA/data/runtime.db\` / dashboard: \`npx dna dashboard\`
2. Classify against Behaviour + Immune System
3. Fix → test → quality → push
4. Optional: \`npx dna ai repair\` (human review only)

## F. "Compliance / GDPR / HIPAA"

1. \`npx dna compliance list\`
2. \`npx dna plan compliance\` with tier + frameworks
3. Install packs; implement; document in Impressions
`;
}

function buildSkill(config: DnaConfig, tool: "cursor" | "claude"): string {
  const cmdPath = tool === "cursor" ? ".cursor/commands" : ".claude/commands";
  const skillPath = tool === "cursor" ? ".cursor/skills/dna-workbench" : ".claude/skills/dna-workbench";

  return `---
name: dna-workbench
description: >-
  DNA Workbench for ${config.projectName} — prompt-first engineering in ${tool === "cursor" ? "Cursor" : "Claude Code"}.
  Use when the user works on features, analysis, compliance, debugging, or mentions DNA, project health,
  quality gates, or shipping. Run npx dna CLI on their behalf; never make them copy prompts.
---

# DNA Workbench

The user works in **plain language**. You run **DNA CLI in shell**, load **\`.DNA/\` intelligence**, and ship with **quality gates**.

## Read first

- \`${skillPath}/dna-session-flow.md\` — session types A–F
- \`${skillPath}/prompt-patterns.md\` — how to prompt and verify
- \`.cursor/rules/dna-workbench.mdc\` — always-on obedience (Cursor)
- \`ai/agent-loop.md\` — feature factory roles

## Slash prompts

| Command | Use when |
|---------|----------|
| \`/work-with-dna\` | Start or reset a DNA-aware session |
| \`/analyze-project\` | Brownfield analysis + gap plan |
| \`/ship-feature\` | Plain-language feature → factory → ship |
| \`/health-check\` | Doctor + validate |
| \`/quality-gate\` | Pre-push SAST + toolchain |
| \`/plan-compliance\` | Tiered compliance rollout |
| \`/debug-issue\` | Runtime / defect loop |
| \`/sync-impressions\` | Docs drift reconciliation |
| \`/load-context\` | Load domain context for a target |

Commands live in \`${cmdPath}/\`.

## Non-negotiable

- Run real \`npx dna\` commands — never fake output
- Feature work stops for approval after Solution Architect plan
- Quality PASS before complete or push
`;
}

function buildWorkWithDnaPrompt(config: DnaConfig): string {
  return `# Work with DNA

You are in **${config.projectName}** with DNA by Humaan installed. The user wants a DNA-aware session.

## Your job

Be their engineering co-pilot. They speak normally; you use DNA intelligence and CLI tools.

## Step 1 — Understand the ask

Restate what they want in one sentence. If ambiguous, ask **one** clarifying question.

User context: $ARGUMENTS

## Step 2 — Load project intelligence

Read in order:
1. \`.DNA/neuralNetwork.json\`
2. Relevant \`.DNA/behaviour/*.behaviour.md\`
3. Matching \`.DNA/knowledge/\` packs for their intent
4. \`DNA/Impressions/\` if architecture or product questions

## Step 3 — Run DNA if applicable

| If they want… | Shell |
|---------------|-------|
| Health / setup | \`npx dna doctor\` |
| Understanding / gaps | \`npx dna analyze\` |
| Domain pack | \`npx dna context <target>\` |
| Feature | follow \`/ship-feature\` |

Execute commands. Read full output.

## Step 4 — Respond

- Plain-language summary
- Concrete next step (one primary action)
- No jargon about "prompts" or "templates"
`;
}

function buildShipFeaturePrompt(): string {
  return `# Ship a feature (DNA feature factory)

The user wants to build or change something. Run the **feature factory** — they do not manage files manually.

User request: $ARGUMENTS

## Phase 1 — Capture (do now)

1. Write or update \`ai/feature-request.md\` from their request (Problem, Users, Desired Behaviour, Edge Cases, Success Criteria).
2. If admin/backoffice mentioned: read \`.cursor/rules/admin-portal.mdc\`.

## Phase 2 — Agent loop (read \`ai/agent-loop.md\`)

Execute each role in order. **Complete one before the next.**

### Product Analyst
Refine \`ai/feature-request.md\`. Output: acceptance criteria.

### Solution Architect
Produce implementation plan: scope, files, data model, API, security, risks, tests.

**STOP HERE. Present plan. Wait for explicit user approval before any code.**

---

*(After approval only)*

### Backend → Frontend → UX → QA → Code Quality → Refactor → Final Review

Code Quality must run \`npx dna quality report --feature\` until **PASS**.

## Phase 3 — Close-out (mandatory)

1. \`npx dna quality report --feature\` — PASS
2. \`npx dna docker build\`
3. \`npx dna github push --message "feat: <summary>"\`

Report: gate status, docker result, branch URL.

## Rules

- Smallest correct diff
- No unrelated file changes
- Never skip approval before implementation
`;
}

function buildAnalyzeProjectPrompt(): string {
  return `# Analyze project

Deep understanding of this codebase through DNA — for brownfield, onboarding, or architecture review.

Focus: $ARGUMENTS

## Run analysis

\`\`\`bash
npx dna analyze
npx dna scan
\`\`\`

Read full output. Do not invent findings.

## Deliver report

### Stack & surfaces
Package manager, frontend/backend, routes, APIs, test count.

### Auth & integrations
Patterns detected and where they live.

### Vertical gaps
List **P1** first, then P2/P3. For each: what's missing and recommended DNA action (\`plan ivf\`, marketplace pack, feature, etc.).

### Recommended path
Ordered 3–5 steps the user should take next.

## Optional follow-up

If P1 includes Impressions or Behaviour gaps:
\`\`\`bash
npx dna document --from-code
npx dna plan ivf
\`\`\`
`;
}

function buildHealthCheckPrompt(): string {
  return `# DNA health check

Verify DNA and project scaffolding are healthy.

Scope: $ARGUMENTS

## Run

\`\`\`bash
npx dna doctor
npx dna validate
\`\`\`

Use \`npx dna doctor --check-only\` only if user asked for report-only.

## Report

For each check: ✓ or ✗ in plain language.

List doctor actions taken (files created/updated).

If git hooks or CI failed: explain fix and offer to repair (re-run doctor without --check-only).

## After health is green

Suggest one high-value next command based on user goal (\`analyze\`, \`ship-feature\`, \`load-context\`).
`;
}

function buildQualityGatePrompt(): string {
  return `# Quality gate

Local SonarQube-style gate before ship. **Required** before marking work complete or pushing.

Scope: $ARGUMENTS

## Run

\`\`\`bash
npm run lint
npm run test:coverage
npx dna quality report --feature
\`\`\`

Add \`--paths\` if scoping to specific files.

## Interpret

- **PASS** — no blocker/critical; safe to proceed to docker + push
- **FAIL** — list blockers/criticals with file paths; fix and re-run until PASS

Read \`.DNA/reports/quality/latest.md\` when written.

## On PASS

Offer: \`npx dna docker build\` then \`npx dna github push\` if user is shipping.
`;
}

function buildPlanCompliancePrompt(): string {
  return `# Plan compliance

Tiered GDPR, HIPAA, ISO 27001, SOC 2, or PCI planning.

Requirement: $ARGUMENTS

## Discover tier

\`\`\`bash
npx dna compliance list
npx dna plan compliance
\`\`\`

Ask user for org tier (startup → enterprise) and frameworks if not in message.

## Deliver

- Controls mapped to tier
- Knowledge packs to install (\`npx dna marketplace install …\`)
- Engineering checklist from plan output
- Impressions/docs to update

Load compliance context:
\`\`\`bash
npx dna context compliance
\`\`\`

**Not legal advice** — flag human review for policy sign-off.
`;
}

function buildDebugIssuePrompt(): string {
  return `# Debug issue

Systematic debug with DNA runtime context and quality loop.

Issue: $ARGUMENTS

## Gather

1. Error message, stack, endpoint, repro steps
2. \`.DNA/data/runtime.db\` or \`npx dna dashboard\` for classified events
3. Relevant \`.DNA/behaviour/\` (security, runtime)

## Fix loop

1. Reproduce → root cause → minimal fix
2. Tests for regression
3. \`npx dna quality report --feature\` — PASS
4. Push when user wants ship

Optional classified repair (never auto-merge):
\`\`\`bash
npx dna ai repair --dry-run
\`\`\`
`;
}

function buildSyncImpressionsPrompt(): string {
  return `# Sync Impressions

Reconcile human docs (\`DNA/Impressions/\`) with the codebase.

Context: $ARGUMENTS

## Assess drift

\`\`\`bash
npx dna scan
npx dna plan impressions-sync
\`\`\`

## Execute plan

Apply doc updates from plan. Prefer \`npx dna document --from-code\` when reverse-engineering.

Confirm drift score improved on re-scan.
`;
}

function buildLoadContextPrompt(): string {
  return `# Load DNA context

Load AI-ready domain context into this session.

Target: $ARGUMENTS

## Run

\`\`\`bash
npx dna context <target>
\`\`\`

Valid targets include: \`cursor\`, \`claude\`, \`backend\`, \`frontend\`, \`security\`, \`qa\`, \`devops\`, \`compliance\`, \`rbac\`, \`ivf\`, \`platform\`, \`all\`.

## Apply

Use the emitted context for all subsequent work in this session. Load referenced \`.DNA/knowledge/\` files.

Confirm to user which domains are now active.
`;
}

function claudeFrontmatter(description: string, hint?: string): string {
  return [
    "---",
    `description: ${description}`,
    hint ? `argument-hint: ${hint}` : null,
    "allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write",
    "---",
    "",
  ]
    .filter(Boolean)
    .join("\n");
}

type PromptDef = { cursor: string; claude: string; description: string; hint?: string };

function promptFiles(config: DnaConfig): Record<string, string> {
  const defs: Record<string, PromptDef> = {
    "work-with-dna": {
      description: "Start a DNA-aware Cursor session — plain language, DNA runs the CLI",
      hint: "[what you want to do]",
      cursor: buildWorkWithDnaPrompt(config),
      claude: buildWorkWithDnaPrompt(config),
    },
    "ship-feature": {
      description: "Ship a feature via DNA factory — plan, approve, implement, quality, push",
      hint: "[plain-language feature request]",
      cursor: buildShipFeaturePrompt(),
      claude: buildShipFeaturePrompt(),
    },
    "analyze-project": {
      description: "Deep DNA analysis — stack, gaps, and recommended next steps",
      hint: "[optional focus area]",
      cursor: buildAnalyzeProjectPrompt(),
      claude: buildAnalyzeProjectPrompt(),
    },
    "health-check": {
      description: "DNA doctor + validate — scaffold health and behaviour compliance",
      hint: "[--check-only optional]",
      cursor: buildHealthCheckPrompt(),
      claude: buildHealthCheckPrompt(),
    },
    "quality-gate": {
      description: "Pre-ship quality gate — lint, coverage, dna quality report",
      hint: "[files or feature scope]",
      cursor: buildQualityGatePrompt(),
      claude: buildQualityGatePrompt(),
    },
    "plan-compliance": {
      description: "Plan tiered compliance (GDPR, HIPAA, ISO, SOC2, PCI)",
      hint: "[tier and frameworks]",
      cursor: buildPlanCompliancePrompt(),
      claude: buildPlanCompliancePrompt(),
    },
    "debug-issue": {
      description: "Debug with DNA runtime context and fix loop",
      hint: "[error or symptom]",
      cursor: buildDebugIssuePrompt(),
      claude: buildDebugIssuePrompt(),
    },
    "sync-impressions": {
      description: "Reconcile DNA Impressions docs with codebase",
      hint: "[optional scope]",
      cursor: buildSyncImpressionsPrompt(),
      claude: buildSyncImpressionsPrompt(),
    },
    "load-context": {
      description: "Load DNA domain context (security, backend, compliance, etc.)",
      hint: "<target>",
      cursor: buildLoadContextPrompt(),
      claude: buildLoadContextPrompt(),
    },
  };

  const files: Record<string, string> = {};
  for (const [name, def] of Object.entries(defs)) {
    files[`.cursor/commands/${name}.md`] = def.cursor;
    files[`.claude/commands/${name}.md`] = claudeFrontmatter(def.description, def.hint) + def.claude;
  }
  return files;
}

export function generateAiWorkbenchFiles(config: DnaConfig): Record<string, string> {
  return {
    ".cursor/rules/dna-workbench.mdc": buildWorkbenchRule(config),
    ".cursor/skills/dna-workbench/SKILL.md": buildSkill(config, "cursor"),
    ".cursor/skills/dna-workbench/prompt-patterns.md": buildPromptPatterns(),
    ".cursor/skills/dna-workbench/dna-session-flow.md": buildSessionFlow(),
    ".claude/skills/dna-workbench/SKILL.md": buildSkill(config, "claude"),
    ".claude/skills/dna-workbench/prompt-patterns.md": buildPromptPatterns(),
    ".claude/skills/dna-workbench/dna-session-flow.md": buildSessionFlow(),
    ...promptFiles(config),
  };
}

export function isAiWorkbenchEnabled(config: DnaConfig): boolean {
  return config.aiWorkbench?.enabled !== false;
}

export async function installAiWorkbench(root: string, config: DnaConfig): Promise<string[]> {
  if (!isAiWorkbenchEnabled(config)) return [];

  const created: string[] = [];
  for (const [relPath, content] of Object.entries(generateAiWorkbenchFiles(config))) {
    await writeFileEnsured(join(root, relPath), content);
    created.push(relPath);
  }

  await writeFileEnsured(
    join(root, ".cursor", "commands", "README.md"),
    `# DNA Workbench — Cursor prompts

**${config.projectName}** — installed by DNA by Humaan.

These are **prompt templates**, not CLI cheatsheets. Type \`/\` and pick a command; describe your goal in plain language.

| Command | Purpose |
|---------|---------|
| \`/work-with-dna\` | Start any DNA-aware task |
| \`/ship-feature\` | Build and ship via feature factory |
| \`/analyze-project\` | Understand codebase + gaps |
| \`/health-check\` | Doctor + validate |
| \`/quality-gate\` | Pre-push gate |
| \`/plan-compliance\` | Compliance rollout |
| \`/debug-issue\` | Debug + fix loop |
| \`/sync-impressions\` | Doc/code sync |
| \`/load-context\` | Load domain context |

Skill: \`.cursor/skills/dna-workbench/\` · Rule: \`.cursor/rules/dna-workbench.mdc\`

Remove: \`npx dna workbench uninstall\` · https://dna.humaan.app/intelligence
`,
  );
  created.push(".cursor/commands/README.md");

  await writeFileEnsured(
    join(root, ".claude", "commands", "README.md"),
    `# DNA Workbench — Claude Code prompts

Same commands as Cursor. Skill: \`.claude/skills/dna-workbench/\`

Remove: \`npx dna workbench uninstall\`
`,
  );
  created.push(".claude/commands/README.md");

  return created;
}

export async function uninstallAiWorkbench(root: string): Promise<string[]> {
  const removed: string[] = [];
  for (const relPath of AI_WORKBENCH_PATHS) {
    const path = join(root, relPath);
    if (await fileExists(path)) {
      await unlink(path);
      removed.push(relPath);
    }
  }
  for (const readme of [".cursor/commands/README.md", ".claude/commands/README.md"]) {
    const path = join(root, readme);
    if (await fileExists(path)) {
      await unlink(path);
      removed.push(readme);
    }
  }
  return removed;
}

export async function persistAiWorkbenchEnabled(
  root: string,
  config: DnaConfig,
  enabled: boolean,
): Promise<void> {
  config.aiWorkbench = { enabled };
  config.updatedAt = new Date().toISOString();
  await writeJsonFile(join(root, ".DNA", "config.dna.json"), config);
}

/** Public catalog for dna.humaan.app/intelligence — prompts & scenarios, not CLI cheatsheets */
export function intelligenceWorkbenchCatalogJson(): string {
  return JSON.stringify(
    {
      version: 3,
      type: "workbench",
      catalogUrl: "https://dna.humaan.app/intelligence",
      generatedBy: "dna workbench install",
      tagline:
        "Talk to Cursor in plain language. DNA runs the CLI, loads project intelligence, and walks the full agent loop for you.",
      packages: {
        cursor: {
          rule: ".cursor/rules/dna-workbench.mdc",
          skill: ".cursor/skills/dna-workbench/SKILL.md",
          prompts: ".cursor/commands/*.md",
        },
        claude: {
          skill: ".claude/skills/dna-workbench/SKILL.md",
          prompts: ".claude/commands/*.md",
        },
      },
      defaultInstall: ["dna init", "dna doctor", "dna update"],
      optOut: "dna workbench uninstall",
      categories: {
        session: { label: "Session", description: "Start or reset a DNA-aware Cursor session" },
        analysis: { label: "Analysis", description: "Understand the codebase and prioritize gaps" },
        features: { label: "Features", description: "Build and ship through the agent loop" },
        quality: { label: "Quality & ship", description: "Gates before push and release" },
        compliance: { label: "Compliance", description: "Regulated rollout planning" },
        debug: { label: "Debug", description: "Runtime issues and fix loops" },
        docs: { label: "Documentation", description: "Impressions and doc/code sync" },
      },
      prompts: [
        {
          id: "work-with-dna",
          slash: "/work-with-dna",
          category: "session",
          title: "Work with DNA",
          summary: "Start any task — you talk normally, Cursor runs DNA and loads context.",
          sayInCursor: [
            "Help me with this project using DNA",
            "I just ran dna init — what should we do first?",
            "Use DNA to figure out what this repo needs",
          ],
          cursorDoes: [
            "Reads .DNA/neuralNetwork.json and behaviour files",
            "Runs npx dna when health or analysis is needed",
            "Responds in plain English with one clear next step",
          ],
        },
        {
          id: "analyze-project",
          slash: "/analyze-project",
          category: "analysis",
          title: "Analyze project",
          summary: "Full deep analysis — stack, auth, integrations, P1–P3 gaps — then a prioritized plan.",
          sayInCursor: [
            "Run a full analysis on my project",
            "Analyze this codebase and tell me what's missing for DNA maturity",
            "What are the P1 gaps in this repo?",
          ],
          cursorDoes: [
            "Runs npx dna analyze and npx dna scan",
            "Summarizes structure, surfaces, auth, integrations",
            "Lists P1 gaps first, then P2/P3",
            "Proposes ordered next steps (IVF plan, shared library, feature factory, packs)",
          ],
        },
        {
          id: "ship-feature",
          slash: "/ship-feature",
          category: "features",
          title: "Ship a feature",
          summary: "Plain-language feature → agent loop → plan approval → implement → quality → push.",
          sayInCursor: [
            "Add an admin portal for support staff",
            "I want providers to record phone calls and transcribe notes",
            "Build RBAC for managers and HR",
          ],
          cursorDoes: [
            "Writes ai/feature-request.md from your words",
            "Runs ai/agent-loop.md role by role",
            "Stops after Solution Architect plan for your approval",
            "Implements Backend → Frontend → UX → QA → Quality → Docker → GitHub push",
          ],
        },
        {
          id: "health-check",
          slash: "/health-check",
          category: "session",
          title: "Health check",
          summary: "Is DNA set up correctly? Doctor + validate with plain-English results.",
          sayInCursor: [
            "Is DNA healthy?",
            "Check if DNA is set up correctly",
            "Fix my git hooks / CI / DNA scaffolding",
          ],
          cursorDoes: [
            "Runs npx dna doctor and npx dna validate",
            "Explains every ✓ and ✗",
            "Repairs scaffolding when needed (hooks, workflows, rules)",
          ],
        },
        {
          id: "quality-gate",
          slash: "/quality-gate",
          category: "quality",
          title: "Quality gate",
          summary: "Pre-ship lint, coverage, and SAST — must PASS before push.",
          sayInCursor: [
            "Are we ready to push?",
            "Run the quality gate on my changes",
            "Check if this feature passes DNA quality",
          ],
          cursorDoes: [
            "Runs lint, test:coverage, npx dna quality report --feature",
            "Fixes blockers until PASS",
            "Offers docker build + github push when green",
          ],
        },
        {
          id: "plan-compliance",
          slash: "/plan-compliance",
          category: "compliance",
          title: "Plan compliance",
          summary: "Tiered GDPR, HIPAA, ISO, SOC 2, PCI — plan, packs, implementation checklist.",
          sayInCursor: [
            "Are we GDPR ready?",
            "Plan HIPAA controls for this app",
            "What compliance do we need for EU B2B SaaS?",
          ],
          cursorDoes: [
            "Runs npx dna compliance list and plan compliance",
            "Maps controls to org tier",
            "Installs marketplace packs and loads context",
          ],
        },
        {
          id: "debug-issue",
          slash: "/debug-issue",
          category: "debug",
          title: "Debug issue",
          summary: "Runtime error → classify → fix → test → quality → push.",
          sayInCursor: [
            "Users get 403 on the admin API — debug it",
            "Fix this production error with DNA context",
          ],
          cursorDoes: [
            "Checks .DNA/runtime and dashboard",
            "Root-cause fix with tests",
            "Quality gate before ship",
          ],
        },
        {
          id: "sync-impressions",
          slash: "/sync-impressions",
          category: "docs",
          title: "Sync Impressions",
          summary: "Reconcile DNA/Impressions/ with the codebase when docs drift.",
          sayInCursor: [
            "Our docs are out of date with the code",
            "Sync Impressions with the codebase",
          ],
          cursorDoes: [
            "Runs npx dna scan and plan impressions-sync",
            "Updates or generates Impressions from code",
          ],
        },
        {
          id: "load-context",
          slash: "/load-context",
          category: "session",
          title: "Load context",
          summary: "Load domain packs — security, backend, frontend, QA, compliance, etc.",
          sayInCursor: [
            "Load security context for this session",
            "Give yourself full backend DNA context",
          ],
          cursorDoes: [
            "Runs npx dna context <target>",
            "Loads referenced .DNA/knowledge/ files into the session",
          ],
        },
      ],
      agentLoop: [
        {
          role: "Product Analyst",
          phase: "plan",
          summary: "Refine the ask — problem, users, acceptance criteria in ai/feature-request.md",
        },
        {
          role: "Solution Architect",
          phase: "plan",
          summary: "Implementation plan — scope, files, API, security, risks. **Stop here for approval.**",
          gate: "User must approve before any code",
        },
        {
          role: "Backend Engineer",
          phase: "build",
          summary: "Routes, services, validation, auth/RBAC, database, tests",
        },
        {
          role: "Frontend Engineer",
          phase: "build",
          summary: "Pages, components, API integration, loading/error states",
        },
        {
          role: "UX Reviewer",
          phase: "build",
          summary: "Flow clarity, labels, friction, design system consistency",
        },
        {
          role: "QA Engineer",
          phase: "verify",
          summary: "Happy path, permissions, edge cases, regression",
        },
        {
          role: "Code Quality Analyst",
          phase: "verify",
          summary: "npx dna quality report --feature until PASS",
        },
        {
          role: "Refactor Reviewer",
          phase: "verify",
          summary: "No duplication, repo patterns, no dead code",
        },
        {
          role: "Final Release Reviewer",
          phase: "ship",
          summary: "Docker build + GitHub push — feature complete",
        },
      ],
      scenarios: [
        {
          id: "doctor-then-analyze",
          title: "Fresh project — doctor then analyze",
          userSays: "I ran dna init. Is everything OK and what should we tackle first?",
          flow: [
            "Cursor runs npx dna doctor — reports ✓/✗ (hooks, CI, rules, runtime)",
            "Cursor runs npx dna analyze — stack, surfaces, vertical gaps",
            "Cursor prioritizes P1 items (shared library, behaviour restructure, build rules)",
            "Cursor proposes: IVF plan, marketplace packs, or first feature via /ship-feature",
          ],
          exampleAsk: "Doctor passed except git hooks — fix hooks then run full analysis",
        },
        {
          id: "after-analyze-what-next",
          title: "After analyze — what do I do next?",
          userSays:
            "I ran analyze. React frontend, 80 API routes, P1 shared library gap, P1 build rules missing. What now?",
          flow: [
            "Cursor explains P1 gaps in plain English (not raw CLI dump)",
            "Shared library → npx dna ivf shared-library --dry-run, scaffold packages/humaan-ui",
            "Build rules → capture MUI patterns from reference pages into .DNA/knowledge/",
            "Behaviour restructure → validate against .DNA/behaviour/, update if needed",
            "Optional: npx dna plan ivf for phased migration plan",
            "Ask: 'Want me to start on P1 shared library or plan IVF first?'",
          ],
          exampleOutput: {
            stack: "npm · React · 80 API routes · MUI installed",
            p1: ["Shared library → packages/humaan-ui", "Build rules on top of MUI", "Behaviour layer restructure"],
            p2: ["CellularMemory live map", "neuralNetwork routing"],
          },
        },
        {
          id: "full-feature-factory",
          title: "Build a feature end-to-end",
          userSays: "Add an admin dashboard for support — new tab, RBAC, only visible to admins",
          flow: [
            "Product Analyst updates ai/feature-request.md",
            "Solution Architect plan → **wait for your OK**",
            "Backend → Frontend → UX → QA",
            "Code Quality: quality report PASS",
            "Docker build + github push",
          ],
          usesAgentLoop: true,
        },
        {
          id: "brownfield-ivf",
          title: "Brownfield — integrate DNA without rewrite",
          userSays: "This is a legacy React monolith. Integrate DNA properly without a rewrite.",
          flow: [
            "npx dna analyze + npx dna document --from-code",
            "npx dna plan ivf — phased migration plan",
            "Implement phase 1 only — never big-bang rewrite",
            "Refresh CellularMemory and Impressions as you go",
          ],
        },
        {
          id: "ready-to-ship",
          title: "Feature done — ship it",
          userSays: "The feature works locally. Ship it.",
          flow: [
            "npx dna quality report --feature — must PASS",
            "npx dna docker build",
            "npx dna github push",
            "Confirm CI / preview deploy triggered",
          ],
        },
        {
          id: "plain-chat-no-slash",
          title: "No slash command needed",
          userSays: "Just type in chat — DNA workbench rule is always on after init",
          flow: [
            "dna-workbench.mdc applies to every session",
            "Say: 'analyze my project' or 'what should we build next?'",
            "Cursor runs DNA CLI itself — you never need /dna-analyze",
            "Use /ship-feature or /analyze-project when you want the full structured prompt",
          ],
        },
      ],
      counts: {
        prompts: 9,
        scenarios: 6,
        agentRoles: 9,
      },
    },
    null,
    2,
  );
}

/** @deprecated Use intelligenceWorkbenchCatalogJson for DNA-Web */
export function intelligenceWorkbenchCatalogForWeb(): string {
  return intelligenceWorkbenchCatalogJson();
}
