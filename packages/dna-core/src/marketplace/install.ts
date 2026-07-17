import { join } from "node:path";
import type { DnaConfig, KnowledgePack, MarketplaceUpdateResult } from "@superhumaan/dna-config";
import { writeFileEnsured, readJsonFile, writeJsonFile } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import { fetchMarketplaceCatalog, fetchKnowledgePack } from "./client.js";
import { getBundledCatalog, getBundledPack } from "./bundled-catalog.js";
import { normalizePackId } from "./aliases.js";
import { resolveHealthcareCountryBundlePackIds } from "./healthcare-country-bundles.js";

export interface InstallKnowledgePackResult {
  pack: KnowledgePack;
  files: string[];
  /** Additional packs installed as part of a country healthcare bundle. */
  bundleInstalled?: Array<{ pack: KnowledgePack; files: string[] }>;
}

export async function installKnowledgePack(
  root: string,
  pack: KnowledgePack,
): Promise<string[]> {
  const installed: string[] = [];

  for (const file of pack.files) {
    if (!file.content) continue;
    const targetPath = join(root, ".DNA", "knowledge", file.path);
    await writeFileEnsured(targetPath, file.content);
    installed.push(`.DNA/knowledge/${file.path}`);
  }

  const config = (await loadDnaConfig(root)) ?? null;
  if (config) {
    const packRef = `${pack.id}@${pack.version}`;
    if (!config.knowledgePacks.includes(packRef)) {
      config.knowledgePacks.push(packRef);
    }
    config.updatedAt = new Date().toISOString();
    await writeJsonFile(join(root, ".DNA/config.dna.json"), config);
  }

  const registryPath = join(root, ".DNA", "marketplace", "installed.json");
  const registry =
    (await readJsonFile<Record<string, { version: string; installedAt: string }>>(registryPath)) ??
    {};
  registry[pack.id] = { version: pack.version, installedAt: new Date().toISOString() };
  await writeJsonFile(registryPath, registry);

  return installed;
}

export async function installKnowledgePackById(
  root: string,
  packId: string,
  channel?: DnaConfig["channel"],
): Promise<InstallKnowledgePackResult> {
  const resolvedId = normalizePackId(packId);
  const bundleIds = resolveHealthcareCountryBundlePackIds(resolvedId);
  const targetIds = bundleIds ?? [resolvedId];

  let primary: InstallKnowledgePackResult | null = null;
  const bundleInstalled: Array<{ pack: KnowledgePack; files: string[] }> = [];

  for (const id of targetIds) {
    const pack = getBundledPack(id) ?? (await fetchKnowledgePack(id, { channel }));
    if (!pack) {
      throw new Error(`Knowledge pack not found: ${id}`);
    }
    const files = await installKnowledgePack(root, pack);
    const entry = { pack, files };
    if (id === resolvedId) {
      primary = { ...entry, bundleInstalled: undefined };
    } else {
      bundleInstalled.push(entry);
    }
  }

  if (!primary) {
    throw new Error(`Knowledge pack not found: ${packId}`);
  }

  if (bundleInstalled.length) {
    primary.bundleInstalled = bundleInstalled;
  }

  return primary;
}

export async function checkMarketplaceUpdates(
  root: string,
  channel: DnaConfig["channel"] = "stable",
): Promise<MarketplaceUpdateResult> {
  const config = await loadDnaConfig(root);
  const catalog = await fetchMarketplaceCatalog({ channel });
  const registry =
    (await readJsonFile<Record<string, { version: string }>>(
      join(root, ".DNA", "marketplace", "installed.json"),
    )) ?? {};

  const installedIds = Object.keys(registry);
  const updatesAvailable: MarketplaceUpdateResult["updatesAvailable"] = [];
  const newPacks: string[] = [];

  for (const pack of catalog.packs) {
    const installed = registry[pack.id];
    if (!installed) {
      newPacks.push(`${pack.id}@${pack.version}`);
    } else if (installed.version !== pack.version) {
      updatesAvailable.push({
        id: pack.id,
        installedVersion: installed.version,
        latestVersion: pack.version,
      });
    }
  }

  return {
    cliVersion: config?.version ?? "0.1.0",
    channel,
    catalogSource: catalog.source ?? "bundled",
    installed: installedIds.map((id) => `${id}@${registry[id]?.version ?? "?"}`),
    updatesAvailable,
    newPacks,
    applied: false,
    refreshed: [],
    foundationInstalled: [],
    failed: [],
  };
}

export function formatMarketplaceCatalog(catalog: Awaited<ReturnType<typeof fetchMarketplaceCatalog>>): string {
  const lines = [
    "DNA Knowledge Pack Marketplace",
    "==============================",
    "",
    `Source:   ${catalog.source ?? "unknown"}`,
    `Channel:  ${catalog.channel}`,
    `URL:      ${catalog.marketplaceUrl ?? "https://dna.humaan.app/marketplace"}`,
    `Updated:  ${catalog.updatedAt}`,
    `Packs:    ${catalog.packs.length}`,
    "",
  ];

  for (const pack of catalog.packs) {
    lines.push(`• ${pack.id}@${pack.version} — ${pack.name}`);
    lines.push(`  ${pack.description}`);
    lines.push(`  Category: ${pack.category} | Files: ${pack.files.length}`);
    lines.push("");
  }

  return lines.join("\n");
}

export function formatUpdateResult(result: MarketplaceUpdateResult): string {
  const lines = [
    result.applied ? "DNA Marketplace Update" : "DNA Marketplace Update Check",
    "============================",
    "",
    `CLI version:    ${result.cliVersion}`,
    `Channel:        ${result.channel}`,
    `Catalog source: ${result.catalogSource}`,
    "",
  ];

  if (result.installed.length) {
    lines.push(`Installed packs (${result.installed.length}):`);
    result.installed.forEach((p) => lines.push(`  • ${p}`));
    lines.push("");
  }

  if (result.applied) {
    const refreshed = result.refreshed ?? [];
    const foundation = result.foundationInstalled ?? [];
    if (refreshed.length) {
      lines.push(`✓ Refreshed ${refreshed.length} installed pack(s) from catalog`);
    } else if (result.installed.length === 0) {
      lines.push("No marketplace packs installed yet.");
    } else {
      lines.push("✓ Installed packs re-applied from catalog");
    }
    if (foundation.length) {
      lines.push(`✓ Foundation packs ensured (${foundation.length}): ${foundation.slice(0, 8).join(", ")}${foundation.length > 8 ? "…" : ""}`);
    }
    const failed = result.failed ?? [];
    if (failed.length) {
      lines.push(`✗ Failed to refresh ${failed.length} pack(s):`);
      failed.slice(0, 10).forEach((f) => lines.push(`  • ${f.packId}: ${f.error}`));
    }
    lines.push("");
  } else {
    if (result.updatesAvailable.length) {
      lines.push("Version bumps available:");
      result.updatesAvailable.forEach((u) =>
        lines.push(`  • ${u.id}: ${u.installedVersion} → ${u.latestVersion}`),
      );
      lines.push("");
    }

    if (result.newPacks.length) {
      lines.push(`New packs in catalog: ${result.newPacks.length} (not auto-installed)`);
      lines.push("");
    }

    if (result.installed.length) {
      lines.push("Run `dna update` (without --check-only) to re-apply all installed pack content.");
    } else {
      lines.push("No packs installed — run `dna marketplace install <pack-id>` or `dna doctor`.");
    }
  }

  lines.push("", "Browse: https://dna.humaan.app/marketplace");
  lines.push("Install more: dna marketplace install <pack-id>");

  return lines.join("\n");
}

export { getBundledCatalog };
