# DNA by Humaan

[![npm](https://img.shields.io/npm/v/@superhumaan/dna-by-humaan)](https://www.npmjs.com/package/@superhumaan/dna-by-humaan)
[![Socket](https://socket.dev/api/badge/npm/package/@superhumaan/dna-by-humaan)](https://socket.dev/npm/package/@superhumaan/dna-by-humaan)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/superhumaan/DNA/blob/main/LICENSE)

# DNA

**Git remembers your code. DNA remembers your system.**

One `doctor` install gives Cursor/Claude a project brain — stems, rules, Lab, marketplace, and AI repair that tags commits and PRs per project (`[Acme]`, `[DNA]`, …).

```bash
npx @superhumaan/dna-by-humaan doctor
```

| | |
|---|---|
| **Website** | [dna.humaan.app](https://dna.humaan.app) |
| **Marketplace** | [Marketplace](https://dna.humaan.app/marketplace) · [Bundles](https://dna.humaan.app/marketplace#bundles) |
| **Health** | [Live gates](https://dna.humaan.app/health) |
| **Repo** | [github.com/superhumaan/DNA](https://github.com/superhumaan/DNA) |

Built by [Humaan](https://dna.humaan.app) · [Superlite](https://superlite.ai)

**Latest (v0.6.24):** Project git naming for AI · Skeletor fleet in context by default · 103 stems · 1045 packs · 27 purpose bundles.

---

## Why teams install DNA

| Pain | DNA |
|------|-----|
| AI invents architecture | Loads `.DNA/` behaviour + knowledge first |
| Generic `chore:` commits across labs | `[Acme] fix(…):` / `[DNA] feat:…` from config |
| Runtime errors with no project context | Lab + immune classification + repair PRs |
| Knowledge scattered per repo | Portfolio/`doctor` on the parent folder |

**Squads:** install once on the parent folder. [Portfolio install →](https://github.com/superhumaan/DNA/blob/main/docs/product/portfolio-install.md) · **Skeletor:** `dna skeletor status` — [Skeletor →](https://dna.humaan.app/skeletor)

---

## Supply chain & trust

Published from [superhumaan/DNA](https://github.com/superhumaan/DNA) — **MIT**, **npm provenance**, **zero production npm dependencies**. Scanners may flag network/shell/filesystem access; expected for a CLI that scaffolds, talks to GitHub, and syncs packs. Details: [SECURITY.md](https://github.com/superhumaan/DNA/blob/main/SECURITY.md#supply-chain-transparency-socketdev--security-scanners).

```bash
npm view @superhumaan/dna-by-humaan version
dna --version
```

---

## Verified results

Canonical health is published on every push (GitHub Actions Step Summary + `dna-health-report` artifact).

**Live snapshot:** [dna.humaan.app/health](https://dna.humaan.app/health)

Regenerate locally: `pnpm run health:report`. Coverage gate: **≥ 80% per file** on the product-critical scope.

---

## Install

```bash
npx @superhumaan/dna-by-humaan doctor
```

Scaffolds `.DNA/`, CI, runtime, Docker, hooks, GitHub sign-in, and AI workbench. Use `init` only when you want the interactive wizard first.

```bash
# Production runtime (same package)
pnpm add @superhumaan/dna-by-humaan
```

### Portfolio install (squads & multi-product folders)

Install **once** on the parent folder — one command, **everything** included:

```bash
cd ~/work/your-squad-folder
npx @superhumaan/dna-by-humaan doctor
```

| Included in one `doctor` | |
|--------------------------|---|
| `.DNA/` intelligence | behaviour, CellularMemory, immune system, neuralNetwork |
| **103 stem packs** + **`/dna-*` commands** | guidelines, expectations, workflows in `.DNA/stems/` |
| **AI workbench** | `AGENTS.md`, Cursor + Claude rules/skills — always on |
| **Detection** | stack, monorepo apps, AI tools, GitHub, healthcare/legal domain, drift |
| **Feature factory** | 9-role loop, quality gates, same template every feature |
| **Runtime + CI** | auto-wired observer, GitHub Actions, pre-push hook, Docker |
| **1045 knowledge packs** | foundation from scan + marketplace |
| **27 purpose bundles** | `dna marketplace install combo/<id>` — packs + stems + AI rules |

One brain for every related app — how they connect, what broke, what to fix. The install teams keep like `tsconfig.json`.

[Full manifest →](https://github.com/superhumaan/DNA/blob/main/docs/product/portfolio-install.md)

---

## What DNA is

DNA is **not** a documentation generator. It is:

| Capability | What it does |
|------------|--------------|
| **Project intelligence** | Structured `.DNA/` context AI tools can actually use |
| **AI behaviour layer** | Rules governing how Cursor, Copilot, and Claude work on *your* stack |
| **Runtime observer** | Classifies production errors with project-specific context |
| **Knowledge marketplace** | **1045** curated packs + **27 purpose bundles** — frameworks, cloud, healthcare, compliance, legal, payments |
| **Tiered compliance** | GDPR, UK GDPR, HIPAA, ISO 27001, SOC 2, PCI DSS — startup → enterprise |
| **GDPR reference library** | **85+** governance, technical, and AI policy templates (bundled in CLI assets) |
| **Platform catalog** | Production patterns from the platform catalog (admin, auth, cloud, integrations) |
| **IVF (brownfield)** | Install into existing codebases — analyze, document, phased migration plans |
| **GitHub automation** | Contextual issues and AI-assisted repair PRs with **project tags** (`[MyApp]`, …) |
| **Software immune system** | Severity, category, and discipline classification |
| **Project git naming** | AI commits/PRs tagged per project — see [naming conventions](https://github.com/superhumaan/DNA/blob/main/docs/design/naming-conventions.md) |

---

## Quick start

```bash
npx @superhumaan/dna-by-humaan doctor
npm install   # if package.json was updated
dna scan
dna context cursor
```

### Brownfield / existing projects

```bash
dna analyze                          # Deep structure, auth, IVF gap analysis
dna document --from-code             # Reverse-engineer Impressions from code
dna plan ivf --quote "Add DNA to our Express monolith"
```

---

## Core commands

| Command | What it does |
|---------|--------------|
| `dna init` | Scaffold `.DNA/` + `DNA/Impressions/` |
| `dna analyze` | Brownfield analysis — structure, auth, IVF gaps |
| `dna document --from-code` | Generate Impressions from existing code |
| `dna plan ivf` | Integrating Vertical Functions — phased migration plan |
| `dna scan` | Detect stack, tests, CI, risks |
| `dna context cursor` | AI-ready context for Cursor / Copilot / Claude |
| `dna update` | Upgrade CLI + re-apply all installed knowledge packs + force re-inject always-on AI rules |
| `dna workbench install` | Refresh DNA Workbench + 103 prompt stem packs + `/dna-*` commands + `AGENTS.md` |
| `dna stems list` | List prompt stem packs (analyze, ship, agent-loop roles, …) |
| `dna stems show <id>` | Copy variants and file paths for one stem |
| `dna commands install` | Refresh `/dna-*` CLI slash commands only (also installed by init/doctor/update) |
| `dna generate feature <id>` | Scaffold audit-logging, sso, multi-tenant, feature-flags, gradual-rollout |
| `dna memory sync` | Sync CellularMemory from team registry |
| `dna plan rbac` | RBAC from plain language → permission matrix |
| `dna plan compliance` | ISO / GDPR / HIPAA / SOC 2 by org tier |
| `dna compliance list` | Startup → enterprise compliance catalog |
| `dna context compliance` | Load tiered compliance knowledge for AI |
| `dna platform list` | DNA production feature catalog |
| `dna plan feature <id>` | End-to-end plans — SSO, admin, flags, Azure, CRM, CMS |
| `dna marketplace list` | Browse 1045 knowledge packs + 27 bundles |
| `dna legal advise` | Legal advisor — jurisdictions, sectors, engineering gates |
| `dna plan legal` | Legal rollout plan + regional packs |
| `dna methodology` | Delivery profile — Scrum, Kanban, Shape Up, ticket/doc systems |
| `dna marketplace install <id>` | Install packs into `.DNA/knowledge/` or a purpose bundle (`combo/*`) |
| `dna validate` | Check against Behaviour rules |
| `dna doctor` | Full health check |
| `dna feedback report` | Report DNA-platform issue upstream (sanitized) |
| `dna feedback sync` | Flush offline feedback queue |
| `dna runtime install` | Framework snippets for production observer |
| `dna lab install` | Scaffold DNA Lab at `/labs` + auto-wire middleware |
| `dna lab serve` | Local Lab at `http://localhost:3200/labs` (no login on localhost) |
| `dna lab installs` | List nested/stale `@superhumaan/dna-by-humaan` installs |
| `dna lab installs --fix` | Upgrade every owner package to `@latest` |
| `dna register lab --url <url>` | Pair local CLI to production Lab (148-digit code) |
| `dna dashboard` | Legacy alias for `dna lab serve` |
| `dna github connect` | Wire GitHub issues + repair workflow |
| `dna ai repair` | AI-assisted fix suggestions (dry-run safe) |

[Full CLI reference →](https://github.com/superhumaan/DNA/blob/main/docs/cli-reference.md)

---

## Knowledge marketplace (1045 packs + 27 bundles)

```bash
dna marketplace list
dna marketplace search --query healthcare
dna marketplace search --query fhir
dna marketplace install frameworks/nextjs
dna marketplace install compliance/gdpr
dna marketplace install healthcare/fhir-r4
dna marketplace install combo/nextjs-fullstack
dna marketplace install combo/gdpr-eu-ready
dna update
```

**Live catalog:** [dna.humaan.app/marketplace](https://dna.humaan.app/marketplace) · [Purpose bundles](https://dna.humaan.app/marketplace#bundles) · Offline bundled fallback included.

| Layer | Count | Examples |
|-------|------:|----------|
| **Purpose bundles** | **27** | `combo/nextjs-fullstack`, `combo/gdpr-eu-ready`, `combo/pmf-check` |
| Core (frameworks, compliance, DNA stack) | 11 | Next.js, GDPR, RBAC |
| Stem delivery surfaces | 21 | `stem/*` |
| Language stems (i18n AI) | 18 | `languages/en`, `languages/vi`, … |
| Catalog expansion v1 | 79 | CMS, payments, modern frameworks |
| Wave 2 | 283 | Healthcare (45), databases, cloud, AI/LLM |
| Wave 3 | 187 | Enterprise ERP, gaming/XR, clinical AI |
| Wave 4 | 142 | Regional cloud, ORMs, security depth |
| Wave 5 | 27 | FinOps, data mesh, store distribution |
| **Total** | **1045** | |

**Healthcare:** 55 packs — FHIR R4, Epic, Cerner, Redox, HL7, MDR, patient portal, clinical AI, HIE networks, and more.

**Stack archetypes:** Auto-detected profiles for healthcare-fhir, fintech-plaid, ecommerce-shopify, gaming-unity, erp-sap-integration, ai-llm-saas, cloud-aws-saas, observability-production, and 35+ more.

[Marketplace docs →](https://github.com/superhumaan/DNA/blob/main/docs/marketplace.md)

---

## Production runtime

Import from the same package in your server:

```typescript
import { dnaRuntime } from "@superhumaan/dna-by-humaan/runtime";

dnaRuntime.start({ projectId: "my-app", projectRoot: process.cwd() });
app.use(dnaRuntime.express());
app.use(dnaRuntime.errorHandler());
```

Supports **Express**, **Fastify**, **NestJS**, and **Next.js**.

```bash
dna runtime install   # Auto-wire framework snippets
dna lab install       # Scaffold DNA Lab at /labs
dna lab serve         # Local Lab — http://localhost:3200/labs
```

### DNA Lab (production observability)

DNA Lab at **`/labs`** complements external uptime tools (it does not replace ping monitoring).

| Mode | Access |
|------|--------|
| **Local** | `dna lab serve` — open `http://localhost:3200/labs`, no login |
| **Production** | `dna register lab --url https://your-app.com` → paste Pairing ID + code at `/labs` → create account. Sign into the app first if your host requires a session. |

Lab uses optimised conditional polling, not sockets: hidden tabs pause, unchanged
snapshots return `304`, and concurrent readers are coalesced. Verify 200-viewer
capacity with `pnpm run test:load:lab`.

Lab authentication state defaults to an atomic **single-instance file store**.
Set `DNA_LAB_INSTANCE_COUNT` / `WEB_CONCURRENCY` accurately; values above `1`
fail closed unless a shared Redis-compatible adapter is fully configured via
`DNA_LAB_STATE_BACKEND=redis`, `DNA_LAB_REDIS_URL`, `DNA_LAB_REDIS_TOKEN`, and
`DNA_LAB_REDIS_KEY`. `/api/dna/labs/health` reports the active backend.

**UI (v0.6.20+):** Mobile-responsive Lab shell (mobile admin parity — off-canvas nav ≤900px). **(v0.6.18+):** **APIs** tab documents every Lab route (Description / Usage / Received / Sent); URL deep links (`/labs/coverage`, `/labs/issues/:id`); 401 → sign-in. [APIs reference →](https://github.com/superhumaan/DNA/blob/main/docs/engineering/lab-apis-reference-0.6.18.md). **(v0.6.16+):** Header Refresh disables + spins and reloads the active tab; Issues have **Copy issue**. **(v0.6.15+):** Sidebar shows the live DNA version; install-mismatch banner when nested/stale copies exist — `dna doctor` / `dna update` auto-align, or run `dna lab installs --fix` ([upgrade DX →](https://github.com/superhumaan/DNA/blob/main/docs/engineering/lab-upgrade-dx-0.6.15.md)). **(v0.6.14+):** Analytics Overview + Sentry-density Issues. Humaan admin chrome (v0.6.7+): DNA logo only, primary pills, search → filters → tables, Monitor/Delivery accordion.

### Upgrade Lab (never skip)

```bash
npx @superhumaan/dna-by-humaan@latest update   # or: npx dna lab installs --fix
# Restart the API that mounts Lab, then hard-refresh /labs
curl -s http://localhost:<api>/api/dna/labs/health | jq '{dnaVersion,labUi}'
```

`npx …@x.y.z` alone does **not** refresh `/labs` in a running host app — install into `node_modules`, **restart the API**, hard-refresh the browser.

```typescript
import { createLabMiddleware } from "@superhumaan/dna-by-humaan/lab";

app.use(createLabMiddleware({ projectRoot: process.cwd() }));
```

Release tracking and source maps: `POST /api/dna/labs/releases`, `POST /api/dna/labs/sourcemaps`.

[Runtime observer docs →](https://github.com/superhumaan/DNA/blob/main/docs/engineering/runtime-observer.md)

DNA classifies live errors with your project's Behaviour rules and writes `.DNA/runtime/issues.jsonl`. Use alongside Sentry — DNA adds *why* and project context, not replacement.

[Runtime guide →](https://github.com/superhumaan/DNA/blob/main/docs/runtime.md)

---

## Compliance & governance

Tiered implementation for **startup → enterprise**:

```bash
dna compliance list
dna plan compliance --frameworks gdpr,iso27001 --tier sme
dna context compliance
```

Frameworks: **GDPR**, **UK GDPR**, **HIPAA**, **ISO 27001**, **SOC 2**, **PCI DSS**.

Bundled **GDPR reference library** (85+ documents): policies, DPIA templates, AI governance, technical controls, external-facing privacy/terms.

[Compliance docs →](https://github.com/superhumaan/DNA/blob/main/docs/compliance.md)

---

## GitHub, upstream feedback & AI repair

```bash
dna github login
dna github connect --owner ORG --repo REPO

dna feedback report --message "DNA error" --dry-run
dna feedback sync

dna ai connect --provider mock
dna ai repair --file issue.json --dry-run
```

**Local:** high/critical runtime → your repo. **Upstream:** DNA-platform failures → sanitized reports to `superhumaan/DNA` (`dna-only` default). **Safety:** never auto-merges, never deploys, never touches secrets.

[Integrations guide →](https://github.com/superhumaan/DNA/blob/main/docs/integrations.md)

---

## Project structure

```
your-project/
├── .DNA/                    # AI-first intelligence (machines)
│   ├── behaviour/           # rules for Cursor, Copilot, Claude
│   ├── knowledge/           # 1045-pack marketplace + combo bundle installs
│   ├── CellularMemory/      # learned history
│   ├── immuneSystem/        # classification rules
│   └── runtime/             # classified production issues
└── DNA/Impressions/         # human-facing docs (people)
    ├── product/
    ├── architecture/
    └── security/
```

---

## Typical workflow

```bash
# 1. Give the project a brain
npx @superhumaan/dna-by-humaan init -y

# 2. Install stack knowledge
dna marketplace install frameworks/nextjs
dna marketplace install compliance/gdpr

# 3. Feed your AI editor
dna context cursor

# 4. Protect your API in production
pnpm add @superhumaan/dna-by-humaan
dna runtime install
```

Commit `.DNA/` and `DNA/` so your team shares one brain.

---

## DNA is / isn't

| DNA is | DNA is not |
|--------|------------|
| Project intelligence for AI | A docs generator |
| Behaviour rules for your stack | A linter replacement |
| Runtime issue classification | A Sentry replacement — use both |
| 1045 knowledge packs + 27 purpose bundles + GDPR library | A hosted SaaS — runs in your repo |
| GitHub issue + repair automation | Auto-merge or auto-deploy |

---

## Documentation

| Guide | Description |
|-------|-------------|
| [Getting started](https://github.com/superhumaan/DNA/blob/main/docs/getting-started.md) | First project in 10 minutes |
| [Brownfield / IVF](https://github.com/superhumaan/DNA/blob/main/docs/ivf.md) | Install into existing projects |
| [Concepts](https://github.com/superhumaan/DNA/blob/main/docs/concepts.md) | Behaviour, memory, immune system |
| [CLI reference](https://github.com/superhumaan/DNA/blob/main/docs/cli-reference.md) | Every command |
| [Runtime observer](https://github.com/superhumaan/DNA/blob/main/docs/runtime.md) | Express, Fastify, NestJS, Next.js |
| [Marketplace](https://github.com/superhumaan/DNA/blob/main/docs/marketplace.md) | 1045 knowledge packs + 27 purpose bundles |
| [Compliance](https://github.com/superhumaan/DNA/blob/main/docs/compliance.md) | Tiered GDPR, HIPAA, ISO, SOC 2 |
| [Platform catalog](https://github.com/superhumaan/DNA/blob/main/docs/platform.md) | DNA production patterns |
| [Changelog](https://github.com/superhumaan/DNA/blob/main/CHANGELOG.md) | Releases and migrations |
| [Integrations](https://github.com/superhumaan/DNA/blob/main/docs/integrations.md) | GitHub issues + AI repair |
| [Team testing](https://github.com/superhumaan/DNA/blob/main/TEAM-TESTING.md) | Colleague pilot guide |

---

## Requirements

- **Node.js 20+**
- TypeScript projects (JavaScript supported via scan)

---


---

## Sponsors

<!-- sponsors:ledger:start -->
DNA is MIT-licensed and maintained in the open. Sponsorship funds hosting, security updates, and the marketplace — not premium features.

_No sponsors yet — [be the first](https://github.com/sponsors/superhumaan)._
<!-- sponsors:ledger:end -->
## License

MIT © [Humaan by Superlite](https://dna.humaan.app)
