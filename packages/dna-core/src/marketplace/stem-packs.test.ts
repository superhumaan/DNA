import { describe, it, expect } from "vitest";
import { BUNDLED_CATALOG_PACK_COUNT } from "./bundled-catalog-packs.js";
import { getBundledCatalog } from "./bundled-catalog.js";
import { STEM_PACKS, STEM_PACK_IDS } from "./bundled-stem-packs.js";
import { STACK_ARCHETYPES } from "../stack/catalog.js";

describe("stem packs", () => {
  it("exports 21 stem packs with stem tag", () => {
    expect(STEM_PACKS).toHaveLength(21);
    for (const pack of STEM_PACKS) {
      expect(pack.tags).toContain("stem");
      expect(pack.files.length).toBeGreaterThan(0);
    }
  });

  it("includes all stem packs in bundled catalog", () => {
    const catalog = getBundledCatalog();
    expect(catalog.packs.length).toBe(BUNDLED_CATALOG_PACK_COUNT);
    for (const id of STEM_PACK_IDS) {
      expect(catalog.packs.some((p) => p.id === id)).toBe(true);
    }
  });

  it("new stack archetypes reference stem pack ids", () => {
    const stemArchetypes = [
      "pwa-react-vite",
      "desktop-electron",
      "desktop-tauri",
      "browser-extension-chrome",
      "browser-extension-safari",
      "gpt-app",
      "mcp-server",
      "flutter-mobile",
      "ios-native",
      "android-native",
      "astro-static",
      "wordpress-headless",
    ];
    for (const id of stemArchetypes) {
      const arch = STACK_ARCHETYPES.find((a) => a.id === id);
      expect(arch, `missing archetype ${id}`).toBeDefined();
      expect(arch!.knowledgePacks.length).toBeGreaterThan(0);
      for (const packId of arch!.knowledgePacks) {
        expect(
          getBundledCatalog().packs.some((p) => p.id === packId),
          `${id} references missing pack ${packId}`,
        ).toBe(true);
      }
    }
  });
});
