import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { DnaConfig, ScanResult } from "@superhumaan/dna-config";
import { fileExists } from "../fs.js";
import { scanProject } from "../scanner.js";
import { resolveBackendEntryCandidates } from "./resolve-backend-entries.js";

export interface WireRuntimeOptions {
  root: string;
  config: DnaConfig;
  scan?: ScanResult;
}

export interface WireRuntimeResult {
  wired: string[];
  skipped: string[];
}

const RUNTIME_IMPORT = `import { dnaRuntime } from "@superhumaan/dna-by-humaan/runtime";`;

const PRELOAD_FLAG = "@superhumaan/dna-by-humaan/runtime/preload";

function runtimeStartBlock(projectId: string): string {
  return `dnaRuntime.start({
  projectId: "${projectId}",
  projectRoot: process.cwd(),
  environment: process.env.NODE_ENV ?? "development",
  release: process.env.GIT_SHA,
  github: { enabled: true },
  aiRepair: { enabled: true },
});
`;
}

function insertAfterImports(content: string, insert: string): string {
  const importMatches = [...content.matchAll(/^import .+$/gm)];
  if (importMatches.length === 0) {
    return `${insert}\n${content}`;
  }
  const last = importMatches[importMatches.length - 1];
  const idx = last.index! + last[0].length;
  return content.slice(0, idx) + `\n${insert}` + content.slice(idx);
}

function hasDnaRuntime(content: string): boolean {
  return content.includes("dnaRuntime");
}

export function generateNextMiddleware(projectId: string): string {
  return `// DNA Runtime — auto-wired by dna doctor
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
${RUNTIME_IMPORT}

${runtimeStartBlock(projectId)}
const dnaObserve = dnaRuntime.nextMiddleware();

export async function middleware(request: NextRequest) {
  await dnaObserve(request);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
`;
}

