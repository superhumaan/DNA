import {
  MARKETPLACE_API_VERSION,
  MARKETPLACE_BASE_URL,
  MarketplaceCatalogSchema,
  type MarketplaceCatalog,
  type KnowledgePack,
} from "@superhumaan/dna-config";
import { getBundledCatalog, getBundledPack } from "./bundled-catalog.js";

export interface MarketplaceClientOptions {
  baseUrl?: string;
  channel?: "stable" | "beta" | "nightly";
  timeoutMs?: number;
}

function catalogUrl(baseUrl: string, channel: string): string {
  const base = baseUrl.replace(/\/$/, "");
  return `${base}/api/${MARKETPLACE_API_VERSION}/catalog?channel=${channel}`;
}

function packUrl(baseUrl: string, packId: string): string {
  const base = baseUrl.replace(/\/$/, "");
  return `${base}/api/${MARKETPLACE_API_VERSION}/packs/${encodeURIComponent(packId)}`;
}

export async function fetchMarketplaceCatalog(
  options: MarketplaceClientOptions = {},
): Promise<MarketplaceCatalog> {
  const baseUrl = options.baseUrl ?? MARKETPLACE_BASE_URL;
  const channel = options.channel ?? "stable";
  const timeoutMs = options.timeoutMs ?? 10_000;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(catalogUrl(baseUrl, channel), {
      signal: controller.signal,
      headers: { Accept: "application/json", "User-Agent": "DNA-by-Humaan/0.1.0" },
    });

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`Marketplace returned ${response.status}`);
    }

    const data = (await response.json()) as Record<string, unknown>;
    const parsed = MarketplaceCatalogSchema.safeParse({ ...data, source: "remote" });
    if (!parsed.success) {
      throw new Error(`Invalid marketplace catalog: ${parsed.error.message}`);
    }

    return { ...parsed.data, marketplaceUrl: baseUrl, source: "remote" };
  } catch {
    const bundled = getBundledCatalog(channel);
    return { ...bundled, source: "bundled" };
  }
}

export async function fetchKnowledgePack(
  packId: string,
  options: MarketplaceClientOptions = {},
): Promise<KnowledgePack | null> {
  const catalog = await fetchMarketplaceCatalog(options);
  const fromCatalog = catalog.packs.find((p) => p.id === packId);
  if (fromCatalog) return fromCatalog;

  const baseUrl = options.baseUrl ?? MARKETPLACE_BASE_URL;

  try {
    const response = await fetch(packUrl(baseUrl, packId), {
      headers: { Accept: "application/json", "User-Agent": "DNA-by-Humaan/0.1.0" },
    });
    if (!response.ok) return getBundledPack(packId) ?? null;
    const data = (await response.json()) as KnowledgePack;

    const filesWithContent = await Promise.all(
      data.files.map(async (file) => {
        if (file.content || !file.url) return file;
        try {
          const fileRes = await fetch(file.url);
          if (!fileRes.ok) return file;
          return { ...file, content: await fileRes.text() };
        } catch {
          return file;
        }
      }),
    );

    return { ...data, files: filesWithContent };
  } catch {
    return getBundledPack(packId) ?? null;
  }
}

export function searchCatalog(
  catalog: MarketplaceCatalog,
  query?: string,
  category?: KnowledgePack["category"],
): KnowledgePack[] {
  let results = catalog.packs;
  if (category) {
    results = results.filter((p) => p.category === category);
  }
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  return results;
}
