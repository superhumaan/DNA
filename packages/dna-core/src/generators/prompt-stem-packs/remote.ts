import { INTELLIGENCE_BASE_URL } from "@superhumaan/dna-config";
import { intelligenceWorkbenchCatalogJson } from "../ai-workbench.js";
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

export function getBundledIntelligenceCatalog(): IntelligenceWorkbenchCatalog {
  return JSON.parse(intelligenceWorkbenchCatalogJson()) as IntelligenceWorkbenchCatalog;
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
