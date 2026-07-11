# Architecture overview

DNA maintains **two separate worlds** in every project it manages, plus a monorepo that builds the tooling itself.

---

## Consumer project layout

```
your-project/
├── .DNA/                 # AI-first intelligence (machines)
│   ├── config.dna.json
│   ├── neuralNetwork.json
│   ├── behaviour/
│   ├── knowledge/
│   ├── CellularMemory/
│   ├── immuneSystem/
│   ├── runtime/
│   └── plans/
└── DNA/Impressions/      # Human documentation (people)
    ├── product/
    ├── architecture/
    ├── security/
    └── compliance/
```

| `.DNA/` | `DNA/Impressions/` |
|---------|-------------------|
| Behaviour, memory, routing | Product, architecture, compliance docs |
| Runtime events and issues | SRS, release notes, user guides |
| AI tool configuration | Auditor and stakeholder facing |

---

## Runtime pipeline

When `@superhumaan/dna-by-humaan/runtime` captures an event:

1. Append to `.DNA/runtime/events.jsonl`
2. Classify via Immune System
3. Append to `.DNA/runtime/issues.jsonl`
4. Update CellularMemory if repeated
5. Optionally create GitHub issue (high/critical)
6. Optionally trigger AI repair workflow

See [Runtime observer](../runtime-observer.md).

---

## DNA monorepo (this repo)

```
packages/
  dna-cli/        CLI entry (`dna` command)
  dna-core/       Scanner, wizard, generators, marketplace
  dna-config/     Typed config schemas, validators, constants
  dna-runtime/    Runtime observer + adapters
  dna-immune/     Issue classifier + DNA platform detection
  dna-feedback/   Upstream feedback (sanitize, queue, ingest)
  dna-github/     GitHub API
  dna-ai/         AI repair orchestrator
  dna-templates/  Install snippets
  dna-docs/       Doc utilities

apps/
  examples/       Express + Vite demos
  docs/           Docusaurus wiki (synced from docs/)
  marketplace/    Standalone marketplace API (local dev)
```

Web UI: [superhumaan/DNA-Web](https://github.com/superhumaan/DNA-Web) → dna.humaan.app

See [Monorepo](./monorepo.md).

---

## Related

- [Domain model](../../product/domain-model-and-glossary.md)
- [Two worlds](./two-worlds.md)
