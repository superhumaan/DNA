import { describe, it, expect } from "vitest";
import { INDUSTRY_SECTORS } from "@superhumaan/dna-config";
import { INDUSTRY_PACKS, INDUSTRY_PACK_COUNT } from "../marketplace/bundled-catalog-industries.js";
import { INDUSTRY_CATALOG, parseIndustryInput, knowledgePackIdsForIndustry } from "../industry/catalog.js";
import { industryKnowledgePaths } from "../industry/pack-factory.js";
import { getBundledCatalog } from "../marketplace/bundled-catalog.js";

describe("industry packs", () => {
  it("exports overview plus 12 sector packs", () => {
    expect(INDUSTRY_PACK_COUNT).toBe(13);
    expect(INDUSTRY_PACKS).toHaveLength(13);
    expect(INDUSTRY_CATALOG).toHaveLength(12);
    expect(INDUSTRY_SECTORS).toHaveLength(12);
  });

  it("each sector pack has 8 standard knowledge files", () => {
    const sectorPacks = INDUSTRY_PACKS.filter((p) => p.id !== "industries/overview");
    expect(sectorPacks).toHaveLength(12);
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
  });

  it("rejects unknown industries", () => {
    expect(() => parseIndustryInput("crypto")).toThrow(/Unknown industry/);
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
