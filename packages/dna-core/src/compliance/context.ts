import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { fileExists } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import { ensureKnowledgeForPaths } from "../marketplace/ensure.js";
import { formatComplianceCatalog } from "./plan.js";
import { type ComplianceFramework } from "./catalog.js";
import { frameworkKnowledgeFiles, inferOrgTierFromStage } from "./tiers.js";
import type { OrgTier } from "./catalog.js";
import { installGdprExamples } from "./install-gdpr-examples.js";

export async function generateComplianceContext(
  root: string,
  options?: { tier?: OrgTier; frameworks?: ComplianceFramework[] },
): Promise<string> {
  const config = await loadDnaConfig(root);
  if (!config) {
    throw new Error("DNA not installed. Run `dna init` first.");
  }

  const tier = options?.tier ?? inferOrgTierFromStage(config.stage);
  const frameworks =
    options?.frameworks ??
    (config.compliance !== "none" && config.compliance !== "custom" && config.compliance !== "pdpa_thailand"
      ? [config.compliance as ComplianceFramework]
      : (["gdpr", "iso27001"] as ComplianceFramework[]));

  const knowledgePaths = new Set<string>([
    `compliance/tiers/${tier}.dna.md`,
    "compliance/tiers/overview.dna.md",
    "compliance/matrices/control-by-tier.dna.md",
  ]);
  for (const f of frameworks) {
    frameworkKnowledgeFiles(f).forEach((k) => knowledgePaths.add(k));
  }

  await ensureKnowledgeForPaths(root, [...knowledgePaths], config.channel);

  const hasGdpr = frameworks.some((f) => f === "gdpr" || f === "uk_gdpr");
  if (hasGdpr) {
    await installGdprExamples(root);
  }

  const sections: string[] = [
    "# DNA Compliance Context",
    "",
    `_Tier: ${tier} | Frameworks: ${frameworks.join(", ")}_`,
    "",
    formatComplianceCatalog(),
    "",
    "## Knowledge",
    "",
  ];

  for (const kPath of [...knowledgePaths].sort()) {
    const fullPath = join(root, ".DNA", "knowledge", kPath);
    if (await fileExists(fullPath)) {
      const content = await readFile(fullPath, "utf-8");
      sections.push(`### ${kPath}`, "", content, "");
    }
  }

  const matrixPath = join(
    root,
    ".DNA",
    "CellularMemory",
    "prefrontalCortex",
    "compliance-control-matrix.md",
  );
  if (await fileExists(matrixPath)) {
    const matrix = await readFile(matrixPath, "utf-8");
    sections.push("## Current control matrix", "", matrix, "");
  }

  const examplesIndex = join(root, ".DNA", "knowledge", "compliance/gdpr/examples/INDEX.md");
  if (await fileExists(examplesIndex)) {
    const index = await readFile(examplesIndex, "utf-8");
    sections.push("## GDPR reference examples (production pack)", "", index, "");
  }

  sections.push(
    "## Commands",
    "",
    "dna plan compliance --frameworks gdpr,iso27001 --tier sme --quote \"...\"",
    "dna compliance list",
    "dna context compliance",
    "",
  );

  return sections.join("\n");
}
