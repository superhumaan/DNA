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

Interactive onboarding (four questions):

```bash
dna init
```

1. Project name  
2. What are you building?  
3. Platform (web, mobile, desktop, CMS)  
4. Optional platform features  

DNA then configures Cursor rules, Claude context, knowledge packs, and the feature factory automatically. Describe features in plain language in chat — no copy-paste prompts.

```bash
dna feature "I want providers to record phone calls and transcribe notes"
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

### Platform features (admin, SSO, deploy)

```bash
dna platform list
dna plan feature admin-portal --quote "Admin portal with Google directory sync"
dna context platform
```

See [Platform Catalog](./platform.md).

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

### Feature factory (automatic)

Installed during `dna init`. Describe what you want in Cursor or Claude — no prompts to copy. Optional terminal start: `dna feature "..."`. Uninstall: `dna feature-factory uninstall`.

Each feature gets a **local quality report** (SonarQube-style SAST + lint/typecheck) in `.DNA/reports/quality/` — no SonarQube server needed. Agents run `dna quality report --feature` before marking work complete.

**Close-out gates (automatic):** `dna docker build` then `dna github push`. GitHub permissions are granted once during `dna init` via browser login — no manual tokens.

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
| Core concepts | [Concepts](./concepts.md) |
| All commands | [CLI Reference](./cli-reference.md) |
| Knowledge packs | [Marketplace](./marketplace.md) |
| Team rollout | [Team Testing](../TEAM-TESTING.md) |
| Naming (Humaan vs DNA) | [Naming conventions](./naming.md) |
