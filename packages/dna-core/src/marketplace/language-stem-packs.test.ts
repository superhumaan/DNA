import { describe, it, expect } from "vitest";
import { BUNDLED_CATALOG_PACK_COUNT } from "./bundled-catalog-packs.js";
import { getBundledCatalog } from "./bundled-catalog.js";
import {
  LANGUAGE_STEM_PACKS,
  LANGUAGE_STEM_PACK_IDS,
  LANGUAGE_STEM_BRIDGE_PACK,
} from "./bundled-language-stem-packs.js";
import { resolveFoundationPackIds } from "./foundation.js";
import { resolvePackIdsForIntents, resetKnowledgePathIndex } from "./resolve.js";
import { generateNeuralNetwork } from "../generators/neural-network.js";
import type { DnaConfig } from "@superhumaan/dna-config";

describe("language stem packs", () => {
  it("exports bridge + 17 locale packs with stem tag", () => {
    expect(LANGUAGE_STEM_PACKS).toHaveLength(18);
    for (const pack of LANGUAGE_STEM_PACKS) {
      expect(pack.tags).toContain("stem");
      expect(pack.category).toBe("languages");
      expect(pack.files.length).toBeGreaterThan(0);
    }
  });

  it("bridge pack has inbound, outbound, sentiment, and documentation files", () => {
    const paths = LANGUAGE_STEM_BRIDGE_PACK.files.map((f) => f.path);
    expect(paths).toContain("languages/stem-bridge/inbound.dna.md");
    expect(paths).toContain("languages/stem-bridge/outbound.dna.md");
    expect(paths).toContain("languages/stem-bridge/sentiment.dna.md");
    expect(paths).toContain("languages/stem-bridge/documentation.dna.md");
  });

  it("includes all language stem packs in bundled catalog", () => {
    const catalog = getBundledCatalog();
    expect(catalog.packs.length).toBe(BUNDLED_CATALOG_PACK_COUNT);
    for (const id of LANGUAGE_STEM_PACK_IDS) {
      expect(catalog.packs.some((p) => p.id === id)).toBe(true);
    }
  });

  it("resolves multilingual intents to stem-bridge pack", () => {
    resetKnowledgePathIndex();
    const neural = generateNeuralNetwork({} as DnaConfig);
    const packs = resolvePackIdsForIntents(
      ["communicate_in_user_language", "translate_documentation"],
      neural,
    );
    expect(packs).toContain("languages/stem-bridge");
  });

  it("auto-installs stem-bridge for multilingual project descriptions", () => {
    const config = {
      description: "Multilingual B2B SaaS with i18n",
      stack: { frontend: "next", backend: "fastify" },
      autoUpdate: true,
      channel: "stable",
    } as DnaConfig;

    const packs = resolveFoundationPackIds(config);
    expect(packs).toContain("languages/stem-bridge");
  });

  it("auto-installs healthcare packs for FHIR/HIPAA project descriptions", () => {
    const config = {
      description: "HIPAA patient portal with FHIR R4 and Epic integration",
      stack: { frontend: "next", backend: "fastify" },
      autoUpdate: true,
      channel: "stable",
    } as DnaConfig;

    const packs = resolveFoundationPackIds(config);
    expect(packs).toContain("healthcare/overview");
    expect(packs).toContain("healthcare/overview-us");
    expect(packs).toContain("healthcare/us-support");
    expect(packs).toContain("healthcare/fhir-r4");
    expect(packs).toContain("healthcare/redox");
  });

  it("auto-installs UK healthcare overview for NHS descriptions", () => {
    const config = {
      description: "NHS GP Connect integration with UK Core FHIR",
      stack: { frontend: "next", backend: "fastify" },
      autoUpdate: true,
      channel: "stable",
    } as DnaConfig;

    const packs = resolveFoundationPackIds(config);
    expect(packs).toContain("healthcare/overview-uk");
    expect(packs).toContain("healthcare/uk-support");
    expect(packs).toContain("healthcare/nhs-fhir");
  });

  it("auto-installs Australia healthcare bundle with APAC regional packs", () => {
    const config = {
      description: "Australian My Health Record FHIR integration",
      stack: { frontend: "next", backend: "fastify" },
      autoUpdate: true,
      channel: "stable",
    } as DnaConfig;

    const packs = resolveFoundationPackIds(config);
    expect(packs).toContain("healthcare/overview-au");
    expect(packs).toContain("healthcare/au-support");
    expect(packs).toContain("healthcare/overview-apac");
    expect(packs).toContain("healthcare/apac-support");
  });
});
