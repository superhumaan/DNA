# Getting Started

DNA turns your repository into a **project brain** that AI tools and your runtime can read, validate, and learn from.

## Prerequisites

- **Node.js 20+**
- **pnpm 9+** (installed automatically by `team-setup.sh` via corepack)
- **Git**

## Install the CLI

### Team / from source (current)

```bash
git clone https://github.com/superhumaan/DNA.git dna
cd dna
chmod +x scripts/*.sh
./scripts/team-setup.sh
```

Verify:

```bash
dna --help
```

### After npm publish

```bash
npx @humaan/dna-cli init -y
```

## Initialise a project

```bash
cd /path/to/your-project
dna init -y          # non-interactive defaults
dna doctor           # full health check
dna validate         # behaviour + structure validation
```

Interactive wizard (recommended for new projects):

```bash
dna init
```

The wizard asks:

1. What you are building
2. Whether to accept the architecture recommendation
3. AI tools (Cursor, Claude Code, Copilot, Windsurf, Gemini)
4. Compliance requirements (GDPR, SOC 2, HIPAA, etc.)
5. Project stage (new, MVP, scaling, enterprise)

## Generated structure

```
your-project/
├── .DNA/                    # AI-first intelligence (machine-readable)
│   ├── config.dna.json
│   ├── neuralNetwork.json
│   ├── behaviour/
│   ├── knowledge/
│   ├── CellularMemory/
│   ├── immuneSystem/
│   └── runtime/
└── DNA/
    └── Impressions/         # Human-facing documentation
        ├── product/
        ├── architecture/
        ├── security/
        └── ...
```

**Commit both** `.DNA/` and `DNA/` so your team shares the same brain.

Optional `.gitignore` for noisy runtime logs:

```gitignore
.DNA/runtime/events.jsonl
.DNA/runtime/issues.jsonl
```

## Daily workflow

```bash
# Understand the stack
dna scan
dna recommend --description "B2B SaaS platform"

# Feed your AI tool
dna context cursor
dna context copilot

# Install stack knowledge
dna marketplace install frameworks/nextjs

# Watch for drift (long-running)
dna watch
```

## Add runtime observation (backend)

```bash
/path/to/dna/scripts/add-runtime.sh /path/to/your-project
```

Wire middleware for your framework — see [Runtime Observer](./runtime.md).

## Next steps

- [Concepts](./concepts.md) — how DNA thinks
- [CLI Reference](./cli-reference.md) — all commands
- [Team Testing](../TEAM-TESTING.md) — pilot with colleagues
