import { unlink } from "node:fs/promises";
import { join } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { DNA_CLI_SKILL_DESCRIPTION } from "./dna-default-on.js";
import { fileExists, writeFileEnsured } from "../fs.js";
import {
  buildAllCommandSpecs,
  enrichCommandSpec,
  type DnaAiCommandSpec,
} from "./ai-command-specs.js";

export type DnaCommandCategory =
  | "core"
  | "analysis"
  | "feature-factory"
  | "quality"
  | "delivery"
  | "plan"
  | "ivf"
  | "marketplace"
  | "memory"
  | "compliance"
  | "legal"
  | "platform"
  | "stack"
  | "ai"
  | "generate";

export interface DnaAiCommandDef {
  id: string;
  category: DnaCommandCategory;
  title: string;
  description: string;
  /** Shell command — use $ARGUMENTS where user input is appended */
  cli: string;
  argumentHint?: string;
  /** Extra instructions after running the CLI */
  followUp?: string;
}

export const DNA_AI_COMMAND_CATALOG: readonly DnaAiCommandDef[] = [
  {
    id: "doctor",
    category: "core",
    title: "DNA Doctor",
    description: "Scaffold, repair, and health-check DNA in this project.",
    cli: "npx dna doctor",
    argumentHint: "[--check-only]",
    followUp:
      "Summarize ✓/✗ checks, doctor actions taken, and any remaining fixes (especially git hooks and CI workflows).",
  },
  {
    id: "init",
    category: "core",
    title: "DNA Init",
    description: "Initialise DNA — `.DNA/`, Impressions, Behaviour, and AI tool files.",
    cli: "npx dna init",
    argumentHint: "[-y]",
    followUp: "Confirm what was scaffolded and suggest `dna doctor` if anything looks incomplete.",
  },
  {
    id: "update",
    category: "core",
    title: "DNA Update",
    description: "Upgrade DNA CLI and refresh knowledge packs / workbench prompts.",
    cli: "npx dna update",
    followUp:
      "Report CLI version change, stem pack refresh count, and marketplace updates. Suggest `dna marketplace install` for relevant packs.",
  },
  {
    id: "validate",
    category: "core",
    title: "DNA Validate",
    description: "Validate the project against Behaviour rules.",
    cli: "npx dna validate",
    followUp: "Report validation issues with file paths and suggested fixes.",
  },
  {
    id: "watch",
    category: "core",
    title: "DNA Watch",
    description: "Watch file changes and update CellularMemory.",
    cli: "npx dna watch",
    followUp: "Explain what regions will update and when to use watch vs manual memory sync.",
  },
  {
    id: "dashboard",
    category: "core",
    title: "DNA Lab",
    description: "Start DNA Lab — local observability at /labs (alias: dna dashboard).",
    cli: "npx dna lab serve --port 3200",
    followUp: "Tell the user the URL (http://localhost:3200/labs). Localhost has no login; production uses register lab pairing.",
  },
  {
    id: "credits",
    category: "core",
    title: "DNA Credits",
    description: "Show sponsors, funding links, and package credits.",
    cli: "npx dna credits",
  },
  {
    id: "analyze",
    category: "analysis",
    title: "DNA Analyze",
    description: "Deep analysis — structure, auth, integrations, and vertical gaps.",
    cli: "npx dna analyze",
    followUp:
      "Summarize stack detection, surfaces, auth patterns, integrations, and P1–P3 vertical gaps with recommended next steps.",
  },
  {
    id: "scan",
    category: "analysis",
    title: "DNA Scan",
    description: "Detect stack, dependencies, tests, CI, and Impressions drift.",
    cli: "npx dna scan",
    argumentHint: "[--open-pr]",
    followUp: "Highlight risks, drift score, and whether `dna plan impressions-sync` is warranted.",
  },
  {
    id: "document",
    category: "analysis",
    title: "DNA Document",
    description: "Generate or update documentation from codebase analysis.",
    cli: "npx dna document --from-code",
    followUp: "List Impressions files created or updated and any gaps remaining.",
  },
  {
    id: "recommend",
    category: "analysis",
    title: "DNA Recommend",
    description: "Recommend solution architecture and stack.",
    cli: "npx dna recommend",
    followUp: "Present the recommendation and tie it to `.DNA/knowledge/` packs to install.",
  },
  {
    id: "context",
    category: "analysis",
    title: "DNA Context",
    description: "Generate AI-ready context for a domain (cursor, claude, security, qa, etc.).",
    cli: "npx dna context $ARGUMENTS",
    argumentHint: "<target>",
    followUp: "Use the generated context in this session — load relevant `.DNA/knowledge/` paths it references.",
  },
  {
    id: "feature",
    category: "feature-factory",
    title: "DNA Feature",
    description: "Start the feature factory from a plain-language request.",
    cli: 'npx dna feature "$ARGUMENTS"',
    argumentHint: "<plain-language quote>",
    followUp:
      "Read `ai/feature-request.md` and `ai/agent-loop.md`. Stop after Solution Architect plan for approval.",
  },
  {
    id: "feature-factory-install",
    category: "feature-factory",
    title: "Feature Factory Install",
    description: "Install Cursor rules and `/ai` agent templates.",
    cli: "npx dna feature-factory install",
    followUp: "Confirm rules under `.cursor/rules/` and workflows under `.DNA/workflows/`.",
  },
  {
    id: "commands-install",
    category: "feature-factory",
    title: "DNA Commands Install",
    description: "Install Cursor and Claude slash command packages for every DNA CLI command.",
    cli: "npx dna commands install",
    followUp: "Tell the user to type `/` in Cursor or Claude and search for `dna-` commands.",
  },
  {
    id: "quality-report",
    category: "quality",
    title: "Quality Report",
    description: "Run local SAST + toolchain checks and write a quality report (feature gate).",
    cli: "npx dna quality report --feature",
    argumentHint: "[--paths <files>]",
    followUp:
      "Report PASS/FAIL, blocker/critical issues, and path to `.DNA/reports/quality/`. Fix blockers before marking work complete.",
  },
  {
    id: "quality-scan",
    category: "quality",
    title: "Quality Scan",
    description: "Run quality analysis to stdout without writing a report file.",
    cli: "npx dna quality scan --feature",
    followUp: "Summarize findings by severity and category.",
  },
  {
    id: "ci-install",
    category: "delivery",
    title: "CI Install",
    description: "Scaffold GitHub Actions workflows (lint, test, coverage, security).",
    cli: "npx dna ci install",
    followUp: "List workflow files created under `.github/workflows/`.",
  },
  {
    id: "docker-build",
    category: "delivery",
    title: "Docker Build",
    description: "Build Docker image — mandatory feature factory close-out gate.",
    cli: "npx dna docker build",
    followUp: "Confirm image built successfully or diagnose Dockerfile/build errors.",
  },
  {
    id: "docker-install",
    category: "delivery",
    title: "Docker Install",
    description: "Scaffold Dockerfile, docker-compose, and npm scripts.",
    cli: "npx dna docker install",
  },
  {
    id: "github-push",
    category: "delivery",
    title: "GitHub Push",
    description: "Commit and push the current feature branch to GitHub.",
    cli: "npx dna github push",
    followUp: "Confirm branch pushed and CI triggered. Never force-push main.",
  },
  {
    id: "github-login",
    category: "delivery",
    title: "GitHub Login",
    description: "Sign in to GitHub via browser (web flow).",
    cli: "npx dna github login",
    followUp: "Confirm authentication succeeded for subsequent `dna github push` and issue automation.",
  },
  {
    id: "plan-rbac",
    category: "plan",
    title: "Plan RBAC",
    description: "Plan RBAC + zero trust from a plain-language requirement.",
    cli: 'npx dna plan rbac "$ARGUMENTS"',
    argumentHint: "<requirement>",
    followUp: "Read the generated plan in `.DNA/` and implement with route guards + API middleware.",
  },
  {
    id: "plan-feature",
    category: "plan",
    title: "Plan Feature",
    description: "Plan a Humaan platform feature from plain-language requirements.",
    cli: 'npx dna plan feature "$ARGUMENTS"',
    argumentHint: "<featureId>",
  },
  {
    id: "plan-compliance",
    category: "plan",
    title: "Plan Compliance",
    description: "Plan tiered GDPR, HIPAA, ISO 27001, SOC 2, or PCI controls.",
    cli: "npx dna plan compliance",
    followUp: "Match org tier to controls and list knowledge packs to install.",
  },
  {
    id: "plan-legal",
    category: "legal",
    title: "Plan Legal",
    description: "Plan legal considerations — privacy, banking, healthcare, IP, regional law.",
    cli: "npx dna plan legal",
    followUp: "Map domains and jurisdictions to packs; update legal matrix; flag counsel gates.",
  },
  {
    id: "legal-advise",
    category: "legal",
    title: "Legal Advise",
    description: "Engineering legal considerations for a product question (not legal advice).",
    cli: 'npx dna legal advise --quote "$ARGUMENTS"',
    argumentHint: "<question>",
    followUp: "Summarize domains, jurisdictions, recommendations, and counsel checklist.",
  },
  {
    id: "legal-list",
    category: "legal",
    title: "Legal List",
    description: "List legal domains and supported jurisdictions.",
    cli: "npx dna legal list",
  },
  {
    id: "plan-ivf",
    category: "plan",
    title: "Plan IVF",
    description: "Generate an Integrating Vertical Functions plan for brownfield projects.",
    cli: "npx dna plan ivf",
  },
  {
    id: "plan-impressions-sync",
    category: "plan",
    title: "Plan Impressions Sync",
    description: "Reconcile Impressions drift with the codebase.",
    cli: "npx dna plan impressions-sync",
    argumentHint: "[--open-pr]",
  },
  {
    id: "ivf",
    category: "ivf",
    title: "DNA IVF",
    description: "Brownfield IVF — analyze, document, plan, and wire DNA into existing projects.",
    cli: "npx dna ivf run",
    argumentHint: "[--quote <text>]",
    followUp: "Summarize analysis, documentation updates, and integration plan.",
  },
  {
    id: "ivf-shared-library",
    category: "ivf",
    title: "IVF Shared Library",
    description: "Shared library extraction — analyze and dry-run.",
    cli: "npx dna ivf shared-library --dry-run",
    argumentHint: "[--scaffold]",
  },
  {
    id: "marketplace-list",
    category: "marketplace",
    title: "Marketplace List",
    description: "List available knowledge packs.",
    cli: "npx dna marketplace list",
  },
  {
    id: "marketplace-search",
    category: "marketplace",
    title: "Marketplace Search",
    description: "Search knowledge packs by keyword.",
    cli: 'npx dna marketplace search "$ARGUMENTS"',
    argumentHint: "<query>",
  },
  {
    id: "marketplace-install",
    category: "marketplace",
    title: "Marketplace Install",
    description: "Install a knowledge pack into `.DNA/knowledge/`.",
    cli: "npx dna marketplace install $ARGUMENTS",
    argumentHint: "<packId>",
  },
  {
    id: "memory-export",
    category: "memory",
    title: "Memory Export",
    description: "Export CellularMemory segments to JSON.",
    cli: "npx dna memory export --out .DNA/exports/memory.json",
  },
  {
    id: "memory-import",
    category: "memory",
    title: "Memory Import",
    description: "Import CellularMemory from an export file.",
    cli: "npx dna memory import $ARGUMENTS --merge",
    argumentHint: "<file>",
  },
  {
    id: "compliance-list",
    category: "compliance",
    title: "Compliance List",
    description: "List org tiers and compliance frameworks.",
    cli: "npx dna compliance list",
  },
  {
    id: "compliance-documents",
    category: "compliance",
    title: "Compliance Documents",
    description: "UK GDPR required document catalog (scrubbed templates).",
    cli: "npx dna compliance documents",
  },
  {
    id: "platform-list",
    category: "platform",
    title: "Platform List",
    description: "List platform features DNA learned from production projects.",
    cli: "npx dna platform list",
  },
  {
    id: "platform-projects",
    category: "platform",
    title: "Platform Projects",
    description: "List reference production projects (aistudio, colorparty, humaan, soli).",
    cli: "npx dna platform projects",
  },
  {
    id: "stack-show",
    category: "stack",
    title: "Stack Show",
    description: "Show current project stack archetype and detected technologies.",
    cli: "npx dna stack show",
  },
  {
    id: "stack-recommend",
    category: "stack",
    title: "Stack Recommend",
    description: "Recommend a stack archetype for this project.",
    cli: "npx dna stack recommend",
  },
  {
    id: "ai-connect",
    category: "ai",
    title: "AI Connect",
    description: "Configure AI provider (mock, openai, anthropic).",
    cli: "npx dna ai connect",
  },
  {
    id: "ai-repair",
    category: "ai",
    title: "AI Repair",
    description: "Run AI repair workflow for a classified runtime issue.",
    cli: "npx dna ai repair",
    argumentHint: "[--issue <json>]",
    followUp: "Never auto-merge — human review required.",
  },
  {
    id: "generate-feature",
    category: "generate",
    title: "Generate Feature",
    description: "Generate code scaffold for a platform feature (e.g. audit-logging).",
    cli: "npx dna generate feature $ARGUMENTS",
    argumentHint: "<featureId>",
  },
  {
    id: "runtime-install",
    category: "core",
    title: "Runtime Install",
    description: "Add runtime observer setup instructions and wire middleware.",
    cli: "npx dna runtime install",
  },
] as const;

