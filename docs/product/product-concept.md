# Product concept

DNA is a **project intelligence system** — not a documentation generator. It gives AI tools, your CLI, and your runtime observer a shared, structured understanding of how your system is supposed to work.

---

## North star

> **Git remembers your code. DNA remembers your system.**

> **Sentry tells you what broke. DNA tells you why, remembers it, and opens the PR.**

---

## What DNA is

| Capability | Description |
|------------|-------------|
| **Project intelligence** | `.DNA/` — config, Behaviour, CellularMemory, neuralNetwork |
| **Human documentation** | `DNA/Impressions/` — product, architecture, compliance for people |
| **AI behaviour layer** | Rules governing Cursor, Copilot, Claude on *your* project |
| **Runtime observer** | Classifies errors with project-specific context |
| **Knowledge marketplace** | 965 stack, compliance, and industry packs |
| **Software immune system** | Severity, category, discipline classification |
| **GitHub automation** | Contextual issues and repair PRs (never auto-merge) |
| **Portfolio install** | One `dna doctor` on the squad folder — every related product + interconnections |

---

## Two worlds (never mix)

| Path | Audience | Purpose |
|------|----------|---------|
| `DNA/Impressions/` | Humans — PM, QA, auditors, engineers | Product, architecture, security, compliance |
| `.DNA/` | AI tools, CLI, runtime | Rules, memory, routing, validation, runtime logs |

Impressions are prose for people. `.DNA` is structured for machines.

Full detail: [Domain model and glossary](./domain-model-and-glossary.md)

---

## One package, two modes

| Mode | How | When |
|------|-----|------|
| **Build intelligence** | `npx @superhumaan/dna-by-humaan` → `dna` CLI | Always |
| **Production protection** | `import from "@superhumaan/dna-by-humaan/runtime"` | Node.js API servers |

---

## Product direction

Every feature should pass:

1. Does it give AI *actionable* project context?
2. Does it work offline (bundled fallback)?
3. Is compliance proportionate to org tier?
4. Does it respect safety boundaries (no auto-merge, no secrets in config)?

See [Planning](./planning.md), [Product canvas](./product-canvas.md), and [Portfolio install](./portfolio-install.md).
