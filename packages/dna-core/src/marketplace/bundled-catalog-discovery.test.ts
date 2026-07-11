import { describe, it, expect } from "vitest";
import { DISCOVERY_PACKS, DISCOVERY_PACK_COUNT } from "./bundled-catalog-discovery.js";
import { DISCOVERY_FOUNDATION_PACK_IDS } from "@superhumaan/dna-config";

describe("discovery marketplace packs", () => {
  it("exports expected pack count", () => {
    expect(DISCOVERY_PACK_COUNT).toBe(55);
    expect(DISCOVERY_PACKS.length).toBe(55);
  });

  it("includes all foundation packs", () => {
    const ids = new Set(DISCOVERY_PACKS.map((p) => p.id));
    for (const foundationId of DISCOVERY_FOUNDATION_PACK_IDS) {
      expect(ids.has(foundationId)).toBe(true);
    }
  });

  it("uses discovery category for all packs", () => {
    for (const pack of DISCOVERY_PACKS) {
      expect(pack.category).toBe("discovery");
    }
  });
});
