import type {
  RuntimeBreadcrumb,
  RuntimeEvent,
  RuntimeStackFrame,
} from "@superhumaan/dna-config";
import { redactSensitive } from "./core/redact.js";

const MAX_FRAMES = 40;
const MAX_BREADCRUMBS = 50;
const MAX_BODY = 1000;

export function parseStackFrames(stack?: string): RuntimeStackFrame[] {
  if (!stack) return [];
  const frames: RuntimeStackFrame[] = [];
  for (const line of stack.split("\n")) {
    const trimmed = line.trim();
    // at fn (file:line:col) OR at file:line:col
    const withFn = trimmed.match(/^at\s+(.+?)\s+\((.+):(\d+):(\d+)\)$/);
    const bare = trimmed.match(/^at\s+(.+):(\d+):(\d+)$/);
    const v8 = trimmed.match(/^at\s+(.+)$/);
    if (withFn) {
      const filename = withFn[2] ?? "";
      frames.push({
        function: withFn[1],
        filename,
        lineno: Number(withFn[3]),
        colno: Number(withFn[4]),
        inApp: isInApp(filename),
      });
    } else if (bare) {
      const filename = bare[1] ?? "";
      frames.push({
        filename,
        lineno: Number(bare[2]),
        colno: Number(bare[3]),
        inApp: isInApp(filename),
      });
    } else if (v8 && trimmed.startsWith("at ")) {
      frames.push({ function: v8[1], inApp: false });
    }
    if (frames.length >= MAX_FRAMES) break;
  }
  return frames;
}

function isInApp(filename: string): boolean {
  if (!filename) return false;
  if (filename.includes("node_modules")) return false;
  return (
    filename.includes("/src/") ||
    filename.includes("/backend/") ||
    filename.includes("/app/") ||
    filename.includes("/packages/") ||
    !filename.startsWith("node:")
  );
}

export function clampBreadcrumbs(breadcrumbs?: RuntimeBreadcrumb[]): RuntimeBreadcrumb[] | undefined {
  if (!breadcrumbs?.length) return undefined;
  return breadcrumbs.slice(-MAX_BREADCRUMBS).map((b) => ({
    ...b,
    message: redactSensitive(String(b.message ?? "")).slice(0, 300),
  }));
}

export function truncateBody(body?: string): string | undefined {
  if (!body) return undefined;
  return redactSensitive(body).slice(0, MAX_BODY);
}

export function enrichRuntimeEvent(event: RuntimeEvent): RuntimeEvent {
  const frames = event.frames?.length ? event.frames.slice(0, MAX_FRAMES) : parseStackFrames(event.stack);
  return {
    ...event,
    message: redactSensitive(event.message),
    stack: event.stack ? redactSensitive(event.stack) : undefined,
    frames: frames.length ? frames : undefined,
    breadcrumbs: clampBreadcrumbs(event.breadcrumbs),
    responseBody: truncateBody(event.responseBody),
    request: event.request
      ? {
          ...event.request,
          bodySnippet: truncateBody(event.request.bodySnippet),
          headers: sanitizeHeaders(event.request.headers),
        }
      : undefined,
  };
}

function sanitizeHeaders(headers?: Record<string, string>): Record<string, string> | undefined {
  if (!headers) return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) {
    const key = k.toLowerCase();
    if (key === "authorization" || key === "cookie" || key.includes("token") || key.includes("secret")) {
      out[k] = "[REDACTED]";
    } else {
      out[k] = redactSensitive(String(v)).slice(0, 200);
    }
  }
  return out;
}

export function browserContexts(payload: Record<string, unknown>): Record<string, Record<string, unknown>> {
  const ua = typeof payload.userAgent === "string" ? payload.userAgent : undefined;
  return {
    browser: {
      userAgent: ua,
      language: payload.language,
      online: payload.online,
    },
    os: {
      platform: payload.platform,
    },
    page: {
      url: payload.url,
      referrer: payload.referrer,
      title: payload.title,
    },
  };
}
