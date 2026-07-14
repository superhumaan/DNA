import type { IncomingMessage, ServerResponse } from "node:http";
import type { RuntimeEvent } from "@superhumaan/dna-config";
import type { RuntimeEngine } from "../core/engine.js";
import { createEvent, trackAndEmit } from "../core/engine.js";
import { browserContexts, enrichRuntimeEvent, parseStackFrames } from "../enrich.js";
import { redactSensitive } from "../core/redact.js";

const MAX_BODY = 64_000;

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buf.length;
    if (size > MAX_BODY) throw new Error("payload too large");
    chunks.push(buf);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf-8")) as Record<string, unknown>;
}

function send(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asBreadcrumbs(value: unknown): RuntimeEvent["breadcrumbs"] {
  if (!Array.isArray(value)) return undefined;
  return value
    .filter((b) => b && typeof b === "object")
    .slice(-50)
    .map((raw) => {
      const b = raw as Record<string, unknown>;
      return {
        timestamp: asString(b.timestamp) ?? new Date().toISOString(),
        category: asString(b.category) ?? "console",
        message: redactSensitive(String(b.message ?? "")).slice(0, 300),
        level: (asString(b.level) as "info" | "warning" | "error" | "debug" | undefined) ?? "info",
        data: b.data && typeof b.data === "object" ? (b.data as Record<string, unknown>) : undefined,
      };
    });
}

/**
 * Browser / agent ingest: POST /api/dna/runtime
 * Mount via dnaRuntime.ingestHandler() or Express middleware.
 */
export function createRuntimeIngestHandler(engine: RuntimeEngine) {
  return async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
      return;
    }

    if (req.method !== "POST") {
      send(res, 405, { error: "method_not_allowed" });
      return;
    }

    try {
      const payload = await readJson(req);
      const typeRaw = asString(payload.type) ?? "uncaught_exception";
      const type = (
        [
          "uncaught_exception",
          "unhandled_rejection",
          "request_error",
          "slow_request",
          "repeated_error",
          "memory_spike",
          "third_party_response",
        ].includes(typeRaw)
          ? typeRaw
          : "uncaught_exception"
      ) as RuntimeEvent["type"];

      const message = redactSensitive(asString(payload.message) ?? "Browser runtime event");
      const stack = asString(payload.stack);
      const frames =
        Array.isArray(payload.frames) && payload.frames.length
          ? (payload.frames as RuntimeEvent["frames"])
          : parseStackFrames(stack);

      const event = enrichRuntimeEvent(
        createEvent(engine, type, message, {
          stack,
          frames,
          breadcrumbs: asBreadcrumbs(payload.breadcrumbs),
          contexts: {
            ...browserContexts(payload),
            ...(payload.contexts && typeof payload.contexts === "object"
              ? (payload.contexts as Record<string, Record<string, unknown>>)
              : {}),
          },
          tags:
            payload.tags && typeof payload.tags === "object"
              ? (payload.tags as Record<string, string>)
              : undefined,
          extra:
            payload.extra && typeof payload.extra === "object"
              ? (payload.extra as Record<string, unknown>)
              : undefined,
          endpoint: asString(payload.url) ?? asString(payload.endpoint) ?? "browser",
          method: asString(payload.method),
          statusCode: typeof payload.statusCode === "number" ? payload.statusCode : undefined,
          durationMs: typeof payload.durationMs === "number" ? payload.durationMs : undefined,
          provider: asString(payload.provider),
          responseBody: asString(payload.responseBody),
          source: "browser",
          request: {
            url: asString(payload.url),
            method: asString(payload.method) ?? "GET",
            statusCode: typeof payload.statusCode === "number" ? payload.statusCode : undefined,
          },
        }),
      );

      const issue = await trackAndEmit(engine, event);
      send(res, 202, {
        ok: true,
        fingerprint: issue?.fingerprint,
        repeatCount: issue?.repeatCount,
        issueId: issue?.id,
      });
    } catch (err) {
      send(res, 400, {
        error: "invalid_payload",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  };
}

/** Express-compatible middleware for POST /api/dna/runtime */
export function createExpressIngestMiddleware(engine: RuntimeEngine) {
  const handler = createRuntimeIngestHandler(engine);
  return (req: IncomingMessage & { url?: string; path?: string }, res: ServerResponse, next: () => void) => {
    const path = req.path ?? req.url?.split("?")[0] ?? "";
    if (path === "/api/dna/runtime" || path.endsWith("/api/dna/runtime")) {
      void handler(req, res);
      return;
    }
    next();
  };
}