export const DNA_COMMAND_CATEGORIES: Record<
  DnaCommandCategory,
  { label: string; description: string }
> = {
  core: { label: "Core", description: "Init, doctor, validate, and daily DNA operations" },
  analysis: { label: "Analysis", description: "Scan, analyze, document, and context generation" },
  "feature-factory": {
    label: "Feature factory",
    description: "Plain-language features and AI slash commands",
  },
  quality: { label: "Quality", description: "Local SAST and quality gates" },
  delivery: { label: "Delivery", description: "CI, Docker, and GitHub push automation" },
  plan: { label: "Plan", description: "RBAC, compliance, IVF, and Impressions plans" },
  ivf: { label: "IVF", description: "Brownfield integration and shared library extraction" },
  marketplace: { label: "Marketplace", description: "Knowledge pack catalog and installs" },
  memory: { label: "Memory", description: "CellularMemory export and import" },
  compliance: { label: "Compliance", description: "Tiered compliance catalogs and documents" },
  legal: { label: "Legal", description: "Legal advisor, jurisdictions, and sector law" },
  platform: { label: "Platform", description: "Production platform feature catalog" },
  stack: { label: "Stack", description: "Stack archetypes and recommendations" },
  ai: { label: "AI", description: "AI provider configuration and repair" },
  generate: { label: "Generate", description: "Platform feature code scaffolds" },
};

