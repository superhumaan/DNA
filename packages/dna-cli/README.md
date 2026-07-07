# DNA by Humaan

> **Git remembers your code. DNA remembers your system.**

[![npm](https://img.shields.io/npm/v/@superhumaan/dna-by-humaan)](https://www.npmjs.com/package/@superhumaan/dna-by-humaan)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/superhumaan/DNA/blob/main/LICENSE)

**One package. Two superpowers.**

DNA by Humaan is a single install that gives your TypeScript project a **living brain** for AI-assisted development *and* **production protection** when your server runs.

Built by [Humaan](https://humaan.com) · [Superlite](https://superlite.ai)

---

## Install

```bash
npx @superhumaan/dna-by-humaan init -y
```

That's the whole product on npm — CLI + runtime observer, bundled.

---

## What you get

### 1. Build intelligence (CLI)

Run in your terminal. Scaffolds `.DNA/`, feeds Cursor and Copilot, plans features and compliance.

```bash
dna doctor
dna context cursor
dna plan compliance
dna scan
```

### 2. Production protection (runtime)

Import in your server. Watches live errors, classifies them with your project's rules, writes `.DNA/runtime/issues.jsonl`.

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

Or let DNA wire it:

```bash
dna runtime install
```

---

## Project structure

```
your-project/
├── .DNA/                    # AI + runtime intelligence
│   ├── behaviour/           # rules for Cursor, Copilot, Claude
│   ├── knowledge/           # stack + compliance packs
│   ├── CellularMemory/      # learned history
│   └── runtime/             # classified production issues
└── DNA/Impressions/         # human-facing docs
```

---

## Core commands

| Command | What it does |
|---------|--------------|
| `dna init` | Scaffold `.DNA/` + `DNA/Impressions/` |
| `dna scan` | Detect stack, tests, CI, risks |
| `dna context cursor` | AI-ready context for your editor |
| `dna plan rbac` | RBAC from plain language → permission matrix |
| `dna plan compliance` | ISO / GDPR / HIPAA / SOC 2 by org tier |
| `dna plan feature <id>` | End-to-end feature plan (SSO, admin, flags…) |
| `dna validate` | Check against Behaviour rules |
| `dna doctor` | Full health check |
| `dna runtime install` | Framework snippets for production observer |

[Full CLI reference →](https://github.com/superhumaan/DNA/blob/main/docs/cli-reference.md)

---

## Typical workflow

```bash
# Give the project a brain
npx @superhumaan/dna-by-humaan init -y

# Feed your AI editor
dna context cursor

# Protect your API in production
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
| Knowledge packs (GDPR, Next.js, RBAC…) | A hosted SaaS — runs in your repo |

---

## Documentation

| Guide | Description |
|-------|-------------|
| [Getting started](https://github.com/superhumaan/DNA/blob/main/docs/getting-started.md) | First project in 10 minutes |
| [Concepts](https://github.com/superhumaan/DNA/blob/main/docs/concepts.md) | Behaviour, memory, immune system |
| [Runtime observer](https://github.com/superhumaan/DNA/blob/main/docs/runtime.md) | Express, Fastify, NestJS, Next.js |
| [Marketplace](https://github.com/superhumaan/DNA/blob/main/docs/marketplace.md) | Knowledge packs |
| [Integrations](https://github.com/superhumaan/DNA/blob/main/docs/integrations.md) | GitHub issues + AI repair |

**Repository:** [github.com/superhumaan/DNA](https://github.com/superhumaan/DNA)

---

## License

MIT © [Humaan by Superlite](https://humaan.com)
