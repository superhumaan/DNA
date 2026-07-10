import type { DnaAiCommandDef, DnaCommandCategory } from "./ai-commands.js";

export interface DnaAiCommandSpec extends DnaAiCommandDef {
  purpose: string;
  whenToUse: string[];
  whenNotToUse: string[];
  prerequisites: string[];
  mustDo: string[];
  mustNotDo: string[];
  flags?: { flag: string; description: string }[];
  outputGuide: { section: string; meaning: string }[];
  exitCodes: { code: number; meaning: string }[];
  filesTouched: string[];
  relatedCommands: string[];
  workflowChains?: string[];
  examples: { scenario: string; command: string; then: string }[];
}

const GLOBAL_MUST_DO = [
  "Run the real CLI command in the shell — never invent or simulate DNA output.",
  "Execute from the **project root** unless `--cwd` is explicitly required.",
  "Read the **full terminal output** (stdout and stderr) before summarizing or acting.",
  "Prefer `npx dna` when `dna` is not on PATH; use global `dna` when available.",
  "Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, and `DNA/Impressions/` before follow-up implementation.",
];

const GLOBAL_MUST_NOT_DO = [
  "Never skip running the command when the user invoked this slash command.",
  "Never tell the user to copy prompts or manually edit DNA scaffold files when DNA can do it.",
  "Never commit `.env`, tokens, or credentials surfaced by CLI output.",
  "Never force-push to `main` or `master`.",
];

const CATEGORY_DEFAULTS: Record<
  DnaCommandCategory,
  Pick<DnaAiCommandSpec, "whenToUse" | "whenNotToUse" | "prerequisites" | "mustDo" | "mustNotDo" | "outputGuide" | "exitCodes" | "filesTouched">
