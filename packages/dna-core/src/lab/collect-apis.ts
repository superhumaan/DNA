import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { fileExists } from "../fs.js";
import { glob } from "../glob.js";
import { DNA_LAB_API_PREFIX } from "@superhumaan/dna-config";
import { readProbeStore, type LabProbeCall } from "./collect-probe.js";
import { thirdPartyEvents } from "./collect-aggregates.js";
import { readRuntimeRecords } from "../storage/runtime-db.js";

const P = DNA_LAB_API_PREFIX;

export interface LabOpenApiOperation {
  method: string;
  path: string;
  summary?: string;
  description?: string;
  usage?: string;
  received?: string;
  sent?: string;
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

/** Full Lab HTTP surface — keep in sync with `lab/server.ts` route handlers. */
export const LAB_OPERATIONS: LabOpenApiOperation[] = [
  {
    method: "GET",
    path: `${P}/client.js`,
    summary: "Lab client JS",
    description: "Serves the Lab dashboard JavaScript bundle (cache-busted).",
    usage: "Loaded by the Lab HTML shell. Public (no session). Prefer Cache-Control: no-cache.",
    received: "No body. Optional query `?v=<cacheBust>` for cache busting.",
    sent: "200 application/javascript — dashboard client source. Headers: X-Dna-Version, X-Dna-Lab-Ui.",
    tags: ["Assets"],
    source: "lab",
  },
  {
    method: "GET",
    path: `${P}/styles.css`,
    summary: "Lab styles",
    description: "Serves the Lab dashboard CSS.",
    usage: "Loaded by the Lab HTML shell. Public (no session).",
    received: "No body. Optional query `?v=<cacheBust>`.",
    sent: "200 text/css — Lab stylesheet. Headers: X-Dna-Version, X-Dna-Lab-Ui.",
    tags: ["Assets"],
    source: "lab",
  },
  {
    method: "GET",
    path: `${P}/health`,
    summary: "Lab health",
    description: "Liveness/readiness for Lab state backend and runtime identity.",
    usage: "Public. Used by probes, gateways, and operators (`curl …/health`).",
    received: "No body.",
    sent: "200 `{ ok, stateBackend, instanceCount, dnaVersion, … }` or 503 `{ ok: false, error, … }` when state is unreachable.",
    tags: ["Lab"],
    source: "lab",
  },
  {
    method: "GET",
    path: `${P}/bootstrap`,
    summary: "Session bootstrap",
    description: "Initial client payload: auth state, pairing mode, install warnings, Lab path.",
    usage: "Public. Called first by the Lab UI on every load (localMode or remote).",
    received: "No body. Cookie session optional — reflects authenticated when present.",
    sent: "200 `{ localMode, authenticated, user?, labPath, pairing, dnaVersion, installs, installWarnings, … }`.",
    tags: ["Lab"],
    source: "lab",
  },
  {
    method: "GET",
    path: `${P}/installs`,
    summary: "DNA install scan",
    description: "Reports discovered `@superhumaan/dna-by-humaan` install paths and versions.",
    usage: "Public (served before auth gate). Lab Installs tab and runtime identity checks.",
    received: "No body.",
    sent: "200 runtime payload including `installs` summary (paths, versions, stale/multi-version flags).",
    tags: ["Lab"],
    source: "lab",
  },
  {
    method: "GET",
    path: `${P}/data`,
    summary: "Dashboard poll payload",
    description: "Aggregated Lab dashboard data (issues, events, doctor, quality, etc.) for polling.",
    usage: "Auth required when not local. Lab UI polls with `If-None-Match` for cheap 304s.",
    received: "Headers: optional `If-None-Match: <etag>`.",
    sent: "200 JSON dashboard payload + `ETag` / Cache-Control, or 304 Not Modified when unchanged. 401 when unauthorized.",
    tags: ["Lab"],
    source: "lab",
  },
  {
    method: "GET",
    path: `${P}/intelligence`,
    summary: "Impressions + CellularMemory",
    description: "Lists project intelligence markdown files under Impressions and CellularMemory.",
    usage: "Auth required when not local. Lab Impressions / Memory tabs.",
    received: "No body.",
    sent: "200 `{ impressions: FileMeta[], cellularMemory: FileMeta[] }` (paths, bytes, mtime).",
    tags: ["Lab"],
    source: "lab",
  },
  {
    method: "GET",
    path: `${P}/coverage`,
    summary: "Coverage detail",
    description: "Detailed code coverage breakdown (files, packages, distribution).",
    usage: "Auth required when not local. Lab Coverage tab.",
    received: "No body.",
    sent: "200 `{ summary, files, packages, distribution }` (empty arrays when no report).",
    tags: ["Lab"],
    source: "lab",
  },
  {
    method: "GET",
    path: `${P}/apis`,
    summary: "API explorer payload",
    description: "OpenAPI-style catalog of Lab (+ project) operations plus live/probe traffic.",
    usage: "Auth required when not local. Lab APIs tab.",
    received: "No body.",
    sent: "200 `{ openapiSource, operations[], labSpec, live[], probes[], stats }`.",
    tags: ["Lab"],
    source: "lab",
  },
  {
    method: "GET",
    path: `${P}/probe`,
    summary: "Visit-gated probes",
    description: "Runs (or returns cached) visit-gated HTTP probes against Lab endpoints.",
    usage: "Auth required when not local. Triggered when Lab opens; TTL ~5h. Pass `?force=1` to re-run.",
    received: "Query: optional `force=1`.",
    sent: "200 `{ skipped, ttlHours, lastProbeAt, results[] }` each result has method, path, ok, statusCode, durationMs, responsePreview.",
    tags: ["Lab"],
    source: "lab",
  },
  {
    method: "GET",
    path: `${P}/releases`,
    summary: "List releases",
    description: "Merges GitHub Releases with locally recorded Lab releases.",
    usage: "Auth required when not local. Lab Releases tab.",
    received: "No body.",
    sent: "200 `{ releases[], githubCount, storeCount }` (up to 50, newest preferred).",
    tags: ["Lab"],
    source: "lab",
  },
  {
    method: "POST",
    path: `${P}/releases`,
    summary: "Record release",
    description: "Records a release version (and optional git SHA / notes) into Lab store.",
    usage: "Auth required when not local. Called by CI/ship hooks or operators.",
    received: "JSON body: `{ version, gitSha?, environment?, notes? }`. Max body size enforced by Lab.",
    sent: "200 `{ ok: true }`. 401 when unauthorized.",
    tags: ["Lab"],
    source: "lab",
  },
  {
    method: "POST",
    path: `${P}/sourcemaps`,
    summary: "Upsert source map meta",
    description: "Stores metadata for an uploaded source map tied to a release.",
    usage: "Auth required when not local. Release / debug tooling.",
    received: "JSON body: `{ releaseId, file, sizeBytes? }`.",
    sent: "200 `{ ok: true }`. 401 when unauthorized.",
    tags: ["Lab"],
    source: "lab",
  },
  {
    method: "GET",
    path: `${P}/issues/:issueId/events`,
    summary: "Issue event history",
    description: "Returns runtime events for a single issue fingerprint/id.",
    usage: "Auth required when not local. Lab Issues detail drawer.",
    received: "Path param `issueId` (URL-encoded, max 256 chars).",
    sent: "200 `{ events[] }`. 400 invalid id. 401 when unauthorized.",
    tags: ["Lab"],
    source: "lab",
  },
  {
    method: "GET",
    path: `${P}/pairing/status/:pairingId`,
    summary: "Pairing status",
    description: "Checks whether a pairing session has been verified.",
    usage: "Public. Polled during device pairing before account creation.",
    received: "Path param `pairingId`.",
    sent: "200 `{ verified: boolean }`.",
    tags: ["Auth"],
    source: "lab",
  },
  {
    method: "POST",
    path: `${P}/pairing/init`,
    summary: "Start pairing",
    description: "Registers a pairing challenge on the production Lab gateway.",
    usage: "Public. First step of paste-verify pairing from a local Lab.",
    received: "JSON body: `{ pairingId, codeHash, projectId?, callbackUrl? }`.",
    sent: "200/400 result object from registerPairingOnProduction (`ok`, error fields).",
    tags: ["Auth"],
    source: "lab",
  },
  {
    method: "POST",
    path: `${P}/pairing/verify`,
    summary: "Verify pairing code",
    description: "Verifies the user-entered pairing code and may fire the callback to local Lab.",
    usage: "Public. Paste-verify flow after init.",
    received: "JSON body: `{ pairingId, code }`.",
    sent: "200/400 `{ ok, error?, message }` — on success message invites account creation.",
    tags: ["Auth"],
    source: "lab",
  },
  {
    method: "POST",
    path: `${P}/pairing/callback`,
    summary: "Pairing callback",
    description: "Signed callback from production Lab marking local pairing as verified.",
    usage: "Public but signature-gated (`x-dna-lab-signature`). Not called by browser UI directly.",
    received: "JSON `{ pairingId, verified }`. Header `x-dna-lab-signature` must match local codeHash.",
    sent: "200 `{ ok: true, pairingId }` or 401 if signature invalid.",
    tags: ["Auth"],
    source: "lab",
  },
  {
    method: "POST",
    path: `${P}/auth/otp`,
    summary: "Request OTP",
    description: "Starts login or register OTP for an email address.",
    usage: "Public. Lab sign-in / register forms. In local non-prod, `devOtp` may be returned.",
    received: "JSON `{ email, purpose: \"login\" | \"register\" }`.",
    sent: "200 `{ ok, message, devOtp? }` or 400 `{ error }` (e.g. unknown login email).",
    tags: ["Auth"],
    source: "lab",
  },
  {
    method: "POST",
    path: `${P}/auth/login`,
    summary: "Login",
    description: "Completes password + OTP login and sets the Lab session cookie.",
    usage: "Public. Lab sign-in form.",
    received: "JSON `{ email, password, otp }`.",
    sent: "200 `{ ok: true }` + `Set-Cookie` session, or 400 `{ error }`.",
    tags: ["Auth"],
    source: "lab",
  },
  {
    method: "POST",
    path: `${P}/auth/register`,
    summary: "Register",
    description: "Creates a Lab account after verified pairing, then sets session cookie.",
    usage: "Public. Lab register form after successful pairing.",
    received: "JSON `{ pairingId, name, email, password, otp }`.",
    sent: "200 `{ ok: true }` + `Set-Cookie` session, or 400 `{ error }`.",
    tags: ["Auth"],
    source: "lab",
  },
  {
    method: "POST",
    path: `${P}/auth/logout`,
    summary: "Logout",
    description: "Invalidates the current session and clears the Lab session cookie.",
    usage: "Auth cookie present. Lab UI logout action.",
    received: "No body required. Cookie carries session id.",
    sent: "200 `{ ok: true }` + `Set-Cookie` clearing the session.",
    tags: ["Auth"],
    source: "lab",
  },
];

/** Expected method+path keys for completeness tests (mirrors LAB_OPERATIONS). */
export function labOperationKeys(ops: LabOpenApiOperation[] = LAB_OPERATIONS): string[] {
  return ops.map((o) => `${o.method} ${o.path}`).sort();
}

function labSelfSpec() {
  const paths: Record<string, unknown> = {};
  for (const op of LAB_OPERATIONS) {
    const key = op.path;
    const methods = (paths[key] as Record<string, unknown>) || {};
    methods[op.method.toLowerCase()] = {
      summary: op.summary,
      description: op.description,
      tags: op.tags,
      "x-dna-usage": op.usage,
      "x-dna-received": op.received,
      "x-dna-sent": op.sent,
      responses: { "200": { description: op.sent || "OK" } },
    };
    paths[key] = methods;
  }
  return {
    openapi: "3.0.3",
    info: { title: "DNA Lab API", version: "1.0.0" },
    paths,
  };
}

function summarizeRequestBody(op: Record<string, unknown>): string | undefined {
  const rb = op.requestBody;
  if (!rb || typeof rb !== "object") return undefined;
  const content = (rb as { content?: Record<string, unknown> }).content;
  if (!content || typeof content !== "object") {
    return JSON.stringify(rb).slice(0, 500);
  }
  const parts: string[] = [];
  for (const [media, mediaObj] of Object.entries(content)) {
    const schema = (mediaObj as { schema?: unknown; example?: unknown })?.schema;
    const example = (mediaObj as { example?: unknown })?.example;
    if (example != null) {
      parts.push(`${media} example: ${JSON.stringify(example).slice(0, 400)}`);
    } else if (schema != null) {
      parts.push(`${media} schema: ${JSON.stringify(schema).slice(0, 400)}`);
    } else {
      parts.push(media);
    }
  }
  return parts.length ? parts.join("\n") : undefined;
}

function summarizeResponses(op: Record<string, unknown>): string | undefined {
  const responses = op.responses;
  if (!responses || typeof responses !== "object") return undefined;
  const parts: string[] = [];
  for (const [code, resp] of Object.entries(responses as Record<string, unknown>)) {
    if (!resp || typeof resp !== "object") {
      parts.push(`${code}`);
      continue;
    }
    const r = resp as { description?: string; content?: Record<string, { example?: unknown; schema?: unknown }> };
    const desc = r.description || "";
    const json = r.content?.["application/json"];
    let body = "";
    if (json?.example != null) body = ` example: ${JSON.stringify(json.example).slice(0, 280)}`;
    else if (json?.schema != null) body = ` schema: ${JSON.stringify(json.schema).slice(0, 280)}`;
    parts.push(`${code}${desc ? ` — ${desc}` : ""}${body}`);
  }
  return parts.length ? parts.join("\n") : undefined;
}

function operationsFromOpenApi(doc: Record<string, unknown>, source: "project"): LabOpenApiOperation[] {
  const paths = doc.paths;
  if (!paths || typeof paths !== "object") return [];
  const out: LabOpenApiOperation[] = [];
  for (const [path, methods] of Object.entries(paths as Record<string, Record<string, unknown>>)) {
    if (!methods || typeof methods !== "object") continue;
    for (const [method, raw] of Object.entries(methods)) {
      if (!["get", "post", "put", "patch", "delete", "head", "options"].includes(method)) continue;
      const o = (raw || {}) as Record<string, unknown>;
      const summary = typeof o.summary === "string" ? o.summary : undefined;
      const description =
        typeof o.description === "string"
          ? o.description
          : typeof o["x-dna-description"] === "string"
            ? String(o["x-dna-description"])
            : summary;
      const usage =
        typeof o["x-dna-usage"] === "string"
          ? String(o["x-dna-usage"])
          : Array.isArray(o.tags)
            ? `Project API · tags: ${o.tags.map(String).join(", ")}`
            : "Project OpenAPI operation.";
      const received =
        typeof o["x-dna-received"] === "string"
          ? String(o["x-dna-received"])
          : summarizeRequestBody(o) ||
            (Array.isArray(o.parameters) ? `Parameters: ${JSON.stringify(o.parameters).slice(0, 500)}` : "See OpenAPI parameters / requestBody.");
      const sent =
        typeof o["x-dna-sent"] === "string" ? String(o["x-dna-sent"]) : summarizeResponses(o) || "See OpenAPI responses.";
      out.push({
        method: method.toUpperCase(),
        path,
        summary,
        description,
        usage,
        received,
        sent,
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
  const operations = [...LAB_OPERATIONS, ...projectOps];

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
