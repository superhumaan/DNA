export const RUNTIME_INSTALL_SNIPPET = `// DNA Runtime — backend + frontend error watching (on by default)
import { dnaRuntime } from "@superhumaan/dna-by-humaan/runtime";

dnaRuntime.start({
  projectId: process.env.DNA_PROJECT_ID ?? "my-project",
  projectRoot: process.cwd(),
  environment: process.env.NODE_ENV ?? "development",
  release: process.env.GIT_SHA,
  github: { enabled: true },
  aiRepair: { enabled: true },
});

// Express:
// app.use(dnaRuntime.express()); // also mounts POST /api/dna/runtime ingest
// app.use(dnaRuntime.errorHandler()); // after routes
// dnaRuntime.observeOutbound({ url, method, statusCode, durationMs, provider }); // optional manual

// Fastify:
// dnaRuntime.attachFastify(fastify);

// NestJS:
// @UseInterceptors(dnaRuntime.nestInterceptor())
// @UseFilters(dnaRuntime.nestExceptionFilter())

// Next.js App Router:
// export const GET = dnaRuntime.withNextHandler(async (request) => { ... });
// export const middleware = dnaRuntime.nextMiddleware();

// Frontend (Vite/React) — import from .DNA/runtime/browser-client.ts
`;

export const BROWSER_RUNTIME_SNIPPET = `/**
 * DNA Browser Runtime — frontend error watching (on by default)
 * Import once in your app entry (main.tsx / layout.tsx).
 */
const DNA_RUNTIME_ENDPOINT = import.meta.env.VITE_DNA_RUNTIME_URL ?? "/api/dna/runtime";

type Breadcrumb = {
  timestamp: string;
  category: string;
  message: string;
  level?: "info" | "warning" | "error" | "debug";
};

const MAX_BREADCRUMBS = 50;
const breadcrumbs: Breadcrumb[] = [];
const lastSent = new Map<string, number>();
const CLIENT_COOLDOWN_MS = 15_000;

function pushBreadcrumb(category: string, message: string, level: Breadcrumb["level"] = "info"): void {
  breadcrumbs.push({
    timestamp: new Date().toISOString(),
    category,
    message: String(message).slice(0, 300),
    level,
  });
  if (breadcrumbs.length > MAX_BREADCRUMBS) breadcrumbs.shift();
}

function pageContext() {
  return {
    url: location.href,
    referrer: document.referrer,
    title: document.title,
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    online: navigator.onLine,
  };
}

export function initDnaBrowserRuntime(options?: { projectId?: string }): void {
  if (typeof window === "undefined") return;
  if ((window as unknown as { __dnaRuntimeInstalled?: boolean }).__dnaRuntimeInstalled) return;
  (window as unknown as { __dnaRuntimeInstalled?: boolean }).__dnaRuntimeInstalled = true;

  const projectId = options?.projectId ?? import.meta.env.VITE_DNA_PROJECT_ID ?? "app";

  const report = (payload: Record<string, unknown>, dedupeKey?: string) => {
    if (dedupeKey) {
      const now = Date.now();
      const prev = lastSent.get(dedupeKey) ?? 0;
      if (now - prev < CLIENT_COOLDOWN_MS) return;
      lastSent.set(dedupeKey, now);
    }

    fetch(DNA_RUNTIME_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        ...pageContext(),
        breadcrumbs: breadcrumbs.slice(),
        projectId,
        source: "browser",
        tags: { ...(payload.tags as object), projectId },
      }),
      keepalive: true,
    }).catch(() => {});
  };

  pushBreadcrumb("navigation", \`load \${location.pathname}\`);

  window.addEventListener("error", (event) => {
    pushBreadcrumb("error", event.message, "error");
    report(
      {
        type: "uncaught_exception",
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        frames: event.filename
          ? [{ filename: event.filename, lineno: event.lineno, colno: event.colno, inApp: true }]
          : undefined,
      },
      \`err:\${event.message}:\${event.filename}:\${event.lineno}\`,
    );
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const message = reason instanceof Error ? reason.message : String(reason);
    const stack = reason instanceof Error ? reason.stack : undefined;
    pushBreadcrumb("error", message, "error");
    report({ type: "unhandled_rejection", message, stack }, \`rej:\${message.slice(0, 80)}\`);
  });

  window.addEventListener("popstate", () => {
    pushBreadcrumb("navigation", \`popstate \${location.pathname}\`);
  });

  document.addEventListener(
    "click",
    (event) => {
      const el = event.target as HTMLElement | null;
      if (!el) return;
      const label =
        el.getAttribute("aria-label") ||
        el.getAttribute("data-testid") ||
        el.tagName.toLowerCase() + (el.id ? \`#\${el.id}\` : "");
      pushBreadcrumb("ui.click", label.slice(0, 120));
    },
    true,
  );

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const started = Date.now();
    const url =
      typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    try {
      const res = await originalFetch(input, init);
      const durationMs = Date.now() - started;
      pushBreadcrumb("fetch", \`\${init?.method ?? "GET"} \${url} → \${res.status}\`);
      if (res.status >= 400 || durationMs > 3000) {
        let body = "";
        try { body = (await res.clone().text()).slice(0, 500); } catch { body = ""; }
        report(
          {
            type: res.status >= 500 ? "request_error" : "third_party_response",
            message: \`Browser fetch \${res.status} \${url}\`,
            url,
            method: init?.method ?? "GET",
            statusCode: res.status,
            durationMs,
            responseBody: body,
            provider: "browser-fetch",
          },
          \`fetch:\${res.status}:\${url.slice(0, 80)}\`,
        );
      }
      return res;
    } catch (err) {
      pushBreadcrumb("fetch", \`failed \${url}\`, "error");
      report(
        {
          type: "request_error",
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
          url,
          method: init?.method ?? "GET",
        },
        \`fetch-fail:\${url.slice(0, 80)}\`,
      );
      throw err;
    }
  };
}
`;

