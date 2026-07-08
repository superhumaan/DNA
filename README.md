# DNA by Humaan

[![npm](https://img.shields.io/npm/v/@superhumaan/dna-by-humaan)](https://www.npmjs.com/package/@superhumaan/dna-by-humaan)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

> **Git remembers your code. DNA remembers your system.**

> **Sentry tells you what broke. DNA tells you why, remembers it, and opens the PR.**

**DNA by Humaan** is an open-source project brain, runtime observer, **768-pack** knowledge marketplace, tiered compliance system, and AI-assisted repair for modern TypeScript teams.

| | |
|---|---|
| **Website** | [dna.humaan.app](https://dna.humaan.app) |
| **Marketplace** | [dna.humaan.app/marketplace](https://dna.humaan.app/marketplace) |
| **npm** | [@superhumaan/dna-by-humaan](https://www.npmjs.com/package/@superhumaan/dna-by-humaan) |
| **Repository** | [github.com/superhumaan/DNA](https://github.com/superhumaan/DNA) |

Built by **[Humaan](https://humaan.com)** · **[Superlite](https://superlite.ai)**

---

## What DNA is

DNA is not a documentation generator. It is:

- A **project intelligence system** — structured context AI can actually use
- An **AI behaviour layer** — rules that govern how Cursor, Copilot, and Claude work on *your* project
- A **runtime issue detector** — classifies errors with project-specific context
- A **GitHub automation engine** — contextual issues and repair PRs
- A **knowledge marketplace** — **768** stack, compliance, and industry packs for `.DNA/knowledge/`
- A **software immune system** — severity, category, and discipline classification
- A **memory layer** — CellularMemory that learns from your project's history

---

## Quick start

```bash
git clone https://github.com/superhumaan/DNA.git dna && cd dna
chmod +x scripts/*.sh && ./scripts/team-setup.sh

cd /path/to/your-project
dna init -y
dna doctor
dna context cursor
```

**Team rollout guide:** [TEAM-TESTING.md](./TEAM-TESTING.md)  
**Full documentation:** [docs/](./docs/README.md) · **Changelog:** [CHANGELOG.md](./CHANGELOG.md)

---

## Install

| Method | Command |
|--------|---------|
| **npm** (recommended) | `npx @superhumaan/dna-by-humaan init -y` |
| **Team setup** (monorepo dev) | `git clone https://github.com/superhumaan/DNA.git && ./scripts/team-setup.sh` |
| **Manual** | `pnpm install && pnpm build && pnpm dna:link` |

Requirements: **Node.js 20+**, **pnpm 9+**

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

## GitHub & AI repair

```bash
dna github connect --owner ORG --repo REPO
export GITHUB_TOKEN=ghp_...

dna ai connect --provider mock
dna ai repair --file issue.json --dry-run
```

**Safety:** never auto-merges, never deploys, never touches secrets.

[Integrations guide →](./docs/integrations.md)

---

## Monorepo

```
packages/
  dna-cli/        CLI
  dna-core/       Scanner, wizard, marketplace
  dna-runtime/    Runtime + adapters
  dna-immune/     Classifier
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

| Doc | Description |
|-----|-------------|
| [Documentation hub](./docs/README.md) | Index of all guides |
| [Getting Started](./docs/getting-started.md) | First project in 10 minutes |
| [Brownfield / IVF](./docs/ivf.md) | Install into existing projects |
| [Concepts](./docs/concepts.md) | Behaviour, memory, immune system |
| [Platform Catalog](./docs/platform.md) | Production patterns — admin, SSO, deploy |
| [CLI Reference](./docs/cli-reference.md) | Every command |
| [Runtime](./docs/runtime.md) | Framework adapters |
| [Marketplace](./docs/marketplace.md) | Knowledge packs |
| [Integrations](./docs/integrations.md) | GitHub + AI |
| [RBAC & Zero Trust](./docs/rbac.md) | Plain-language → permission matrix |
| [Naming conventions](./docs/naming.md) | Humaan vs DNA vs pack IDs |
| [Changelog](./CHANGELOG.md) | Releases and migrations |
| [Team Testing](./TEAM-TESTING.md) | Colleague pilot guide |
| [Contributing](./CONTRIBUTING.md) | PR guidelines |

---

## Roadmap

- [x] Knowledge pack marketplace
- [x] Fastify, NestJS, Next.js runtime adapters
- [ ] Real-time dashboard UI
- [ ] Multi-project CellularMemory sync
- [ ] Impressions drift → auto PR suggestions
- [x] `npx @superhumaan/dna-by-humaan` on npm (v0.3.1 — CLI + `/runtime` bundle, 768 packs)

---

## License

MIT © 2026 [Humaan by Superlite](https://humaan.com)

See [LICENSE](./LICENSE) for full text.
