import { describe, expect, it } from "vitest";
import {
  PURPOSE_COMBOS,
  allPurposeComboMemberPackIds,
  getPurposeCombo,
  purposeCombosAsMarketplaceBundles,
  resolvePurposeComboPackIds,
} from "./purpose-combos.js";
import { getBundledPack } from "./bundled-catalog.js";
import { METHODOLOGY_PACKS } from "./bundled-catalog-methodologies.js";
import { listPromptStemPackIds } from "../generators/prompt-stem-packs/index.js";

describe("purpose combos", () => {
  it("lists approved purpose combos", () => {
    expect(PURPOSE_COMBOS.length).toBeGreaterThanOrEqual(12);
    expect(getPurposeCombo("combo/product-canvas-creation")?.purpose).toBe(
      "Product canvas creation",
    );
  });

  it("resolves required + preferred by default (not recommended)", () => {
    const ids = resolvePurposeComboPackIds("combo/nextjs-fullstack");
    expect(ids).not.toBeNull();
    expect(ids).toContain("frameworks/nextjs");
    expect(ids).toContain("auth/clerk");
    expect(ids).toContain("tools/tailwind-css");
    expect(ids).not.toContain("payments/stripe");
  });

  it("includes recommended when opted in", () => {
    const ids = resolvePurposeComboPackIds("combo/nextjs-fullstack", {
      includeRecommended: true,
    });
    expect(ids).toContain("payments/stripe");
  });

  it("can skip preferred", () => {
    const ids = resolvePurposeComboPackIds("combo/saas-billing", {
      includePreferred: false,
    });
    expect(ids).toContain("payments/stripe");
    expect(ids).not.toContain("payments/anrok");
  });

  it("returns null for non-combo pack ids", () => {
    expect(resolvePurposeComboPackIds("frameworks/nextjs")).toBeNull();
  });

  it("references real bundled or source methodology packs", () => {
    const sourceIds = new Set(METHODOLOGY_PACKS.map((p) => p.id));
    const missing: string[] = [];
    for (const id of allPurposeComboMemberPackIds()) {
      if (id.startsWith("combo/")) continue;
      if (!getBundledPack(id) && !sourceIds.has(id)) missing.push(id);
    }
    expect(missing).toEqual([]);
  });

  it("maps each combo to known prompt stem ids", () => {
    const known = new Set(listPromptStemPackIds());
    const missing: string[] = [];
    for (const combo of PURPOSE_COMBOS) {
      expect(combo.stems.length).toBeGreaterThan(0);
      for (const stem of combo.stems) {
        if (!known.has(stem)) missing.push(`${combo.id} → ${stem}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("exposes marketplace bundle views with install commands", () => {
    const bundles = purposeCombosAsMarketplaceBundles();
    expect(bundles.length).toBe(PURPOSE_COMBOS.length);
    expect(bundles[0]?.installCommand).toMatch(/^dna marketplace install combo\//);
    expect(bundles[0]?.stems.length).toBeGreaterThan(0);
  });
});
