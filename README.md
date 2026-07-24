# DNA by Humaan

[![npm](https://img.shields.io/npm/v/@superhumaan/dna-by-humaan)](https://www.npmjs.com/package/@superhumaan/dna-by-humaan)
[![Socket](https://socket.dev/api/badge/npm/package/@superhumaan/dna-by-humaan)](https://socket.dev/npm/package/@superhumaan/dna-by-humaan)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

> **Git remembers your code. DNA remembers your system.**

> **Sentry tells you what broke. DNA tells you why, remembers it, and opens the PR.**

> Run `npx @superhumaan/dna-by-humaan doctor` — *“No amount of money ever bought a second of time.”*

**DNA by Humaan** is an open-source delivery platform for TypeScript teams — describe features in plain language, run quality gates, push to GitHub, and ship with a **965-pack** knowledge marketplace, tiered compliance, runtime observer, and AI-assisted repair.

**One squad, many products?** Install DNA on the **parent folder** — not every repo. One brain remembers every app and how they connect. [Portfolio install →](./docs/product/portfolio-install.md)

| | |
|---|---|
| **Website** | [dna.humaan.app](https://dna.humaan.app) |
| **Marketplace** | [dna.humaan.app/marketplace](https://dna.humaan.app/marketplace) |
| **Intelligence** | [dna.humaan.app/intelligence](https://dna.humaan.app/intelligence) |
| **Health** | [dna.humaan.app/health](https://dna.humaan.app/health) |
| **npm** | [@superhumaan/dna-by-humaan](https://www.npmjs.com/package/@superhumaan/dna-by-humaan) |
| **Supply chain** | [Socket.dev](https://socket.dev/npm/package/@superhumaan/dna-by-humaan) · [SECURITY.md](./SECURITY.md) |
| **Repository** | [github.com/superhumaan/DNA](https://github.com/superhumaan/DNA) |

Built by **[Humaan](https://dna.humaan.app)** · **[Superlite](https://superlite.ai)**

---

## What DNA is

DNA is not a documentation generator. It is:

- A **project intelligence system** — structured context AI can actually use
- An **AI behaviour layer** — rules that govern how Cursor, Copilot, and Claude work on *your* project
- A **runtime issue detector** — classifies errors with project-specific context
- A **GitHub automation engine** — contextual issues and repair PRs
- A **knowledge marketplace** — **965** stack, compliance, and industry packs for `.DNA/knowledge/`
- A **software immune system** — severity, category, and discipline classification
- A **memory layer** — CellularMemory that learns from your project's history

---

## Quick start

```bash
cd /path/to/your-project    # or portfolio parent for multi-app squads
npx @superhumaan/dna-by-humaan doctor

# In Cursor: type / for 77 stems and /dna-* commands — already installed
# Portfolio squads: run doctor on the parent folder, not each repo
```

**Team rollout guide:** [TEAM-TESTING.md](./TEAM-TESTING.md)  
**Portfolio install:** [docs/product/portfolio-install.md](./docs/product/portfolio-install.md)  
**Full documentation:** [docs/](./docs/README.md) · **Changelog:** [CHANGELOG.md](./CHANGELOG.md)

---

## Install

| Method | Command |
|--------|---------|
| **npm** (recommended) | `npx @superhumaan/dna-by-humaan doctor` |
| **Interactive wizard** | `npx @superhumaan/dna-by-humaan init -y` then `doctor` |
| **Team setup** (monorepo dev) | `git clone https://github.com/superhumaan/DNA.git && ./scripts/team-setup.sh` |
| **Manual** | `pnpm install && pnpm build && pnpm dna:link` |

Requirements: **Node.js 20+**, **pnpm 9+**

---

## Portfolio install (one squad, many products)

Most squads cannot afford Sentry on every service, premium AI memory on every seat, and GitHub Teams on top of rent. **Install DNA once** on the folder that holds all related products — enterprise health apps, monorepo `apps/*`, agency client suites — not inside each repo.

```bash
cd ~/work/your-squad-folder     # parent of every related product
npx @superhumaan/dna-by-humaan doctor
```

**One command installs everything** — no bolt-ons, no “upgrade for memory”:

| Layer | Included |
|-------|----------|
| **Intelligence** | `.DNA/` — config, neuralNetwork, 8 behaviour files, 7 CellularMemory regions, immune system |
| **AI workbench** | `AGENTS.md`, Cursor + Claude rules/skills, always-on co-pilot (no “use DNA”) |
| **Stems & commands** | **77** prompt stem packs (guidelines, expectations, workflows) + **`/dna-*`** slash commands |
| **Feature factory** | 9-role agent loop, `ai/agent-loop.md`, product-process rules, quality gates |
| **Detection** | Stack, monorepo apps, AI tools, GitHub, healthcare/legal domain, Impressions drift, auth patterns |
| **Runtime** | Observer auto-wired into Express/Fastify/Next.js → classified issues + repair plans |
| **Delivery** | CI workflows, pre-push hook, Docker scaffold, GitHub browser login |
| **Knowledge** | Foundation packs from scan + **965** marketplace packs (offline fallback) |

One `.DNA/` at the parent remembers **every product and how they interconnect** — feature #5 uses the same template as feature #1; runtime errors explain *why* across the suite.

[Full manifest — why no one regrets this install →](./docs/product/portfolio-install.md)

---

## Core commands

| Command | What it does |
|---------|--------------|
| `dna init` | Scaffold `.DNA/` + `DNA/Impressions/` |
| `dna analyze` | Deep brownfield analysis (structure, auth, IVF gaps) |
| `dna document --from-code` | Reverse-engineer Impressions from existing code |
| `dna plan ivf` | Integrating Vertical Functions plan — before/after, phased migration |
| `dna scan` | Detect stack, tests, CI, risks |
| `dna context cursor` | AI-ready context for your tool |
| `dna plan rbac` | RBAC plan from plain language → permission matrix |
| `dna platform list` | DNA production feature catalog (AIStudio, ColorParty, Humaan Ops, Soli) |
| `dna plan feature <id>` | End-to-end feature plan — Azure, SSO, admin, flags, CRM, CMS |
| `dna plan compliance` | Tiered ISO/GDPR/HIPAA/SOC 2 plan by org size |
| `dna compliance list` | Startup → enterprise compliance catalog |
| `dna context compliance` | Load tiered compliance knowledge for AI |
| `dna validate` | Check against Behaviour rules |
| `dna doctor` | Full health check |
| `dna feedback report` | Report a DNA-platform issue upstream (sanitized, opt-in) |
| `dna feedback sync` | Flush offline feedback queue |
| `dna marketplace install <id>` | Install knowledge packs |
| `dna runtime install` | Runtime integration snippets |

[Complete CLI reference →](./docs/cli-reference.md)

---

## Architecture

DNA maintains two separate worlds:

```
your-project/
├── .DNA/                 # AI-first intelligence (machines)
│   ├── config.dna.json
│   ├── neuralNetwork.json
│   ├── behaviour/
│   ├── knowledge/
│   ├── CellularMemory/
│   ├── immuneSystem/
│   └── runtime/
└── DNA/Impressions/      # Human documentation (people)
    ├── product/
    ├── architecture/
    ├── security/
    └── ...
```

| `.DNA/` | `DNA/Impressions/` |
|---------|-------------------|
| Behaviour, memory, routing | Product, architecture, compliance docs |
| Runtime events and issues | SRS, release notes, user guides |
| AI tool configuration | Auditor and stakeholder facing |

[Learn the concepts →](./docs/concepts.md)

---

## Runtime observer

DNA ships as **one package**. The CLI runs in your terminal; the runtime imports from a subpath in your server:

```bash
pnpm add @superhumaan/dna-by-humaan
```

```typescript
import { dnaRuntime } from "@superhumaan/dna-by-humaan/runtime";

dnaRuntime.start({ projectId: "my-app", projectRoot: process.cwd() });
app.use(dnaRuntime.express());
app.use(dnaRuntime.errorHandler());
```

Supports **Express**, **Fastify**, **NestJS**, and **Next.js**.

[Runtime guide →](./docs/runtime.md)

---

## Knowledge marketplace

```bash
dna marketplace list
dna marketplace install frameworks/nextjs
dna marketplace install compliance/gdpr
dna update
```

Remote: [dna.humaan.app/marketplace](https://dna.humaan.app/marketplace) · Offline bundled fallback included.

[Marketplace docs →](./docs/marketplace.md)

---

## GitHub, upstream feedback & AI repair

```bash
dna github login
dna github connect --owner ORG --repo REPO

# Upstream DNA platform feedback (opt-in, dna-only by default)
dna feedback report --message "doctor failed" --command "dna doctor" --dry-run
dna feedback sync
dna feedback status

dna ai connect --provider mock
dna ai repair --file issue.json --dry-run
```

**Local issues:** high/critical runtime errors → your project's GitHub repo.  
**Upstream feedback:** DNA CLI/doctor/runtime failures → sanitized reports to [superhumaan/DNA](https://github.com/superhumaan/DNA/issues) (deduped by fingerprint). App bugs stay in your repo.

**Safety:** never auto-merges, never deploys, never touches secrets. Feedback payloads are redacted before send.

[Integrations guide →](./docs/integrations.md)

---

## Monorepo

```
packages/
  dna-cli/        CLI
  dna-core/       Scanner, wizard, marketplace
  dna-runtime/    Runtime + adapters
  dna-immune/     Classifier + DNA platform detection
  dna-feedback/   Upstream feedback (sanitize, queue, ingest)
  dna-github/     GitHub API
  dna-ai/         AI repair
  dna-config/     Schemas
  dna-templates/  Snippets

apps/
  examples/       Express + Vite demos
  web/            dna.humaan.app — landing + marketplace
  marketplace/    Legacy standalone API (local dev)
```

```bash
pnpm install && pnpm build && pnpm test
```

[Development guide →](./docs/development.md)

---

## Documentation

Full wiki: **[docs/README.md](./docs/README.md)** · Browse locally: `pnpm run wiki:dev`

| Section | Start here |
|---------|------------|
| **Business** | [Business strategy](./docs/business/business-strategy.md) |
| **Product** | [Product concept](./docs/product/product-concept.md) · [Portfolio install](./docs/product/portfolio-install.md) · [Marketplace](./docs/product/marketplace.md) |
| **Design** | [Naming conventions](./docs/design/naming-conventions.md) |
| **Delivery** | [Brownfield / IVF](./docs/delivery/features/brownfield-ivf.md) |
| **Engineering** | [Quick start](./docs/engineering/quick-start.md) · [CLI reference](./docs/engineering/cli-reference.md) |
| **Quality** | [Testing strategy](./docs/quality-assurance/testing-strategy.md) |

| Also | |
|------|---|
| [Changelog](./CHANGELOG.md) | Releases and migrations |
| [Team Testing](./TEAM-TESTING.md) | Colleague pilot guide |
| [Contributing](./CONTRIBUTING.md) | PR guidelines |
| [LOCAL_WIKI.md](./docs/LOCAL_WIKI.md) | Wiki commands |

---

## Roadmap

DNA is evolving from project scaffold to a full delivery loop: init → feature factory → quality → Docker → GitHub push → CI. Track progress on the [DNA Roadmap project board](https://github.com/users/superhumaan/projects/3/views/1).

| Item | Start | End | Status |
|------|-------|-----|--------|
| Knowledge pack marketplace (965 packs) | Jan 2026 | Jul 2026 | Shipped |
| DNA always-on + `AGENTS.md` agent flow (v0.4.9) | Jul 2026 | Jul 2026 | Shipped |
| Legal advisor + delivery methodology (v0.4.9) | Jul 2026 | Jul 2026 | Shipped |
| Fastify, NestJS, Next.js runtime adapters | Feb 2026 | Apr 2026 | Shipped |
| `npx @superhumaan/dna-by-humaan` on npm (v0.4.0) | Mar 2026 | Jul 2026 | Shipped |
| [Supply-chain hardening + Socket transparency](https://socket.dev/npm/package/@superhumaan/dna-by-humaan) (v0.4.4) | Jul 2026 | Jul 2026 | Shipped |
| [Zero npm dependencies](https://socket.dev/npm/package/@superhumaan/dna-by-humaan) (v0.4.5) | Jul 2026 | Jul 2026 | Shipped |
| npm `dna doctor` workbench asset path fix (v0.4.6) | Jul 2026 | Jul 2026 | Shipped |
| [Upstream feedback](https://github.com/superhumaan/DNA/issues) — DNA platform auto-report (v0.4.8) | Jul 2026 | Jul 2026 | Shipped |
| [Prompt stem packs + intelligence library](https://dna.humaan.app/intelligence) | Jul 2026 | Jul 2026 | Shipped |
| Strategy stem ladder (Golden Circle → canvases → OKRs/KPIs → Now/Next/Later; 77 stems, catalog v6) | Jul 2026 | Jul 2026 | Shipped |
| [End-to-end delivery pipeline](https://github.com/superhumaan/DNA/issues/1) | May 2026 | Jul 2026 | Shipped |
| [Interactive onboarding wizard](https://github.com/superhumaan/DNA/issues/2) | May 2026 | Jun 2026 | Shipped |
| [Feature factory v2 + admin portal pattern](https://github.com/superhumaan/DNA/issues/3) | May 2026 | Jun 2026 | Shipped |
| [Local quality module (`dna quality`)](https://github.com/superhumaan/DNA/issues/4) | May 2026 | Jul 2026 | Shipped |
| [CI, Docker, and git hooks generators](https://github.com/superhumaan/DNA/issues/5) | Jun 2026 | Jul 2026 | Shipped |
| [Doctor orchestrator + `dna ivf`](https://github.com/superhumaan/DNA/issues/6) | Jun 2026 | Jul 2026 | Shipped |
| [IVF UI layer stack (MUI, mobile, shared library)](https://github.com/superhumaan/DNA/issues/7) | Jun 2026 | Jul 2026 | Shipped |
| [GitHub integration package](https://github.com/superhumaan/DNA/issues/8) | Jun 2026 | Jul 2026 | Shipped |
| [Runtime SQLite storage](https://github.com/superhumaan/DNA/issues/9) | Jun 2026 | Jul 2026 | Shipped |
| [Preview deployment workflow](https://github.com/superhumaan/DNA/issues/10) | Jul 2026 | Aug 2026 | Shipped |
| [DNA Lab — production observability at `/labs`](https://github.com/superhumaan/DNA/issues/12) | Jul 2026 | Jul 2026 | Shipped |
| Lab hardening + Aggressive Repair Loop (v0.6.3) | Jul 2026 | Jul 2026 | Shipped |
| Lab UI v4 + runtime depth + EPIPE/repair harden (v0.6.4) | Jul 2026 | Jul 2026 | Shipped |
| Lab gateway auth + honest pairing init (v0.6.5) | Jul 2026 | Jul 2026 | Shipped |
| DNA pairing is DNA-only (v0.6.6) | Jul 2026 | Jul 2026 | Shipped |
| Lab UI Humaan admin parity (v0.6.7) | Jul 2026 | Jul 2026 | Shipped |
| Lab CI billing blocker + cleanup anti-cascade (v0.6.8) | Jul 2026 | Jul 2026 | Shipped |
| Lab pairing paste-first without init (v0.6.9) | Jul 2026 | Jul 2026 | Superseded by store-first (v0.6.11) |
| Lab pairing store-first + gateway allowlist (v0.6.11) | Jul 2026 | Jul 2026 | Shipped |
| Express 5 optional peer (v0.6.12) | Jul 2026 | Jul 2026 | Shipped — `express@^4 \|\| ^5` |
| Production health & residual closure (v0.6.13) | Jul 2026 | Jul 2026 | Shipped — shared Lab state, strict CI, coverage, Playwright, `/health` |
| Lab analytics Overview + Sentry-density Issues (v0.6.14) | Jul 2026 | Jul 2026 | Shipped — KPIs/batteries/charts; issue sparklines + deep detail |
| [First-party GitHub OAuth app](https://github.com/superhumaan/DNA/issues/11) | Jul 2026 | Sep 2026 | Shipped — setup script + OAuth scaffolding |
| [IVF Phase 4b — shared library extraction](https://github.com/superhumaan/DNA/issues/16) | Aug 2026 | Oct 2026 | Shipped |
| [Multi-project CellularMemory sync](https://github.com/superhumaan/DNA/issues/13) | Oct 2026 | Jan 2027 | Shipped |
| [Impressions drift → auto PR suggestions](https://github.com/superhumaan/DNA/issues/14) | Oct 2026 | Feb 2027 | Shipped |
| [Platform feature codegen (SSO, multi-tenant, flags)](https://github.com/superhumaan/DNA/issues/17) | Nov 2026 | Feb 2027 | Shipped |
| [Multi-tenant gradual rollout patterns](https://github.com/superhumaan/DNA/issues/15) | Jan 2027 | Mar 2027 | Shipped |

---

## Sponsors

<!-- sponsors:ledger:start -->
DNA is MIT-licensed and maintained in the open. Sponsorship funds hosting, security updates, and the marketplace — not premium features.

_No sponsors yet — [be the first](https://github.com/sponsors/superhumaan)._
<!-- sponsors:ledger:end -->

## License

MIT © 2026 [Humaan by Superlite](https://dna.humaan.app)

See [LICENSE](./LICENSE) for full text.
