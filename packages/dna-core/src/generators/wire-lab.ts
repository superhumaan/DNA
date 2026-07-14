import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import type { DnaConfig, ScanResult } from "@superhumaan/dna-config";
import { fileExists } from "../fs.js";
import { scanProject } from "../scanner.js";
import { resolveBackendEntryCandidates } from "./resolve-backend-entries.js";

export interface WireLabOptions {
  root: string;
  config: DnaConfig;
  scan?: ScanResult;
}

export interface WireLabResult {
  wired: string[];
  skipped: string[];
}

const LAB_IMPORT_EXPRESS = `import { createLabMiddleware } from "@superhumaan/dna-by-humaan/lab";`;
const LAB_IMPORT_FASTIFY = `import { createLabFastifyPlugin } from "@superhumaan/dna-by-humaan/lab";`;

/** CJS cannot require() the ESM-only ./lab export — dynamic import bridge instead. */
export function buildCjsLabWireSource(projectId: string): string {
  return `/**
 * DNA Lab Express bridge for CommonJS servers.
 * @superhumaan/dna-by-humaan/lab is ESM-only — do not require() it.
 */
"use strict";

let labMiddleware = null;
let initPromise = null;

function isLabEnabled() {
  return process.env.DNA_LAB_ENABLED !== "0";
}

function loadLabMiddleware() {
  if (!initPromise) {
    initPromise = import("@superhumaan/dna-by-humaan/lab").then(({ createLabMiddleware }) => {
      labMiddleware = createLabMiddleware({
        root: process.cwd(),
        config: {
          projectId: process.env.DNA_PROJECT_ID || "${projectId}",
          lab: {
            enabled: true,
            path: "/labs",
            requireAuthInProduction: true,
            openLocalWithoutAuth: true,
          },
        },
      });
      return labMiddleware;
    });
  }
  return initPromise;
}

function dnaLabMiddleware() {
  return (req, res, next) => {
    if (!isLabEnabled()) return next();
    void loadLabMiddleware()
      .then((middleware) => middleware(req, res, next))
      .catch((err) => {
        console.error("dna_lab_middleware_failed", { message: err?.message || String(err) });
        next();
      });
  };
}

module.exports = {
  isLabEnabled,
  dnaLabMiddleware,
};
`;
}

