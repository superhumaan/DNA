import { join } from "node:path";
import { readFile } from "node:fs/promises";
import type { DnaConfig } from "@superhumaan/dna-config";
import { writeFileEnsured, fileExists } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import { analyzeProject, type DeepAnalysis } from "./analyze.js";
import { documentFromCode } from "./document.js";
import {
  DEFAULT_IVF_VERTICALS,
  IVF_VERTICALS,
  type IvfVerticalId,
  type VerticalGap,
} from "./verticals.js";
import { ensureSharedLibrary } from "./shared-library.js";
import { ensureProjectUiStandards } from "./ui-standards.js";

export interface IvfPlanOptions {
  root: string;
  quote?: string;
  verticals?: IvfVerticalId[];
  /** Only write gap matrix, skip full plan */
  gapsOnly?: boolean;
  /** Run document --from-code as part of plan generation */
  documentFromCode?: boolean;
}

export interface IvfPlanResult {
  planPath: string;
  gapsPath: string;
  context: string;
  analysis: DeepAnalysis;
  documentFiles?: string[];
  sharedLibraryPlanPath?: string;
}

function slugify(name: string): string {
  return name.replace(/[^a-z0-9-]/gi, "-").toLowerCase().replace(/-+/g, "-");
}

function buildBeforeStructure(analysis: DeepAnalysis): string {
  const { structure, scan } = analysis;
  const lines = [
    "```",
    `${structure.topLevelDirs.filter((d) => !d.startsWith(".")).join("/")}/`,
  ];

  for (const root of structure.sourceRoots) {
    if (root === ".") continue;
    lines.push(`├── ${root}/`);
    if (structure.hasFeaturesFolder) lines.push("│   ├── features/");
    else if (structure.componentDirs.length) lines.push("│   ├── components/");
    if (structure.hasUtilsGodModule) lines.push("│   ├── utils/          # god-module — consider splitting");
    if (scan.backend) lines.push(`│   └── api/ or routes/  # ${scan.backend}`);
  }

  if (!scan.hasDna) lines.push("└── (no .DNA/, no Behaviour, no runtime)");
  else lines.push("├── .DNA/               # partial DNA install");
  lines.push("```");
  return lines.join("\n");
}

function buildAfterStructure(analysis: DeepAnalysis, verticals: IvfVerticalId[]): string {
  const selected = new Set(verticals);
  const { structure, scan } = analysis;

  const lines = ["```", `${structure.topLevelDirs.filter((d) => !d.startsWith(".")).slice(0, 3).join("/")}/`];

  for (const root of structure.sourceRoots.slice(0, 2)) {
    if (root === ".") continue;
    lines.push(`├── ${root}/`);
    if (selected.has("rbac") || selected.has("platform")) {
      lines.push(structure.hasFeaturesFolder ? "│   ├── features/" : "│   ├── features/       # vertical slices");
      if (!structure.hasMiddlewareDir && selected.has("rbac")) {
        lines.push("│   ├── middleware/     # auth, RBAC, audit");
      }
      if (!structure.hasAdminRoute && selected.has("platform")) {
        lines.push("│   └── admin/          # admin route group");
      }
    }
  }

  if (selected.has("sharedLibrary")) {
    lines.push(`├── ${analysis.sharedLibrary.recommendedPackagePath}/  # shared UI library`);
  }

  lines.push("├── .DNA/");
  if (selected.has("behaviour")) lines.push("│   ├── behaviour/      # AI rules");
  if (selected.has("knowledge")) lines.push("│   ├── knowledge/      # stack + compliance packs");
  if (selected.has("cellularMemory")) lines.push("│   ├── CellularMemory/ # learned context");
  if (selected.has("neuralNetwork")) lines.push("│   ├── neuralNetwork.json");
  if (selected.has("runtime")) lines.push("│   ├── immuneSystem/ + runtime/");
  lines.push("│   └── plans/            # IVF, RBAC, compliance, feature");
  if (selected.has("impressions")) lines.push("└── DNA/Impressions/    # human docs (as-is + target)");
  lines.push("```");

  if (scan.backend && selected.has("runtime")) {
    lines.push("", `_Runtime: import from @superhumaan/dna-by-humaan/runtime (${scan.backend} adapter)_`);
  }

  return lines.join("\n");
}

