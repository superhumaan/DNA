import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalogBuild = join(ROOT, "packages", "dna-core", "dist", "catalog-build", "bundled-catalog-build.js");
const catalogAsset = join(ROOT, "packages", "dna-core", "assets", "marketplace-catalog.json");

export default async function globalSetup() {
  if (existsSync(catalogAsset)) return;

  if (!existsSync(catalogBuild)) {
    const build = spawnSync("pnpm", ["--filter", "@superhumaan/dna-core", "build"], {
      cwd: ROOT,
      stdio: "inherit",
    });
    if (build.status !== 0) {
      throw new Error("Failed to build @superhumaan/dna-core for tests");
    }
    return;
  }

  const gen = spawnSync("node", [join(ROOT, "scripts/generate-catalog-assets.mjs")], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (gen.status !== 0) {
    throw new Error("Failed to generate catalog assets for tests");
  }
}
