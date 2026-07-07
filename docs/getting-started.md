# Getting Started

DNA by Humaan is **one npm package** with two modes:

| Mode | How | When |
|------|-----|------|
| **Build intelligence** | `npx @superhumaan/dna-by-humaan` → `dna` CLI | Always — scaffolds `.DNA/`, feeds AI tools |
| **Production protection** | `import from "@superhumaan/dna-by-humaan/runtime"` | When you have a Node.js API server |

---

## Prerequisites

- **Node.js 20+**
- **Git**

---

## Install

```bash
cd /path/to/your-project
npx @superhumaan/dna-by-humaan init -y
dna doctor
```

For backend projects, add the same package to your app dependencies (runtime is a subpath export):

```bash
pnpm add @superhumaan/dna-by-humaan
```

```typescript
import { dnaRuntime } from "@superhumaan/dna-by-humaan/runtime";
```

---

## Initialise a project

```bash
dna init -y
dna doctor
dna validate
```

Interactive wizard:

```bash
dna init
```

---

## Generated structure

```
your-project/
├── .DNA/
│   ├── config.dna.json
│   ├── behaviour/
│   ├── knowledge/
│   ├── CellularMemory/
│   └── runtime/             # live issues when observer is enabled
└── DNA/Impressions/
```

Commit both `.DNA/` and `DNA/`.

---

## Daily workflow

```bash
dna scan
dna context cursor
dna plan compliance
dna validate
```

### Brownfield (existing project)

```bash
dna init                          # stage: legacy_modernisation
dna analyze --deep
dna document --from-code
dna plan ivf --quote "Integrate DNA without a rewrite"
dna context ivf
```

See [Brownfield / IVF](./ivf.md).

---

## Production protection

```bash
pnpm add @superhumaan/dna-by-humaan
dna runtime install
```

See [Runtime Observer](./runtime.md).

---

## Next steps

- [Concepts](./concepts.md)
- [CLI Reference](./cli-reference.md)
- [Team Testing](../TEAM-TESTING.md)
