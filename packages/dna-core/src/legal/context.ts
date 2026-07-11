import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { fileExists } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import { ensureKnowledgeForPaths, ensureKnowledgeInstalled } from "../marketplace/ensure.js";
import { formatLegalCatalog } from "./catalog.js";
import type { LegalDomain, LegalJurisdiction } from "./catalog.js";
import {
  domainKnowledgePaths,
  jurisdictionKnowledgePaths,
  jurisdictionPackIds,
  inferDomainsFromText,
  inferJurisdictionsFromText,
} from "./regions.js";
import { adviseLegal } from "./advisor.js";

export async function generateLegalContext(
  root: string,
  options?: { domains?: LegalDomain[]; jurisdictions?: LegalJurisdiction[]; quote?: string },
): Promise<string> {
  const config = await loadDnaConfig(root);
  if (!config) {
    throw new Error("DNA not installed. Run `dna init` first.");
  }

  const combined = [options?.quote ?? "", config.description ?? ""].join(" ");
  const domains = options?.domains?.length ? options.domains : inferDomainsFromText(combined);
  const jurisdictions = options?.jurisdictions?.length
    ? options.jurisdictions
    : inferJurisdictionsFromText(combined);

  const knowledgePaths = new Set<string>([
    ...domainKnowledgePaths(domains),
    ...jurisdictionKnowledgePaths(jurisdictions),
  ]);

  await ensureKnowledgeForPaths(root, [...knowledgePaths], config.channel);
  const packIds = jurisdictionPackIds(jurisdictions);
  if (packIds.length) {
    await ensureKnowledgeInstalled(root, packIds, config.channel);
  }

  const advisor = adviseLegal({
    quote: options?.quote ?? "Load legal context for engineering decisions",
    projectDescription: config.description,
    domains,
    jurisdictions,
  });

  const sections: string[] = [
    "# DNA Legal Context",
    "",
    `_Domains: ${domains.join(", ")} | Jurisdictions: ${jurisdictions.join(", ") || "none detected"}_`,
    "",
    formatLegalCatalog(),
    "",
    advisor.brief,
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
    "legal-considerations-matrix.md",
  );
  if (await fileExists(matrixPath)) {
    const matrix = await readFile(matrixPath, "utf-8");
    sections.push("## Current legal matrix", "", matrix, "");
  }

  sections.push(
    "## Commands",
    "",
    "dna legal advise --quote \"Should we store health records in Singapore?\"",
    "dna plan legal --domains healthcare,privacy --jurisdictions sg",
    "dna context legal",
    "dna legal list",
    "",
  );

  return sections.join("\n");
}