export const DNA_COMMAND_PACKAGE_PATHS = [
  ".cursor/skills/dna-cli/SKILL.md",
  ".cursor/skills/dna-cli/commands-reference.md",
  ".cursor/skills/dna-cli/workflows.md",
  ".cursor/rules/dna-cli-commands.mdc",
  ".claude/skills/dna-cli/SKILL.md",
  ".claude/skills/dna-cli/commands-reference.md",
  ".claude/skills/dna-cli/workflows.md",
] as const;

function slashName(id: string): string {
  return `dna-${id}`;
}

function resolveCli(raw: string, args: string): string {
  const trimmed = args.trim();
  if (!trimmed) {
    return raw.replace(/\s+"\$ARGUMENTS"/g, "").replace(/\s+\$ARGUMENTS/g, "").trim();
  }
  return raw.replace(/\$ARGUMENTS/g, trimmed);
}

function bulletList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function buildDetailedCommandBody(spec: DnaAiCommandSpec): string {
  const lines = [
    `# DNA Command: ${spec.title}`,
    "",
    `> Slash: \`/${slashName(spec.id)}\` · Category: **${DNA_COMMAND_CATEGORIES[spec.category].label}**`,
    "",
    "## Purpose",
    "",
    spec.purpose,
    "",
    "## When to use",
    "",
    bulletList(spec.whenToUse),
    "",
    "## When NOT to use",
    "",
    bulletList(spec.whenNotToUse),
    "",
    "## Prerequisites",
    "",
    bulletList(spec.prerequisites),
    "",
    "## Mandatory behaviour — OBEY",
    "",
    spec.mustDo.map((item) => `- **MUST** ${item}`).join("\n"),
    "",
    "## Forbidden — NEVER",
    "",
    spec.mustNotDo.map((item) => `- **NEVER** ${item}`).join("\n"),
    "",
    "## Execute (required)",
    "",
    "Run this command from the **project root** in the shell. Do not skip execution.",
    "",
    "```bash",
    resolveCli(spec.cli, "$ARGUMENTS"),
    "```",
    "",
  ];

  if (spec.flags?.length) {
    lines.push("## Flags", "", "| Flag | Description |", "|------|-------------|");
    for (const f of spec.flags) {
      lines.push(`| \`${f.flag}\` | ${f.description} |`);
    }
    lines.push("");
  }

  if (spec.argumentHint) {
    lines.push(`**Argument hint:** \`${spec.argumentHint}\``, "", "");
  }

  lines.push(
    "## Output interpretation",
    "",
    "| Section | Meaning |",
    "|---------|---------|",
    ...spec.outputGuide.map((g) => `| ${g.section} | ${g.meaning} |`),
    "",
    "## Exit codes",
    "",
    spec.exitCodes.map((e) => `- **${e.code}** — ${e.meaning}`).join("\n"),
    "",
    "## Files touched",
    "",
    bulletList(spec.filesTouched),
    "",
    "## After running",
    "",
    spec.followUp ??
      "Read the full CLI output, summarize results for the user, and recommend concrete next steps.",
    "",
  );

  if (spec.relatedCommands.length) {
    lines.push("## Related slash commands", "", bulletList(spec.relatedCommands.map((c) => `\`/${c}\``)), "");
  }

  if (spec.workflowChains?.length) {
    lines.push("## Typical workflows", "", bulletList(spec.workflowChains), "");
  }

  lines.push("## Examples", "");
  for (const ex of spec.examples) {
    lines.push(`### ${ex.scenario}`, "", "```bash", ex.command, "```", "", `**Then:** ${ex.then}`, "");
  }

  lines.push(
    "## Session context",
    "",
    "Before follow-up implementation, load:",
    "",
    "- `.DNA/neuralNetwork.json` — intent routing",
    "- `.DNA/behaviour/*.behaviour.md` — project rules",
    "- `.DNA/knowledge/` — stack-matched packs",
    "- `DNA/Impressions/` — human-facing system docs",
    "",
    "**User context (if any):**",
    "",
    "$ARGUMENTS",
  );

  return lines.join("\n");
}

