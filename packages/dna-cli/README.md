# DNA by Humaan

> **Git remembers your code. DNA remembers your system.**

[![npm](https://img.shields.io/npm/v/@superhumaan/dna-by-humaan)](https://www.npmjs.com/package/@superhumaan/dna-by-humaan)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/superhumaan/DNA/blob/main/LICENSE)

**One npm package. Two superpowers.**

DNA by Humaan is an open-source **project brain**, **runtime observer**, **768-pack knowledge marketplace**, and **AI-assisted repair** system for modern TypeScript teams.

Built by [Humaan](https://humaan.com) · [Superlite](https://superlite.ai)

| | |
|---|---|
| **Website** | [dna.humaan.app](https://dna.humaan.app) |
| **Marketplace** | [dna.humaan.app/marketplace](https://dna.humaan.app/marketplace) |
| **Repository** | [github.com/superhumaan/DNA](https://github.com/superhumaan/DNA) |
| **npm** | [@superhumaan/dna-by-humaan](https://www.npmjs.com/package/@superhumaan/dna-by-humaan) |

---

## Install

```bash
npx @superhumaan/dna-by-humaan init -y
```

That's the whole product on npm — **CLI + `/runtime` subpath**, fully bundled. No separate `@superhumaan/dna-core` install required.

```bash
# Production runtime (same package)
pnpm add @superhumaan/dna-by-humaan
```

---

## What DNA is

DNA is **not** a documentation generator. It is:

| Capability | What it does |
|------------|--------------|
| **Project intelligence** | Structured `.DNA/` context AI tools can actually use |
| **AI behaviour layer** | Rules governing how Cursor, Copilot, and Claude work on *your* stack |
| **Runtime observer** | Classifies production errors with project-specific context |
| **Knowledge marketplace** | **768** curated packs — frameworks, cloud, healthcare, compliance, payments, gaming, ERP |
| **Tiered compliance** | GDPR, UK GDPR, HIPAA, ISO 27001, SOC 2, PCI DSS — startup → enterprise |
| **GDPR reference library** | **85+** governance, technical, and AI policy templates (bundled in CLI assets) |
| **Platform catalog** | Production patterns from Humaan systems (AIStudio, ColorParty, Humaan Ops, Soli) |
| **IVF (brownfield)** | Install into existing codebases — analyze, document, phased migration plans |
| **GitHub automation** | Contextual issues and AI-assisted repair PRs |
| **Software immune system** | Severity, category, and discipline classification |
| **CellularMemory** | Learns from your project's history |

---

## Quick start

```bash
npx @superhumaan/dna-by-humaan init -y
dna doctor
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
| `dna plan rbac` | RBAC from plain language → permission matrix |
| `dna plan compliance` | ISO / GDPR / HIPAA / SOC 2 by org tier |
| `dna compliance list` | Startup → enterprise compliance catalog |
| `dna context compliance` | Load tiered compliance knowledge for AI |
| `dna platform list` | Humaan production feature catalog |
| `dna plan feature <id>` | End-to-end plans — SSO, admin, flags, Azure, CRM, CMS |
| `dna marketplace list` | Browse 768 knowledge packs |
| `dna marketplace install <id>` | Install packs into `.DNA/knowledge/` |
| `dna validate` | Check against Behaviour rules |
| `dna doctor` | Full health check |
| `dna runtime install` | Framework snippets for production observer |
| `dna github connect` | Wire GitHub issues + repair workflow |
| `dna ai repair` | AI-assisted fix suggestions (dry-run safe) |

[Full CLI reference →](https://github.com/superhumaan/DNA/blob/main/docs/cli-reference.md)

---

## Knowledge marketplace (768 packs)

```bash
dna marketplace list
dna marketplace search --query healthcare
dna marketplace search --query fhir
dna marketplace install frameworks/nextjs
dna marketplace install compliance/gdpr
dna marketplace install healthcare/fhir-r4
dna update
```

**Live catalog:** [dna.humaan.app/marketplace](https://dna.humaan.app/marketplace) · Offline bundled fallback included.

| Layer | Count | Examples |
|-------|------:|----------|
| Core (frameworks, compliance, Humaan stack) | 11 | Next.js, GDPR, RBAC |
| Stem delivery surfaces | 21 | `stem/*` |
| Language stems (i18n AI) | 18 | `languages/en`, `languages/vi`, … |
| Catalog expansion v1 | 79 | CMS, payments, modern frameworks |
| Wave 2 | 283 | Healthcare (45), databases, cloud, AI/LLM |
| Wave 3 | 187 | Enterprise ERP, gaming/XR, clinical AI |
| Wave 4 | 142 | Regional cloud, ORMs, security depth |
| Wave 5 | 27 | FinOps, data mesh, store distribution |
| **Total** | **768** | |

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
```

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

## GitHub & AI repair

```bash
dna github connect --owner ORG --repo REPO
export GITHUB_TOKEN=ghp_...

dna ai connect --provider mock
dna ai repair --file issue.json --dry-run
```

**Safety:** never auto-merges, never deploys, never touches secrets.

[Integrations guide →](https://github.com/superhumaan/DNA/blob/main/docs/integrations.md)

---

## Project structure

```
your-project/
├── .DNA/                    # AI-first intelligence (machines)
│   ├── behaviour/           # rules for Cursor, Copilot, Claude
│   ├── knowledge/           # 768-pack marketplace installs
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
| 768 knowledge packs + GDPR library | A hosted SaaS — runs in your repo |
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
| [Marketplace](https://github.com/superhumaan/DNA/blob/main/docs/marketplace.md) | 768 knowledge packs |
| [Compliance](https://github.com/superhumaan/DNA/blob/main/docs/compliance.md) | Tiered GDPR, HIPAA, ISO, SOC 2 |
| [Platform catalog](https://github.com/superhumaan/DNA/blob/main/docs/platform.md) | Humaan production patterns |
| [Integrations](https://github.com/superhumaan/DNA/blob/main/docs/integrations.md) | GitHub issues + AI repair |
| [Team testing](https://github.com/superhumaan/DNA/blob/main/TEAM-TESTING.md) | Colleague pilot guide |

---

## Requirements

- **Node.js 20+**
- TypeScript projects (JavaScript supported via scan)

---

## License

MIT © [Humaan by Superlite](https://humaan.com)