export const ENV_EXAMPLE_SNIPPET = `# DNA Runtime (enabled by default — opt out in .DNA/config.dna.json)
DNA_PROJECT_ID=my-project
GITHUB_TOKEN=          # Optional locally if you use dna github login; required in CI
ANTHROPIC_API_KEY=     # Required for live AI repair (mock until set)
OPENAI_API_KEY=        # Alternative AI provider
VITE_DNA_PROJECT_ID=my-project
VITE_DNA_RUNTIME_URL=/api/dna/runtime

# DNA Lab — production observability at /labs (local: no login)
# Pair production: npx dna register lab --url https://your-app.example.com
DNA_LAB_PATH=/labs
GIT_SHA=               # Release tracking for Lab (v2 source maps)
`;

export const LAB_INSTALL_SNIPPET = `// DNA Lab — production observability at /labs
// Auto-wired by dna init, dna doctor, dna update, and dna lab install:
//   • Express ESM / Fastify: createLabMiddleware on your API server
//   • Express CJS: .DNA/lab/express-wire.cjs (dynamic import — lab is ESM-only)
//   • Vite dev: proxy /labs + /api/dna/labs to the same target as /api
//   • Vercel: rewrites /labs → API origin before SPA fallback
// import { createLabMiddleware } from "@superhumaan/dna-by-humaan/lab";

// Express ESM (mount after helmet / configureExpress, before SPA fallback):
// app.use(createLabMiddleware({ root: process.cwd() }));

// Express CJS — never require("@superhumaan/dna-by-humaan/lab"):
// const { dnaLabMiddleware } = require("../.DNA/lab/express-wire.cjs");
// app.use(dnaLabMiddleware());

// Local dev: http://localhost:<vite-port>/labs — proxied to API (no login)
// Standalone: npx dna lab serve --port 3200
// Production: https://your-app.com/labs — pair with npx dna register lab
`;