function buildClaudeCommandBody(spec: DnaAiCommandSpec): string {
  const longRunning = spec.cli.includes("watch") || spec.cli.includes("dashboard");
  const allowedTools = longRunning
    ? "Bash(npx:*), Bash(dna:*), Read"
    : "Bash(npx:*), Bash(dna:*), Read, Grep, Glob";

  return [
    "---",
    `description: ${spec.description}`,
    spec.argumentHint ? `argument-hint: ${spec.argumentHint}` : null,
    `allowed-tools: ${allowedTools}`,
    "disable-model-invocation: true",
    "---",
    "",
    buildDetailedCommandBody(spec),
  ]
    .filter((line) => line !== null)
    .join("\n");
}

function buildCommandsReferenceMarkdown(specs: DnaAiCommandSpec[]): string {
  const lines = [
    "# DNA CLI — full command reference",
    "",
    "Generated by `dna commands install`. Agents must obey mandatory rules in each command.",
    "",
  ];

  let lastCategory: DnaCommandCategory | null = null;
  for (const spec of specs) {
    if (spec.category !== lastCategory) {
      lastCategory = spec.category;
      lines.push(`## ${DNA_COMMAND_CATEGORIES[spec.category].label}`, "");
    }
    lines.push(
      `### /${slashName(spec.id)} — ${spec.title}`,
      "",
      spec.purpose,
      "",
      `**CLI:** \`${spec.cli.replace(/\$ARGUMENTS/g, "<args>")}\``,
      "",
      "**Must:**",
      spec.mustDo.slice(0, 4).map((m) => `- ${m}`).join("\n"),
      "",
    );
  }
  return lines.join("\n");
}

