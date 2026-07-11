# Getting Started

DNA by Humaan is **one npm package** with two modes:

| Mode | How | When |
|------|-----|------|
| **Build intelligence** | `npx @superhumaan/dna-by-humaan doctor` → full platform | Always — one install for the whole squad folder |
| **Production protection** | `import from "@superhumaan/dna-by-humaan/runtime"` | When you have a Node.js API server |

> **Portfolio squads:** install on the **parent folder** that holds every related app — not inside each repo. [Portfolio install guide →](../product/portfolio-install.md)

---

## Prerequisites

- **Node.js 20+**
- **Git**

---

## Install (recommended)

```bash
cd /path/to/your-project          # or portfolio parent for multi-app squads
npx @superhumaan/dna-by-humaan doctor
npm install                       # if doctor added @superhumaan/dna-by-humaan
```

**One `dna doctor` installs everything:**

| Layer | Included |
|-------|----------|
| `.DNA/` intelligence | config, neuralNetwork, behaviour, CellularMemory, immune system |
| **59 stem packs** + **`/dna-*` commands** | guidelines, expectations, workflows |
| **AI workbench** | `AGENTS.md`, Cursor + Claude rules/skills — always on |
| **Detection** | stack, monorepo apps, AI tools, GitHub, healthcare/legal, drift |
| **Feature factory** | 9-role loop, quality gates, same template every feature |
| **Runtime + CI** | auto-wired observer, GitHub Actions, pre-push hook, Docker |
| **897 knowledge packs** | foundation from scan + marketplace |

Doctor opens GitHub browser sign-in when needed and auto-wires the runtime observer for Express, Fastify, and Next.js.

For backend projects, the runtime package is added automatically when missing:

```bash
pnpm add @superhumaan/dna-by-humaan   # only if not already added by doctor
```

```typescript
import { dnaRuntime } from "@superhumaan/dna-by-humaan/runtime";
```

---

## Portfolio install (multi-product squads)

```bash
cd ~/work/your-squad-folder    # parent of product-a, product-b, shared-api…
npx @superhumaan/dna-by-humaan doctor
dna analyze
dna context cursor
```

Commit `.DNA/`, `DNA/`, `AGENTS.md`, `ai/`, `.cursor/`, and `.claude/` at the **parent** so the squad shares one brain.

[Full manifest →](../product/portfolio-install.md)

---

## Initialise (interactive wizard)

Use `init` only when you want the four-question wizard before doctor:

```bash
dna init -y
dna doctor
dna validate
```

Interactive onboarding:

```bash
dna init
```

1. Project name  
2. What are you building?  
3. Platform (web, mobile, desktop, CMS)  
4. Optional platform features  

Describe features in plain language in chat — no copy-paste prompts:

```bash
dna feature "I want providers to record phone calls and transcribe notes"
```

---

## Generated structure

```
your-project/
├── AGENTS.md
├── ai/                      # feature factory
├── .cursor/                 # rules, skills, commands, stems
├── .claude/
├── .github/workflows/       # dna-ci, preview, security
├── .DNA/
│   ├── config.dna.json
│   ├── behaviour/
│   ├── knowledge/
│   ├── stems/               # 59 prompt stem packs
│   ├── CellularMemory/
│   └── runtime/
└── DNA/Impressions/
```

Commit `.DNA/`, `DNA/`, workbench files, and CI workflows.

---

## Daily workflow

```bash
dna scan
dna context cursor
dna plan compliance
dna validate
```

Type `/` in Cursor for stem packs and `/dna-*` commands.

### Platform features (admin, SSO, deploy)

```bash
dna platform list
dna plan feature admin-portal --quote "Admin portal with Google directory sync"
dna context platform
```

See [Platform Catalog](./platform.md).

### Brownfield (existing project)

```bash
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

### Feature factory (automatic)

Installed during `dna doctor`. Describe what you want in Cursor or Claude — no prompts to copy. Optional terminal start: `dna feature "..."`.

Each feature gets a **local quality report** (SonarQube-style SAST + lint/typecheck) in `.DNA/reports/quality/`. Agents run `dna quality report --feature` before marking work complete.

**Close-out gates (automatic):** `dna docker build` then `dna github push`. GitHub permissions are granted once during `dna doctor` via browser login — no manual tokens.

---

## Optional: local reference repos

If you clone DNA's reference production apps (AIStudio, ColorParty, Humaan Ops, Soli), point the CLI at them:

```bash
export DNA_REFERENCE_ROOT=~/Projects
dna platform projects
```

See [Platform Catalog](./platform.md#reference-repos-on-your-machine).

---

## Next steps

| Topic | Guide |
|-------|-------|
| Portfolio install | [One squad, many products](../product/portfolio-install.md) |
| Core concepts | [Concepts](./concepts.md) |
| All commands | [CLI Reference](./cli-reference.md) |
| Knowledge packs | [Marketplace](../product/marketplace.md) |
| Team rollout | [Team Testing](../../TEAM-TESTING.md) |
| Naming (Humaan vs DNA) | [Naming conventions](./naming.md) |
