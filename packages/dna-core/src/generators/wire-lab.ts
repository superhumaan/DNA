import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
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

const LAB_IMPORT = `import { createLabMiddleware } from "@superhumaan/dna-by-humaan/lab";
import { createLabFastifyPlugin } from "@superhumaan/dna-by-humaan/lab";`;

function hasLabWired(content: string): boolean {
  return (
    /createLabMiddleware\s*\(/.test(content) ||
    /createLabFastifyPlugin\s*\(/.test(content) ||
    content.includes("dnaRuntime.lab")
  );
}

function insertAfterImports(content: string, insert: string): string {
  const importMatches = [...content.matchAll(/^import .+$/gm)];
  if (importMatches.length === 0) return `${insert}\n${content}`;
  const last = importMatches[importMatches.length - 1];
  const idx = last.index! + last[0].length;
  return content.slice(0, idx) + `\n${insert}` + content.slice(idx);
}

export function wireExpressLabContent(content: string, projectId: string): string | null {
  if (hasLabWired(content)) return null;
  if (!/from\s+["']express["']/.test(content) && !/require\s*\(\s*["']express["']\s*\)/.test(content)) {
    return null;
  }

  const appMatch = content.match(/(const|let|var)\s+(\w+)\s*=\s*express\s*\(\s*\)/);
  if (!appMatch) return null;

  const appVar = appMatch[2];
  let result = insertAfterImports(content, LAB_IMPORT);

  if (!result.includes("createLabMiddleware")) return null;

  const mount = `${appVar}.use(createLabMiddleware({ root: process.cwd(), config: { projectId: "${projectId}", lab: { enabled: true, path: "/labs", requireAuthInProduction: true, openLocalWithoutAuth: true } } }));\n`;

  const expressLine = result.match(new RegExp(`(const|let|var)\\s+${appVar}\\s*=\\s*express\\s*\\(\\s*\\)`));
  if (!expressLine?.index) return null;

  const lineEnd = result.indexOf("\n", expressLine.index) + 1;
  if (!result.includes("createLabMiddleware({")) {
    result = result.slice(0, lineEnd) + mount + result.slice(lineEnd);
  }

  return result;
}

export function wireFastifyLabContent(content: string, projectId: string): string | null {
  if (hasLabWired(content)) return null;
  if (!/from\s+["']fastify["']/.test(content)) return null;

  const instanceMatch =
    content.match(/(const|let|var)\s+(\w+)\s*=\s*Fastify\s*\(/) ??
    content.match(/(const|let|var)\s+(\w+)\s*=\s*fastify\s*\(/);
  if (!instanceMatch) return null;

  const instanceVar = instanceMatch[2];
  let result = insertAfterImports(content, LAB_IMPORT);
  const line = result.match(
    new RegExp(`(const|let|var)\\s+${instanceVar}\\s*=\\s*(Fastify|fastify)\\s*\\(`),
  );
  if (!line?.index) return null;

  const lineEnd = result.indexOf("\n", line.index) + 1;
  const mount = `void ${instanceVar}.register(createLabFastifyPlugin({ root: process.cwd(), config: { projectId: "${projectId}", lab: { enabled: true, path: "/labs", requireAuthInProduction: true, openLocalWithoutAuth: true } } }));\n`;
  if (!result.includes("createLabMiddleware({")) {
    result = result.slice(0, lineEnd) + mount + result.slice(lineEnd);
  }

  return result;
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
    const express = await wireEntryFile(root, entryCandidates, projectId, wireExpressLabContent);
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