function buildWorkflowsMarkdown(): string {
  return `# DNA CLI — workflow chains

Agents must follow these sequences unless the user explicitly overrides.

## New project / first clone

1. \`/dna-doctor\` — scaffold and repair everything
2. \`/dna-analyze\` — understand structure and gaps
3. \`/dna-context cursor\` or \`/dna-context claude\` — load AI context
4. Begin feature work via plain language (auto factory) or \`/dna-feature\`

## Brownfield / existing codebase

1. \`/dna-analyze\`
2. \`/dna-document\` (with \`--from-code\`)
3. \`/dna-plan-ivf\` or \`/dna-ivf\`
4. Implement phases — never big-bang rewrite

## Feature factory (every feature)

1. User describes feature OR \`/dna-feature "<quote>"\`
2. Agent loop through roles — **stop after Solution Architect for approval**
3. Implement Backend → Frontend → UX → QA
4. \`/dna-quality-report\` — **must PASS**
5. \`/dna-docker-build\`
6. \`/dna-github-push\`

## Regulated / compliance work

1. \`/dna-compliance-list\`
2. \`/dna-plan-compliance\` with tier + frameworks
3. \`/dna-marketplace-install\` for compliance packs
4. \`/dna-context compliance\`

## Regulated / legal work (banking, healthcare, APAC/EU/US)

1. \`/dna-legal-list\` or \`/legal-list\`
2. \`/dna-legal-advise --quote "..."\` or \`/legal-advise\`
3. \`/dna-plan-legal\` with domains + jurisdictions
4. \`/dna-marketplace-install\` for \`legal/regions/*\` packs
5. \`/dna-context legal\` or \`/legal-engineering\`
6. \`/dna-plan-compliance\` for control frameworks (pair with legal)

Follow \`.DNA/workflows/legal.workflow.md\`.

## Health check / drift

1. \`/dna-scan\` — drift score
2. If drift critical: \`/dna-plan-impressions-sync\`
3. \`/dna-validate\` — behaviour compliance

## Hard gates (never skip)

| Gate | Command | Block if FAIL |
|------|---------|---------------|
| Quality | \`/dna-quality-report\` | Push, feature complete |
| Docker | \`/dna-docker-build\` | Feature factory close-out |
| GitHub | \`/dna-github-push\` | Only after quality PASS |
| Repair merge | \`/dna-ai-repair\` | Human review always |
`;
}

