import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";
import { upsertSourceMapMeta, listSourceMapMeta } from "./storage.js";
import type { LabSourceMapMeta } from "./types.js";

const MAP_EXTS = [".js.map", ".mjs.map", ".cjs.map", ".css.map"];
const SCAN_DIRS = ["dist", "build", ".next", "out", "coverage"];

function walkMaps(absDir: string, projectRoot: string, out: string[], cap: number): void {
  if (out.length >= cap || !existsSync(absDir)) return;
  let entries: string[] = [];
  try {
    entries = readdirSync(absDir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (out.length >= cap) return;
    if (name === "node_modules" || name.startsWith(".")) continue;
    const abs = join(absDir, name);
    let st;
    try {
      st = statSync(abs);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      walkMaps(abs, projectRoot, out, cap);
      continue;
    }
    if (MAP_EXTS.some((ext) => name.endsWith(ext))) {
      out.push(abs);
    }
  }
}

export interface SourceMapScanResult {
  found: number;
  registered: number;
  paths: string[];
}

/** Scan common build output dirs for *.map and register metadata in Lab store. */
export async function scanAndRegisterSourceMaps(
  root: string,
  opts?: { releaseId?: string; cap?: number },
): Promise<SourceMapScanResult> {
  const cap = opts?.cap ?? 200;
  const foundAbs: string[] = [];
  for (const dir of SCAN_DIRS) {
    walkMaps(join(root, dir), root, foundAbs, cap);
  }
  // Also packages/*/dist in monorepos (one level)
  const packages = join(root, "packages");
  if (existsSync(packages)) {
    try {
      for (const name of readdirSync(packages)) {
        walkMaps(join(packages, name, "dist"), root, foundAbs, cap);
      }
    } catch {
      /* ignore */
    }
  }

  const releaseId = opts?.releaseId || "local";
  let registered = 0;
  const paths: string[] = [];
  for (const abs of foundAbs) {
    const rel = relative(root, abs).split("\\").join("/");
    paths.push(rel);
    let sizeBytes = 0;
    let mtime = new Date().toISOString();
    try {
      const st = statSync(abs);
      sizeBytes = st.size;
      mtime = st.mtime.toISOString();
    } catch {
      /* ignore */
    }
    const id = createHash("sha1").update(rel).digest("hex").slice(0, 16);
    const meta: LabSourceMapMeta = {
      id,
      releaseId,
      file: rel,
      uploadedAt: mtime,
      sizeBytes,
    };
    await upsertSourceMapMeta(root, meta);
    registered += 1;
  }

  return { found: foundAbs.length, registered, paths };
}

export async function sourceMapInventory(root: string): Promise<LabSourceMapMeta[]> {
  return listSourceMapMeta(root);
}
