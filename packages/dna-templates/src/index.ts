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
// app.use(dnaRuntime.express());
// app.use(dnaRuntime.errorHandler()); // after routes

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

export function initDnaBrowserRuntime(options?: { projectId?: string }): void {
  if (typeof window === "undefined") return;

  const projectId = options?.projectId ?? import.meta.env.VITE_DNA_PROJECT_ID ?? "app";

  const report = (payload: Record<string, unknown>) => {
    fetch(DNA_RUNTIME_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, projectId, source: "browser" }),
      keepalive: true,
    }).catch(() => {});
  };

  window.addEventListener("error", (event) => {
    report({
      type: "uncaught_exception",
      message: event.message,
      stack: event.error?.stack,
      filename: event.filename,
      lineno: event.colno,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    report({
      type: "unhandled_rejection",
      message: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined,
    });
  });
}
`;

export const ENV_EXAMPLE_SNIPPET = `# DNA Runtime (enabled by default — opt out in .DNA/config.dna.json)
DNA_PROJECT_ID=my-project
GITHUB_TOKEN=          # Required for GitHub issues + repair PRs
ANTHROPIC_API_KEY=     # Required for live AI repair (mock until set)
OPENAI_API_KEY=        # Alternative AI provider
VITE_DNA_PROJECT_ID=my-project
VITE_DNA_RUNTIME_URL=/api/dna/runtime
`;