function gapMatrixTable(gaps: VerticalGap[]): string {
  const header = "| Priority | Vertical | Current | Target | Restructure | Why |";
  const sep = "|----------|----------|---------|--------|-------------|-----|";
  const rows = gaps.map(
    (g) =>
      `| ${g.priority} | ${g.name} | ${g.currentState.replace(/\|/g, "/").slice(0, 40)} | ${g.targetState.replace(/\|/g, "/").slice(0, 35)} | ${g.restructureNeeded ? "yes" : "no"} | ${g.why.slice(0, 50)} |`,
  );
  return [header, sep, ...rows].join("\n");
}

function buildPhases(gaps: VerticalGap[], verticals: IvfVerticalId[]): string[] {
  const phases: string[] = [];

  phases.push(
    "### Phase 0 — DNA shell (no code moves)",
    "",
    "```bash",
    "dna init --stage legacy_modernisation   # if not installed",
    "dna marketplace install frameworks/<your-stack>",
    "```",
    "",
    "**Output:** `.DNA/config.dna.json`, behaviour/, knowledge/",
    "",
  );

  phases.push(
    "### Phase 1 — Document reality",
    "",
    "```bash",
    "dna analyze --deep",
    "dna document --from-code",
    "```",
    "",
    "**Output:** `DNA/Impressions/architecture/*`, `parietalLobe/system-map.md`",
    "",
  );

  if (verticals.includes("runtime")) {
    phases.push(
      "### Phase 2 — Runtime + immune",
      "",
      "```bash",
      "pnpm add @superhumaan/dna-by-humaan",
      "dna runtime install",
      "```",
      "",
      "**Output:** `.DNA/runtime/`, middleware wired in server",
      "",
    );
  }

  const featureVerticals = verticals.filter((v) => ["rbac", "compliance", "platform"].includes(v));
  if (featureVerticals.length) {
    phases.push("### Phase 3 — Vertical features", "");
    if (verticals.includes("rbac")) phases.push("- `dna plan rbac --quote \"...\"`");
    if (verticals.includes("compliance")) phases.push("- `dna plan compliance --frameworks gdpr,iso27001`");
    if (verticals.includes("platform")) phases.push("- `dna plan feature admin-portal`");
    phases.push("", "**Output:** `.DNA/plans/*.md`, permission/control matrices", "");
  }

  const restructureGaps = gaps.filter((g) => g.restructureNeeded && g.priority <= "P1");
  if (restructureGaps.length) {
    phases.push("### Phase 4 — Restructure (per gap matrix)", "");
    for (const g of restructureGaps) {
      phases.push(`- **${g.name}:** ${g.actions[0]}`);
    }
    phases.push("", "**Output:** PR with before/after, updated system-map", "");
  }

  if (verticals.includes("sharedLibrary")) {
    phases.push(
      "### Phase 4b — Shared library consolidation",
      "",
      "AI scaffolds a shared component package, extracts duplicates, and replaces local copies with imports.",
      "",
      "```bash",
      "dna plan ivf --verticals sharedLibrary   # writes .DNA/plans/shared-library-<project>.md",
      "dna context ivf",
      "```",
      "",
      "**Workflow:**",
      "1. Scaffold `packages/ui` (or detected shared package path)",
      "2. Move canonical components into shared lib",
      "3. Replace imports across apps — delete duplicate files",
      "4. Standardise prop APIs and document in `occipitalLobe/ui-patterns.md`",
      "",
      "**Output:** Zero cross-scope duplicate components, `dna validate` clean",
      "",
    );
  }

  if (verticals.includes("mui") || verticals.includes("buildRules")) {
    phases.push(
      "### Phase 4c — Web UI layers (automatic on init/context)",
      "",
      "| Layer | What |",
      "|-------|------|",
      "| **MUI foundation** | Theme, tokens, primitives — use MUI fully if no build rules |",
      "| **Build rules** | Clone reference list/report pages for new features |",
      "",
      "Configured automatically — no extra commands. Cursor rules: `.cursor/rules/list-report-pages.mdc`",
      "",
    );
  }

  if (verticals.includes("mobileTheming") || verticals.includes("mobileBuildRules")) {
    phases.push(
      "### Phase 4d — Mobile UI layers (automatic on init/context)",
      "",
      "| Layer | What |",
      "|-------|------|",
      "| **Mobile theming** | Paper/Tamagui theme provider + tokens |",
      "| **Mobile build rules** | Clone reference list screens |",
      "",
    );
  }

  phases.push(
    "### Phase 5 — Validate + handoff",
    "",
    "```bash",
    "dna validate",
    "dna doctor",
    "dna context ivf",
    "dna context cursor",
    "```",
    "",
    "**Output:** AI-ready project, documented exceptions only",
  );

  return phases;
}

