import { describe, expect, it } from "vitest";
import { PACKS } from "./bundled-catalog-packs.js";
import {
  LONGTAIL_MIN_CHARS,
  meetsRichnessBar,
  packCharCount,
  liftPackToRichness,
  RICHNESS_MIN_FILES,
} from "./pack-richness.js";
import { pack } from "./bundled-catalog-helpers.js";

describe("long-tail richness floor", () => {
  it("lifts a synthetic stub pack to the richness bar", () => {
    const stub = pack("tools/example-stub", "Example Stub", "disciplines", "Tiny stub", [
      { path: "tools/example-stub/positioning.dna.md", content: "# Example\n\nStub.\n" },
    ]);
    expect(meetsRichnessBar(stub)).toBe(false);
    const lifted = liftPackToRichness(stub);
    expect(lifted.files.length).toBeGreaterThanOrEqual(RICHNESS_MIN_FILES);
    expect(packCharCount(lifted)).toBeGreaterThanOrEqual(LONGTAIL_MIN_CHARS);
    expect(lifted.tags).toContain("longtail-lifted");
  });

  it("finalized PACKS have zero stubs (every pack meets richness floor)", () => {
    const failures: string[] = [];
    for (const p of PACKS) {
      if (!meetsRichnessBar(p, LONGTAIL_MIN_CHARS)) {
        failures.push(`${p.id} files=${p.files.length} chars=${packCharCount(p)}`);
      }
    }
    expect(failures.slice(0, 20)).toEqual([]);
    expect(failures.length).toBe(0);
  });

  it("built catalog asset matches richness floor after rebuild", () => {
    // Uses in-memory PACKS path via getBundledPack only after assets rebuilt;
    // assert source PACKS already lifted (above). Spot-check a historically thin id.
    const soc2 = PACKS.find((p) => p.id === "compliance/soc2");
    expect(soc2 && meetsRichnessBar(soc2)).toBe(true);
    const randomCloud = PACKS.find((p) => p.id.startsWith("cloud/") && p.tags.includes("catalog-wave"));
    if (randomCloud) {
      expect(meetsRichnessBar(randomCloud)).toBe(true);
    }
  });
});
