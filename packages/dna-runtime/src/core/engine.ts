import { randomUUID } from "node:crypto";
import type { RuntimeEvent, ClassifiedIssue } from "@superhumaan/dna-config";
import { EventTracker, resetImmuneCache } from "@superhumaan/dna-immune";
import { processRuntimeEvent } from "../pipeline.js";
import { redactSensitive } from "./redact.js";

export interface DnaRuntimeConfig {
  projectId: string;
  projectRoot?: string;
  environment?: string;
  release?: string;
  dnaRoot?: string;
  github?: { enabled: boolean };
  aiRepair?: { enabled: boolean };
  slowRequestThresholdMs?: number;
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

export function startEngine(engine: RuntimeEngine, config: DnaRuntimeConfig): void {
  engine.config = config;
  if (engine.started) return;
  engine.started = true;
  resetImmuneCache();

  if (!processHooksRegistered) {
    processHooksRegistered = true;

    process.on("uncaughtException", (error: Error) => {
      const event = createEvent(engine, "uncaught_exception", error.message, {
        stack: error.stack,
      });
      void trackAndEmit(engine, event);
    });

    process.on("unhandledRejection", (reason: unknown) => {
      const message = reason instanceof Error ? reason.message : String(reason);
      const stack = reason instanceof Error ? reason.stack : undefined;
      const event = createEvent(engine, "unhandled_rejection", message, { stack });
      void trackAndEmit(engine, event);
    });

    const memInterval = setInterval(() => {
      const usage = process.memoryUsage();
      const heapUsedMb = usage.heapUsed / 1024 / 1024;
      if (heapUsedMb > 512) {
        const event = createEvent(engine, "memory_spike", `Heap usage: ${heapUsedMb.toFixed(1)}MB`);
        void trackAndEmit(engine, event);
      }
    }, 60_000);

    memInterval.unref();
  }
}

export function createEvent(
  engine: RuntimeEngine,
  type: RuntimeEvent["type"],
  message: string,
  extra: Partial<RuntimeEvent> = {},
): RuntimeEvent {
  return {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    type,
    message: redactSensitive(message),
    environment: engine.config.environment,
    release: engine.config.release,
    ...extra,
    stack: extra.stack ? redactSensitive(extra.stack) : undefined,
  };
}

export async function trackAndEmit(
  engine: RuntimeEngine,
  event: RuntimeEvent,
): Promise<ClassifiedIssue> {
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
}

export function observeRequest(engine: RuntimeEngine, observation: RequestObservation): void {
  const slowThreshold = engine.config.slowRequestThresholdMs ?? 3000;
  const { endpoint, method, statusCode, durationMs } = observation;

  if (durationMs > slowThreshold) {
    void trackAndEmit(
      engine,
      createEvent(engine, "slow_request", `Slow request: ${durationMs}ms`, {
        endpoint,
        method,
        statusCode,
        durationMs,
      }),
    );
  }

  if (statusCode >= 500) {
    void trackAndEmit(
      engine,
      createEvent(engine, "request_error", `HTTP ${statusCode}`, {
        endpoint,
        method,
        statusCode,
        durationMs,
      }),
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
        }),
      );
    }
  }
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
    }),
  );
}

export function resetEngine(engine: RuntimeEngine): void {
  engine.started = false;
  engine.tracker.reset();
  engine.config = { projectId: "test" };
  resetImmuneCache();
}
