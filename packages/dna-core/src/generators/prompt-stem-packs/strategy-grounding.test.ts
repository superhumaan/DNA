import { describe, expect, it } from "vitest";
import {
  STRATEGY_GROUNDING_GUIDELINES,
  STRATEGY_GROUNDING_MARKDOWN,
  mergeGuidelines,
} from "./strategy-grounding.js";
import { STRATEGY_STEM_DEFS } from "./catalog-strategy.js";
import { PRODUCT_INTEL_GROUND, PRODUCT_INTEL_STEM_DEFS } from "./catalog-product-intel.js";

describe("strategy grounding contract", () => {
  it("defines Impression Guard + STRATEGY_COMPLETE contract", () => {
    expect(STRATEGY_GROUNDING_MARKDOWN).toContain("Impression Guard");
    expect(STRATEGY_GROUNDING_MARKDOWN).toContain("STRATEGY_COMPLETE");
    expect(STRATEGY_GROUNDING_MARKDOWN).toContain("TRIGGER_FEATURE_FACTORY");
    expect(STRATEGY_GROUNDING_GUIDELINES.must.some((m) => m.includes("Impression Guard"))).toBe(
      true,
    );
  });

  it("wires grounding into strategy-ladder", () => {
    const ladder = STRATEGY_STEM_DEFS.find((s) => s.id === "strategy-ladder");
    expect(ladder?.prompt).toContain("STRATEGY_COMPLETE");
    expect(ladder?.prompt).toContain("Impression Guard");
    expect(ladder?.guidelines.must.some((m) => /Impression Guard|DNA CLI/i.test(m))).toBe(true);
  });

  it("merges product-intel ground with shared contract", () => {
    expect(PRODUCT_INTEL_GROUND.must.some((m) => m.includes("Impression Guard"))).toBe(true);
    expect(PRODUCT_INTEL_GROUND.never.some((m) => /stub/i.test(m))).toBe(true);
  });

  it("product-diagnose prompt includes grounding block", () => {
    const diagnose = PRODUCT_INTEL_STEM_DEFS.find((s) => s.id === "product-diagnose");
    expect(diagnose?.prompt).toContain("Impression Guard");
    expect(diagnose?.prompt).toContain("STRATEGY_COMPLETE");
  });

  it("mergeGuidelines dedupes", () => {
    const merged = mergeGuidelines(
      { must: ["a"], never: ["x"], should: ["s"] },
      { must: ["a", "b"], never: ["y"], should: ["s"] },
    );
    expect(merged.must).toEqual(["a", "b"]);
    expect(merged.never.sort()).toEqual(["x", "y"]);
  });
});
