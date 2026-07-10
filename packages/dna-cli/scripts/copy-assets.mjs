import { cp, rm, copyFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "..", "dna-core", "assets");
const dest = join(root, "assets");
const sponsorsRoot = join(root, "..", "..", "sponsors.json");

await rm(dest, { recursive: true, force: true });
await cp(src, dest, { recursive: true });
try {
  await copyFile(sponsorsRoot, join(dest, "sponsors.json"));
  console.log("Copied sponsors.json → dna-cli/assets");
} catch {
  console.warn("No sponsors.json at repo root — run pnpm sponsors:sync");
}
console.log("Copied dna-core assets → dna-cli/assets");
