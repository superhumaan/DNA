import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { fileExists } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import { ensureKnowledgeForPaths } from "../marketplace/ensure.js";
import { formatPlatformCatalog } from "./feature-plan.js";
import { PLATFORM_FEATURES } from "./catalog.js";

export async function generatePlatformContext(
  root: string,
  featureId?: string,
): Promise<string> {
  const config = await loadDnaConfig(root);
  if (!config) {
    throw new Error("DNA not installed. Run `dna init` first.");
  }

  const sections: string[] = [
    "# DNA Platform Context",
    "",
    "_Humaan production patterns from AIStudio, ColorParty, Humaan Ops, and Soli._",
    "",
    formatPlatformCatalog(),
    "",
  ];

  const knowledgePaths = new Set<string>();
  if (featureId) {
    const feature = PLATFORM_FEATURES.find((f) => f.id === featureId);
    if (feature) {
      sections.push(`## Focus feature: ${feature.name}`, "", feature.description, "");
      feature.knowledgeFiles.forEach((k) => knowledgePaths.add(k));
    }
  } else {
    for (const f of PLATFORM_FEATURES) {
      f.knowledgeFiles.forEach((k) => knowledgePaths.add(k));
    }
  }

  await ensureKnowledgeForPaths(root, [...knowledgePaths], config.channel);

  sections.push("## Knowledge (Humaan stack)", "");
  for (const kPath of [...knowledgePaths].sort()) {
    const fullPath = join(root, ".DNA", "knowledge", kPath);
    if (await fileExists(fullPath)) {
      const content = await readFile(fullPath, "utf-8");
      sections.push(`### ${kPath}`, "", content, "");
    }
  }

  sections.push(
    "## How to use",
    "",
    "1. `dna platform list` — browse features",
    "2. `dna plan feature <id> --quote \"...\"` — generate implementation plan",
    "3. `dna plan rbac` — if the feature needs access control",
    "4. `dna context platform` — reload this context",
    "",
  );

  return sections.join("\n");
}
