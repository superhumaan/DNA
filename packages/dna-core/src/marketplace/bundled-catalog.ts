import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { KnowledgePack, MarketplaceCatalog } from "@superhumaan/dna-config";
import { normalizePackId } from "./aliases.js";

const catalogCache = new Map<string, MarketplaceCatalog>();

function resolveCatalogAssetPath(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    join(here, "..", "assets", "marketplace-catalog.json"),
    join(here, "..", "..", "assets", "marketplace-catalog.json"),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(
    "Missing assets/marketplace-catalog.json. Run `pnpm --filter @superhumaan/dna-core build` first.",
  );
}

function loadBaseCatalog(): MarketplaceCatalog {
  const raw = readFileSync(resolveCatalogAssetPath(), "utf-8");
  return JSON.parse(raw) as MarketplaceCatalog;
}

export function getBundledCatalog(channel: "stable" | "beta" | "nightly" = "stable"): MarketplaceCatalog {
  const cached = catalogCache.get(channel);
  if (cached) return cached;

  const base = loadBaseCatalog();
  const filtered = base.packs.filter((p) => p.channel === channel || channel === "stable");
  const byId = new Map<string, KnowledgePack>();
  for (const packEntry of filtered) {
    byId.set(packEntry.id, packEntry);
  }
  const catalog: MarketplaceCatalog = {
    ...base,
    channel,
    source: "bundled",
    packs: [...byId.values()],
  };
  catalogCache.set(channel, catalog);
  return catalog;
}

export function getBundledPack(packId: string): KnowledgePack | undefined {
  const id = normalizePackId(packId);
  return getBundledCatalog().packs.find((p) => p.id === id);
}
