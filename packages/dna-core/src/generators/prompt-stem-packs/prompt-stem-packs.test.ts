import { describe, it, expect } from "vitest";
import { PROMPT_STEM_DEFS, getPromptStemPacks, intelligenceStemPackEntries } from "./index.js";
import { finalizeStemPack } from "./builder.js";

describe("prompt stem packs", () => {
  it("defines a large stem library", () => {
    expect(PROMPT_STEM_DEFS.length).toBeGreaterThanOrEqual(30);
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
  });
});