function buildIvfBrief(
  options: IvfPlanOptions,
  config: DnaConfig | null,
  analysis: DeepAnalysis,
  verticals: IvfVerticalId[],
): string {
  const { scan, structure, inventory, stackErrors } = analysis;
  const projectName = config?.projectName ?? "project";
  const gaps = analysis.verticalGaps;

  const lines = [
    `# DNA IVF Plan: Integrating Vertical Functions`,
    "",
    `_Generated by DNA by Humaan. Give this entire document to your AI tool before brownfield integration._`,
    "",
    "## Executive summary",
    "",
    `- **Project:** ${projectName}`,
    `- **Stage:** ${config?.stage ?? "unknown"}`,
    `- **Archetype:** ${config?.stack.archetype ?? "not set"}`,
    `- **Integration scope:** ${verticals.map((v) => IVF_VERTICALS.find((x) => x.id === v)?.name ?? v).join(", ")}`,
    `- **Risk level:** ${gaps.some((g) => g.priority === "P0") ? "high — address P0 gaps first" : gaps.some((g) => g.priority === "P1") ? "medium" : "low"}`,
    "",
    "## User requirement",
    "",
    options.quote?.trim() ||
      `Integrate DNA vertical functions into existing ${projectName} without a full rewrite.`,
    "",
    "## Before (as-is)",
    "",
    buildBeforeStructure(analysis),
    "",
    "### Detected state",
    "",
    `- Frontend: ${scan.frontend ?? "not detected"}`,
    `- Backend: ${scan.backend ?? "not detected"}`,
    `- Routes: ${inventory.routes.length}, APIs: ${inventory.apis.length}`,
    `- Tests: ${structure.testFileCount} files, framework: ${scan.testFramework ?? "none"}`,
    `- DNA installed: ${scan.hasDna ? "yes" : "no"}`,
    "",
    "## After (target)",
    "",
    buildAfterStructure(analysis, verticals),
    "",
    "## Vertical function gap matrix",
    "",
    gapMatrixTable(gaps),
    "",
    "## Gap details",
    "",
  ];

  for (const g of gaps) {
    lines.push(`### ${g.name} [${g.priority}]`, "");
    lines.push(`- **Current:** ${g.currentState}`);
    lines.push(`- **Target:** ${g.targetState}`);
    lines.push(`- **Restructure:** ${g.restructureNeeded ? "yes" : "no"}`);
    lines.push(`- **Why:** ${g.why}`);
    lines.push("- **Actions:**");
    g.actions.forEach((a) => lines.push(`  - ${a}`));
    lines.push("");
  }

  if (stackErrors.length) {
    lines.push("## Stack issues to resolve", "");
    stackErrors.forEach((e) => lines.push(`- ⚠ ${e.message}`));
    lines.push("");
  }

  lines.push("## Phased execution", "", ...buildPhases(gaps, verticals), "");

  lines.push(
    "## Definition of done",
    "",
    "- [ ] `dna doctor` passes",
    "- [ ] `dna validate` passes (or exceptions documented in prefrontalCortex/decisions.md)",
    "- [ ] Impressions reflect actual architecture",
    "- [ ] Chosen verticals have plans in `.DNA/plans/`",
    "- [ ] `dna context ivf` loads this plan for AI sessions",
    "- [ ] Runtime classifies errors (if backend + runtime vertical selected)",
    verticals.includes("sharedLibrary")
      ? "- [ ] Shared library plan executed — no DUPLICATE_COMPONENTS warnings"
      : "",
    "",
    "## Related commands",
    "",
    "```bash",
    "dna analyze --deep",
    "dna document --from-code",
    "dna plan ivf --verticals " + verticals.join(","),
    "dna context ivf",
    "```",
    "",
  );

  return lines.join("\n");
}

