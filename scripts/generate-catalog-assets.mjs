#!/usr/bin/env node
/**
 * Serialize marketplace + intelligence catalogs to JSON assets.
 * Run after @superhumaan/dna-core build (catalog-build entries).
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CORE = join(ROOT, "packages", "dna-core");
const ASSETS = join(CORE, "assets");

async function main() {
  const { buildBundledCatalog } = await import(
    join(CORE, "dist", "catalog-build", "bundled-catalog-build.js")
  );
  const { buildIntelligenceWorkbenchCatalog } = await import(
    join(CORE, "dist", "catalog-build", "intelligence-catalog-build.js")
  );

  await mkdir(ASSETS, { recursive: true });

  const marketplacePath = join(ASSETS, "marketplace-catalog.json");
  const intelligencePath = join(ASSETS, "intelligence-catalog.json");

  const marketplace = buildBundledCatalog("stable");
  const intelligence = buildIntelligenceWorkbenchCatalog();

  await writeFile(marketplacePath, `${JSON.stringify(marketplace)}\n`, "utf-8");
  await writeFile(intelligencePath, `${JSON.stringify(intelligence)}\n`, "utf-8");

  console.log(`✓ marketplace-catalog.json (${marketplace.packs.length} packs)`);
  console.log(`✓ intelligence-catalog.json (${intelligence.stemPacks?.length ?? 0} stems)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
