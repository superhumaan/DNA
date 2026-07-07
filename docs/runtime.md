# Runtime Observer

The runtime ships **inside** `@superhumaan/dna-by-humaan` — same package as the CLI.

```bash
pnpm add @superhumaan/dna-by-humaan
```

```typescript
import { dnaRuntime } from "@superhumaan/dna-by-humaan/runtime";
```

It observes your Node.js application while it runs, classifies issues using your project's Behaviour rules, and persists them to `.DNA/runtime/`.

## Do I need this?

| Situation | Enable runtime? |
|-----------|-----------------|
| Frontend-only (Vite, React SPA) | No — CLI is enough |
| API server (Express, Fastify, NestJS, Next.js) | Yes — production protection |

## Install

```bash
pnpm add @superhumaan/dna-by-humaan
dna runtime install
```

## Start configuration

```typescript
import { dnaRuntime } from "@superhumaan/dna-by-humaan/runtime";

dnaRuntime.start({
  projectId: process.env.DNA_PROJECT_ID ?? "my-project",
  projectRoot: process.cwd(),
  environment: process.env.NODE_ENV,
  release: process.env.GIT_SHA,
  github: { enabled: false },
  aiRepair: { enabled: false },
  slowRequestThresholdMs: 3000,
  onEvent: (event) => { /* optional */ },
  onIssue: (issue) => { /* optional */ },
});
```

## What is captured

- Uncaught exceptions and unhandled rejections
- HTTP 500 responses and slow requests
- Repeated auth failures (401/403)
- Memory spikes (>512 MB heap)
- Framework-specific errors (via adapters)

Sensitive data (tokens, passwords, API keys) is **redacted** before persistence.

## Express

```typescript
const app = express();

app.use(dnaRuntime.express());
app.get("/api/users", handler);
app.use(dnaRuntime.errorHandler());
```

## Fastify

```typescript
dnaRuntime.attachFastify(fastify);
```

## NestJS

```typescript
@UseInterceptors(dnaRuntime.nestInterceptor())
@UseFilters(dnaRuntime.nestExceptionFilter())
@Controller("users")
export class UsersController {}
```

## Next.js

```typescript
export const GET = dnaRuntime.withNextHandler(async (request) => {
  return Response.json({ ok: true });
});
```

## Output files

| File | Contents |
|------|----------|
| `.DNA/runtime/events.jsonl` | Raw runtime events |
| `.DNA/runtime/issues.jsonl` | Classified issues |

## Production guidance

Use alongside Sentry or similar for uptime monitoring. DNA adds **project-specific classification** tied to your Behaviour and memory.

See [Integrations](./integrations.md) for GitHub and AI repair.
