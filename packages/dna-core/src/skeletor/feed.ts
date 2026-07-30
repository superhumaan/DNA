import { join } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { ensureDir, writeFileEnsured } from "../fs.js";
import { pullSkeletorData } from "./pull.js";
import { formatSkeletorContextSection } from "./format.js";

export const SKELETOR_FLEET_MEMORY_REL =
  "CellularMemory/parietalLobe/skeletor-fleet.md";

/**
 * Pull Skeletor data (when installed) and write CellularMemory for AI agents.
 * Returns the relative path written, or null when skipped.
 */
export async function feedSkeletorToAi(
  root: string,
  config?: Pick<DnaConfig, "skeletor"> | null,
): Promise<string | null> {
  const pull = await pullSkeletorData({ config });
  const section = formatSkeletorContextSection(pull);
  if (!section) return null;

  const rel = SKELETOR_FLEET_MEMORY_REL;
  const abs = join(root, ".DNA", rel);
  await ensureDir(join(root, ".DNA", "CellularMemory", "parietalLobe"));
  const body = [
    "# Skeletor fleet (AI feed)",
    "",
    `_Auto-synced by DNA when Skeletor is installed. Updated ${new Date().toISOString()}._`,
    "",
    section.replace(/^## Skeletor fleet\n\n/, ""),
    "",
  ].join("\n");
  await writeFileEnsured(abs, body);
  return `.DNA/${rel}`;
}