export function wireExpressContent(content: string, projectId: string): string | null {
  if (hasDnaRuntime(content)) return null;
  if (!/from\s+["']express["']/.test(content) && !/require\s*\(\s*["']express["']\s*\)/.test(content)) {
    return null;
  }

  const appMatch = content.match(/(const|let|var)\s+(\w+)\s*=\s*express\s*\(\s*\)/);
  if (!appMatch) return null;

  const appVar = appMatch[2];
  let result = insertAfterImports(content, RUNTIME_IMPORT);
  const startBlock = runtimeStartBlock(projectId);

  const appLine = result.match(new RegExp(`(const|let|var)\\s+${appVar}\\s*=\\s*express\\s*\\(\\s*\\)`));
  if (!appLine?.index) return null;

  if (!result.includes("dnaRuntime.start")) {
    result = result.slice(0, appLine.index) + startBlock + result.slice(appLine.index);
  }

  if (!result.includes("dnaRuntime.express()")) {
    const recreated = result.match(new RegExp(`(const|let|var)\\s+${appVar}\\s*=\\s*express\\s*\\(\\s*\\)`));
    if (recreated?.index !== undefined) {
      const lineEnd = result.indexOf("\n", recreated.index) + 1;
      result =
        result.slice(0, lineEnd) +
        `${appVar}.use(dnaRuntime.express());\n` +
        result.slice(lineEnd);
    }
  }

  if (!result.includes("dnaRuntime.errorHandler()")) {
    const listenMatch = result.match(new RegExp(`${appVar}\\.listen\\s*\\(`));
    if (listenMatch?.index !== undefined) {
      result =
        result.slice(0, listenMatch.index) +
        `${appVar}.use(dnaRuntime.errorHandler());\n\n` +
        result.slice(listenMatch.index);
    }
  }

  return result;
}

export function wireFastifyContent(content: string, projectId: string): string | null {
  if (hasDnaRuntime(content)) return null;
  if (!/from\s+["']fastify["']/.test(content)) return null;

  const instanceMatch =
    content.match(/(const|let|var)\s+(\w+)\s*=\s*Fastify\s*\(/) ??
    content.match(/(const|let|var)\s+(\w+)\s*=\s*fastify\s*\(/);
  if (!instanceMatch) return null;

  const instanceVar = instanceMatch[2];
  let result = insertAfterImports(content, RUNTIME_IMPORT);
  const startBlock = runtimeStartBlock(projectId);

  const line = result.match(
    new RegExp(`(const|let|var)\\s+${instanceVar}\\s*=\\s*(Fastify|fastify)\\s*\\(`),
  );
  if (!line?.index) return null;

  if (!result.includes("dnaRuntime.start")) {
    result = result.slice(0, line.index) + startBlock + result.slice(line.index);
  }

  if (!result.includes("dnaRuntime.attachFastify")) {
    const recreated = result.match(
      new RegExp(`(const|let|var)\\s+${instanceVar}\\s*=\\s*(Fastify|fastify)\\s*\\(`),
    );
    if (recreated?.index !== undefined) {
      const lineEnd = result.indexOf("\n", recreated.index) + 1;
      result =
        result.slice(0, lineEnd) +
        `dnaRuntime.attachFastify(${instanceVar});\n` +
        result.slice(lineEnd);
    }
  }

  return result;
}

async function resolveNextMiddlewarePath(root: string): Promise<string> {
  if (await fileExists(join(root, "middleware.ts"))) return "middleware.ts";
  if (await fileExists(join(root, "src/middleware.ts"))) return "src/middleware.ts";
  if (
    (await fileExists(join(root, "src/app"))) ||
    (await fileExists(join(root, "src/pages"))) ||
    (await fileExists(join(root, "app")))
  ) {
    return "src/middleware.ts";
  }
  return "middleware.ts";
}

async function wireNext(
  root: string,
  projectId: string,
): Promise<{ wired: string[]; skipped: string[] }> {
  const wired: string[] = [];
  const skipped: string[] = [];
  const relPath = await resolveNextMiddlewarePath(root);
  const fullPath = join(root, relPath);

  if (await fileExists(fullPath)) {
    const existing = await readFile(fullPath, "utf-8");
    if (hasDnaRuntime(existing)) {
      skipped.push(`${relPath} (already wired)`);
      return { wired, skipped };
    }
    skipped.push(`${relPath} (custom middleware exists — using preload fallback)`);
    return { wired, skipped };
  }

  await writeFile(fullPath, generateNextMiddleware(projectId), "utf-8");
  wired.push(relPath);
  return { wired, skipped };
}

async function wireEntryFile(
  root: string,
  candidates: string[],
  projectId: string,
  wireFn: (content: string, projectId: string) => string | null,
): Promise<{ wired: string[]; skipped: string[] }> {
  const wired: string[] = [];
  const skipped: string[] = [];

  for (const rel of candidates) {
    const fullPath = join(root, rel);
    if (!(await fileExists(fullPath))) continue;

    const content = await readFile(fullPath, "utf-8");
    if (hasDnaRuntime(content)) {
      skipped.push(`${rel} (already wired)`);
      return { wired, skipped };
    }

    const updated = wireFn(content, projectId);
    if (!updated) {
      skipped.push(`${rel} (no safe injection point)`);
      continue;
    }

    await writeFile(fullPath, updated, "utf-8");
    wired.push(rel);
    return { wired, skipped };
  }

  skipped.push("no matching entry file");
  return { wired, skipped };
}

export async function ensurePreloadInScripts(root: string): Promise<string[]> {
  const pkgPath = join(root, "package.json");
  if (!(await fileExists(pkgPath))) return [];

  const raw = await readFile(pkgPath, "utf-8");
  const pkg = JSON.parse(raw) as { scripts?: Record<string, string> };
  const scripts = { ...(pkg.scripts ?? {}) };
  const updated: string[] = [];
  const prefix = `NODE_OPTIONS='--import ${PRELOAD_FLAG}'`;

  for (const name of ["dev", "start", "serve"] as const) {
    const cmd = scripts[name];
    if (!cmd || cmd.includes(PRELOAD_FLAG)) continue;
    scripts[name] = `${prefix} ${cmd}`;
    updated.push(`package.json scripts.${name} (runtime preload)`);
  }

  if (updated.length > 0) {
    pkg.scripts = scripts;
    await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
  }

  return updated;
}

function stackUsesNext(scan: ScanResult): boolean {
  return scan.frontend === "next" || scan.dependencies.includes("next");
}

function stackUsesExpress(scan: ScanResult): boolean {
  return scan.backend === "express" || scan.dependencies.includes("express");
}

function stackUsesFastify(scan: ScanResult): boolean {
  return scan.backend === "fastify" || scan.dependencies.includes("fastify");
}

export async function wireRuntimeMiddleware(
  options: WireRuntimeOptions,
): Promise<WireRuntimeResult> {
  const { root, config } = options;
  const scan = options.scan ?? (await scanProject(root));
  const projectId = config.projectId ?? config.projectName ?? "app";
  const wired: string[] = [];
  const skipped: string[] = [];

  if (stackUsesNext(scan)) {
    const next = await wireNext(root, projectId);
    wired.push(...next.wired);
    skipped.push(...next.skipped);
    if (next.wired.length > 0) {
      return { wired, skipped };
    }
  }

  const entryCandidates = await resolveBackendEntryCandidates(root);

  if (stackUsesExpress(scan)) {
    const express = await wireEntryFile(root, entryCandidates, projectId, wireExpressContent);
    wired.push(...express.wired);
    skipped.push(...express.skipped);
    if (express.wired.length > 0) {
      return { wired, skipped };
    }
  }

  if (stackUsesFastify(scan)) {
    const fastify = await wireEntryFile(root, entryCandidates, projectId, wireFastifyContent);
    wired.push(...fastify.wired);
    skipped.push(...fastify.skipped);
    if (fastify.wired.length > 0) {
      return { wired, skipped };
    }
  }

  const preload = await ensurePreloadInScripts(root);
  wired.push(...preload);
  if (preload.length === 0 && wired.length === 0) {
    skipped.push("no supported stack detected for auto-wire");
  }

  return { wired, skipped };
}
