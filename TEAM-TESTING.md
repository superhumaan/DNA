# DNA — Team Testing Guide

Share this with colleagues who want to try DNA on their own projects.

**Time:** ~15 minutes one-time setup, ~5 minutes per project.

---

## What you're testing

| Layer | Command / feature | What to expect |
|-------|-------------------|----------------|
| Project brain | `dna init` | `.DNA/` + `DNA/Impressions/` scaffolded |
| AI context | `dna context cursor` | Paste-ready context for your AI tool |
| **Cursor workbench** | `dna init` / `dna doctor` | 88 prompt stem packs + `/dna-*` commands — DNA always on; `AGENTS.md` routes engineering work through the 9-role agent loop |
| **Stem library** | [dna.humaan.app/intelligence](https://dna.humaan.app/intelligence) | Copy prompts + guidelines; each stem has MUST/NEVER rules and expectations |
| Knowledge packs | `dna marketplace install` | Stack-specific guidance in `.DNA/knowledge/` |
| Validation | `dna validate` / `dna doctor` | Health checks against Behaviour rules |
| Runtime observer | `@superhumaan/dna-by-humaan/runtime` | Errors/slow requests → `.DNA/data/runtime.db` |
| **DNA Lab** | `dna lab serve` / `/labs` | Local open access; production auth via `dna register lab` (paste-verify at `/labs`; optional pre-notify). URL deep links (`/labs/<tab>`); **APIs** tab = full route reference (Description / Usage / Received / Sent); Overview = analytics; Issues = Sentry-density + **Copy issue**; Refresh disables + spins. **After every npm upgrade:** `npx dna lab installs --fix` (or `dna update`), **restart the API**, hard-refresh `/labs`. See [lab-apis-reference](./docs/engineering/lab-apis-reference-0.6.18.md) · [lab-upgrade-dx](./docs/engineering/lab-upgrade-dx-0.6.15.md). |
| Upstream feedback | `dna feedback report` / auto | DNA-platform failures → sanitized upstream report (opt-in, `dna-only` default) |
| GitHub (optional) | `dna doctor` (auto) | Browser login + remote detect; auto-issues for high/critical events |
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
npm view @superhumaan/dna-by-humaan version
```

**Supply chain:** Published from [github.com/superhumaan/DNA](https://github.com/superhumaan/DNA) with npm provenance. See [SECURITY.md](./SECURITY.md) and the [Socket.dev report](https://socket.dev/npm/package/@superhumaan/dna-by-humaan) for documented network endpoints and scanner expectations.

> **After npm publish:** skip the clone — use `npx @superhumaan/dna-by-humaan init -y` instead.

---

## 2. Add DNA to your project

```bash
cd /path/to/your-project

# One command — scaffolds DNA, CI, runtime, Docker, hooks, and GitHub (browser login)
npx @superhumaan/dna-by-humaan doctor

# If doctor added the runtime package
npm install

# Health check (optional — doctor already validates)
dna validate
```

`dna doctor` replaces the older multi-step flow (`init`, `ci install`, `runtime install`, `github connect`). It auto-detects your GitHub remote, opens browser sign-in when needed, and **auto-wires the runtime observer** into Express/Fastify entry files or Next.js `middleware.ts`. From v0.6.16 it also **auto-aligns nested/stale Lab package installs**.

### Upgrade DNA Lab (required after every npm bump)

`/labs` stays on a stale UI if a nested `node_modules` copy or a long-lived API process is left behind.

```bash
npx @superhumaan/dna-by-humaan@latest update   # preferred
# or: npx dna lab installs --fix

# Then ALWAYS:
# 1. Restart the API / dna lab serve process that mounts Lab
# 2. Hard-refresh /labs (Cmd+Shift+R)
curl -s http://localhost:<api>/api/dna/labs/health | jq '{dnaVersion,labUi}'
```

See [lab-upgrade-dx](./docs/engineering/lab-upgrade-dx-0.6.15.md).

### Portfolio install (one squad, many products)

If your squad owns **multiple related apps** under one folder (enterprise health suite, monorepo, client portfolio), install DNA on the **parent** — not each repo:

```bash
cd ~/work/your-squad-folder
npx @superhumaan/dna-by-humaan doctor
```

**One `doctor` installs the full platform** for every product underneath:

- **88 stem packs** + **`/dna-*` slash commands** (guidelines, expectations, workflows; includes strategy ladder)
- **Cursor + Claude rules, skills, `AGENTS.md`** — DNA always on, no “use DNA”
- **Detection** — stack, monorepo apps, AI tools, GitHub, healthcare/legal domain, drift, auth
- **CellularMemory + system maps** — cross-product memory in git
- **Feature factory** — 9-role loop, same template for every feature
- **Runtime observer** — auto-wired, classified issues, repair plans
- **CI, hooks, Docker, GitHub login** — delivery pipeline ready
- **1045 knowledge packs + 27 purpose bundles** — foundation from scan + marketplace; `dna marketplace install combo/<id>` for one-command workflows

Commit `.DNA/`, `DNA/`, `AGENTS.md`, `ai/`, `.cursor/`, `.claude/` at the parent so the squad shares one install forever.

[Full manifest →](./docs/product/portfolio-install.md)

### What to commit

Commit these to your repo so the team shares the same brain:

```
.DNA/
DNA/
```

Add to `.gitignore` if you prefer not to share local runtime logs:

```
.DNA/data/
.DNA/runtime/events.jsonl
.DNA/runtime/issues.jsonl
```

`.DNA/data/` includes `runtime.db` and `feedback-queue.jsonl` (upstream reports when offline).

### Upstream feedback (optional)

DNA can report **its own** failures (CLI, doctor, bundled packages) back to the maintainers — not your app bugs.

```bash
dna feedback status
dna feedback report --message "describe DNA error" --command "dna doctor" --dry-run
```

Opt out in `.DNA/config.dna.json`: `"feedback": { "enabled": false }`.

---

## 3. Runtime observer (recommended for backend projects)

```bash
# From the DNA monorepo — installs runtime from source
/path/to/dna/scripts/add-runtime.sh /path/to/your-project
```

Then wire up for your framework:

### Express

```ts
import { dnaRuntime } from "@superhumaan/dna-by-humaan/runtime";

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
dna github login
dna github connect --owner YOUR_ORG --repo YOUR_REPO

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
| GitHub auth errors | Run `dna github login`; optional `export GITHUB_TOKEN=...` for CI only — never put in `config.dna.json` |

---

## Reference: example apps

From the DNA monorepo:

```bash
cd apps/examples/node-express-app
pnpm dev
curl http://localhost:3456/api/error   # triggers DNA capture
```

Questions → ask in your team channel or open an issue on the DNA repo.
