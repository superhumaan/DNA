import type { KnowledgePack, MarketplaceCatalog } from "@superhumaan/dna-config";
import { PACKS } from "./bundled-catalog-packs.js";

export { PACKS, BUNDLED_CATALOG_PACK_COUNT } from "./bundled-catalog-packs.js";

/** Build-time catalog serializer (used by scripts/generate-catalog-assets.mjs). */
export function buildBundledCatalog(
  channel: "stable" | "beta" | "nightly" = "stable",
): MarketplaceCatalog {
  const filtered = PACKS.filter((p) => p.channel === channel || channel === "stable");
  const byId = new Map<string, KnowledgePack>();
  for (const packEntry of filtered) {
    byId.set(packEntry.id, packEntry);
  }
  return {
    version: "1.0.0",
    channel,
    updatedAt: new Date().toISOString(),
    source: "bundled",
    marketplaceUrl: "https://dna.humaan.app/marketplace",
    packs: [...byId.values()],
  };
}
