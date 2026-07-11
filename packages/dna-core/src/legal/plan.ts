import { join } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { writeFileEnsured } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import { ensureKnowledgeForPaths, ensureKnowledgeInstalled } from "../marketplace/ensure.js";
import { adviseLegal } from "./advisor.js";
import {
  formatLegalCatalog,
  parseDomainsInput,
  parseJurisdictionsInput,
  type LegalDomain,
  type LegalJurisdiction,
} from "./catalog.js";
import {
  domainKnowledgePaths,
  jurisdictionKnowledgePaths,
  jurisdictionPackIds,
  inferDomainsFromText,
  inferJurisdictionsFromText,
} from "./regions.js";
import { inferOrgTierFromStage } from "../compliance/tiers.js";
import type { OrgTier } from "../compliance/catalog.js";

export interface LegalPlanOptions {
  root: string;
  domains?: LegalDomain[];
  jurisdictions?: LegalJurisdiction[];
  tier?: OrgTier;
  quote?: string;
}

export interface LegalPlanResult {
  planPath: string;
  matrixPath: string;
  context: string;
  tier: OrgTier;
  domains: LegalDomain[];
  jurisdictions: LegalJurisdiction[];
}

function resolveDomains(options: LegalPlanOptions, config: DnaConfig | null): LegalDomain[] {
  if (options.domains?.length) return options.domains;
  const combined = [options.quote ?? "", config?.description ?? ""].join(" ");
  return inferDomainsFromText(combined);
}

function resolveJurisdictions(options: LegalPlanOptions, config: DnaConfig | null): LegalJurisdiction[] {
  if (options.jurisdictions?.length) return options.jurisdictions;
  const combined = [options.quote ?? "", config?.description ?? ""].join(" ");
  return inferJurisdictionsFromText(combined);
}

function buildLegalMatrixMarkdown(
  tier: OrgTier,
  domains: LegalDomain[],
  jurisdictions: LegalJurisdiction[],
): string {
  const lines = [
    `# Legal Considerations Matrix — ${tier}`,
    "",
    "_Track legal gates alongside engineering. Status: ☐ pending · ◐ in review · ✓ counsel approved._",
    "",
    "## Jurisdictions",
    "",
    "| Jurisdiction | Applicable laws | Counsel review | Engineering controls | Status |",
    "| --- | --- | --- | --- | --- |",
  ];

  for (const j of jurisdictions) {
    lines.push(`| ${j.toUpperCase()} | See regional pack | ☐ | ☐ | ☐ |`);
  }
  if (!jurisdictions.length) {
    lines.push("| _TBD_ | Specify target markets | ☐ | ☐ | ☐ |");
  }

  lines.push("", "## Domains", "", "| Domain | Policy/docs | Technical controls | Status |", "| --- | --- | --- | --- |");

  for (const d of domains) {
    lines.push(`| ${d} | ☐ | ☐ | ☐ |`);
  }

  lines.push(
    "",
    "## Pre-ship legal gate",
    "",
    "- [ ] Privacy policy matches data flows",
    "- [ ] Terms of service reviewed",
    "- [ ] Vendor DPAs/BAAs executed",
    "- [ ] Regional packs installed for all launch markets",
    "- [ ] Qualified counsel sign-off recorded",
    "",
  );

  return lines.join("\n");
}

export async function generateLegalPlan(options: LegalPlanOptions): Promise<LegalPlanResult> {
  const config = await loadDnaConfig(options.root);
  const tier = options.tier ?? (config?.stage ? inferOrgTierFromStage(config.stage) : "startup");
  const domains = resolveDomains(options, config);
  const jurisdictions = resolveJurisdictions(options, config);

  const knowledgePaths = new Set<string>([
    ...domainKnowledgePaths(domains),
    ...jurisdictionKnowledgePaths(jurisdictions),
  ]);

  await ensureKnowledgeForPaths(options.root, [...knowledgePaths], config?.channel ?? "stable");

  const packIds = jurisdictionPackIds(jurisdictions);
  if (packIds.length) {
    await ensureKnowledgeInstalled(options.root, packIds, config?.channel ?? "stable");
  }

  const advisor = adviseLegal({
    quote: options.quote ?? "Plan legal considerations for this product",
    projectDescription: config?.description,
    domains,
    jurisdictions,
  });

  const slugDomains = domains.join("-") || "privacy";
  const slugJurisdictions = jurisdictions.join("-") || "global";
  const planPath = join(
    options.root,
    ".DNA",
    "plans",
    `legal-${slugDomains}-${slugJurisdictions}-${tier}.md`,
  );
  const matrixPath = join(
    options.root,
    ".DNA",
    "CellularMemory",
    "prefrontalCortex",
    "legal-considerations-matrix.md",
  );

  const planContent = [
    `# Legal Plan — ${tier} tier`,
    "",
    `_Domains: ${domains.join(", ")} | Jurisdictions: ${jurisdictions.join(", ") || "global TBD"}_`,
    "",
    formatLegalCatalog(),
    "",
    advisor.brief,
    "",
    "## AI implementation brief",
    "",
    "When building features for this project:",
    "1. Load legal knowledge packs before designing data flows",
    "2. Run `dna legal advise --quote \"<feature>\"` for each significant change",
    "3. Block merge if legal matrix rows are unchecked for in-scope domains",
    "4. Pair engineering controls with compliance plan (`dna plan compliance`)",
    "",
  ].join("\n");

  const matrix = buildLegalMatrixMarkdown(tier, domains, jurisdictions);

  await writeFileEnsured(planPath, planContent);
  await writeFileEnsured(matrixPath, matrix);

  return {
    planPath,
    matrixPath,
    context: planContent,
    tier,
    domains,
    jurisdictions,
  };
}

export { parseDomainsInput, parseJurisdictionsInput, formatLegalCatalog };