> = {
  core: {
    whenToUse: ["Project health is unknown", "After cloning a DNA-enabled repo", "Before major feature work"],
    whenNotToUse: ["When `--check-only` was requested and fixes are explicitly forbidden"],
    prerequisites: ["Project root with `package.json` or DNA already partially installed"],
    mustDo: ["Report every ✓ and ✗ line from doctor-style output literally"],
    mustNotDo: ["Never disable DNA hooks or CI to 'fix' a failing gate without user approval"],
    outputGuide: [{ section: "Checks", meaning: "Each line is pass/fail for a DNA subsystem" }],
    exitCodes: [{ code: 0, meaning: "Success or acceptable validation warnings" }, { code: 1, meaning: "Validation failed — fix before proceeding" }],
    filesTouched: [".DNA/", "DNA/Impressions/", ".cursor/", ".claude/", ".github/workflows/"],
  },
  analysis: {
    whenToUse: ["Brownfield onboarding", "Architecture review", "Before planning IVF or compliance"],
    whenNotToUse: ["When the user only wants a single file explained — use Read/Grep instead"],
    prerequisites: ["DNA installed (`dna init` or `dna doctor`) for full gap analysis"],
    mustDo: ["Prioritize P1 gaps over P3 in recommendations"],
    mustNotDo: ["Never recommend a full rewrite when IVF phased migration is available"],
    outputGuide: [{ section: "Vertical gaps", meaning: "P1 = structural blockers; P3 = enhancements" }],
    exitCodes: [{ code: 0, meaning: "Analysis complete" }],
    filesTouched: ["DNA/Impressions/", ".DNA/CellularMemory/"],
  },
  "feature-factory": {
    whenToUse: ["User describes a feature in plain language", "Starting net-new product work", "Re-enabling DNA agent workflows"],
    whenNotToUse: ["Trivial one-line typo fixes", "When user explicitly asked for read-only review"],
    prerequisites: ["Feature factory installed (`dna feature-factory install`)"],
    mustDo: [
      "Stop after Solution Architect plan and **wait for user approval** before coding",
      "Run `dna quality report --feature` before marking feature complete",
      "Close with `dna docker build` then `dna github push`",
    ],
    mustNotDo: ["Never implement without updating `ai/feature-request.md` first", "Never skip the quality gate"],
    outputGuide: [{ section: "Feature slug", meaning: "Used for quality report path `.DNA/reports/quality/<slug>.md`" }],
    exitCodes: [{ code: 0, meaning: "Factory files written" }],
    filesTouched: ["ai/feature-request.md", "ai/agent-loop.md", ".cursor/rules/", ".cursor/commands/", ".claude/"],
  },
  quality: {
    whenToUse: ["Before marking any feature complete", "Before `git push`", "After significant code changes"],
    whenNotToUse: ["Exploratory spikes the user will discard"],
    prerequisites: ["Lint and test scripts in package.json when toolchain checks are enabled"],
    mustDo: ["Treat FAIL as a hard stop — fix blockers and criticals", "Read `.DNA/reports/quality/latest.md` when report mode"],
    mustNotDo: ["Never waive security blockers without explicit user sign-off"],
    outputGuide: [
      { section: "PASS", meaning: "No blocker or critical issues — may proceed to push" },
      { section: "FAIL", meaning: "Fix listed issues and re-run until PASS" },
    ],
    exitCodes: [{ code: 0, meaning: "Gate PASS" }, { code: 1, meaning: "Gate FAIL" }],
    filesTouched: [".DNA/reports/quality/"],
  },
  delivery: {
    whenToUse: ["Feature factory close-out", "CI missing or broken", "Preparing preview deploy"],
    whenNotToUse: ["Mid-implementation before quality gate passes"],
    prerequisites: ["Docker installed for `docker build`", "GitHub auth for `github push`"],
    mustDo: ["Ensure pre-push hook runs `dna quality report` on every push"],
    mustNotDo: ["Never push with failing quality gate unless user explicitly overrides"],
    outputGuide: [{ section: "Workflow files", meaning: "Created under `.github/workflows/`" }],
    exitCodes: [{ code: 0, meaning: "Delivery step succeeded" }, { code: 1, meaning: "Build or auth failed" }],
    filesTouched: [".github/workflows/", "Dockerfile", ".DNA/hooks/pre-push"],
  },
  plan: {
    whenToUse: ["User needs RBAC, compliance, IVF, or Impressions reconciliation plans"],
    whenNotToUse: ["When implementation is already approved and scoped"],
    prerequisites: ["Plain-language quote or flags describing requirements"],
    mustDo: ["Write plans to `.DNA/plans/` and present summary before implementation"],
    mustNotDo: ["Never implement compliance controls without referencing generated plan files"],
    outputGuide: [{ section: "Plan path", meaning: "Markdown plan under `.DNA/plans/`" }],
    exitCodes: [{ code: 0, meaning: "Plan generated" }],
    filesTouched: [".DNA/plans/", ".DNA/knowledge/"],
  },
  ivf: {
    whenToUse: ["Existing production codebase without DNA", "Brownfield integration without rewrite"],
    whenNotToUse: ["Greenfield projects — use `dna init` instead"],
    prerequisites: ["Existing source tree with detectable stack"],
    mustDo: ["Prefer phased migration over big-bang restructure"],
    mustNotDo: ["Never delete existing production code paths without user approval"],
    outputGuide: [{ section: "IVF phases", meaning: "Ordered integration steps — follow sequence" }],
    exitCodes: [{ code: 0, meaning: "IVF step completed" }],
    filesTouched: [".DNA/", "DNA/Impressions/"],
  },
  marketplace: {
    whenToUse: ["Need stack, compliance, or vertical knowledge packs"],
    whenNotToUse: ["When pack is already installed — check `.DNA/config.dna.json` first"],
    prerequisites: ["Network for remote catalog; bundled fallback works offline"],
    mustDo: ["Record installed pack IDs in config after install"],
    mustNotDo: ["Never hand-edit files under `.DNA/knowledge/` when reinstalling packs"],
    outputGuide: [{ section: "packId", meaning: "Install path like `frameworks/nextjs` or `compliance/gdpr`" }],
    exitCodes: [{ code: 0, meaning: "Catalog or install succeeded" }],
    filesTouched: [".DNA/knowledge/", ".DNA/config.dna.json"],
  },
  memory: {
    whenToUse: ["Sharing CellularMemory across repos", "Backup before major refactor"],
    whenNotToUse: ["Replacing git history or Impressions docs"],
    prerequisites: ["DNA CellularMemory scaffolded"],
    mustDo: ["Use `--merge` on import unless user requested full replace"],
    mustNotDo: ["Never commit export files with secrets from runtime events"],
    outputGuide: [{ section: "Segments", meaning: "Seven memory regions exported as JSON" }],
    exitCodes: [{ code: 0, meaning: "Export/import succeeded" }],
    filesTouched: [".DNA/CellularMemory/", ".DNA/exports/"],
  },
  compliance: {
    whenToUse: ["Regulated industries", "GDPR/HIPAA/ISO/SOC2/PCI scoping"],
    whenNotToUse: ["Non-regulated internal tools with no PII"],
    prerequisites: ["Org tier known (startup → enterprise)"],
    mustDo: ["Match controls to org tier — do not over-engineer startup tier"],
    mustNotDo: ["Never treat templates as legal advice — flag for human review"],
    outputGuide: [{ section: "Framework", meaning: "gdpr, hipaa, iso27001, soc2, pci" }],
    exitCodes: [{ code: 0, meaning: "Catalog listed" }],
    filesTouched: [".DNA/knowledge/compliance/", ".DNA/plans/"],
  },
  platform: {
    whenToUse: ["Implementing Humaan production patterns", "Scoping admin portal, SSO, audit logging"],
    whenNotToUse: ["Greenfield with no platform feature overlap"],
    prerequisites: ["Reference projects available for context"],
    mustDo: ["Cross-check with `dna platform project <id>` before planning"],
    mustNotDo: [],
    outputGuide: [{ section: "featureId", meaning: "Platform feature slug from catalog" }],
    exitCodes: [{ code: 0, meaning: "Catalog displayed" }],
    filesTouched: [".DNA/knowledge/platforms/"],
  },
  stack: {
    whenToUse: ["Stack conflicts detected", "New project archetype selection"],
    whenNotToUse: ["When stack is validated and documented"],
    prerequisites: ["package.json and lockfile present"],
    mustDo: ["Resolve archetype conflicts before adding new frameworks"],
    mustNotDo: ["Never mix incompatible archetypes (e.g. Next.js + Vite app roots)"],
    outputGuide: [{ section: "Conflicts", meaning: "Technologies that violate chosen archetype" }],
    exitCodes: [{ code: 0, meaning: "Stack report generated" }],
    filesTouched: [".DNA/config.dna.json"],
  },
  ai: {
    whenToUse: ["Configuring repair provider", "Running classified runtime issue repair"],
    whenNotToUse: ["When issue is unclassified — use runtime observer first"],
    prerequisites: ["API keys via env or `dna ai connect` — never in repo"],
    mustDo: ["Human review required for all repair PRs"],
    mustNotDo: ["NEVER auto-merge repair PRs"],
    outputGuide: [{ section: "Confidence", meaning: "Repair plan confidence — low values need extra review" }],
    exitCodes: [{ code: 0, meaning: "Connect or repair workflow completed" }],
    filesTouched: [".DNA/config.dna.json", ".DNA/runtime/"],
  },
  generate: {
    whenToUse: ["Platform feature codegen requested", "Audit logging or similar scaffolds"],
    whenNotToUse: ["When full feature factory plan is not yet approved"],
    prerequisites: ["Valid platform feature ID from `dna platform list`"],
    mustDo: ["Review generated scaffold before wiring into production routes"],
    mustNotDo: [],
    outputGuide: [{ section: "Created files", meaning: "Scaffold paths printed by CLI" }],
    exitCodes: [{ code: 0, meaning: "Scaffold generated" }],
    filesTouched: ["src/ or project-specific scaffold paths"],
  },
};

