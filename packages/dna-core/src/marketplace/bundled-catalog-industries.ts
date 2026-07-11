import type { KnowledgePack } from "@superhumaan/dna-config";
import { buildIndustryOverviewPack, buildIndustrySectorPack } from "../industry/pack-factory.js";
import { INDUSTRY_SECTOR_DEFINITIONS } from "../industry/sector-definitions.js";

export const INDUSTRY_PACKS: KnowledgePack[] = [
  buildIndustryOverviewPack(INDUSTRY_SECTOR_DEFINITIONS),
  ...INDUSTRY_SECTOR_DEFINITIONS.map(buildIndustrySectorPack),
];

export const INDUSTRY_PACK_COUNT = INDUSTRY_PACKS.length;
