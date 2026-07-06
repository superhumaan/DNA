import { describe, it, expect } from "vitest";
import { fetchMarketplaceCatalog, searchCatalog } from "./client.js";
import { getBundledCatalog } from "./bundled-catalog.js";

describe("marketplace client", () => {
  it("falls back to bundled catalog when remote is unavailable", async () => {
    const catalog = await fetchMarketplaceCatalog({
      baseUrl: "http://127.0.0.1:1",
      timeoutMs: 100,
    });
    expect(catalog.source).toBe("bundled");
    expect(catalog.packs.length).toBeGreaterThan(0);
  });

  it("searches catalog by query and category", () => {
    const catalog = getBundledCatalog();
    const vite = searchCatalog(catalog, "vite");
    expect(vite.some((p) => p.id === "frameworks/vite")).toBe(true);

    const compliance = searchCatalog(catalog, undefined, "compliance");
    expect(compliance.every((p) => p.category === "compliance")).toBe(true);
  });
});
