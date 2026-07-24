import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { fileExists } from "../fs.js";
import { glob } from "../glob.js";
import { DNA_LAB_API_PREFIX } from "@superhumaan/dna-config";
import { readProbeStore, type LabProbeCall } from "./collect-probe.js";
import { thirdPartyEvents } from "./collect-aggregates.js";
import { readRuntimeRecords } from "../storage/runtime-db.js";

export interface LabOpenApiOperation {
  method: string;
  path: string;
  summary?: string;
  tags: string[];
  source: "lab" | "project";
}

export interface LabApisPayload {
  openapiSource: string | null;
  operations: LabOpenApiOperation[];
  labSpec: { openapi: string; info: { title: string; version: string }; paths: Record<string, unknown> };
  live: Array<Record<string, unknown>>;
  probes: LabProbeCall[];
  stats: {
    operationCount: number;
    liveCount: number;
    probeOk: number;
    probeFail: number;
    lastProbeAt: string | null;
  };
}

const LAB_PATHS: LabOpenApiOperation[] = [
  { method: "GET", path: `${DNA_LAB_API_PREFIX}/health`, summary: "Lab health", tags: ["Lab"], source: "lab" },
  { method: "GET", path: `${DNA_LAB_API_PREFIX}/bootstrap`, summary: "Session bootstrap", tags: ["Lab"], source: "lab" },
  { method: "GET", path: `${DNA_LAB_API_PREFIX}/data`, summary: "Dashboard poll payload", tags: ["Lab"], source: "lab" },
  { method: "GET", path: `${DNA_LAB_API_PREFIX}/installs`, summary: "DNA install scan", tags: ["Lab"], source: "lab" },
  { method: "GET", path: `${DNA_LAB_API_PREFIX}/intelligence`, summary: "Impressions + CellularMemory", tags: ["Lab"], source: "lab" },
  { method: "GET", path: `${DNA_LAB_API_PREFIX}/coverage`, summary: "Coverage detail", tags: ["Lab"], source: "lab" },
  { method: "GET", path: `${DNA_LAB_API_PREFIX}/apis`, summary: "API explorer payload", tags: ["Lab"], source: "lab" },
  { method: "GET", path: `${DNA_LAB_API_PREFIX}/probe`, summary: "Visit-gated probes", tags: ["Lab"], source: "lab" },
  { method: "GET", path: `${DNA_LAB_API_PREFIX}/releases`, summary: "GitHub + store releases", tags: ["Lab"], source: "lab" },
  { method: "POST", path: `${DNA_LAB_API_PREFIX}/auth/login`, summary: "Login", tags: ["Auth"], source: "lab" },
  { method: "POST", path: `${DNA_LAB_API_PREFIX}/pairing/verify`, summary: "Pairing verify", tags: ["Auth"], source: "lab" },
];

function labSelfSpec() {
  const paths: Record<string, unknown> = {};
  for (const op of LAB_PATHS) {
    const key = op.path;
    const methods = (paths[key] as Record<string, unknown>) || {};
    methods[op.method.toLowerCase()] = {
      summary: op.summary,
      tags: op.tags,
      responses: { "200": { description: "OK" } },
    };
    paths[key] = methods;
  }
  return {
    openapi: "3.0.3",
    info: { title: "DNA Lab API", version: "1.0.0" },
    paths,
  };
}

function operationsFromOpenApi(doc: Record<string, unknown>, source: "project"): LabOpenApiOperation[] {
  const paths = doc.paths;
  if (!paths || typeof paths !== "object") return [];
  const out: LabOpenApiOperation[] = [];
  for (const [path, methods] of Object.entries(paths as Record<string, Record<string, unknown>>)) {
    if (!methods || typeof methods !== "object") continue;
    for (const [method, op] of Object.entries(methods)) {
      if (!["get", "post", "put", "patch", "delete", "head", "options"].includes(method)) continue;
      const o = (op || {}) as { summary?: string; tags?: string[] };
      out.push({
        method: method.toUpperCase(),
        path,
        summary: o.summary,
        tags: Array.isArray(o.tags) ? o.tags.map(String) : ["API"],
        source,
      });
    }
  }
  return out;
}

async function discoverProjectOpenApi(root: string): Promise<{ path: string; doc: Record<string, unknown> } | null> {
  const candidates = [
    "openapi.json",
    "swagger.json",
    "docs/openapi.json",
    "docs/swagger.json",
    ...(await glob("**/openapi.json", { cwd: root, onlyFiles: true })).slice(0, 5),
  ];
  for (const rel of candidates) {
    const abs = join(root, rel);
    if (!(await fileExists(abs))) continue;
    try {
      const doc = JSON.parse(await readFile(abs, "utf8")) as Record<string, unknown>;
      if (doc.openapi || doc.swagger || doc.paths) return { path: rel, doc };
    } catch {
      continue;
    }
  }
  return null;
}

export async function collectLabApis(root: string): Promise<LabApisPayload> {
  const labSpec = labSelfSpec();
  const discovered = await discoverProjectOpenApi(root);
  const projectOps = discovered ? operationsFromOpenApi(discovered.doc, "project") : [];
  const operations = [...LAB_PATHS, ...projectOps];

  const events = await readRuntimeRecords(root, "events").catch(() => [] as unknown[]);
  const live = thirdPartyEvents(events, 80).map((e) => ({
    method: e.method,
    path: e.endpoint || e.message,
    statusCode: e.statusCode,
    durationMs: e.durationMs,
    provider: e.provider || e.source,
    message: e.message,
    responsePreview: String((e as { responseBody?: string }).responseBody || "").slice(0, 280),
    timestamp: e.timestamp,
  }));

  const probe = await readProbeStore(root);
  const probeOk = probe.results.filter((r) => r.ok).length;
  const probeFail = probe.results.length - probeOk;

  return {
    openapiSource: discovered?.path ?? null,
    operations,
    labSpec,
    live,
    probes: probe.results,
    stats: {
      operationCount: operations.length,
      liveCount: live.length,
      probeOk,
      probeFail,
      lastProbeAt: probe.lastProbeAt,
    },
  };
}
