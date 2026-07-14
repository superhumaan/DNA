import { randomUUID } from "node:crypto";
import type { RuntimeEvent, ClassifiedIssue } from "@superhumaan/dna-config";
import { EventTracker, resetImmuneCache } from "@superhumaan/dna-immune";
import { processRuntimeEvent } from "../pipeline.js";
import { isBenignRuntimeError, isBenignRuntimeMessage } from "./noise.js";
import { redactSensitive } from "./redact.js";
import { enrichRuntimeEvent, truncateBody } from "../enrich.js";

export interface DnaRuntimeConfig {
  projectId: string;
  projectRoot?: string;
  environment?: string;
  release?: string;
  dnaRoot?: string;
  github?: { enabled: boolean };
  aiRepair?: { enabled: boolean };
  slowRequestThresholdMs?: number;
  /** Patch global fetch to capture outbound 3rd-party responses (default true). */
  captureOutbound?: boolean;
  onEvent?: (event: RuntimeEvent) => void;
  onIssue?: (issue: ClassifiedIssue) => void;
  onPipelineComplete?: (result: Awaited<ReturnType<typeof processRuntimeEvent>>) => void;
}

export interface RuntimeEngine {
  config: DnaRuntimeConfig;
  tracker: EventTracker;
  started: boolean;
}

export function createEngine(): RuntimeEngine {
  return {
    config: { projectId: "unknown" },
    tracker: new EventTracker(),
    started: false,
  };
}

let processHooksRegistered = false;
let fetchPatched = false;
const originalFetch: typeof globalThis.fetch | undefined =
  typeof globalThis.fetch === "function" ? globalThis.fetch.bind(globalThis) : undefined;

export function startEngine(engine: RuntimeEngine, config: DnaRuntimeConfig): void {
  engine.config = config;
  if (engine.started) return;
  engine.started = true;
  resetImmuneCache();

  if (!processHooksRegistered) {
    processHooksRegistered = true;

    process.on("uncaughtException", (error: Error) => {
      // Client closed the socket mid-write — not an application defect
      if (isBenignRuntimeError(error)) return;
      const event = createEvent(engine, "uncaught_exception", error.message, {
        stack: error.stack,
        source: "server",
      });
      void trackAndEmit(engine, event);
    });

    process.on("unhandledRejection", (reason: unknown) => {
      if (isBenignRuntimeError(reason)) return;
      const message = reason instanceof Error ? reason.message : String(reason);
      const stack = reason instanceof Error ? reason.stack : undefined;
      const event = createEvent(engine, "unhandled_rejection", message, {
        stack,
        source: "server",
      });
      void trackAndEmit(engine, event);
    });

    const memInterval = setInterval(() => {
      const usage = process.memoryUsage();
      const heapUsedMb = usage.heapUsed / 1024 / 1024;
      if (heapUsedMb > 512) {
        const event = createEvent(engine, "memory_spike", `Heap usage: ${heapUsedMb.toFixed(1)}MB`, {
          source: "server",
        });
        void trackAndEmit(engine, event);
      }
    }, 60_000);

    memInterval.unref();
  }

  if (config.captureOutbound !== false && !fetchPatched && originalFetch) {
    fetchPatched = true;
    installFetchCapture(engine);
  }
}

function isLocalOrDnaUrl(url: string): boolean {
  try {
    const u = new URL(url, "http://localhost");
    if (u.pathname.includes("/api/dna/")) return true;
    const host = u.hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return true;
  }
}

function providerFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname;
    if (host.includes("openai")) return "openai";
    if (host.includes("anthropic")) return "anthropic";
    if (host.includes("stripe")) return "stripe";
    if (host.includes("github")) return "github";
    if (host.includes("googleapis")) return "google";
    return host;
  } catch {
    return "unknown";
  }
}

function installFetchCapture(engine: RuntimeEngine): void {
  if (!originalFetch) return;
  globalThis.fetch = async (
    input: string | URL | Request,
    init?: RequestInit,
  ): Promise<Response> => {
    const started = Date.now();
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : (input as Request).url;

    const response = await originalFetch(input, init);
    const durationMs = Date.now() - started;

    if (!isLocalOrDnaUrl(url)) {
      const status = response.status;
      const shouldCapture =
        status >= 400 || durationMs > (engine.config.slowRequestThresholdMs ?? 3000);
      let bodySnippet: string | undefined;
      try {
        const clone = response.clone();
        bodySnippet = truncateBody(await clone.text());
      } catch {
        bodySnippet = undefined;
      }
      // Errors/slow always; healthy outbound sampled at 5% to avoid DB spam
      if (shouldCapture || Math.random() < 0.05) {
        observeOutbound(engine, {
          url,
          method: init?.method ?? "GET",
          statusCode: status,
          durationMs,
          responseBody: bodySnippet,
          provider: providerFromUrl(url),
        });
      }
    }

    return response;
  };
}

