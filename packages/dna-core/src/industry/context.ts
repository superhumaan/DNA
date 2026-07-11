import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { fileExists } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import { ensureKnowledgeInstalled } from "../marketplace/ensure.js";
import {
  getIndustryMeta,
  knowledgePackIdsForIndustry,
  knowledgePathsForIndustry,
  resolveIndustryProfile,
} from "./catalog.js";

export async function generateIndustryContext(root: string): Promise<string> {
  const config = await loadDnaConfig(root);
  const profile = resolveIndustryProfile(config);

  if (!profile.active) {
    return [
      "# DNA Industry Context",
      "",
      "_No active industry set._",
      "",
      "Run `dna plan industry <sector>` to activate. Browse sectors:",
      "",
      "```",
      "dna marketplace search industry",
      "```",
      "",
      "Or list all: healthcare, fintech, ecommerce-retail, edtech, gov-public-sector,",
      "travel-hospitality, saas-b2b, logistics-supply-chain, media-entertainment,",
      "real-estate-proptech, energy-utilities, legal-tech",
    ].join("\n");
  }

  const meta = getIndustryMeta(profile.active);
  const packIds = knowledgePackIdsForIndustry(profile.active);
  await ensureKnowledgeInstalled(root, packIds, config?.channel ?? "stable");

  const sections: string[] = [
    "# DNA Industry Context",
    "",
    `_Domain knowledge for **${meta.name}**. Git remembers your code. DNA remembers your system._`,
    "",
    `**Active sector:** ${meta.name} (\`${profile.active}\`)`,
    profile.clientName ? `**Client:** ${profile.clientName}` : "",
    profile.secondary.length ? `**Secondary:** ${profile.secondary.join(", ")}` : "",
    "",
    "## AI instructions",
    "",
    "1. Apply industry practices and regulation before proposing architecture",
    "2. Use UI patterns unless client brand guide explicitly overrides",
    "3. Reference influencers and latest trends when recommending tech",
    "4. For agencies: client-readable language in external docs per agency-notes",
    "5. Install linked compliance packs when storing regulated data",
    "",
    "## Knowledge",
    "",
  ];

  const paths = [
    "industries/overview.dna.md",
    ...knowledgePathsForIndustry(profile.active),
  ];

  for (const kPath of paths) {
    const fullPath = join(root, ".DNA", "knowledge", kPath);
    if (await fileExists(fullPath)) {
      const content = await readFile(fullPath, "utf-8");
      sections.push(`### ${kPath}\n`, content, "\n");
    }
  }

  const summaryPath = join(root, ".DNA", "CellularMemory", "hippocampus", "industry-summary.md");
  if (await fileExists(summaryPath)) {
    sections.push("## CellularMemory\n", `### hippocampus/industry-summary.md\n`, await readFile(summaryPath, "utf-8"), "\n");
  }

  return sections.filter(Boolean).join("\n");
}

/** Append active industry knowledge to a context document when set. */
export async function appendIndustryKnowledgeToContext(
  root: string,
  sections: string[],
): Promise<void> {
  const config = await loadDnaConfig(root);
  const profile = resolveIndustryProfile(config);
  if (!profile.active) return;

  const paths = knowledgePathsForIndustry(profile.active);
  const hasAny = await Promise.all(
    paths.map((p) => fileExists(join(root, ".DNA", "knowledge", p))),
  );
  if (!hasAny.some(Boolean)) return;

  sections.push("## Active Industry\n", `Sector: **${profile.active}**${profile.clientName ? ` (${profile.clientName})` : ""}\n`);

  for (const kPath of ["industries/" + profile.active + "/practices.dna.md", "industries/" + profile.active + "/ui-patterns.dna.md", "industries/" + profile.active + "/regulation.dna.md"]) {
    const fullPath = join(root, ".DNA", "knowledge", kPath);
    if (await fileExists(fullPath)) {
      const content = await readFile(fullPath, "utf-8");
      sections.push(`### ${kPath}\n`, content, "\n");
    }
  }
}