function isCjsExpressEntry(content: string): boolean {
  const usesEsmImport = /^import\s+/m.test(content);
  return !usesEsmImport && /require\s*\(\s*['"]express['"]\s*\)/.test(content);
}

export function hasLabWired(content: string): boolean {
  return (
    /createLabMiddleware\s*\(/.test(content) ||
    /createLabFastifyPlugin\s*\(/.test(content) ||
    /dnaLabMiddleware\s*\(/.test(content) ||
    content.includes("dnaRuntime.lab") ||
    content.includes("dnaLabWire")
  );
}

function insertAfterImports(content: string, insert: string): string {
  const importMatches = [...content.matchAll(/^import .+$/gm)];
  if (importMatches.length === 0) return `${insert}\n${content}`;
  const last = importMatches[importMatches.length - 1];
  const idx = last.index! + last[0].length;
  return content.slice(0, idx) + `\n${insert}` + content.slice(idx);
}

function insertAfterRequires(content: string, insert: string): string {
  const requireMatches = [...content.matchAll(/^const .+ = require\(.+\);?\s*$/gm)];
  if (requireMatches.length === 0) return `${insert}\n${content}`;
  const last = requireMatches[requireMatches.length - 1];
  const idx = last.index! + last[0].length;
  return content.slice(0, idx) + `\n${insert}` + content.slice(idx);
}

/** Mount after helmet/configureExpress so Lab CSP overrides API default-src 'none'. */
export function findExpressLabMountIndex(content: string): number | null {
  const configureMatch = content.match(
    /^[^;\n]*\bconfigureExpress\s*\(\s*(?:app|server)\b[^)]*\)\s*;?\s*$/m,
  );
  if (configureMatch?.index != null) {
    const lineEnd = content.indexOf("\n", configureMatch.index);
    return lineEnd >= 0 ? lineEnd + 1 : configureMatch.index + configureMatch[0].length;
  }

  const helmetMatch = content.match(/^[^;\n]*\bapp\.use\s*\(\s*helmet\s*\(/m);
  if (helmetMatch?.index != null) {
    const lineEnd = content.indexOf("\n", helmetMatch.index);
    return lineEnd >= 0 ? lineEnd + 1 : helmetMatch.index + helmetMatch[0].length;
  }

  const appMatch = content.match(/(const|let|var)\s+\w+\s*=\s*express\s*\(\s*\)/);
  if (appMatch?.index != null) {
    return content.indexOf("\n", appMatch.index) + 1;
  }

  return null;
}

export function toRequirePath(fromFile: string, toFile: string): string {
  let rel = relative(dirname(fromFile), toFile).replace(/\\/g, "/");
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return rel;
}

/** ESM Express entry — static import of createLabMiddleware. */
export function wireExpressLabEsmContent(content: string, projectId: string): string | null {
  if (hasLabWired(content)) return null;
  if (!/from\s+["']express["']/.test(content) && !/require\s*\(\s*["']express["']\s*\)/.test(content)) {
    return null;
  }
  if (isCjsExpressEntry(content)) return null;

  const appMatch = content.match(/(const|let|var)\s+(\w+)\s*=\s*express\s*\(\s*\)/);
  if (!appMatch) return null;

  const appVar = appMatch[2];
  let result = insertAfterImports(content, LAB_IMPORT_EXPRESS);
  const mount = `${appVar}.use(createLabMiddleware({ root: process.cwd(), config: { projectId: "${projectId}" } }));\n`;

  if (!result.includes("createLabMiddleware({")) {
    const mountIndex = findExpressLabMountIndex(result);
    if (mountIndex == null) return null;
    result = result.slice(0, mountIndex) + mount + result.slice(mountIndex);
  }

  return result;
}

/**
 * CJS Express entry — require a local bridge that dynamic-imports the ESM lab package.
 * Never inject require("@superhumaan/dna-by-humaan/lab") — that crashes under Node --watch.
 */
export function wireExpressLabCjsContent(
  content: string,
  _projectId: string,
  helperRequirePath: string,
): string | null {
  void _projectId; // projectId lives in express-wire.cjs (buildCjsLabWireSource), not the entry file
  if (hasLabWired(content)) return null;
  if (!isCjsExpressEntry(content)) return null;

  const appMatch = content.match(/(const|let|var)\s+(\w+)\s*=\s*express\s*\(\s*\)/);
  if (!appMatch) return null;

  const appVar = appMatch[2];
  const requireLine = `const { dnaLabMiddleware } = require("${helperRequirePath}");`;
  let result = insertAfterRequires(content, requireLine);
  const mount = `${appVar}.use(dnaLabMiddleware());\n`;

  if (!result.includes("dnaLabMiddleware()")) {
    const mountIndex = findExpressLabMountIndex(result);
    if (mountIndex == null) return null;
    result = result.slice(0, mountIndex) + mount + result.slice(mountIndex);
  }

  // Drop leftover broken CJS requires of the ESM lab export if somehow present
  result = result.replace(
    /^.*require\s*\(\s*["']@superhumaan\/dna-by-humaan\/lab["']\s*\).*\n?/gm,
    "",
  );
  result = result.replace(
    /^.*createLabMiddleware\s*\([^)]*\)[;\s]*\n?/gm,
    "",
  );

  return result;
}

/** @deprecated Prefer wireExpressLabEsmContent / wireExpressLabCjsContent */
export function wireExpressLabContent(content: string, projectId: string): string | null {
  if (isCjsExpressEntry(content)) {
    return wireExpressLabCjsContent(content, projectId, "../.DNA/lab/express-wire.cjs");
  }
  return wireExpressLabEsmContent(content, projectId);
}

export function wireFastifyLabContent(content: string, projectId: string): string | null {
  if (hasLabWired(content)) return null;
  if (!/from\s+["']fastify["']/.test(content)) return null;

  const instanceMatch =
    content.match(/(const|let|var)\s+(\w+)\s*=\s*Fastify\s*\(/) ??
    content.match(/(const|let|var)\s+(\w+)\s*=\s*fastify\s*\(/);
  if (!instanceMatch) return null;

  const instanceVar = instanceMatch[2];
  let result = insertAfterImports(content, LAB_IMPORT_FASTIFY);
  const line = result.match(
    new RegExp(`(const|let|var)\\s+${instanceVar}\\s*=\\s*(Fastify|fastify)\\s*\\(`),
  );
  if (!line?.index) return null;

  const lineEnd = result.indexOf("\n", line.index) + 1;
  const mount = `void ${instanceVar}.register(createLabFastifyPlugin({ root: process.cwd(), config: { projectId: "${projectId}" } }));\n`;
  if (!result.includes("createLabFastifyPlugin({")) {
    result = result.slice(0, lineEnd) + mount + result.slice(lineEnd);
  }

  return result;
}

async function ensureCjsLabHelper(root: string, projectId: string): Promise<string> {
  const helperPath = join(root, ".DNA", "lab", "express-wire.cjs");
  await mkdir(dirname(helperPath), { recursive: true });
  await writeFile(helperPath, buildCjsLabWireSource(projectId), "utf-8");
  return helperPath;
}

async function wireExpressEntry(
  root: string,
  candidates: string[],
  projectId: string,
): Promise<{ wired: string[]; skipped: string[] }> {
  const wired: string[] = [];
  const skipped: string[] = [];

  for (const rel of candidates) {
    const fullPath = join(root, rel);
    if (!(await fileExists(fullPath))) continue;

    const content = await readFile(fullPath, "utf-8");
    if (hasLabWired(content)) {
      skipped.push(`${rel} (already wired)`);
      return { wired, skipped };
    }

    let updated: string | null;
    if (isCjsExpressEntry(content)) {
      const helperPath = await ensureCjsLabHelper(root, projectId);
      const requirePath = toRequirePath(fullPath, helperPath);
      updated = wireExpressLabCjsContent(content, projectId, requirePath);
      if (updated) wired.push(".DNA/lab/express-wire.cjs");
    } else {
      updated = wireExpressLabEsmContent(content, projectId);
    }

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
    if (hasLabWired(content)) {
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

function stackUsesExpress(scan: ScanResult): boolean {
  return scan.backend === "express" || scan.dependencies.includes("express");
}

function stackUsesFastify(scan: ScanResult): boolean {
  return scan.backend === "fastify" || scan.dependencies.includes("fastify");
}

export async function wireLabMiddleware(options: WireLabOptions): Promise<WireLabResult> {
  const { root, config } = options;
  if (config.lab?.enabled === false) {
    return { wired: [], skipped: ["lab disabled in config"] };
  }

  const scan = options.scan ?? (await scanProject(root));
  const projectId = config.projectId ?? config.projectName ?? "app";
  const wired: string[] = [];
  const skipped: string[] = [];

  const entryCandidates = await resolveBackendEntryCandidates(root);

  if (stackUsesExpress(scan)) {
    const express = await wireExpressEntry(root, entryCandidates, projectId);
    wired.push(...express.wired);
    skipped.push(...express.skipped);
    if (express.wired.length > 0) return { wired, skipped };
  }

  if (stackUsesFastify(scan)) {
    const fastify = await wireEntryFile(root, entryCandidates, projectId, wireFastifyLabContent);
    wired.push(...fastify.wired);
    skipped.push(...fastify.skipped);
    if (fastify.wired.length > 0) return { wired, skipped };
  }

  skipped.push("add createLabMiddleware manually — see dna lab install");
  return { wired, skipped };
}
