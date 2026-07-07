import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { fileExists } from "../fs.js";
import { loadDnaConfig } from "../validator.js";

export async function generateIvfContext(root: string): Promise<string> {
  const config = await loadDnaConfig(root);
  if (!config) {
    throw new Error("DNA not installed. Run `dna init` first.");
  }

  const sections: string[] = [
    "# DNA IVF Context",
    "",
    "_Brownfield integration context. Git remembers your code. DNA remembers your system._",
    "",
    `Project: ${config.projectName} (${config.stage})`,
    "",
  ];

  const planDir = join(root, ".DNA", "plans");
  const ivfPlan = await findLatestIvfPlan(root, planDir);
  if (ivfPlan) {
    const content = await readFile(ivfPlan, "utf-8");
    sections.push("## IVF Plan\n", content, "\n");
  } else {
    sections.push("## IVF Plan\n", "_No IVF plan found. Run `dna plan ivf`._\n");
  }

  const memoryFiles = [
    "prefrontalCortex/ivf-gaps.md",
    "prefrontalCortex/current-plan.md",
    "parietalLobe/system-map.md",
    "hippocampus/project-summary.md",
    "amygdala/risks.md",
  ];

  sections.push("## CellularMemory\n");
  for (const mem of memoryFiles) {
    const path = join(root, ".DNA", "CellularMemory", mem);
    if (await fileExists(path)) {
      const content = await readFile(path, "utf-8");
      sections.push(`### ${mem}\n`, content, "\n");
    }
  }

  const archDocs = [
    "architecture/solution-architecture.md",
    "architecture/data-flow.md",
    "architecture/integration-map.md",
  ];

  sections.push("## Impressions (architecture)\n");
  for (const doc of archDocs) {
    const path = join(root, "DNA", "Impressions", doc);
    if (await fileExists(path)) {
      const content = await readFile(path, "utf-8");
      sections.push(`### ${doc}\n`, content, "\n");
    }
  }

  return sections.join("\n");
}

async function findLatestIvfPlan(_root: string, plansDir: string): Promise<string | null> {
  if (!(await fileExists(plansDir))) return null;

  const { readdir } = await import("node:fs/promises");
  const files = await readdir(plansDir);
  const ivfFiles = files.filter((f) => f.startsWith("ivf-") && f.endsWith(".md"));
  if (!ivfFiles.length) return null;

  ivfFiles.sort();
  return join(plansDir, ivfFiles[ivfFiles.length - 1]!);
}
