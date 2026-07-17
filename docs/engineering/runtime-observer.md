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
| API server (Express 4/5, Fastify, NestJS, Next.js) | Yes — production protection |

## Production Lab (`/labs`)

DNA Lab is the **production** observability UI — not localhost-only.

| Command | Purpose |
|---------|---------|
| `dna lab install` | Scaffold `/labs` + auto-wire middleware |
| `dna lab serve` | Local Lab at `http://localhost:3200/labs` (no login) |
| `dna register lab --url https://your-app.com` | Pair local project with production |

### Local vs production

- **Local** (`localhost` / literal loopback host only): `/labs` opens with **no login**
- **Production**: ColorParty-style sign-in (email + password + OTP) after pairing

`NODE_ENV=development` is not an authentication bypass. Public preview hosts
must sign in even when the process runs a development build, and development
OTPs are only returned to a literal loopback request outside production.

### Pairing flow (paste-verify)

1. Deploy with `dna lab install` / `dna doctor` — `/labs` is live on your domain
2. Locally: `npx dna register lab --url https://your-app.com` — copy Pairing ID + 148-digit code (production pre-notify is optional)
3. On production `/labs` (sign into the app if the host requires a session) → paste Pairing ID + code → verify → create account
4. Sign in on production anytime thereafter

`/labs` invents the store row from a valid paste when `pairing/init` never ran. No gateway allowlist is required.
When production pre-notify supplies a loopback callback, the callback is
authenticated with an HMAC derived from the pairing code hash; unsigned or
modified callbacks return `401`.

### Polling and live-event capacity

Lab intentionally uses request polling, not sockets. Visible tabs poll the
specific `/api/dna/labs/data` resource with jitter and `If-None-Match`;
background tabs stop polling and unchanged snapshots return `304`. The server
coalesces simultaneous readers and caps the wire payload. The repeatable gate is:

```bash
pnpm run test:load:lab
```

This simulates 200 concurrent viewers and fails on request errors, p95 above
1500ms, or throughput below 500 requests/second.

### State topology

Lab users, sessions, pairings, releases, and source-map metadata use an atomic
single-instance file store. Set `DNA_LAB_INSTANCE_COUNT` (or
`WEB_CONCURRENCY`) accurately. Values above `1` fail closed with `503` rather
than silently splitting authentication state. Run one Lab application instance
until a shared state adapter is available; do not deploy the file store across
independent serverless replicas.

### Screens

Overview · Issues · Events · Performance · Quality · Releases

**UI (v0.6.7):** Humaan admin parity — DNA icon-only brand, 48px primary pills, large pill tabs, search above tabs on list pages, tables always shown (empty row when no data), Monitor/Delivery sidebar accordion (one open). See [lab-ui-humaan-0.6.7](./lab-ui-humaan-0.6.7.md).

**CI billing (v0.6.8):** Overview / Quality → CI show a billing blocker banner when Actions cannot start runners. See [lab-ci-billing-blocker](./lab-ci-billing-blocker.md). After upgrading the npm package, **restart the API** that mounts Lab.

### Release tracking & source maps (v2)

- `GET /api/dna/labs/health` — unauthenticated liveness + state topology
- `GET /api/dna/labs/issues/:id/events` — authenticated full event detail on demand
- `POST /api/dna/labs/releases` — register deploy (`GIT_SHA`, version)
- `POST /api/dna/labs/sourcemaps` — register source map metadata per release

### Uptime monitoring

DNA Lab **complements** dedicated uptime ping services (Better Uptime, Pingdom, etc.) — it classifies runtime errors and performance from your app. It does **not** replace external availability monitoring.

## Local dashboard (legacy)

`dna dashboard` now serves **Lab** at `/labs` on port 3200.

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

## Upstream feedback (v0.4.8)

When `feedback.upstream` is enabled (default on init/doctor), DNA-platform failures are reported upstream after local classification. User application errors are **not** sent unless `autoReport` is set to `all`.

| Source | Upstream when |
|--------|----------------|
| Runtime | Stack trace in `@superhumaan/*` or DNA middleware |
| CLI / doctor | Always (manual `dna feedback report` or auto on DNA errors) |
| Your app code | Never (default `dna-only`) |

```bash
dna feedback status
dna feedback sync   # after offline queue
```

Queue file: `.DNA/data/feedback-queue.jsonl` (gitignored).

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
| `.DNA/data/runtime.db` | Atomic JSON runtime store (default; legacy compatibility filename) |
| `.DNA/runtime/events.jsonl` | Legacy JSONL events |
| `.DNA/runtime/issues.jsonl` | Legacy classified issues |
| `.DNA/data/feedback-queue.jsonl` | Queued upstream feedback (offline) |

## Production guidance

Use alongside Sentry or similar for uptime monitoring. DNA adds **project-specific classification** tied to your Behaviour and memory.

See [Integrations](./integrations.md) for GitHub and AI repair.
