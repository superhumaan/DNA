import { cp, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "..", "dna-core", "assets");
const dest = join(root, "assets");

await rm(dest, { recursive: true, force: true });
await cp(src, dest, { recursive: true });
console.log("Copied dna-core assets → dna-cli/assets");
