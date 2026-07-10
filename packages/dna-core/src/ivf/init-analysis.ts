import { join } from "node:path";
import { readFile } from "node:fs/promises";
import type { DnaConfig } from "@superhumaan/dna-config";
import { writeFileEnsured, writeJsonFile } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import { ensureKnowledgeInstalled } from "../marketplace/ensure.js";
import { resolveFeaturePlanPackIds } from "../platform/knowledge.js";
import { getFeature } from "../platform/catalog.js";
import {
  detectPlatformFeaturesFromAnalysis,
  formatDetectedFeatures,
} from "../platform/detect-features.js";
import { formatAnalysisSummary, type DeepAnalysis } from "./analyze.js";
import { generateIvfPlan } from "./plan.js";
import { ALL_IVF_VERTICALS } from "./verticals.js";

export interface FullInitAnalysisResult {
  analysis: DeepAnalysis;
  planPath: string;
  gapsPath: string;
  detectedFeatures: string[];
  installedFeaturePacks: string[];
  summary: string;
}

async function installDetectedFeaturePacks(
  root: string,
  config: DnaConfig,
  featureIds: string[],
): Promise<string[]> {
  const packIds = new Set<string>();
  for (const featureId of featureIds) {
    const feature = getFeature(featureId);
    if (!feature) continue;
    for (const packId of resolveFeaturePlanPackIds(feature)) {
      packIds.add(packId);
    }
  }
  if (!packIds.size) return [];
  const result = await ensureKnowledgeInstalled(root, [...packIds], config.channel);
  return result.installed;
}

async function writeAnalysisMemory(
  root: string,
  config: DnaConfig,
  analysis: DeepAnalysis,
  detectedFeatures: string[],
  planPath: string,
): Promise<void> {
  const now = new Date().toISOString().split("T")[0];
  const p0 = analysis.verticalGaps.filter((g) => g.priority === "P0");
  const p1 = analysis.verticalGaps.filter((g) => g.priority === "P1");

  await writeFileEnsured(
    join(root, ".DNA", "CellularMemory", "hippocampus", "project-summary.md"),
    `# Project Summary

**${config.projectName}**

${config.description ?? "Analysed from codebase on init."}

## Stack (detected)

- Archetype: ${config.stack.archetype ?? "not set"}
- Frontend: ${analysis.scan.frontend ?? config.stack.frontend ?? "not detected"}
- Backend: ${analysis.scan.backend ?? config.stack.backend ?? "not detected"}
- Database: ${analysis.scan.database ?? config.stack.database ?? "not detected"}
- Package manager: ${analysis.scan.packageManager ?? "unknown"}

## Surfaces

- Routes: ${analysis.inventory.routes.length}
- API endpoints: ${analysis.inventory.apis.length}
- Pages: ${analysis.inventory.pages.length}
- Integrations: ${analysis.integrations.map((i) => i.name).join(", ") || "none detected"}

## Platform features detected

${detectedFeatures.length ? detectedFeatures.map((id) => `- ${id}`).join("\n") : "- (none — use Cursor to plan features)"}

_Last analysed: ${now}_
`,
  );

  await writeFileEnsured(
    join(root, ".DNA", "CellularMemory", "prefrontalCortex", "next-actions.md"),
    `# Next Actions

_From full init analysis (${now})_

## P0 gaps (${p0.length})

${p0.length ? p0.map((g) => `- [ ] **${g.name}** — ${g.currentState}`).join("\n") : "- None"}

## P1 gaps (${p1.length})

${p1.length ? p1.slice(0, 8).map((g) => `- [ ] **${g.name}** — ${g.currentState}`).join("\n") : "- None"}

## Plans

- IVF plan: \`${planPath.replace(/^\.\//, "")}\`
- Gap matrix: \`.DNA/CellularMemory/prefrontalCortex/ivf-gaps.md\`

## Commands

- \`npx dna analyze\` — re-run analysis
- \`npx dna plan ivf\` — refresh integration plan
- \`npx dna plan feature <id>\` — plan a platform feature
`,
  );

  const recentPath = join(root, ".DNA", "CellularMemory", "hippocampus", "recent-changes.md");
  let recent = "";
  try {
    recent = await readFile(recentPath, "utf-8");
  } catch {
    recent = "# Recent Changes\n\n";
  }
  await writeFileEnsured(
    recentPath,
    `${recent.trim()}\n\n## ${now}: Full init analysis\n\n- ${ALL_IVF_VERTICALS.length} verticals scanned\n- ${detectedFeatures.length} platform feature(s) detected\n- ${analysis.verticalGaps.length} gap(s) in matrix\n`,
  );
}

export function formatFullInitAnalysisSummary(
  result: FullInitAnalysisResult,
  verticalCount: number,
): string {
  const base = formatAnalysisSummary(result.analysis);
  const extra = [
    "",
    "Platform features detected",
    "========================",
    formatDetectedFeatures(result.detectedFeatures),
    "",
    `IVF verticals scanned: ${verticalCount}`,
    `Gap matrix: ${result.gapsPath.replace(/^.*\.DNA\//, ".DNA/")}`,
    `IVF plan:   ${result.planPath.replace(/^.*\.DNA\//, ".DNA/")}`,
  ];
  if (result.installedFeaturePacks.length) {
    extra.push("", `Knowledge packs installed: ${result.installedFeaturePacks.join(", ")}`);
  }
  return base + extra.join("\n");
}

/**
 * Full brownfield analysis on init — all IVF verticals, platform feature detection,
 * documentation from code, gap matrix, and IVF plan.
 */
export async function runFullInitAnalysis(
  root: string,
  options: { quote?: string; config?: DnaConfig } = {},
): Promise<FullInitAnalysisResult> {
  const planResult = await generateIvfPlan({
    root,
    quote: options.quote ?? "Full project analysis from dna init",
    verticals: ALL_IVF_VERTICALS,
    documentFromCode: true,
  });

  const detectedFeatures = detectPlatformFeaturesFromAnalysis(planResult.analysis);
  let config = options.config ?? (await loadDnaConfig(root));
  if (!config) {
    throw new Error("DNA config missing after init");
  }

  const mergedFeatures = [...new Set([...(config.platformFeatures ?? []), ...detectedFeatures])];
  if (mergedFeatures.length) {
    config = {
      ...config,
      platformFeatures: mergedFeatures,
      updatedAt: new Date().toISOString(),
    };
    await writeJsonFile(join(root, ".DNA", "config.dna.json"), config);
  }

  const installedFeaturePacks = await installDetectedFeaturePacks(root, config, detectedFeatures);
  await writeAnalysisMemory(root, config, planResult.analysis, detectedFeatures, planResult.planPath);

  const result: FullInitAnalysisResult = {
    analysis: planResult.analysis,
    planPath: planResult.planPath,
    gapsPath: planResult.gapsPath,
    detectedFeatures,
    installedFeaturePacks,
    summary: "",
  };
  result.summary = formatFullInitAnalysisSummary(result, ALL_IVF_VERTICALS.length);
  return result;
}
