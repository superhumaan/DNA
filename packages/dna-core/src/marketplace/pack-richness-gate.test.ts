import { describe, expect, it } from "vitest";
import { getBundledPack } from "./bundled-catalog.js";
import { P0_RICH_PACK_IDS, P0_RICH_PACKS } from "./bundled-catalog-p0-rich.js";
import { P0_WAVE2_PACK_IDS } from "./bundled-catalog-p0-wave2.js";
import { AGILE_FAMILY_PACKS } from "./bundled-catalog-agile-family.js";
import {
  meetsP0DepthBar,
  meetsRichnessBar,
  packCharCount,
  P0_MIN_CHARS,
  RICHNESS_MIN_FILES,
} from "./pack-richness.js";

/** P0 + agile family must never regress to stubs (knowledge-pack zero-stubs plan). */
describe("pack richness CI gate", () => {
  it("defines Wave 1+2 P0 set", () => {
    expect(P0_RICH_PACKS.map((p) => p.id).sort()).toEqual([...P0_RICH_PACK_IDS].sort());
    expect(P0_WAVE2_PACK_IDS.length).toBeGreaterThanOrEqual(15);
  });

  it("jams each P0 pack to ≥12k chars with assets", () => {
    for (const p of P0_RICH_PACKS) {
      expect(p.files.length, p.id).toBeGreaterThanOrEqual(RICHNESS_MIN_FILES);
      expect(packCharCount(p), p.id).toBeGreaterThanOrEqual(P0_MIN_CHARS);
      expect(meetsP0DepthBar(p), p.id).toBe(true);
      expect(p.tags).toContain("p0");
      expect(
        p.files.some((f) => f.path.endsWith("ops-playbook.dna.md")),
        `${p.id} ops-playbook`,
      ).toBe(true);
    }
  });

  it("catalog last-write-wins serves rich P0 packs", () => {
    for (const id of P0_RICH_PACK_IDS) {
      const bundled = getBundledPack(id);
      expect(bundled, id).toBeTruthy();
      expect(meetsP0DepthBar(bundled!), id).toBe(true);
    }
  });

  it("keeps agile family on the standard richness bar", () => {
    for (const p of AGILE_FAMILY_PACKS) {
      expect(meetsRichnessBar(p, 2500), p.id).toBe(true);
    }
  });
});