/** Per-command overrides — merged on top of category defaults */
export const COMMAND_SPEC_OVERRIDES: Record<string, Partial<DnaAiCommandSpec>> = {
  doctor: {
    purpose: "Single orchestrator for DNA health: scaffold missing files, refresh CI/Docker/hooks, wire runtime, refresh AI rules, and install slash commands.",
    flags: [
      { flag: "--check-only", description: "Report only — no fixes, no browser GitHub login" },
      { flag: "--ivf", description: "Run brownfield IVF pipeline when legacy project detected" },
      { flag: "--quote <text>", description: "IVF integration quote" },
    ],
    outputGuide: [
      { section: "DNA Doctor checks", meaning: "✓ = healthy; ✗ = missing or broken — doctor attempts repair unless --check-only" },
      { section: "Doctor actions", meaning: "Files created/updated during this run" },
      { section: "Validation", meaning: "Behaviour validation issue count" },
    ],
    relatedCommands: ["dna-init", "dna-commands-install", "dna-feature-factory-install", "dna-ci-install"],
    workflowChains: ["dna doctor → dna analyze → dna plan ivf (brownfield)", "dna doctor → dna feature (new work)"],
    examples: [
      { scenario: "First clone", command: "npx dna doctor", then: "Run npm install if package.json changed; verify git hooks" },
      { scenario: "Audit only", command: "npx dna doctor --check-only", then: "List ✗ items without fixing" },
    ],
  },
  analyze: {
    purpose: "Deep brownfield analysis: package manager, frontend/backend stack, auth patterns, integrations, shared library health, and prioritized vertical gaps (IVF).",
    flags: [{ flag: "--deep", description: "Extended analysis" }, { flag: "--verticals", description: "Comma-separated verticals to inspect" }],
    outputGuide: [
      { section: "Structure", meaning: "Source roots, features folder, admin routes, test count" },
      { section: "Surfaces", meaning: "Routes, API endpoints, pages detected" },
      { section: "Vertical gaps", meaning: "P1 = must fix for DNA maturity; P3 = nice-to-have" },
    ],
    relatedCommands: ["dna-scan", "dna-document", "dna-plan-ivf", "dna-ivf"],
    examples: [
      { scenario: "New repo assessment", command: "npx dna analyze", then: "Address P1 gaps; run dna plan ivf for migration plan" },
    ],
  },
  feature: {
    purpose: "Bootstrap feature factory: write ai/feature-request.md, baseline quality report, and trigger agent-loop workflow.",
    mustDo: [
      "Read ai/agent-loop.md and execute role-by-role",
      "Stop after Solution Architect plan — wait for approval",
    ],
    relatedCommands: ["dna-quality-report", "dna-docker-build", "dna-github-push"],
    examples: [
      { scenario: "New capability", command: 'npx dna feature "Add admin dashboard for support"', then: "Follow agent-loop; run quality report before done" },
    ],
  },
  "quality-report": {
    purpose: "Local SonarQube-style gate — security, reliability, maintainability, coverage, and toolchain checks. No SonarQube server.",
    flags: [
      { flag: "--feature", description: "Scope to git-changed files (feature factory default)" },
      { flag: "--paths", description: "Specific files to scan" },
      { flag: "--json", description: "Machine-readable output" },
    ],
    relatedCommands: ["dna-quality-scan", "dna-docker-build", "dna-github-push"],
    examples: [
      { scenario: "Feature close-out", command: "npx dna quality report --feature", then: "Fix FAIL items; then docker build and github push" },
    ],
  },
  "github-push": {
    purpose: "Commit and push current feature branch — feature factory mandatory close-out step.",
    flags: [
      { flag: "--message", description: "Commit message" },
      { flag: "--branch", description: "Branch name" },
      { flag: "--create-branch", description: "Create branch if missing" },
    ],
    mustDo: ["Confirm quality gate PASS before push unless user explicitly overrides"],
    relatedCommands: ["dna-quality-report", "dna-github-login"],
  },
  context: {
    purpose: "Emit focused domain context for AI tools — loads neuralNetwork routes to knowledge, behaviour, and memory.",
    flags: [],
    outputGuide: [
      { section: "Targets", meaning: "cursor, claude, backend, frontend, security, qa, compliance, ivf, all, etc." },
    ],
    relatedCommands: ["dna-analyze", "dna-validate"],
    examples: [
      { scenario: "Security work", command: "npx dna context security", then: "Apply output to current session before editing auth code" },
    ],
  },
  "plan-rbac": {
    purpose: "Generate RBAC + zero trust plan: roles, permission matrix, route guards, API middleware, and knowledge pack install.",
    flags: [
      { flag: "--quote", description: "Plain-language RBAC requirement" },
      { flag: "--roles", description: "Comma-separated role list" },
      { flag: "--feature", description: "Feature scope name" },
    ],
    filesTouched: [".DNA/plans/rbac-*.md", ".DNA/knowledge/security/"],
    relatedCommands: ["dna-plan-feature", "dna-marketplace-install"],
  },
  "plan-compliance": {
    purpose: "Tiered compliance plan for GDPR, HIPAA, ISO 27001, SOC 2, PCI — scoped to org tier.",
    flags: [
      { flag: "--frameworks", description: "gdpr, hipaa, iso27001, soc2, pci" },
      { flag: "--tier", description: "startup | sme | corporate | enterprise" },
      { flag: "--quote", description: "Project context" },
    ],
    relatedCommands: ["dna-compliance-list", "dna-context", "dna-marketplace-install"],
  },
  ivf: {
    purpose: "Brownfield IVF run: analyze → document from code → generate integration plan → wire DNA without rewrite.",
    flags: [{ flag: "--quote", description: "Integration requirement in plain language" }],
    workflowChains: ["dna analyze → dna ivf run → dna plan ivf → implement phases"],
    relatedCommands: ["dna-analyze", "dna-document", "dna-plan-ivf"],
  },
  "marketplace-install": {
    purpose: "Install a knowledge pack into .DNA/knowledge/ and register version in config.",
    flags: [{ flag: "--channel", description: "stable | beta" }],
    mustDo: ["Verify packId exists via list/search if install fails"],
    examples: [
      { scenario: "Next.js pack", command: "npx dna marketplace install frameworks/nextjs", then: "Load new knowledge before frontend work" },
    ],
  },
  "ai-repair": {
    purpose: "AI-assisted repair from classified runtime issue JSON — creates branch/PR, never auto-merges.",
    flags: [{ flag: "--file", description: "Issue JSON path" }, { flag: "--dry-run", description: "Plan only" }],
    mustNotDo: ["NEVER merge repair PRs without human review", "NEVER run repair on unclassified issues"],
  },
};