function buildCursorSkillMarkdown(projectName: string, specs: DnaAiCommandSpec[]): string {
  const commandTable = specs
    .map((s) => `| \`/${slashName(s.id)}\` | ${s.title} | ${s.cli.replace(/\$ARGUMENTS/g, "<args>")} |`)
    .join("\n");

  return `---
name: dna-cli
description: >-
  ${DNA_CLI_SKILL_DESCRIPTION}
disable-model-invocation: false
---

# DNA CLI skill — ${projectName}

You operate inside a **DNA by Humaan** project. DNA is the source of truth for stack, behaviour, memory, and delivery gates.

**DNA is always on** — never wait for the user to say "use DNA" before running commands or loading \`.DNA/\` context.

Engineering work (build, add, fix, change) **must** follow \`ai/agent-loop.md\` — all 9 roles, architect approval before code.

## Absolute rules (obey always)

1. **Run real commands** — execute \`npx dna …\` in the shell; never fabricate output.
2. **Respect gates** — quality PASS, docker build, github push are mandatory for feature close-out.
3. **Feature factory** — stop after Solution Architect plan; wait for approval before coding.
4. **Context first** — read \`.DNA/neuralNetwork.json\`, behaviour files, and Impressions before structural changes.
5. **No secrets in git** — tokens live in \`~/.config/dna/\` or env vars only.

## Command routing

| Slash | Title | CLI |
|-------|-------|-----|
${commandTable}

Full detail: read \`.cursor/skills/dna-cli/commands-reference.md\` or invoke any \`/dna-*\` slash command.

## When user intent maps to DNA

| User says | Run |
|-----------|-----|
| health / setup / fix DNA | \`/dna-doctor\` |
| understand codebase / gaps | \`/dna-analyze\` |
| build feature / add X | \`/dna-feature\` or auto factory |
| lint / quality / gate | \`/dna-quality-report\` |
| push / ship / PR | \`/dna-github-push\` (after quality PASS) |
| GDPR / HIPAA / compliance | \`/dna-plan-compliance\` |
| Banking / healthcare / PDPA / legal | \`/dna-legal-advise\` → \`/dna-plan-legal\` |
| install knowledge pack | \`/dna-marketplace-install\` |
| brownfield / legacy | \`/dna-ivf\` |

## Supporting files

- \`commands-reference.md\` — all ${specs.length} commands with purpose and must-rules
- \`workflows.md\` — chained workflows and hard gates
- \`.cursor/commands/dna-*.md\` — per-command extreme detail (invoke with \`/\`)

Regenerate package: \`npx dna commands install\`
Catalog: https://dna.humaan.app/intelligence
`;
}

function buildClaudeSkillMarkdown(projectName: string, specs: DnaAiCommandSpec[]): string {
  return buildCursorSkillMarkdown(projectName, specs).replace(
    ".cursor/skills/dna-cli/",
    ".claude/skills/dna-cli/",
  ).replace(
    ".cursor/commands/dna-*.md",
    ".claude/commands/dna-*.md",
  );
}