export async function generateIvfPlan(options: IvfPlanOptions): Promise<IvfPlanResult> {
  const config = await loadDnaConfig(options.root);
  if (!config) {
    throw new Error("DNA not installed. Run `dna init` first.");
  }

  const verticals = options.verticals?.length ? options.verticals : DEFAULT_IVF_VERTICALS;
  const analysis = await analyzeProject(options.root, { verticals });

  // Auto-bootstrap UI layers for web/mobile (idempotent)
  await ensureProjectUiStandards({
    root: options.root,
    quote: options.quote,
    includeSharedLibrary: verticals.includes("sharedLibrary"),
  });

  let documentFiles: string[] | undefined;
  if (options.documentFromCode !== false) {
    const docResult = await documentFromCode({
      root: options.root,
      merge: true,
    });
    documentFiles = docResult.filesWritten;
    // Re-analyze after documentation
    Object.assign(analysis, { verticalGaps: docResult.analysis.verticalGaps });
  }

  const context = buildIvfBrief(options, config, analysis, verticals);
  const slug = slugify(config.projectName);
  const planPath = join(options.root, ".DNA", "plans", `ivf-${slug}.md`);
  const gapsPath = join(options.root, ".DNA", "CellularMemory", "prefrontalCortex", "ivf-gaps.md");

  let sharedLibraryPlanPath: string | undefined;
  if (verticals.includes("sharedLibrary")) {
    const slResult = await ensureSharedLibrary({
      root: options.root,
      quote: options.quote,
    });
    if (!slResult.skipped) {
      sharedLibraryPlanPath = slResult.planPath;
    }
  }

  if (!options.gapsOnly) {
    await writeFileEnsured(planPath, context);
  }

  const gapsContent = [
    "# IVF Gap Matrix",
    "",
    `_Updated: ${new Date().toISOString().split("T")[0]}_`,
    "",
    gapMatrixTable(analysis.verticalGaps),
    "",
    ...analysis.verticalGaps.flatMap((g) => [
      `## ${g.name} (${g.priority})`,
      "",
      g.why,
      "",
      ...g.actions.map((a) => `- ${a}`),
      "",
    ]),
  ].join("\n");

  await writeFileEnsured(gapsPath, gapsContent);

  // Update current plan in prefrontalCortex
  const currentPlanPath = join(options.root, ".DNA", "CellularMemory", "prefrontalCortex", "current-plan.md");
  if (await fileExists(currentPlanPath)) {
    const existing = await readFile(currentPlanPath, "utf-8");
    if (existing.includes("Initial project setup") || existing.includes("MVP development")) {
      await writeFileEnsured(
        currentPlanPath,
        `# Current Plan

## Active Focus

Brownfield DNA integration (IVF Plan).

## Stage

${config.stage}

## Plan

See \`.DNA/plans/ivf-${slug}.md\`

## Next actions

${analysis.verticalGaps
  .filter((g) => g.priority <= "P1")
  .flatMap((g) => g.actions.slice(0, 1).map((a) => `- [ ] ${a}`))
  .join("\n")}
`,
      );
    }
  }

  return {
    planPath,
    gapsPath,
    context: options.gapsOnly ? gapsContent : context,
    analysis,
    documentFiles,
    sharedLibraryPlanPath,
  };
}

export {
  parseVerticalsInput,
  DEFAULT_IVF_VERTICALS,
  IVF_VERTICALS,
} from "./verticals.js";
export { analyzeProject, formatAnalysisSummary } from "./analyze.js";
export { documentFromCode, formatDocumentResult } from "./document.js";
export {
  analyzeSharedLibrary,
  ensureSharedLibrary,
  buildSharedLibraryBrief,
  formatSharedLibrarySummary,
} from "./shared-library.js";
export {
  analyzeFeaturePatterns,
  ensureFeatureBuildingRules,
  formatFeaturePatternSummary,
} from "./build-rules.js";
export { analyzeMuiFoundation, ensureMuiFoundation, formatMuiFoundationSummary } from "./mui-foundation.js";
export { ensureMobileTheming, analyzeMobileTheming } from "./mobile-theming.js";
export { ensureMobileBuildRules, analyzeMobileBuildRules } from "./mobile-build-rules.js";
export { ensureProjectUiStandards } from "./ui-standards.js";