export function enrichCommandSpec(def: DnaAiCommandDef): DnaAiCommandSpec {
  const cat = CATEGORY_DEFAULTS[def.category];
  const override = COMMAND_SPEC_OVERRIDES[def.id] ?? {};

  return {
    ...def,
    purpose: override.purpose ?? def.description,
    whenToUse: override.whenToUse ?? cat.whenToUse,
    whenNotToUse: override.whenNotToUse ?? cat.whenNotToUse,
    prerequisites: override.prerequisites ?? cat.prerequisites,
    mustDo: [...GLOBAL_MUST_DO, ...cat.mustDo, ...(override.mustDo ?? [])],
    mustNotDo: [...GLOBAL_MUST_NOT_DO, ...cat.mustNotDo, ...(override.mustNotDo ?? [])],
    flags:
      override.flags ??
      (def.argumentHint ? [{ flag: def.argumentHint, description: "See CLI reference" }] : undefined),
    outputGuide: override.outputGuide ?? cat.outputGuide,
    exitCodes: override.exitCodes ?? cat.exitCodes,
    filesTouched: override.filesTouched ?? cat.filesTouched,
    relatedCommands: override.relatedCommands ?? [],
    workflowChains: override.workflowChains,
    examples: override.examples ?? [
      {
        scenario: "Default invocation",
        command: def.cli.replace(/\$ARGUMENTS/g, "").trim(),
        then: def.followUp ?? "Summarize output and recommend next command.",
      },
    ],
  };
}

export function buildAllCommandSpecs(defs: readonly DnaAiCommandDef[]): DnaAiCommandSpec[] {
  return defs.map(enrichCommandSpec);
}
