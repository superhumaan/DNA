# DNA by Humaan

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

> **Git remembers your code. DNA remembers your system.**

> **Sentry tells you what broke. DNA tells you why, remembers it, and opens the PR.**

**DNA by Humaan** is an open-source project brain, runtime observer, knowledge marketplace, and AI-assisted repair system for modern TypeScript teams.

Built by **[Humaan](https://humaan.com)** · **[Superlite](https://superlite.ai)**  
Repository: **[github.com/superhumaan/DNA](https://github.com/superhumaan/DNA)**

---

## What DNA is

DNA is not a documentation generator. It is:

- A **project intelligence system** — structured context AI can actually use
- An **AI behaviour layer** — rules that govern how Cursor, Copilot, and Claude work on *your* project
- A **runtime issue detector** — classifies errors with project-specific context
- A **GitHub automation engine** — contextual issues and repair PRs
- A **knowledge marketplace** — stack and compliance packs for `.DNA/knowledge/`
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
**Full documentation:** [docs/](./docs/README.md)

---

## Install

| Method | Command |
|--------|---------|
| **Team setup** (now) | `git clone https://github.com/superhumaan/DNA.git && ./scripts/team-setup.sh` |
| **Manual** | `pnpm install && pnpm build && pnpm dna:link` |
| **npm** (after publish) | `npx @humaan/dna-cli init -y` |

Requirements: **Node.js 20+**, **pnpm 9+**

---

## Core commands

| Command | What it does |
|---------|--------------|
| `dna init` | Scaffold `.DNA/` + `DNA/Impressions/` |
| `dna scan` | Detect stack, tests, CI, risks |
| `dna context cursor` | AI-ready context for your tool |
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

```bash
pnpm add @humaan/dna-runtime   # or: scripts/add-runtime.sh
```

Supports **Express**, **Fastify**, **NestJS**, and **Next.js**.

```typescript
import { dnaRuntime } from "@humaan/dna-runtime";

dnaRuntime.start({ projectId: "my-app", projectRoot: process.cwd() });
app.use(dnaRuntime.express());
app.use(dnaRuntime.errorHandler());
```

Captures errors → classifies via Immune System → writes `.DNA/runtime/issues.jsonl` → optional GitHub issue → optional AI repair PR.

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
  marketplace/  API for dna.humaan.app
```

```bash
pnpm install && pnpm build && pnpm test
```

[Development guide →](./docs/development.md)

---

## Documentation

| Doc | Description |
|-----|-------------|
| [Getting Started](./docs/getting-started.md) | First project in 10 minutes |
| [Concepts](./docs/concepts.md) | Behaviour, memory, immune system |
| [CLI Reference](./docs/cli-reference.md) | Every command |
| [Runtime](./docs/runtime.md) | Framework adapters |
| [Marketplace](./docs/marketplace.md) | Knowledge packs |
| [Integrations](./docs/integrations.md) | GitHub + AI |
| [Team Testing](./TEAM-TESTING.md) | Colleague pilot guide |
| [Contributing](./CONTRIBUTING.md) | PR guidelines |

---

## Roadmap

- [x] Knowledge pack marketplace
- [x] Fastify, NestJS, Next.js runtime adapters
- [ ] Real-time dashboard UI
- [ ] Multi-project CellularMemory sync
- [ ] Impressions drift → auto PR suggestions
- [ ] `npx @humaan/dna-cli` on npm

---

## License

MIT © 2026 [Humaan by Superlite](https://humaan.com)

See [LICENSE](./LICENSE) for full text.
