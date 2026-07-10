import { unlink } from "node:fs/promises";
import { join } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { fileExists, writeFileEnsured, writeJsonFile } from "../fs.js";
import {
  generatePromptStemPackFiles,
  getPromptStemInstallPaths,
  getPromptStemPacks,
  intelligenceStemPackEntries,
  STEM_CATEGORY_LABELS,
  uninstallPromptStemPacks,
} from "./prompt-stem-packs/index.js";

/** Core workbench paths (stem packs add `.DNA/stems/` and slash commands separately). */
export const AI_WORKBENCH_CORE_PATHS = [
  ".cursor/rules/dna-workbench.mdc",
  ".cursor/skills/dna-workbench/SKILL.md",
  ".cursor/skills/dna-workbench/prompt-patterns.md",
  ".cursor/skills/dna-workbench/dna-session-flow.md",
  ".claude/skills/dna-workbench/SKILL.md",
  ".claude/skills/dna-workbench/prompt-patterns.md",
  ".claude/skills/dna-workbench/dna-session-flow.md",
] as const;

/** @deprecated Use getAiWorkbenchPaths() — includes all stem pack paths */
export const AI_WORKBENCH_PATHS = AI_WORKBENCH_CORE_PATHS;

export function getAiWorkbenchPaths(): string[] {
  return [...AI_WORKBENCH_CORE_PATHS, ...getPromptStemInstallPaths(), ".cursor/commands/README.md", ".claude/commands/README.md"];
}

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

## Slash commands & stem packs

