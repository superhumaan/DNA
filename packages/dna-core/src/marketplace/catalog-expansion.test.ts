import { describe, it, expect } from "vitest";
import { getBundledCatalog, BUNDLED_CATALOG_PACK_COUNT } from "./bundled-catalog.js";
import {
  CATALOG_EXPANSION_PACKS,
  CATALOG_EXPANSION_PACK_IDS,
  CATALOG_EXPANSION_COUNTS,
} from "./bundled-catalog-expansion.js";
import { CATALOG_WAVE_COUNTS } from "./catalog-waves.js";
import { STEM_PACKS } from "./bundled-stem-packs.js";
import { LANGUAGE_STEM_PACKS } from "./bundled-language-stem-packs.js";
import { STACK_ARCHETYPES } from "../stack/catalog.js";

const CORE_PACK_COUNT = 11;

describe("catalog expansion", () => {
  it("exports expected expansion pack counts", () => {
    expect(CATALOG_EXPANSION_COUNTS.languages).toBe(14);
    expect(CATALOG_EXPANSION_COUNTS.cms).toBe(12);
    expect(CATALOG_EXPANSION_COUNTS.browsers).toBe(6);
    expect(CATALOG_EXPANSION_COUNTS.frameworks).toBe(17);
    expect(CATALOG_EXPANSION_COUNTS.disciplines).toBe(15);
    expect(CATALOG_EXPANSION_COUNTS.payments).toBe(12);
    expect(CATALOG_EXPANSION_COUNTS.data).toBe(3);
    expect(CATALOG_WAVE_COUNTS.healthcare).toBe(45);
    expect(CATALOG_WAVE_COUNTS.wave3.healthcareExtended).toBe(10);
    expect(CATALOG_WAVE_COUNTS.wave3.total).toBeGreaterThan(150);
    expect(CATALOG_WAVE_COUNTS.wave4.total).toBeGreaterThan(120);
    expect(CATALOG_WAVE_COUNTS.wave5).toBeGreaterThan(20);
    const v1Total =
      CATALOG_EXPANSION_COUNTS.languages +
      CATALOG_EXPANSION_COUNTS.cms +
      CATALOG_EXPANSION_COUNTS.browsers +
      CATALOG_EXPANSION_COUNTS.frameworks +
      CATALOG_EXPANSION_COUNTS.disciplines +
      CATALOG_EXPANSION_COUNTS.payments +
      CATALOG_EXPANSION_COUNTS.data;
    expect(v1Total).toBe(79);
    expect(CATALOG_EXPANSION_PACKS).toHaveLength(v1Total + CATALOG_WAVE_COUNTS.total);
  });

  it("tags expansion packs as catalog", () => {
    for (const pack of CATALOG_EXPANSION_PACKS) {
      expect(pack.tags).toContain("catalog");
      expect(pack.files.length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate pack ids in expansion catalog", () => {
    const ids = CATALOG_EXPANSION_PACKS.map((p) => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("includes all expansion packs in bundled catalog", () => {
    const catalog = getBundledCatalog();
    const ids = catalog.packs.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    const expected = BUNDLED_CATALOG_PACK_COUNT;
    expect(catalog.packs.length).toBe(expected);
    for (const id of CATALOG_EXPANSION_PACK_IDS) {
      expect(catalog.packs.some((p) => p.id === id)).toBe(true);
    }
  });

  it("wordpress CMS pack recommends modern alternatives", () => {
    const wp = getBundledCatalog().packs.find((p) => p.id === "cms/wordpress");
    expect(wp?.files.some((f) => f.content.includes("cms/sanity"))).toBe(true);
  });

  it("CMS and framework archetypes reference catalog packs", () => {
    const ids = [
      "sanity-headless",
      "strapi-headless",
      "payload-cms",
      "remix-fullstack",
      "nuxt-fullstack",
      "fastapi-api",
    ];
    const catalog = getBundledCatalog();
    for (const id of ids) {
      const arch = STACK_ARCHETYPES.find((a) => a.id === id);
      expect(arch, id).toBeDefined();
      for (const packId of arch!.knowledgePacks) {
        expect(catalog.packs.some((p) => p.id === packId), `${id} → ${packId}`).toBe(true);
      }
    }
  });

  it("data HQ pack explains why and how", () => {
    const hq = getBundledCatalog().packs.find((p) => p.id === "data/data-hq");
    expect(hq?.files.some((f) => f.content.includes("Why it matters"))).toBe(true);
    expect(hq?.files.some((f) => f.content.includes("How to establish"))).toBe(true);
  });

  it("disaster recovery pack covers active-active and passive topologies", () => {
    const dr = getBundledCatalog().packs.find((p) => p.id === "data/disaster-recovery");
    const text = dr?.files.map((f) => f.content).join("\n") ?? "";
    expect(text).toContain("Active–Active");
    expect(text).toContain("Active–Passive");
    expect(text).toContain("Passive–Passive");
  });

  it("payment packs include Stripe and PCI overview", () => {
    const catalog = getBundledCatalog();
    expect(catalog.packs.some((p) => p.id === "payments/stripe")).toBe(true);
    expect(catalog.packs.some((p) => p.id === "payments/overview")).toBe(true);
  });

  it("healthcare wave covers FHIR, EHRs, and integration platforms", () => {
    const catalog = getBundledCatalog();
    const ids = [
      "healthcare/fhir-r4",
      "healthcare/redox",
      "healthcare/epic",
      "healthcare/health-gorilla",
      "healthcare/medplum",
      "healthcare/phi-engineering",
      "healthcare/patient-portal",
      "healthcare/mdr-eu",
      "erp/sap",
    ];
    for (const id of ids) {
      expect(catalog.packs.some((p) => p.id === id), id).toBe(true);
    }
    const redox = catalog.packs.find((p) => p.id === "healthcare/redox");
    expect(redox?.tags).toContain("healthcare");
    expect(redox?.files.some((f) => f.content.includes("Redox"))).toBe(true);
  });

  it("healthcare-fhir archetype references bundled healthcare packs", () => {
    const arch = STACK_ARCHETYPES.find((a) => a.id === "healthcare-fhir");
    expect(arch).toBeDefined();
    const catalog = getBundledCatalog();
    for (const packId of arch!.knowledgePacks) {
      expect(catalog.packs.some((p) => p.id === packId), packId).toBe(true);
    }
  });

  it("factory wave packs include architecture and checklist files", () => {
    const sample = getBundledCatalog().packs.find((p) => p.id === "databases/postgresql");
    expect(sample?.files.some((f) => f.path.endsWith("/architecture.dna.md"))).toBe(true);
    expect(sample?.files.some((f) => f.path.endsWith("/checklist.dna.md"))).toBe(true);
    expect(sample?.files.length).toBeGreaterThanOrEqual(4);
  });

  it("catalog packs include maturity tags", () => {
    const catalog = getBundledCatalog();
    const withMaturity = catalog.packs.filter((p) =>
      p.tags.some((t) => t === "legacy" || t === "mainstream" || t === "emerging"),
    );
    expect(withMaturity.length).toBeGreaterThan(700);
    expect(catalog.packs.find((p) => p.id === "cms/wordpress")?.tags).toContain("legacy");
    expect(catalog.packs.find((p) => p.id === "databases/convex")?.tags).toContain("emerging");
  });

  it("new vertical archetypes reference bundled packs", () => {
    const catalog = getBundledCatalog();
    for (const id of [
      "gaming-unity",
      "erp-sap-integration",
      "fintech-plaid",
      "ecommerce-shopify",
      "ai-llm-saas",
      "cloud-aws-saas",
    ] as const) {
      const arch = STACK_ARCHETYPES.find((a) => a.id === id);
      expect(arch, id).toBeDefined();
      for (const packId of arch!.knowledgePacks) {
        expect(catalog.packs.some((p) => p.id === packId), `${id} → ${packId}`).toBe(true);
      }
    }
  });
});
