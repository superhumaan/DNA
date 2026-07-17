#!/usr/bin/env node
/**
 * Sync intelligence command catalog → DNA-Web static data.
 *
 * Usage:
 *   node scripts/sync-intelligence-commands.mjs
 *   DNA_WEB_ROOT="../DNA-Web" node scripts/sync-intelligence-commands.mjs
 */
import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DNA_WEB_ROOT = process.env.DNA_WEB_ROOT ?? join(ROOT, "..", "DNA-Web");
const OUT = join(DNA_WEB_ROOT, "apps", "web", "src", "data", "intelligence-workbench.json");

async function main() {
  const coreDist = join(ROOT, "packages", "dna-core", "dist", "index.js");
  const { intelligenceWorkbenchCatalogJson } = await import(coreDist);
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, intelligenceWorkbenchCatalogJson(), "utf-8");
  console.log(`✓ Intelligence catalog → ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