Type \`/\` in chat for **${getPromptStemPacks().length}** prompt stems (e.g. \`work-with-dna\`, \`analyze-project\`, \`what-next\`, \`ship-feature\`).

Each stem has full guidelines in \`.DNA/stems/<id>/\` — read **all files** before executing.

Copy-paste library: https://dna.humaan.app/intelligence#stem-library

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

## Slash prompts & stem packs

Each command maps to \`.DNA/stems/<id>/\` — read **prompt.md, guidelines.md, expectations.md, context.md, examples.md** before acting.

| Command | Stem | Use when |
|---------|------|----------|
| \`/work-with-dna\` | work-with-dna | Start any DNA-aware session |
| \`/analyze-project\` | analyze-project | Brownfield analysis + gap plan |
| \`/what-next\` | what-next-after-analyze | Turn analyze output into action plan |
| \`/ship-feature\` | ship-feature | Plain-language feature → full agent loop |
| \`/agent-loop\` | agent-loop-full | All 9 roles in sequence |
| \`/product-analyst\` … \`/final-release\` | role-* | One agent-loop role at a time |
| \`/health-check\` | health-check | Doctor + validate |
| \`/quality-gate\` | quality-gate | Pre-push gate |
| \`/plan-compliance\` | plan-compliance | Compliance rollout |
| \`/debug-issue\` | debug-issue | Debug + fix loop |
| \`/ivf-shared-library\` | ivf-shared-library | Extract shared UI library |

Full library (${getPromptStemPacks().length} stems): https://dna.humaan.app/intelligence#stem-library

Commands live in \`${cmdPath}/\`. Stem data: \`.DNA/stems/\`.

## Non-negotiable

- Run real \`npx dna\` commands — never fake output
- Feature work stops for approval after Solution Architect plan
- Quality PASS before complete or push
`;
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
    ...generatePromptStemPackFiles(config),
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

  const stemCount = getPromptStemPacks().length;
  const slashTable = getPromptStemPacks()
    .filter((p) => p.slash)
    .map((p) => `| \`/${p.slash}\` | ${p.name} |`)
    .join("\n");

  await writeFileEnsured(
    join(root, ".cursor", "commands", "README.md"),
    `# DNA Workbench — Cursor prompts

**${config.projectName}** — ${stemCount} prompt stem packs installed by DNA by Humaan.

Each stem includes **prompt + guidelines + expectations + context + examples** in \`.DNA/stems/<id>/\`.

| Slash | Stem |
|-------|------|
${slashTable}

Copy-paste library: https://dna.humaan.app/intelligence#stem-library

Skill: \`.cursor/skills/dna-workbench/\` · Rule: \`.cursor/rules/dna-workbench.mdc\`

Remove: \`npx dna workbench uninstall\`
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
  for (const relPath of getAiWorkbenchPaths()) {
    const path = join(root, relPath);
    if (await fileExists(path)) {
      await unlink(path);
      removed.push(relPath);
    }
  }
  removed.push(...(await uninstallPromptStemPacks(root)));
  return [...new Set(removed)];
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

/** Public catalog for dna.humaan.app/intelligence */
export function intelligenceWorkbenchCatalogJson(): string {
  const stems = intelligenceStemPackEntries();
  const prompts = stems
    .filter((s) => s.slash)
    .map((s) => ({
      id: s.id,
      slash: `/${s.slash}`,
      category: s.category,
      title: s.name,
      summary: s.summary,
      sayInCursor: s.copyVariants,
      cursorDoes: [...s.cliCommands.slice(0, 3), ...s.expectations.slice(0, 2)],
      stemPath: `.DNA/stems/${s.id}/`,
    }));

  return JSON.stringify(
    {
      version: 4,
      type: "workbench",
      catalogUrl: "https://dna.humaan.app/intelligence",
      generatedBy: "dna workbench install",
      tagline:
        "Copy-paste prompt stem packs for Cursor. Each stem includes guidelines, expectations, and context so the AI sticks to the workflow.",
      packages: {
        cursor: {
          rule: ".cursor/rules/dna-workbench.mdc",
          skill: ".cursor/skills/dna-workbench/SKILL.md",
          prompts: ".cursor/commands/*.md",
          stems: ".DNA/stems/<id>/",
        },
        claude: {
          skill: ".claude/skills/dna-workbench/SKILL.md",
          prompts: ".claude/commands/*.md",
          stems: ".DNA/stems/<id>/",
        },
      },
      defaultInstall: ["dna init", "dna doctor", "dna update"],
      optOut: "dna workbench uninstall",
      stemCategories: STEM_CATEGORY_LABELS,
      stemPacks: stems,
      categories: STEM_CATEGORY_LABELS,
      prompts,
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
          stems: ["health-check", "analyze-project", "what-next-after-analyze"],
        },
        {
          id: "after-analyze-what-next",
          title: "After analyze — what do I do next?",
          userSays:
            "I ran analyze. React frontend, 80 API routes, P1 shared library gap, P1 build rules missing. What now?",
          flow: [
            "Use stem: what-next-after-analyze",
            "Cursor explains P1 gaps in plain English",
            "Shared library → ivf-shared-library stem",
            "Build rules → capture MUI patterns into .DNA/knowledge/",
            "Ask which path to start",
          ],
          stems: ["what-next-after-analyze", "ivf-shared-library", "plan-ivf"],
          exampleOutput: {
            stack: "npm · React · 80 API routes · MUI installed",
            p1: ["Shared library → packages/humaan-ui", "Build rules on top of MUI", "Behaviour layer restructure"],
          },
        },
        {
          id: "full-feature-factory",
          title: "Build a feature end-to-end",
          userSays: "Add an admin dashboard for support — new tab, RBAC, only visible to admins",
          flow: [
            "Stem: ship-feature → agent loop",
            "Solution Architect plan → wait for OK",
            "Backend → Frontend → UX → QA → quality-gate → github-push",
          ],
          usesAgentLoop: true,
          stems: ["ship-feature", "quality-gate", "github-push"],
        },
        {
          id: "brownfield-ivf",
          title: "Brownfield — integrate DNA without rewrite",
          userSays: "This is a legacy React monolith. Integrate DNA properly without a rewrite.",
          flow: ["Stems: analyze-project → plan-ivf → ivf-run (phase 1 only)"],
          stems: ["analyze-project", "plan-ivf", "ivf-run"],
        },
        {
          id: "ready-to-ship",
          title: "Feature done — ship it",
          userSays: "The feature works locally. Ship it.",
          flow: ["quality-gate → docker-build → github-push"],
          stems: ["quality-gate", "docker-build", "github-push"],
        },
        {
          id: "copy-paste-stem",
          title: "Copy-paste from stem library",
          userSays: "Pick a stem from dna.humaan.app/intelligence, paste into Cursor",
          flow: [
            "Copy a copyVariant or full prompt from stem library",
            "AI reads .DNA/stems/<id>/ guidelines + expectations",
            "AI follows MUST/NEVER rules for that workflow",
          ],
          stems: ["work-with-dna", "analyze-project", "what-next-after-analyze"],
        },
      ],
      counts: {
        stemPacks: stems.length,
        prompts: prompts.length,
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
