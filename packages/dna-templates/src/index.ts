export const RUNTIME_INSTALL_SNIPPET = `// DNA Runtime — framework adapters
import { dnaRuntime } from "@superhumaan/dna-by-humaan/runtime";

dnaRuntime.start({
  projectId: process.env.DNA_PROJECT_ID ?? "my-project",
  projectRoot: process.cwd(),
  environment: process.env.NODE_ENV ?? "development",
  release: process.env.GIT_SHA,
  github: { enabled: false },
  aiRepair: { enabled: false },
});

// Express:
// app.use(dnaRuntime.express());
// app.use(dnaRuntime.errorHandler()); // after routes

// Fastify:
// dnaRuntime.attachFastify(fastify);
// await fastify.register(dnaRuntime.fastify()); // scoped plugin alternative

// NestJS:
// @UseInterceptors(dnaRuntime.nestInterceptor())
// @UseFilters(dnaRuntime.nestExceptionFilter())

// Next.js App Router:
// export const GET = dnaRuntime.withNextHandler(async (request) => { ... });
// export const middleware = dnaRuntime.nextMiddleware();
`;

export const ENV_EXAMPLE_SNIPPET = `# DNA Runtime
DNA_PROJECT_ID=my-project
GITHUB_TOKEN=          # Required for GitHub integration
DNA_AI_PROVIDER=mock   # mock | openai | anthropic
`;
