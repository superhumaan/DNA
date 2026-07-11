import { INDUSTRY_SECTORS } from "@superhumaan/dna-config";
import type { DnaConfig } from "@superhumaan/dna-config";
import { INDUSTRY_SECTOR_DEFINITIONS } from "./sector-definitions.js";
import { industryKnowledgePaths } from "./pack-factory.js";

export type IndustrySector = (typeof INDUSTRY_SECTORS)[number];

export interface IndustryMeta {
  id: IndustrySector;
  name: string;
  description: string;
  packId: string;
  linkedPacks: string[];
  tags: string[];
}

export const INDUSTRY_CATALOG: IndustryMeta[] = INDUSTRY_SECTOR_DEFINITIONS.map((def) => ({
  id: def.id as IndustrySector,
  name: def.name,
  description: def.description,
  packId: `industries/${def.id}`,
  linkedPacks: def.linkedPacks,
  tags: def.tags ?? [],
}));

const ALIASES: Record<string, IndustrySector> = {
  health: "healthcare",
  medical: "healthcare",
  pharma: "healthcare",
  bank: "fintech",
  banking: "fintech",
  payments: "fintech",
  finance: "fintech",
  retail: "ecommerce-retail",
  ecommerce: "ecommerce-retail",
  "e-commerce": "ecommerce-retail",
  education: "edtech",
  lms: "edtech",
  gov: "gov-public-sector",
  government: "gov-public-sector",
  "public-sector": "gov-public-sector",
  travel: "travel-hospitality",
  hospitality: "travel-hospitality",
  hotels: "travel-hospitality",
  saas: "saas-b2b",
  b2b: "saas-b2b",
  logistics: "logistics-supply-chain",
  supplychain: "logistics-supply-chain",
  "supply-chain": "logistics-supply-chain",
  media: "media-entertainment",
  entertainment: "media-entertainment",
  streaming: "media-entertainment",
  proptech: "real-estate-proptech",
  "real-estate": "real-estate-proptech",
  property: "real-estate-proptech",
  energy: "energy-utilities",
  utilities: "energy-utilities",
  legal: "legal-tech",
  law: "legal-tech",
};

export function parseIndustryInput(input: string): IndustrySector {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, "-");
  const resolved = ALIASES[normalized] ?? (normalized as IndustrySector);
  if (!INDUSTRY_SECTORS.includes(resolved)) {
    throw new Error(
      `Unknown industry: ${input}. Valid: ${INDUSTRY_SECTORS.join(", ")}`,
    );
  }
  return resolved;
}

export function getIndustryMeta(id: IndustrySector): IndustryMeta {
  const found = INDUSTRY_CATALOG.find((entry) => entry.id === id);
  if (!found) {
    throw new Error(`Unknown industry sector: ${id}`);
  }
  return found;
}

export function resolveIndustryProfile(config: DnaConfig | null): {
  active?: IndustrySector;
  secondary: IndustrySector[];
  clientName?: string;
} {
  return {
    active: config?.industry?.active,
    secondary: config?.industry?.secondary ?? [],
    clientName: config?.industry?.clientName,
  };
}

export function knowledgePackIdsForIndustry(sectorId: IndustrySector): string[] {
  const meta = getIndustryMeta(sectorId);
  return [meta.packId, "industries/overview", ...meta.linkedPacks];
}

export function knowledgePathsForIndustry(sectorId: IndustrySector): string[] {
  return industryKnowledgePaths(sectorId);
}

export function formatIndustryCatalog(): string {
  const lines = [
    "DNA Industry Packs",
    "==================",
    "",
    "Activate: dna plan industry <id>",
    "Context:  dna context industry",
    "",
  ];
  for (const entry of INDUSTRY_CATALOG) {
    lines.push(`• ${entry.id.padEnd(24)} ${entry.name}`);
    lines.push(`  ${entry.description}`);
    lines.push("");
  }
  return lines.join("\n");
}
