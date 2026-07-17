/**
 * Sync DNA marketplace catalog assets into DNA-Web.
 *
 * Usage:
 *   node scripts/sync-marketplace-catalog.mjs
 *   DNA_WEB_ROOT="../DNA-Web" node scripts/sync-marketplace-catalog.mjs
 */
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DNA_WEB_ROOT = process.env.DNA_WEB_ROOT ?? join(ROOT, "..", "DNA-Web");
const SOURCE = join(ROOT, "packages", "dna-core", "assets", "marketplace-catalog.json");

const TARGETS = [
  join(DNA_WEB_ROOT, "packages", "dna-core", "assets", "marketplace-catalog.json"),
  join(DNA_WEB_ROOT, "packages", "dna-cli", "assets", "marketplace-catalog.json"),
];

async function main() {
  const catalog = JSON.parse(readFileSync(SOURCE, "utf8"));
  for (const target of TARGETS) {
    await mkdir(dirname(target), { recursive: true });
    await copyFile(SOURCE, target);
    console.log(`✓ ${target} (${catalog.packs.length} packs)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
