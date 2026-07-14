import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ScanResult } from "@superhumaan/dna-config";
import { DNA_LAB_API_PREFIX, DNA_LAB_DEFAULT_PATH } from "@superhumaan/dna-config";
import { fileExists } from "../fs.js";
import { scanProject } from "../scanner.js";
import { wireLabMiddleware, type WireLabOptions, type WireLabResult } from "./wire-lab.js";

export interface WireLabStackOptions extends WireLabOptions {
  scan?: ScanResult;
}

const VITE_CONFIG_CANDIDATES = ["vite.config.ts", "vite.config.js", "vite.config.mjs"];
const VERCEL_CONFIG_CANDIDATES = ["vercel.ts", "vercel.json"];

const LAB_PROXY_PATHS = [DNA_LAB_DEFAULT_PATH, DNA_LAB_API_PREFIX] as const;
const LAB_VERCEL_MARKER = "dna-lab-rewrites";

function hasViteLabProxy(content: string): boolean {
  return /['"]\/labs['"]\s*:/.test(content);
}

function stripTrailingComma(line: string): string {
  return line.replace(/,\s*$/, "");
}

function extractApiProxyBlock(content: string): {
  block: string;
  targetLine: string;
  baseIndent: string;
  optionLines: string[];
} | null {
  const match = content.match(/^(\s*)(['"]\/api['"]\s*:\s*\{[\s\S]*?^\1\},?\s*$)/m);
  if (!match) return null;

  const baseIndent = match[1] ?? "        ";
  const block = match[2] ?? match[0];
  const targetLine = block.match(/^\s*target\s*:.+$/m)?.[0]?.trim();
  if (!targetLine) return null;

  const optionLines = ["changeOrigin", "timeout", "secure", "ws", "rewrite"]
    .map((key) => block.match(new RegExp(`^\\s*${key}\\s*:.+$`, "m"))?.[0]?.trim())
    .filter((line): line is string => Boolean(line));

  return { block, targetLine, baseIndent, optionLines };
}

export function wireViteLabProxyContent(content: string): string | null {
  if (hasViteLabProxy(content)) return null;

  const api = extractApiProxyBlock(content);
  if (!api) return null;

  const innerIndent = `${api.baseIndent}  `;
  const optionsBody = api.optionLines
    .map((line) => `${innerIndent}${stripTrailingComma(line)},`)
    .join("\n");

  const proxyEntry = (path: string) =>
    [
      `${api.baseIndent}'${path}': {`,
      `${innerIndent}${stripTrailingComma(api.targetLine)},`,
      optionsBody,
      `${api.baseIndent}},`,
    ]
      .filter(Boolean)
      .join("\n");

  const labBlock = `${proxyEntry("/labs")}\n`;
  return content.replace(api.block, `${api.block}\n${labBlock}`);
}

function hasVercelLabRewrites(content: string): boolean {
  return content.includes(LAB_VERCEL_MARKER) || /\/api\/dna\/labs/.test(content);
}

export function wireVercelTsLabRewrites(content: string): string | null {
  if (hasVercelLabRewrites(content)) return null;
  if (!content.includes("rewrites:") || !content.includes("routes.rewrite")) return null;

  const apiRewrite = content.match(/routes\.rewrite\(\s*['"]\/api\//);
  if (!apiRewrite?.index) return null;

  const insert = [
    "    // dna-lab-rewrites",
    "    routes.rewrite('/api/dna/labs/(.*)', `${resolveApiBaseUrl()}/api/dna/labs/$1`),",
    "    routes.rewrite('/labs', `${resolveApiBaseUrl()}/labs`),",
    "    routes.rewrite('/labs/(.*)', `${resolveApiBaseUrl()}/labs/$1`),",
    "",
  ].join("\n");

  return `${content.slice(0, apiRewrite.index)}${insert}${content.slice(apiRewrite.index)}`;
}

export function wireVercelJsonLabRewrites(content: string): string | null {
  if (hasVercelLabRewrites(content)) return null;

  let parsed: { rewrites?: Array<Record<string, string>> };
  try {
    parsed = JSON.parse(content) as { rewrites?: Array<Record<string, string>> };
  } catch {
    return null;
  }

  if (!Array.isArray(parsed.rewrites)) return null;
  const apiRewrite = parsed.rewrites.find((r) => r.source?.startsWith("/api"));
  const destination = apiRewrite?.destination;
  if (!destination || typeof destination !== "string") return null;

  const base = destination.replace(/\/api\/.*$/, "");
  const labRewrites = [
    { source: "/api/dna/labs/:path*", destination: `${base}/api/dna/labs/:path*` },
    { source: "/labs", destination: `${base}/labs` },
    { source: "/labs/:path*", destination: `${base}/labs/:path*` },
  ];

  parsed.rewrites = [...labRewrites, ...parsed.rewrites];
  return `${JSON.stringify(parsed, null, 2)}\n`;
}

async function wireConfigFile(
  root: string,
  candidates: string[],
  wireFn: (content: string) => string | null,
): Promise<{ wired: string[]; skipped: string[] }> {
  const wired: string[] = [];
  const skipped: string[] = [];

  for (const rel of candidates) {
    const fullPath = join(root, rel);
    if (!(await fileExists(fullPath))) continue;

    const content = await readFile(fullPath, "utf-8");
    const updated = wireFn(content);
    if (!updated) {
      skipped.push(`${rel} (no safe injection point)`);
      continue;
    }

    await writeFile(fullPath, updated, "utf-8");
    wired.push(rel);
    return { wired, skipped };
  }

  skipped.push("no matching config file");
  return { wired, skipped };
}

export async function wireViteLabProxy(options: WireLabStackOptions): Promise<WireLabResult> {
  const scan = options.scan ?? (await scanProject(options.root));
  if (!scan.dependencies.includes("vite")) {
    return { wired: [], skipped: ["no Vite dev server detected"] };
  }

  return wireConfigFile(options.root, VITE_CONFIG_CANDIDATES, wireViteLabProxyContent);
}

export async function wireVercelLabRewrites(options: WireLabStackOptions): Promise<WireLabResult> {
  const scan = options.scan ?? (await scanProject(options.root));
  if (scan.hosting !== "vercel" && !(await fileExists(join(options.root, "vercel.ts")))) {
    return { wired: [], skipped: ["no Vercel config detected"] };
  }

  for (const rel of VERCEL_CONFIG_CANDIDATES) {
    const fullPath = join(options.root, rel);
    if (!(await fileExists(fullPath))) continue;

    const content = await readFile(fullPath, "utf-8");
    const wireFn = rel.endsWith(".ts") ? wireVercelTsLabRewrites : wireVercelJsonLabRewrites;
    const updated = wireFn(content);
    if (!updated) continue;

    await writeFile(fullPath, updated, "utf-8");
    return { wired: [rel], skipped: [] };
  }

  return { wired: [], skipped: ["no Vercel rewrite injection point"] };
}

/** Wire Lab middleware, Vite dev proxy, and Vercel production rewrites. */
export async function wireLabStack(options: WireLabStackOptions): Promise<WireLabResult> {
  const { root, config } = options;
  if (config.lab?.enabled === false) {
    return { wired: [], skipped: ["lab disabled in config"] };
  }

  const scan = options.scan ?? (await scanProject(root));
  const wired: string[] = [];
  const skipped: string[] = [];

  const middleware = await wireLabMiddleware({ root, config, scan });
  wired.push(...middleware.wired.map((f) => `lab middleware: ${f}`));
  skipped.push(...middleware.skipped);

  const vite = await wireViteLabProxy({ root, config, scan });
  wired.push(...vite.wired.map((f) => `vite lab proxy: ${f}`));
  skipped.push(...vite.skipped);

  const vercel = await wireVercelLabRewrites({ root, config, scan });
  wired.push(...vercel.wired.map((f) => `vercel lab rewrites: ${f}`));
  skipped.push(...vercel.skipped);

  if (wired.length === 0) {
    skipped.push(
      `run npx dna lab serve — or mount createLabMiddleware and proxy ${LAB_PROXY_PATHS.join(", ")}`,
    );
  }

  return { wired, skipped };
}
