# DNA — Team Testing Guide

Share this with colleagues who want to try DNA on their own projects.

**Time:** ~15 minutes one-time setup, ~5 minutes per project.

---

## What you're testing

| Layer | Command / feature | What to expect |
|-------|-------------------|----------------|
| Project brain | `dna init` | `.DNA/` + `DNA/Impressions/` scaffolded |
| AI context | `dna context cursor` | Paste-ready context for your AI tool |
| Knowledge packs | `dna marketplace install` | Stack-specific guidance in `.DNA/knowledge/` |
| Validation | `dna validate` / `dna doctor` | Health checks against Behaviour rules |
| Runtime observer | `@humaan/dna-runtime` | Errors/slow requests → `.DNA/runtime/issues.jsonl` |
| GitHub (optional) | `dna github connect` | Auto-issues for high/critical runtime events |
| AI repair (optional) | `dna ai repair --dry-run` | Branch + patch plan, never auto-merged |

---

## 1. One-time machine setup

**Requirements:** Node.js 20+, git access to this repo.

```bash
git clone https://github.com/superhumaan/DNA.git dna
cd dna
chmod +x scripts/*.sh
./scripts/team-setup.sh
```

Verify:

```bash
dna --help
```

> **After npm publish:** skip the clone — use `npx @humaan/dna-cli init -y` instead.

---

## 2. Add DNA to your project

```bash
cd /path/to/your-project

# Initialise (non-interactive defaults)
dna init -y

# Health check
dna doctor
dna validate

# Install a knowledge pack matching your stack
dna marketplace list
dna marketplace install frameworks/nextjs    # or vite, fastify, nestjs, etc.

# Generate AI context (pick your tool)
dna context cursor
dna context copilot
```

### What to commit

Commit these to your repo so the team shares the same brain:

```
.DNA/
DNA/
```

Add to `.gitignore` if you prefer not to share local runtime logs:

```
.DNA/runtime/events.jsonl
.DNA/runtime/issues.jsonl
```

---

## 3. Runtime observer (recommended for backend projects)

```bash
# From the DNA monorepo — installs runtime from source
/path/to/dna/scripts/add-runtime.sh /path/to/your-project
```

Then wire up for your framework:

### Express

```ts
import { dnaRuntime } from "@humaan/dna-runtime";

dnaRuntime.start({
  projectId: "your-project",
  projectRoot: process.cwd(),
  environment: process.env.NODE_ENV,
});

app.use(dnaRuntime.express());
// ... routes ...
app.use(dnaRuntime.errorHandler());
```

### Fastify

```ts
dnaRuntime.start({ projectId: "your-project", projectRoot: process.cwd() });
dnaRuntime.attachFastify(fastify);
```

### NestJS

```ts
@UseInterceptors(dnaRuntime.nestInterceptor())
@UseFilters(dnaRuntime.nestExceptionFilter())
```

### Next.js (App Router)

```ts
export const GET = dnaRuntime.withNextHandler(async (request) => { ... });
```

**Test it:** trigger an error endpoint, then check:

```bash
cat .DNA/runtime/issues.jsonl | tail -1 | jq .
```

---

## 4. GitHub integration (optional)

```bash
dna github connect --owner YOUR_ORG --repo YOUR_REPO
export GITHUB_TOKEN=ghp_...   # never commit this

# Enable in .DNA/config.dna.json:
# "github": { "enabled": true, "owner": "...", "repo": "..." }
```

Runtime auto-creates issues for **high** and **critical** severity when `github.enabled` is true.

Manual test:

```bash
dna github issue --file .DNA/runtime/last-issue.json
```

---

## 5. AI repair (optional — dry run only for testing)

```bash
dna ai connect --provider mock

# Plan a repair without git changes
dna ai repair --file .DNA/runtime/last-issue.json --dry-run
```

**Safety:** DNA never auto-merges PRs. All repairs need human review.

---

## 6. Marketplace updates

```bash
dna update
dna marketplace search --category compliance
```

Remote catalog: `https://dna.humaan.app/marketplace` (falls back to bundled packs offline).

---

## 7. Feedback template

Copy this into Slack / Linear / GitHub issue when reporting back:

```
**Project:** 
**Stack:** 
**DNA version:** 0.1.0

**Init / validate / doctor:** ✅ / ❌ — notes:
**Context quality (cursor/copilot):** 
**Marketplace pack used:** 
**Runtime wired?** yes / no — framework:
**Issues captured?** yes / no
**GitHub / AI tested?** yes / no / skipped

**Blockers:**
**Would use in production?** yes / not yet — why:
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `dna: command not found` | Re-run `./scripts/team-setup.sh` from the DNA repo |
| `DNA not installed` | Run `dna init -y` in project root |
| Runtime not capturing | Ensure `dnaRuntime.start({ projectRoot })` and middleware is registered |
| Marketplace empty | Offline — bundled catalog still has 8 packs |
| `GITHUB_TOKEN` errors | Export token; never put in `config.dna.json` |

---

## Reference: example apps

From the DNA monorepo:

```bash
cd apps/examples/node-express-app
pnpm dev
curl http://localhost:3456/api/error   # triggers DNA capture
```

Questions → ask in your team channel or open an issue on the DNA repo.
