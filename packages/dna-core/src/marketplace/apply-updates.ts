import { join } from "node:path";
import type { DnaConfig, MarketplaceUpdateResult } from "@superhumaan/dna-config";
import { readJsonFile } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import { scanProject } from "../scanner.js";
import { checkMarketplaceUpdates, installKnowledgePackById } from "./install.js";
import { installFoundationKnowledge } from "./foundation.js";

export interface ApplyMarketplaceUpdatesOptions {
  channel?: DnaConfig["channel"];
  /** When true, only report — do not re-install packs. */
  checkOnly?: boolean;
  /** Also ensure stack foundation packs (default: true). */
  foundation?: boolean;
}

/**
 * Refresh every installed knowledge pack from the latest catalog (bundled or remote).
 * Pack versions are often `1.0.0` across regenerations — content must be re-applied,
 * not only compared by version string.
 */
export async function applyMarketplaceUpdates(
  root: string,
  options: ApplyMarketplaceUpdatesOptions = {},
): Promise<MarketplaceUpdateResult> {
  const channel = options.channel ?? "stable";
  const check = await checkMarketplaceUpdates(root, channel);

  if (options.checkOnly) {
    return check;
  }

  const config = await loadDnaConfig(root);
  const registry =
    (await readJsonFile<Record<string, { version: string }>>(
      join(root, ".DNA", "marketplace", "installed.json"),
    )) ?? {};

  const installedIds = Object.keys(registry);
  const refreshed: string[] = [];
  const failed: Array<{ packId: string; error: string }> = [];

  for (const packId of installedIds) {
    try {
      await installKnowledgePackById(root, packId, channel);
      refreshed.push(packId);
    } catch (error) {
      failed.push({
        packId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  let foundationInstalled: string[] = [];
  if (options.foundation !== false && config) {
    const scan = await scanProject(root);
    const foundation = await installFoundationKnowledge(root, config, scan);
    foundationInstalled = [...foundation.installed, ...foundation.refreshed];
    failed.push(...foundation.failed);
  }

  const after = await checkMarketplaceUpdates(root, channel);
  return {
    ...after,
    applied: true,
    refreshed: [...new Set(refreshed)],
    foundationInstalled: [...new Set(foundationInstalled)],
    failed,
  };
}
