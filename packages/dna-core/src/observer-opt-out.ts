import { readdir, readFile, rm, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import {
  DNA_CONFIG_FILE,
  DNA_LAB_DIR,
  DNA_LAB_STORE,
  DNA_RUNTIME_DB,
} from "@superhumaan/dna-config";
import { fileExists, writeJsonFile } from "./fs.js";
import { resolveBackendEntryCandidates } from "./generators/resolve-backend-entries.js";
import { loadDnaConfig } from "./validator.js";

const RUNTIME_OBSERVER_FILES = [
  ".DNA/runtime/install-snippet.ts",
  ".DNA/runtime/browser-client.ts",
  ".DNA/runtime/env.example.snippet",
  DNA_RUNTIME_DB,
];

const PRELOAD_FLAG = "@superhumaan/dna-by-humaan/runtime/preload";
const PACKAGE_NAME = "@superhumaan/dna-by-humaan";

const VITE_CONFIGS = ["vite.config.ts", "vite.config.js", "vite.config.mjs"];
const VERCEL_CONFIGS = ["vercel.ts", "vercel.json"];
const NEXT_MIDDLEWARE = ["middleware.ts", "src/middleware.ts"];

export function runtimeIsRemoved(config: DnaConfig | null | undefined): boolean {
  return config?.runtime?.removed === true;
}

export function labIsRemoved(config: DnaConfig | null | undefined): boolean {
  return config?.lab?.removed === true;
}

/** Strip DNA runtime observer injections. Leaves unrelated application code. */
export function stripRuntimeFromSource(content: string): string {
  let result = content;
  result = result.replace(
    /^import \{ dnaRuntime \} from ["']@superhumaan\/dna-by-humaan\/runtime["'];\n?/m,
    "",
  );
  result = result.replace(/dnaRuntime\.start\(\{[\s\S]*?\}\);\n?/g, "");
  result = result.replace(/^.*dnaRuntime\.express\(\).*\n?/gm, "");
  result = result.replace(/^.*dnaRuntime\.errorHandler\(\).*\n?/gm, "");
  result = result.replace(/^.*dnaRuntime\.attachFastify\(.*\n?/gm, "");
  result = result.replace(/^const dnaObserve = dnaRuntime\.nextMiddleware\(\);\n?/m, "");
  result = result.replace(/\n{3,}/g, "\n\n");
  return result;
}

/** Strip DNA Lab middleware injections. */
export function stripLabFromSource(content: string): string {
  let result = content;
  result = result.replace(
    /^import \{ createLabMiddleware \} from ["']@superhumaan\/dna-by-humaan\/lab["'];\n?/m,
    "",
  );
  result = result.replace(
    /^import \{ createLabFastifyPlugin \} from ["']@superhumaan\/dna-by-humaan\/lab["'];\n?/m,
    "",
  );
  result = result.replace(/^const \{ dnaLabMiddleware \} = require\([^)]*\);\n?/gm, "");
  result = result.replace(
    /^.*require\s*\(\s*["']@superhumaan\/dna-by-humaan\/lab["']\s*\).*\n?/gm,
    "",
  );
  result = result.replace(/^.*createLabMiddleware\s*\([\s\S]*?\);\n?/gm, "");
  result = result.replace(/^.*createLabFastifyPlugin\s*\([\s\S]*?\);\n?/gm, "");
  result = result.replace(/^.*dnaLabMiddleware\(\).*\n?/gm, "");
  result = result.replace(/\n\s*['"]\/labs['"]\s*:\s*\{[\s\S]*?\n\s*\},?/g, "");
  result = result.replace(/^\s*\/\/ dna-lab-rewrites\n?/gm, "");
  result = result.replace(/^\s*routes\.rewrite\(\s*['"]\/api\/dna\/labs\/.*\n?/gm, "");
  result = result.replace(/^\s*routes\.rewrite\(\s*['"]\/labs['"].*\n?/gm, "");
  result = result.replace(/^\s*routes\.rewrite\(\s*['"]\/labs\/.*\n?/gm, "");
  result = result.replace(/\n{3,}/g, "\n\n");
  return result;
}

function stripVercelJsonLab(content: string): string {
  try {
    const parsed = JSON.parse(content) as { rewrites?: Array<{ source?: string }> };
    if (!Array.isArray(parsed.rewrites)) return content;
    const next = parsed.rewrites.filter(
      (rule) =>
        !rule.source?.startsWith("/labs") && !rule.source?.startsWith("/api/dna/labs"),
    );
    if (next.length === parsed.rewrites.length) return content;
    parsed.rewrites = next;
    return JSON.stringify(parsed, null, 2) + "\n";
  } catch {
    return content;
  }
}

async function rewriteIfChanged(path: string, next: string, original: string, removed: string[]): Promise<void> {
  if (next === original) return;
  await writeFile(path, next, "utf-8");
  removed.push(path);
}

async function unwireFiles(
  root: string,
  relPaths: string[],
  strip: (content: string) => string,
  removed: string[],
): Promise<void> {
  for (const rel of relPaths) {
    const full = join(root, rel);
    if (!(await fileExists(full))) continue;
    const original = await readFile(full, "utf-8");
    await rewriteIfChanged(full, strip(original), original, removed);
  }
}

async function deleteNextMiddlewareIfGenerated(root: string, removed: string[]): Promise<void> {
  for (const rel of NEXT_MIDDLEWARE) {
    const full = join(root, rel);
    if (!(await fileExists(full))) continue;
    const content = await readFile(full, "utf-8");
    if (!content.includes("DNA Runtime — auto-wired") || !content.includes("dnaRuntime")) continue;
    await unlink(full);
    removed.push(rel);
  }
}

async function stripPreloadScripts(root: string, removed: string[]): Promise<void> {
  const pkgPath = join(root, "package.json");
  if (!(await fileExists(pkgPath))) return;
  const raw = await readFile(pkgPath, "utf-8");
  const pkg = JSON.parse(raw) as { scripts?: Record<string, string> };
  if (!pkg.scripts) return;
  let changed = false;
  for (const [name, cmd] of Object.entries(pkg.scripts)) {
    if (!cmd.includes(PRELOAD_FLAG)) continue;
    pkg.scripts[name] = cmd
      .replaceAll(`NODE_OPTIONS='--import ${PRELOAD_FLAG}'`, "")
      .replaceAll(`NODE_OPTIONS="--import ${PRELOAD_FLAG}"`, "")
      .replaceAll(`--import ${PRELOAD_FLAG}`, "")
      .replace(/\s{2,}/g, " ")
      .trim();
    changed = true;
  }
  if (!changed) return;
  await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
  removed.push("package.json scripts (runtime preload removed)");
}

async function projectStillImportsObserver(root: string): Promise<boolean> {
  const roots = [root, join(root, "src"), join(root, "app"), join(root, "apps")];
  const pending = roots.filter((dir) => dir);
  const seen = new Set<string>();
  while (pending.length > 0) {
    if (seen.size >= 400) return true;
    const dir = pending.pop();
    if (!dir || seen.has(dir)) continue;
    seen.add(dir);
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist" || entry.name === ".DNA") {
        continue;
      }
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        pending.push(full);
        continue;
      }
      if (!/\.(ts|tsx|js|mjs|cjs)$/.test(entry.name)) continue;
      const text = await readFile(full, "utf-8");
      if (text.includes(PACKAGE_NAME)) return true;
    }
  }
  return false;
}

async function dropPackageDependency(root: string, removed: string[]): Promise<void> {
  if (await projectStillImportsObserver(root)) return;
  const pkgPath = join(root, "package.json");
  if (!(await fileExists(pkgPath))) return;
  const raw = await readFile(pkgPath, "utf-8");
  const pkg = JSON.parse(raw) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  let changed = false;
  if (pkg.dependencies?.[PACKAGE_NAME]) {
    delete pkg.dependencies[PACKAGE_NAME];
    changed = true;
  }
  if (pkg.devDependencies?.[PACKAGE_NAME]) {
    delete pkg.devDependencies[PACKAGE_NAME];
    changed = true;
  }
  if (!changed) return;
  await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
  removed.push(`package.json (removed ${PACKAGE_NAME})`);
}

async function deleteIfExists(root: string, rel: string, removed: string[]): Promise<void> {
  const full = join(root, rel);
  if (!(await fileExists(full))) return;
  await rm(full, { recursive: true, force: true });
  removed.push(rel);
}

async function saveConfig(root: string, config: DnaConfig): Promise<void> {
  config.updatedAt = new Date().toISOString();
  await writeJsonFile(join(root, DNA_CONFIG_FILE), config);
}

export async function uninstallRuntime(root: string): Promise<string[]> {
  const removed: string[] = [];
  const config = await loadDnaConfig(root);
  if (!config) {
    throw new Error("DNA not installed. Run `dna init` first.");
  }

  const entries = await resolveBackendEntryCandidates(root);
  await unwireFiles(root, entries, stripRuntimeFromSource, removed);
  await deleteNextMiddlewareIfGenerated(root, removed);
  await stripPreloadScripts(root, removed);

  for (const rel of RUNTIME_OBSERVER_FILES) {
    await deleteIfExists(root, rel, removed);
  }

  const runtimeDir = join(root, ".DNA", "runtime");
  try {
    const names = await readdir(runtimeDir);
    for (const name of names) {
      if (!name.endsWith(".jsonl")) continue;
      await deleteIfExists(root, join(".DNA", "runtime", name), removed);
    }
  } catch {
    // no runtime dir
  }

  config.runtime = {
    storage: "json",
    watchBackend: false,
    watchFrontend: false,
    ...config.runtime,
    enabled: false,
    removed: true,
  };
  await saveConfig(root, config);
  removed.push(".DNA/config.dna.json (runtime removed)");

  if (labIsRemoved(config)) {
    await dropPackageDependency(root, removed);
  }

  return removed;
}

export async function uninstallLab(root: string): Promise<string[]> {
  const removed: string[] = [];
  const config = await loadDnaConfig(root);
  if (!config) {
    throw new Error("DNA not installed. Run `dna init` first.");
  }

  const entries = await resolveBackendEntryCandidates(root);
  await unwireFiles(root, [...entries, ...VITE_CONFIGS], stripLabFromSource, removed);

  for (const rel of VERCEL_CONFIGS) {
    const full = join(root, rel);
    if (!(await fileExists(full))) continue;
    const original = await readFile(full, "utf-8");
    const next = rel.endsWith(".json") ? stripVercelJsonLab(original) : stripLabFromSource(original);
    await rewriteIfChanged(full, next, original, removed);
  }

  await deleteIfExists(root, DNA_LAB_DIR, removed);
  await deleteIfExists(root, DNA_LAB_STORE, removed);

  config.lab = {
    path: "/labs",
    requireAuthInProduction: true,
    openLocalWithoutAuth: true,
    ...config.lab,
    enabled: false,
    removed: true,
  };
  await saveConfig(root, config);
  removed.push(".DNA/config.dna.json (lab removed)");

  if (runtimeIsRemoved(config)) {
    await dropPackageDependency(root, removed);
  }

  return removed;
}

export function clearRuntimeOptOut(config: DnaConfig): DnaConfig {
  config.runtime = {
    storage: "json",
    ...config.runtime,
    enabled: true,
    removed: false,
    watchBackend: true,
    watchFrontend: true,
  };
  return config;
}

export function clearLabOptOut(config: DnaConfig): DnaConfig {
  config.lab = {
    path: "/labs",
    requireAuthInProduction: true,
    openLocalWithoutAuth: true,
    ...config.lab,
    enabled: true,
    removed: false,
  };
  return config;
}