function buildCursorRuleMarkdown(projectName: string): string {
  return `---
description: DNA CLI obedience — run real dna commands, respect quality gates, use /dna-* slash commands
alwaysApply: true
---

# DNA CLI commands — obedience layer

Project: **${projectName}**

## You MUST

- Execute **real** \`npx dna\` commands when DNA health, analysis, planning, or delivery is involved
- Use **/\`dna-*\` slash commands** from \`.cursor/commands/\` for structured DNA operations
- Load the **dna-cli skill** at \`.cursor/skills/dna-cli/SKILL.md\` when routing DNA work
- Run \`/dna-quality-report\` before marking features complete or pushing
- Stop feature factory after **Solution Architect plan** — wait for user approval

## You MUST NOT

- Simulate DNA CLI output or skip running commands
- Push to GitHub with a failing quality gate (unless user explicitly overrides)
- Auto-merge AI repair PRs
- Force-push main/master

## Quick reference

| Intent | Slash command |
|--------|---------------|
| Health / repair | \`/dna-doctor\` |
| Deep analysis | \`/dna-analyze\` |
| New feature | \`/dna-feature\` |
| Quality gate | \`/dna-quality-report\` |
| Ship | \`/dna-docker-build\` then \`/dna-github-push\` |

Full catalog: https://dna.humaan.app/intelligence
`;
}

export function generateCursorCommandPackage(config: DnaConfig): Record<string, string> {
  const specs = buildAllCommandSpecs(DNA_AI_COMMAND_CATALOG);
  const reference = buildCommandsReferenceMarkdown(specs);
  const workflows = buildWorkflowsMarkdown();

  return {
    ".cursor/skills/dna-cli/SKILL.md": buildCursorSkillMarkdown(config.projectName, specs),
    ".cursor/skills/dna-cli/commands-reference.md": reference,
    ".cursor/skills/dna-cli/workflows.md": workflows,
    ".cursor/rules/dna-cli-commands.mdc": buildCursorRuleMarkdown(config.projectName),
  };
}

export function generateClaudeCommandPackage(config: DnaConfig): Record<string, string> {
  const specs = buildAllCommandSpecs(DNA_AI_COMMAND_CATALOG);
  return {
    ".claude/skills/dna-cli/SKILL.md": buildClaudeSkillMarkdown(config.projectName, specs),
    ".claude/skills/dna-cli/commands-reference.md": buildCommandsReferenceMarkdown(specs),
    ".claude/skills/dna-cli/workflows.md": buildWorkflowsMarkdown(),
  };
}

export function generateCursorCommands(): Record<string, string> {
  const files: Record<string, string> = {};
  for (const def of DNA_AI_COMMAND_CATALOG) {
    const spec = enrichCommandSpec(def);
    files[`.cursor/commands/${slashName(def.id)}.md`] = buildDetailedCommandBody(spec);
  }
  return files;
}

export function generateClaudeCommands(): Record<string, string> {
  const files: Record<string, string> = {};
  for (const def of DNA_AI_COMMAND_CATALOG) {
    const spec = enrichCommandSpec(def);
    files[`.claude/commands/${slashName(def.id)}.md`] = buildClaudeCommandBody(spec);
  }
  return files;
}

export function generateAiCommandFiles(config: DnaConfig): Record<string, string> {
  return {
    ...generateCursorCommands(),
    ...generateClaudeCommands(),
    ...generateCursorCommandPackage(config),
    ...generateClaudeCommandPackage(config),
  };
}

export function listAiCommandPaths(config?: DnaConfig): string[] {
  const base = Object.keys(generateCursorCommands()).concat(Object.keys(generateClaudeCommands()));
  if (config) {
    return base.concat(Object.keys(generateAiCommandFiles(config)));
  }
  return base.concat([...DNA_COMMAND_PACKAGE_PATHS]);
}

export function formatAiCommandsCatalog(): string {
  const specs = buildAllCommandSpecs(DNA_AI_COMMAND_CATALOG);
  const byCategory = new Map<DnaCommandCategory, DnaAiCommandSpec[]>();
  for (const spec of specs) {
    const list = byCategory.get(spec.category) ?? [];
    list.push(spec);
    byCategory.set(spec.category, list);
  }

  const lines = [
    "DNA AI command packages",
    "=======================",
    "",
    "Cursor: .cursor/skills/dna-cli/ + .cursor/commands/dna-*.md",
    "Claude: .claude/skills/dna-cli/ + .claude/commands/dna-*.md",
    "",
  ];

  for (const [category, meta] of Object.entries(DNA_COMMAND_CATEGORIES)) {
    const defs = byCategory.get(category as DnaCommandCategory);
    if (!defs?.length) continue;
    lines.push(`${meta.label}`, "");
    for (const def of defs) {
      lines.push(`  /${slashName(def.id)}  — ${def.title}`);
      lines.push(`    ${def.purpose}`);
    }
    lines.push("");
  }

  lines.push(`Total: ${specs.length} commands · Packages: Cursor skill + Claude skill + obedience rule`);
  return lines.join("\n");
}

