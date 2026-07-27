import { describe, it, expect } from "vitest";
import { INDUSTRY_SECTORS } from "@superhumaan/dna-config";
import { INDUSTRY_PACKS, INDUSTRY_PACK_COUNT } from "../marketplace/bundled-catalog-industries.js";
import { INDUSTRY_CATALOG, parseIndustryInput, knowledgePackIdsForIndustry } from "../industry/catalog.js";
import { industryKnowledgePaths } from "../industry/pack-factory.js";
import { getBundledCatalog } from "../marketplace/bundled-catalog.js";
import { INDUSTRY_SECTOR_DEFINITIONS } from "./sector-definitions.js";

const SECTOR_COUNT = INDUSTRY_SECTOR_DEFINITIONS.length;

describe("industry packs", () => {
  it("exports overview plus all sector packs", () => {
    expect(SECTOR_COUNT).toBe(INDUSTRY_SECTORS.length);
    expect(INDUSTRY_PACK_COUNT).toBe(SECTOR_COUNT + 1);
    expect(INDUSTRY_PACKS).toHaveLength(SECTOR_COUNT + 1);
    expect(INDUSTRY_CATALOG).toHaveLength(SECTOR_COUNT);
    expect(INDUSTRY_SECTORS).toHaveLength(SECTOR_COUNT);
  });

  it("each sector pack has 8 standard knowledge files", () => {
    const sectorPacks = INDUSTRY_PACKS.filter((p) => p.id !== "industries/overview");
    expect(sectorPacks).toHaveLength(SECTOR_COUNT);
    for (const pack of sectorPacks) {
      expect(pack.category).toBe("industries");
      expect(pack.files).toHaveLength(8);
      expect(pack.tags).toContain("industry");
    }
  });

  it("parses industry aliases", () => {
    expect(parseIndustryInput("health")).toBe("healthcare");
    expect(parseIndustryInput("fintech")).toBe("fintech");
    expect(parseIndustryInput("e-commerce")).toBe("ecommerce-retail");
    expect(parseIndustryInput("gov")).toBe("gov-public-sector");
    expect(parseIndustryInput("crypto")).toBe("crypto-web3");
    expect(parseIndustryInput("devtools")).toBe("developer-tools");
  });

  it("rejects unknown industries", () => {
    expect(() => parseIndustryInput("not-a-real-vertical-xyz")).toThrow(/Unknown industry/);
  });

  it("knowledge paths cover all standard files", () => {
    const paths = industryKnowledgePaths("healthcare");
    expect(paths).toContain("industries/healthcare/overview.dna.md");
    expect(paths).toContain("industries/healthcare/ui-patterns.dna.md");
    expect(paths).toHaveLength(8);
  });

  it("links compliance and tool packs per sector", () => {
    const fintech = knowledgePackIdsForIndustry("fintech");
    expect(fintech).toContain("industries/fintech");
    expect(fintech).toContain("industries/overview");
    expect(fintech.some((id) => id.includes("payments") || id.includes("pci"))).toBe(true);
  });

  it("includes industry packs in bundled catalog", () => {
    const catalog = getBundledCatalog();
    for (const pack of INDUSTRY_PACKS) {
      expect(catalog.packs.some((p) => p.id === pack.id)).toBe(true);
    }
  });
});
