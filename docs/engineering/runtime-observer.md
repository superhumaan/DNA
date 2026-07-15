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

- **Local** (`localhost`, `127.0.0.1`, `development`): `/labs` opens with **no login**
- **Production**: ColorParty-style sign-in (email + password + OTP) after pairing

### Pairing flow (store-first)

1. Deploy with `dna lab install` / `dna doctor` — `/labs` is live on your domain
2. If an auth gateway sits in front of the app (Invitrace Connect, oauth2-proxy, etc.), **allowlist**:
   - `POST /api/dna/labs/pairing/init`
   - `GET /api/dna/labs/pairing/status/*`  
   See `.DNA/lab/gateway-public-paths.md` (written by doctor / lab install).
3. Locally: `npx dna register lab --url https://your-app.com` — must print **Production notified** (CLI saves `{ pairingId, codeHash }` into Lab store). Exit code 1 if init was blocked.
4. On production `/labs` → paste Pairing ID + 148-digit code → verify against the store → create account
5. Sign in on production anytime thereafter

`/labs` never invents pairings from paste alone. Without a successful CLI `pairing/init`, verify returns **Unknown pairing**.

### Screens

Overview · Issues · Events · Performance · Quality · Releases

**UI (v0.6.7):** Humaan admin parity — DNA icon-only brand, 48px primary pills, large pill tabs, search above tabs on list pages, tables always shown (empty row when no data), Monitor/Delivery sidebar accordion (one open). See [lab-ui-humaan-0.6.7](./lab-ui-humaan-0.6.7.md).

**CI billing (v0.6.8):** Overview / Quality → CI show a billing blocker banner when Actions cannot start runners. See [lab-ci-billing-blocker](./lab-ci-billing-blocker.md). After upgrading the npm package, **restart the API** that mounts Lab.

### Release tracking & source maps (v2)

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
| `.DNA/data/runtime.db` | SQLite runtime events and issues (default) |
| `.DNA/runtime/events.jsonl` | Legacy JSONL events |
| `.DNA/runtime/issues.jsonl` | Legacy classified issues |
| `.DNA/data/feedback-queue.jsonl` | Queued upstream feedback (offline) |

## Production guidance

Use alongside Sentry or similar for uptime monitoring. DNA adds **project-specific classification** tied to your Behaviour and memory.

See [Integrations](./integrations.md) for GitHub and AI repair.
