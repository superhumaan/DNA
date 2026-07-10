import { join } from "node:path";
import { writeFileEnsured } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import { detectImpressionsDrift, formatImpressionsDriftReport } from "./drift.js";
import { scanProject } from "../scanner.js";

export interface ImpressionsSyncPlanOptions {
  root: string;
  openPr?: boolean;
}

export interface ImpressionsSyncPlanResult {
  planPath: string;
  driftReport: Awaited<ReturnType<typeof detectImpressionsDrift>>;
  context: string;
}

export async function generateImpressionsSyncPlan(
  options: ImpressionsSyncPlanOptions,
): Promise<ImpressionsSyncPlanResult> {
  const config = await loadDnaConfig(options.root);
  if (!config) {
    throw new Error("DNA not installed. Run `dna init` first.");
  }

  const scan = await scanProject(options.root);
  const driftReport = await detectImpressionsDrift(options.root, scan);

  const slug = config.projectName.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const planPath = join(options.root, ".DNA", "plans", `impressions-sync-${slug}.md`);

  const lines = [
    `# Impressions Sync Plan — ${config.projectName}`,
    "",
    `_Generated when drift score reached ${driftReport.score}/100 (${driftReport.level})_`,
    "",
    "## Drift summary",
    "",
    formatImpressionsDriftReport(driftReport),
    "",
    "## Recommended actions",
    "",
    "1. Run `dna document --from-code` to refresh Impressions from codebase",
    "2. Review `DNA/Impressions/architecture/overview.md` for stack accuracy",
    "3. Update `.DNA/CellularMemory/prefrontalCortex/decisions.md` with sync date",
    "4. Run `dna validate` to confirm Behaviour compliance",
    "",
    "## Missing Impressions",
    "",
    ...(scan.missingDocs.length
      ? scan.missingDocs.map((d) => `- [ ] \`DNA/Impressions/${d}\``)
      : ["_None — all required paths present._"]),
    "",
    "## Stack alignment",
    "",
    `- Config: frontend=${config.stack.frontend ?? "—"}, backend=${config.stack.backend ?? "—"}`,
    `- Detected: frontend=${scan.frontend ?? "—"}, backend=${scan.backend ?? "—"}`,
    "",
    options.openPr
      ? "## PR automation\n\nRun with GitHub configured:\n\n```bash\ndna scan --open-pr\n```\n"
      : "",
  ];

  const context = lines.join("\n");
  await writeFileEnsured(planPath, context);

  return { planPath, driftReport, context };
}
