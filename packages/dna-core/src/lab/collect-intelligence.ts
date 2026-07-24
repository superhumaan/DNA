import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export interface LabIntelligenceFile {
  path: string;
  kind: "impression" | "memory";
  mtime: string | null;
  bytes: number | null;
}

export interface LabIntelligenceData {
  impressions: LabIntelligenceFile[];
  cellularMemory: LabIntelligenceFile[];
}

/** Cap file-tree walks so Lab intelligence stays cheap under concurrent viewers. */
export const LAB_INTELLIGENCE_FILE_CAP = 200;

function walkMarkdownFiles(
  absRoot: string,
  projectRoot: string,
  kind: LabIntelligenceFile["kind"],
  out: LabIntelligenceFile[],
  cap: number,
): void {
  if (out.length >= cap || !existsSync(absRoot)) return;

  let entries: string[] = [];
  try {
    entries = readdirSync(absRoot);
  } catch {
    return;
  }

  for (const name of entries) {
    if (out.length >= cap) return;
    if (name.startsWith(".")) continue;
    const abs = join(absRoot, name);
    let st;
    try {
      st = statSync(abs);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      walkMarkdownFiles(abs, projectRoot, kind, out, cap);
      continue;
    }
    if (!name.endsWith(".md") && !name.endsWith(".dna.md")) continue;
    out.push({
      path: relative(projectRoot, abs).split("\\").join("/"),
      kind,
      mtime: Number.isFinite(st.mtimeMs) ? new Date(st.mtimeMs).toISOString() : null,
      bytes: Number.isFinite(st.size) ? st.size : null,
    });
  }
}

/**
 * On-demand Lab intelligence inventory (not on the poll `/data` path).
 * Lists Impressions + CellularMemory markdown paths for Lab list pages.
 */
export function collectLabIntelligence(root: string): LabIntelligenceData {
  const impressions: LabIntelligenceFile[] = [];
  const cellularMemory: LabIntelligenceFile[] = [];
  walkMarkdownFiles(join(root, "DNA", "Impressions"), root, "impression", impressions, LAB_INTELLIGENCE_FILE_CAP);
  walkMarkdownFiles(
    join(root, ".DNA", "CellularMemory"),
    root,
    "memory",
    cellularMemory,
    LAB_INTELLIGENCE_FILE_CAP,
  );
  impressions.sort((a, b) => a.path.localeCompare(b.path));
  cellularMemory.sort((a, b) => a.path.localeCompare(b.path));
  return { impressions, cellularMemory };
}