export async function installAiCommands(
  root: string,
  config: DnaConfig,
  opts?: { skipReadme?: boolean },
): Promise<string[]> {
  const created: string[] = [];

  for (const [relPath, content] of Object.entries(generateAiCommandFiles(config))) {
    await writeFileEnsured(join(root, relPath), content);
    created.push(relPath);
  }

  if (opts?.skipReadme) {
    return created;
  }

  await writeFileEnsured(
    join(root, ".cursor", "commands", "README.md"),
    `# DNA command package (Cursor)

Installed by **DNA by Humaan** for **${config.projectName}**.

## Package contents

| Path | Purpose |
|------|---------|
| \`.cursor/skills/dna-cli/\` | Master skill — routing, obedience, full reference |
| \`.cursor/rules/dna-cli-commands.mdc\` | Always-on obedience layer |
| \`.cursor/commands/dna-*.md\` | ${DNA_AI_COMMAND_CATALOG.length} slash commands with extreme detail |

## Usage

Type \`/\` in Cursor chat → search \`dna-\` → e.g. \`/dna-doctor\`, \`/dna-analyze\`

Regenerate: \`npx dna commands install\`  
Catalog: https://dna.humaan.app/intelligence
`,
  );
  created.push(".cursor/commands/README.md");

  await writeFileEnsured(
    join(root, ".claude", "commands", "README.md"),
    `# DNA command package (Claude Code)

Installed by **DNA by Humaan** for **${config.projectName}**.

## Package contents

| Path | Purpose |
|------|---------|
| \`.claude/skills/dna-cli/\` | Master skill — routing, obedience, workflows |
| \`.claude/commands/dna-*.md\` | ${DNA_AI_COMMAND_CATALOG.length} slash commands with YAML frontmatter |

Type \`/\` in Claude Code → search \`dna-\`

Regenerate: \`npx dna commands install\`
`,
  );
  created.push(".claude/commands/README.md");

  return created;
}

const PACKAGE_README_PATHS = [".cursor/commands/README.md", ".claude/commands/README.md"] as const;

export async function uninstallAiCommands(root: string): Promise<string[]> {
  const removed: string[] = [];

  for (const relPath of DNA_COMMAND_PACKAGE_PATHS) {
    const path = join(root, relPath);
    if (await fileExists(path)) {
      await unlink(path);
      removed.push(relPath);
    }
  }

  for (const def of DNA_AI_COMMAND_CATALOG) {
    for (const prefix of [".cursor/commands", ".claude/commands"] as const) {
      const path = join(root, prefix, `${slashName(def.id)}.md`);
      if (await fileExists(path)) {
        await unlink(path);
        removed.push(`${prefix}/${slashName(def.id)}.md`);
      }
    }
  }

  for (const readme of PACKAGE_README_PATHS) {
    const path = join(root, readme);
    if (await fileExists(path)) {
      await unlink(path);
      removed.push(readme);
    }
  }

  return removed;
}

export function intelligenceCatalogJson(): string {
  const specs = buildAllCommandSpecs(DNA_AI_COMMAND_CATALOG);
  return JSON.stringify(
    {
      version: 2,
      generatedBy: "dna commands install",
      catalogUrl: "https://dna.humaan.app/intelligence",
      packages: {
        cursor: {
          skill: ".cursor/skills/dna-cli/SKILL.md",
          rule: ".cursor/rules/dna-cli-commands.mdc",
          commands: ".cursor/commands/dna-*.md",
        },
        claude: {
          skill: ".claude/skills/dna-cli/SKILL.md",
          commands: ".claude/commands/dna-*.md",
        },
      },
      categories: DNA_COMMAND_CATEGORIES,
      commands: specs.map((spec) => ({
        id: spec.id,
        category: spec.category,
        title: spec.title,
        description: spec.description,
        purpose: spec.purpose,
        cli: spec.cli.replace(/\$ARGUMENTS/g, "<args>"),
        argumentHint: spec.argumentHint,
        cursorSlash: `/${slashName(spec.id)}`,
        claudeSlash: `/${slashName(spec.id)}`,
        mustDo: spec.mustDo,
        mustNotDo: spec.mustNotDo,
        relatedCommands: spec.relatedCommands,
      })),
      counts: {
        commands: specs.length,
        cursorFiles: specs.length,
        claudeFiles: specs.length,
        packageFiles: DNA_COMMAND_PACKAGE_PATHS.length,
      },
    },
    null,
    2,
  );
}
