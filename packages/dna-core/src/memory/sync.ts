import { glob } from "../glob.js";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileExists, ensureDir } from "../fs.js";

const DEFAULT_SEGMENTS = [
  "hippocampus",
  "prefrontalCortex",
  "amygdala",
  "cerebellum",
  "temporalLobe",
  "occipitalLobe",
] as const;

export type CellularMemorySegment = (typeof DEFAULT_SEGMENTS)[number];

export type MemoryConflictStrategy = "keep-local" | "keep-remote" | "newest";

export interface MemoryExportManifest {
  version: 1;
  exportedAt: string;
  projectRoot: string;
  segments: string[];
  files: Record<string, string>;
}

export interface ExportCellularMemoryOptions {
  root: string;
  segments?: string[];
  outPath: string;
}

export interface ExportCellularMemoryResult {
  outPath: string;
  fileCount: number;
  segments: string[];
}

export interface ImportCellularMemoryOptions {
  root: string;
  inPath: string;
  merge?: boolean;
  segments?: string[];
  onConflict?: MemoryConflictStrategy;
}

export interface ImportCellularMemoryResult {
  imported: number;
  skipped: number;
  merged: number;
  segments: string[];
}

function memoryRoot(root: string): string {
  return join(root, ".DNA", "CellularMemory");
}

export async function exportCellularMemory(
  options: ExportCellularMemoryOptions,
): Promise<ExportCellularMemoryResult> {
  const base = memoryRoot(options.root);
  if (!(await fileExists(base))) {
    throw new Error("CellularMemory not found. Run `dna init` first.");
  }

  const segments = options.segments?.length ? options.segments : [...DEFAULT_SEGMENTS];
  const files: Record<string, string> = {};

  for (const segment of segments) {
    const segmentPath = join(base, segment);
    if (!(await fileExists(segmentPath))) continue;

    const mdFiles = await glob("**/*.md", { cwd: segmentPath, onlyFiles: true });
    for (const rel of mdFiles) {
      const key = join(segment, rel);
      files[key] = await readFile(join(segmentPath, rel), "utf-8");
    }
  }

  const manifest: MemoryExportManifest = {
    version: 1,
    exportedAt: new Date().toISOString(),
    projectRoot: options.root,
    segments,
    files,
  };

  await ensureDir(join(options.outPath, ".."));
  await writeFile(options.outPath, JSON.stringify(manifest, null, 2) + "\n", "utf-8");

  return {
    outPath: options.outPath,
    fileCount: Object.keys(files).length,
    segments,
  };
}

export async function importCellularMemory(
  options: ImportCellularMemoryOptions,
): Promise<ImportCellularMemoryResult> {
  const raw = await readFile(options.inPath, "utf-8");
  const manifest = JSON.parse(raw) as MemoryExportManifest;

  if (manifest.version !== 1 || !manifest.files) {
    throw new Error("Invalid CellularMemory export file.");
  }

  const base = memoryRoot(options.root);
  await ensureDir(base);

  const allowedSegments = new Set(options.segments ?? manifest.segments ?? DEFAULT_SEGMENTS);
  let imported = 0;
  let skipped = 0;
  let merged = 0;
  const strategy = options.onConflict ?? "newest";

  for (const [relPath, content] of Object.entries(manifest.files)) {
    const segment = relPath.split("/")[0] ?? "";
    if (!allowedSegments.has(segment)) {
      skipped++;
      continue;
    }

    const dest = join(base, relPath);
    const exists = await fileExists(dest);

    if (exists && options.merge) {
      const local = await readFile(dest, "utf-8");
      if (local === content) {
        skipped++;
        continue;
      }
      if (strategy === "keep-local") {
        skipped++;
        continue;
      }
      if (strategy === "keep-remote") {
        await writeFile(dest, content, "utf-8");
        merged++;
        continue;
      }
      // newest: prefer incoming export timestamp vs file mtime — export wins when merging team sync
      await writeFile(dest, content, "utf-8");
      merged++;
      continue;
    }

    if (!options.merge && exists) {
      skipped++;
      continue;
    }

    await ensureDir(join(dest, ".."));
    await writeFile(dest, content, "utf-8");
    imported++;
  }

  return { imported, skipped, merged, segments: [...allowedSegments] };
}

export async function copyCellularMemorySegment(
  root: string,
  segment: string,
  destDir: string,
): Promise<number> {
  const src = join(memoryRoot(root), segment);
  if (!(await fileExists(src))) return 0;
  await mkdir(destDir, { recursive: true });
  await cp(src, destDir, { recursive: true });
  const files = await glob("**/*", { cwd: destDir, onlyFiles: true });
  return files.length;
}

export function formatMemoryExportSummary(result: ExportCellularMemoryResult): string {
  return [
    "CellularMemory Export",
    "=====================",
    "",
    `Output:   ${result.outPath}`,
    `Segments: ${result.segments.join(", ")}`,
    `Files:    ${result.fileCount}`,
    "",
    "Share this file with team projects, then run:",
    "  dna memory import <file.json> --merge",
  ].join("\n");
}

export function formatMemoryImportSummary(result: ImportCellularMemoryResult): string {
  return [
    "CellularMemory Import",
    "=====================",
    "",
    `Imported: ${result.imported} file(s)`,
    `Merged:   ${result.merged} file(s)`,
    `Skipped:  ${result.skipped} file(s)`,
    `Segments: ${result.segments.join(", ")}`,
  ].join("\n");
}

export async function syncFromTeamRegistry(root: string, registryPath: string): Promise<ImportCellularMemoryResult> {
  const resolved = registryPath.startsWith("/") ? registryPath : join(root, registryPath);
  return importCellularMemory({
    root,
    inPath: resolved,
    merge: true,
    onConflict: "newest",
  });
}

export function listMemorySegments(root: string): Promise<string[]> {
  return glob("*", { cwd: memoryRoot(root), onlyDirectories: true }).catch(() => []);
}
