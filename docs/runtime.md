# Runtime Observer

`@humaan/dna-runtime` observes your Node.js application, classifies issues, and persists them to `.DNA/runtime/`.

## Install

```bash
# From monorepo (team testing)
/path/to/dna/scripts/add-runtime.sh /path/to/your-project

# After npm publish
pnpm add @humaan/dna-runtime
dna runtime install
```

## Start configuration

```typescript
import { dnaRuntime } from "@humaan/dna-runtime";

dnaRuntime.start({
  projectId: process.env.DNA_PROJECT_ID ?? "my-project",
  projectRoot: process.cwd(),       // required — locates .DNA/
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

app.use(dnaRuntime.express());     // before routes

app.get("/api/users", handler);

app.use(dnaRuntime.errorHandler()); // after routes
```

## Fastify

```typescript
dnaRuntime.attachFastify(fastify);  // recommended — applies to all routes

// Alternative scoped plugin:
await fastify.register(dnaRuntime.fastify());
```

## NestJS

```typescript
@UseInterceptors(dnaRuntime.nestInterceptor())
@UseFilters(dnaRuntime.nestExceptionFilter())
@Controller("users")
export class UsersController {}
```

## Next.js

**App Router handler:**

```typescript
export const GET = dnaRuntime.withNextHandler(async (request) => {
  return Response.json({ ok: true });
});
```

**Middleware:**

```typescript
export const middleware = dnaRuntime.nextMiddleware();
```

**Pages Router API:**

```typescript
export default dnaRuntime.withNextApiRoute(async (req, res) => {
  res.json({ ok: true });
});
```

## Output files

| File | Contents |
|------|----------|
| `.DNA/runtime/events.jsonl` | Raw runtime events |
| `.DNA/runtime/issues.jsonl` | Classified issues |

Inspect latest issue:

```bash
tail -1 .DNA/runtime/issues.jsonl | jq .
```

## GitHub auto-issues

Enable in `.DNA/config.dna.json`:

```json
{
  "github": { "enabled": true, "owner": "org", "repo": "project" }
}
```

Set `GITHUB_TOKEN`. DNA creates issues for **high** and **critical** severity automatically.

## Production guidance

DNA runtime is **v0.1.0**. Use alongside Sentry or similar for production-grade monitoring. DNA adds **context-rich classification** and ties incidents to your project's Behaviour and memory.

See [Integrations](./integrations.md) for GitHub and AI repair.
