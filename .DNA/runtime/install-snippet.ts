// DNA Runtime — backend + frontend error watching (on by default)
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
