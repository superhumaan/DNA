import { describe, it, expect } from "vitest";
import { getBundledIntelligenceCatalog } from "./remote.js";

describe("getBundledIntelligenceCatalog", () => {
  it("loads intelligence-catalog.json from package assets (dist/../assets layout)", () => {
    const catalog = getBundledIntelligenceCatalog();
    expect(catalog.type).toBe("workbench");
    expect(catalog.stemPacks.length).toBeGreaterThanOrEqual(40);
    expect(catalog.stemPacks.find((s) => s.id === "analyze-project")).toBeDefined();
  });
});