export function createEvent(
  engine: RuntimeEngine,
  type: RuntimeEvent["type"],
  message: string,
  extra: Partial<RuntimeEvent> = {},
): RuntimeEvent {
  return enrichRuntimeEvent({
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    type,
    message: redactSensitive(message),
    environment: engine.config.environment,
    release: engine.config.release,
    source: extra.source ?? "server",
    ...extra,
    stack: extra.stack ? redactSensitive(extra.stack) : undefined,
  });
}

export async function trackAndEmit(
  engine: RuntimeEngine,
  event: RuntimeEvent,
): Promise<ClassifiedIssue | null> {
  if (isBenignRuntimeMessage(event.message)) {
    return null;
  }

  const projectRoot = engine.config.projectRoot ?? process.cwd();
  const dnaRoot = engine.config.dnaRoot ?? `${projectRoot}/.DNA`;

  engine.config.onEvent?.(event);

  const result = await processRuntimeEvent(event, {
    projectRoot,
    dnaRoot,
    tracker: engine.tracker,
  });

  engine.config.onIssue?.(result.issue);
  engine.config.onPipelineComplete?.(result);
  return result.issue;
}

export interface RequestObservation {
  endpoint: string;
  method: string;
  statusCode: number;
  durationMs: number;
  requestId?: string;
  responseBody?: string;
  upstream?: string;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  bodySnippet?: string;
}

export function observeRequest(engine: RuntimeEngine, observation: RequestObservation): void {
  const slowThreshold = engine.config.slowRequestThresholdMs ?? 3000;
  const {
    endpoint,
    method,
    statusCode,
    durationMs,
    requestId,
    responseBody,
    upstream,
    headers,
    query,
    bodySnippet,
  } = observation;

  const httpExtra: Partial<RuntimeEvent> = {
    endpoint,
    method,
    statusCode,
    durationMs,
    requestId,
    responseBody: truncateBody(responseBody),
    upstream,
    source: "server",
    request: {
      url: endpoint,
      method,
      statusCode,
      headers,
      query,
      bodySnippet: truncateBody(bodySnippet),
    },
    contexts: {
      runtime: {
        node: process.version,
        pid: process.pid,
      },
      app: {
        environment: engine.config.environment,
        release: engine.config.release,
        projectId: engine.config.projectId,
      },
    },
  };

  if (durationMs > slowThreshold) {
    void trackAndEmit(
      engine,
      createEvent(engine, "slow_request", `Slow request: ${durationMs}ms`, httpExtra),
    );
  }

  if (statusCode >= 500) {
    void trackAndEmit(
      engine,
      createEvent(engine, "request_error", `HTTP ${statusCode}`, httpExtra),
    );
  }

  if ([401, 403].includes(statusCode)) {
    const authKey = `auth:${endpoint}`;
    const count = engine.tracker.record(authKey, {
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      type: "repeated_error",
      message: `Auth failure ${statusCode}`,
      endpoint,
      method,
      statusCode,
    });
    if (count >= 10) {
      void trackAndEmit(
        engine,
        createEvent(engine, "repeated_error", `Repeated auth failures on ${endpoint}`, {
          endpoint,
          method,
          statusCode,
          source: "server",
        }),
      );
    }
  }
}

export interface OutboundObservation {
  url: string;
  method: string;
  statusCode: number;
  durationMs: number;
  responseBody?: string;
  provider?: string;
}

export function observeOutbound(engine: RuntimeEngine, observation: OutboundObservation): void {
  const { url, method, statusCode, durationMs, responseBody, provider } = observation;
  void trackAndEmit(
    engine,
    createEvent(
      engine,
      "third_party_response",
      `${provider ?? "outbound"} ${method} ${statusCode} ${url}`,
      {
        endpoint: url,
        method,
        statusCode,
        durationMs,
        responseBody: truncateBody(responseBody),
        provider,
        source: "outbound",
        tags: {
          provider: provider ?? "unknown",
          status: String(statusCode),
        },
        request: {
          url,
          method,
          statusCode,
          bodySnippet: truncateBody(responseBody),
        },
        contexts: {
          outbound: {
            provider: provider ?? "unknown",
            durationMs,
          },
        },
      },
    ),
  );
}

export function captureError(
  engine: RuntimeEngine,
  error: Error,
  context: { endpoint?: string; method?: string; statusCode?: number },
): void {
  void trackAndEmit(
    engine,
    createEvent(engine, "request_error", error.message, {
      stack: error.stack,
      endpoint: context.endpoint,
      method: context.method,
      statusCode: context.statusCode ?? 500,
      source: "server",
    }),
  );
}

export function resetEngine(engine: RuntimeEngine): void {
  engine.started = false;
  engine.tracker.reset();
  engine.config = { projectId: "test" };
  resetImmuneCache();
}
