import { join } from "node:path";
import { BEHAVIOUR_FILES, DNA_CONFIG_FILE, DNA_RUNTIME_DB } from "@superhumaan/dna-config";
import { fileExists } from "./fs.js";
import { loadDnaConfig, validateProject } from "./validator.js";
import { scanProject } from "./scanner.js";

export interface DoctorReport {
  dna: { installed: boolean; version?: string };
  documentation: { impressionsCount: number; missing: number };
  behaviour: { files: number; missing: string[] };
  immuneSystem: { configured: boolean };
  cellularMemory: { configured: boolean };
  github: { enabled: boolean; configured: boolean };
  ai: { enabled: boolean; provider?: string };
  runtime: { enabled: boolean; configured: boolean };
  preview: { enabled: boolean; workflowInstalled: boolean; provider: string };
  validation: { valid: boolean; issueCount: number };
}

export async function runDoctor(root: string): Promise<DoctorReport> {
  const config = await loadDnaConfig(root);
  const validation = await validateProject(root);
  const scan = await scanProject(root);

  const behaviourMissing: string[] = [];
  for (const file of BEHAVIOUR_FILES) {
    if (!(await fileExists(join(root, ".DNA", "behaviour", file)))) {
      behaviourMissing.push(file);
    }
  }

  const immuneConfigured = await fileExists(join(root, ".DNA", "immuneSystem", "rules.json"));
  const memoryConfigured = await fileExists(
    join(root, ".DNA", "CellularMemory", "hippocampus", "project-summary.md"),
  );
  const runtimeDb = await fileExists(join(root, DNA_RUNTIME_DB));
  const runtimeJsonl = await fileExists(join(root, ".DNA", "runtime", "events.jsonl"));
  const runtimeConfigured = runtimeDb || runtimeJsonl;
  const previewWorkflow = await fileExists(join(root, ".github", "workflows", "dna-preview.yml"));

  return {
    dna: {
      installed: await fileExists(join(root, DNA_CONFIG_FILE)),
      version: config?.version,
    },
    documentation: {
      impressionsCount: scan.docs.filter((d) => d.startsWith("DNA/")).length,
      missing: scan.missingDocs.length,
    },
    behaviour: {
      files: BEHAVIOUR_FILES.length - behaviourMissing.length,
      missing: behaviourMissing,
    },
    immuneSystem: { configured: immuneConfigured },
    cellularMemory: { configured: memoryConfigured },
    github: {
      enabled: config?.github?.enabled ?? false,
      configured: !!(config?.github?.owner && config?.github?.repo),
    },
    ai: {
      enabled: config?.ai?.enabled ?? false,
      provider: config?.ai?.provider,
    },
    runtime: {
      enabled: config?.runtime?.enabled ?? false,
      configured: runtimeConfigured,
    },
    preview: {
      enabled: config?.ci?.pushToPreview ?? false,
      workflowInstalled: previewWorkflow,
      provider: config?.ci?.previewProvider ?? "vercel",
    },
    validation: {
      valid: validation.valid,
      issueCount: validation.errors.length,
    },
  };
}

export function formatDoctorReport(report: DoctorReport): string {
  const status = (ok: boolean) => (ok ? "✓" : "✗");
  const lines = [
    "DNA Doctor",
    "==========",
    "",
    `${status(report.dna.installed)} DNA installed${report.dna.version ? ` (v${report.dna.version})` : ""}`,
    `${status(report.documentation.missing === 0)} Documentation (${report.documentation.missing} missing Impressions)`,
    `${status(report.behaviour.missing.length === 0)} Behaviour (${report.behaviour.files}/${BEHAVIOUR_FILES.length} files)`,
    `${status(report.immuneSystem.configured)} Immune System`,
    `${status(report.cellularMemory.configured)} CellularMemory`,
    `${status(report.github.configured || !report.github.enabled)} GitHub integration${report.github.enabled ? "" : " (disabled)"}`,
    `${status(!report.ai.enabled || !!report.ai.provider)} AI integration${report.ai.enabled ? ` (${report.ai.provider})` : " (disabled)"}`,
    `${status(report.runtime.configured || !report.runtime.enabled)} Runtime database${report.runtime.enabled ? "" : " (disabled)"}`,
    `${status(!report.preview.enabled || report.preview.workflowInstalled)} Preview deploy${report.preview.enabled ? ` (${report.preview.provider})` : " (disabled)"}`,
    "",
    `${status(report.validation.valid)} Validation (${report.validation.issueCount} issues)`,
  ];
  return lines.join("\n");
}
