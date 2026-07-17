import { describe, it, expect } from "vitest";
import { PROMPT_STEM_DEFS, getPromptStemPacks, intelligenceStemPackEntries } from "./index.js";
import { finalizeStemPack } from "./builder.js";

describe("prompt stem packs", () => {
  it("defines a large stem library", () => {
    expect(PROMPT_STEM_DEFS.length).toBeGreaterThanOrEqual(77);
  });

  it("has unique stem ids", () => {
    const ids = PROMPT_STEM_DEFS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes strategy ladder stems", () => {
    for (const id of [
      "strategy-ladder",
      "golden-circle",
      "business-strategy-canvas",
      "product-canvas",
      "north-star-metric",
      "define-okrs",
      "define-kpis",
      "goal-cascade",
      "define-initiative",
      "define-product",
      "shape-feature",
      "roadmap-now-next-later",
    ]) {
      expect(PROMPT_STEM_DEFS.find((d) => d.id === id)?.category).toBe("strategy");
    }
  });

  it("each stem has required files", () => {
    for (const def of PROMPT_STEM_DEFS) {
      const pack = finalizeStemPack(def);
      const paths = pack.files.map((f) => f.path);
      expect(paths).toContain("prompt.md");
      expect(paths).toContain("guidelines.md");
      expect(paths).toContain("expectations.md");
      expect(paths).toContain("context.md");
      expect(paths).toContain("examples.md");
      expect(pack.copyVariants.length).toBeGreaterThan(0);
    }
  });

  it("exports intelligence catalog entries", () => {
    const entries = intelligenceStemPackEntries();
    expect(entries.length).toBe(getPromptStemPacks().length);
    expect(entries.find((e) => e.id === "what-next-after-analyze")).toBeDefined();
    expect(entries.find((e) => e.id === "analyze-project")?.copyVariants.length).toBeGreaterThan(0);
    expect(entries.find((e) => e.id === "golden-circle")).toBeDefined();
    expect(entries.find((e) => e.id === "roadmap-now-next-later")?.slash).toBe("roadmap-now-next-later");
    expect(entries.find((e) => e.id === "define-okrs")?.slash).toBe("define-okrs");
    expect(entries.find((e) => e.id === "define-kpis")?.slash).toBe("define-kpis");
  });
});
