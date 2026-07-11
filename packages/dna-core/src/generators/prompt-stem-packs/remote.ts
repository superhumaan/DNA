import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { INTELLIGENCE_BASE_URL } from "@superhumaan/dna-config";
import type { IntelligenceStemPackEntry } from "./types.js";

export interface IntelligenceWorkbenchCatalog {
  version: number;
  type: string;
  catalogUrl: string;
  stemPacks: IntelligenceStemPackEntry[];
  counts?: { stemPacks?: number };
}

export interface FetchIntelligenceCatalogOptions {
  url?: string;
  timeoutMs?: number;
}

function resolveIntelligenceCatalogPath(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    join(here, "..", "assets", "intelligence-catalog.json"),
    join(here, "..", "..", "assets", "intelligence-catalog.json"),
    join(here, "..", "..", "..", "assets", "intelligence-catalog.json"),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(
    "Missing assets/intelligence-catalog.json. Run `pnpm --filter @superhumaan/dna-core build` first.",
  );
}

export function getBundledIntelligenceCatalog(): IntelligenceWorkbenchCatalog {
  const raw = readFileSync(resolveIntelligenceCatalogPath(), "utf-8");
  return JSON.parse(raw) as IntelligenceWorkbenchCatalog;
}

export async function fetchIntelligenceCatalog(
  options: FetchIntelligenceCatalogOptions = {},
): Promise<IntelligenceWorkbenchCatalog | null> {
  const url = options.url ?? `${INTELLIGENCE_BASE_URL.replace(/\/$/, "")}/api/v1/catalog`;
  const timeoutMs = options.timeoutMs ?? 15_000;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "DNA-by-Humaan/0.4.0",
      },
    });

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`Intelligence catalog returned ${response.status}`);
    }

    const data = (await response.json()) as IntelligenceWorkbenchCatalog;
    if (!Array.isArray(data.stemPacks) || data.stemPacks.length === 0) {
      throw new Error("Intelligence catalog missing stemPacks");
    }

    return data;
  } catch {
    return null;
  }
}
