# Brownfield Integration (IVF Plan)

Install DNA into an **existing** project without treating it like a greenfield scaffold. DNA analyzes what you have, documents reality, then produces an **IVF Plan** (Integrating Vertical Functions) — what to restructure, why, before vs after, and phased execution.

---

## When to use

| Mode | Command | Use case |
|------|---------|----------|
| Greenfield | `dna init` | New project — templates and recommendations |
| Brownfield | `dna init` + `dna plan ivf` | Existing codebase — analyze, document, integrate |

Set project stage to `legacy_modernisation` or `audit_remediation` during init for corporate-tier compliance defaults.

---

## Quick workflow

```bash
cd /path/to/existing-project
dna init                          # choose legacy_modernisation stage
dna analyze --deep
dna document --from-code
dna plan ivf --quote "B2B SaaS — need RBAC, GDPR, runtime observer"
dna context ivf
```

---

## Commands

### analyze

Deep scan: stack, folder structure, routes, APIs, auth patterns, integrations, and vertical gap matrix.

```bash
dna analyze --deep
dna analyze --verticals behaviour,runtime,rbac,compliance
```

### document --from-code

Reverse-engineer architecture Impressions and CellularMemory from the codebase. Skips files that already have real content (use `--force` to overwrite).

```bash
dna document --from-code
dna document --from-code --force
```

**Writes:**
- `DNA/Impressions/architecture/*` — as-is stack, data flow, integrations
- `.DNA/CellularMemory/parietalLobe/system-map.md`
- `.DNA/CellularMemory/prefrontalCortex/ivf-gaps.md`

### plan ivf

Generate the full Integrating Vertical Functions plan.

```bash
dna plan ivf --quote "Integrate DNA without a rewrite"
dna plan ivf --verticals behaviour,runtime,rbac,compliance,impressions
dna plan ivf --gaps-only
dna plan ivf --no-document
```

**Writes:**
- `.DNA/plans/ivf-<project>.md` — full plan (before/after, gaps, phases)
- `.DNA/CellularMemory/prefrontalCortex/ivf-gaps.md` — gap matrix
- Updates `current-plan.md` when still on default MVP text

Automatically runs `document --from-code` unless `--no-document` is passed.

### context ivf

Load IVF plan + gap matrix + architecture Impressions for your AI session.

```bash
dna context ivf
```

---

## Vertical functions

| ID | What DNA integrates |
|----|---------------------|
| `behaviour` | Six AI behaviour files |
| `cellularMemory` | Project memory regions |
| `runtime` | Production error classifier |
| `rbac` | Permission matrix + zero trust |
| `compliance` | Tiered GDPR/HIPAA/ISO controls |
| `platform` | Admin portal, SSO, flags (DNA platform patterns) |
| `knowledge` | Marketplace packs in `.DNA/knowledge/` |
| `neuralNetwork` | Intent → resource routing |
| `impressions` | Human docs in `DNA/Impressions/` |
| `sharedLibrary` | Shared component library — dedupe UI, standardise imports |
| `mui` | Web foundation — Material UI theme + primitives |
| `buildRules` | Web build rules on top of MUI — list/report page patterns |
| `mobileTheming` | Mobile foundation — theme provider + design tokens |
| `mobileBuildRules` | Mobile build rules on top of theming — list screen patterns |

Default scope: `behaviour,cellularMemory,runtime,knowledge,neuralNetwork,mui,buildRules,sharedLibrary,impressions`

**Automatic:** MUI + build rules (web) and mobile theming + build rules (mobile) are configured on `dna init` and every `dna context cursor` — no manual steps.

### UI layer model

| Platform | Foundation | Build rules on top |
|----------|------------|-------------------|
| Web | **MUI** — theme, tokens, primitives. Use MUI fully when no project patterns exist. | Clone reference list/report pages for new features |
| Mobile | **Mobile theming** — Paper/MD3 (or detected library) | Clone reference list screens |

---

## Shared library consolidation

IVF detects duplicated components across apps/scopes and generates an AI-executable plan to:

1. **Scaffold** a shared package (`packages/ui` or detected path)
2. **Extract** canonical implementations from duplicate copies
3. **Replace** local imports with shared library imports
4. **Standardise** prop APIs and document conventions in `occipitalLobe/ui-patterns.md`

```bash
dna plan ivf --verticals sharedLibrary --quote "Consolidate duplicated UI into packages/ui"
dna context ivf   # loads shared-library plan + IVF plan
```

**Writes:**
- `.DNA/plans/shared-library-<project>.md` — step-by-step AI workflow
- `.DNA/CellularMemory/occipitalLobe/ui-patterns.md` — shared package import conventions

---

## IVF plan structure

Each plan includes:

1. **Executive summary** — stage, archetype, scope, risk level
2. **Before (as-is)** — detected folder layout and stack
3. **After (target)** — DNA-integrated layout
4. **Vertical gap matrix** — current → target, priority, restructure flag
5. **Phased execution** — Phase 0 (shell) through Phase 5 (validate)
6. **Definition of done** — doctor, validate, context handoff

---

## Phases

| Phase | Action | Output |
|-------|--------|--------|
| 0 | `dna init`, marketplace install | `.DNA/` shell |
| 1 | `dna analyze`, `dna document --from-code` | As-is Impressions + system map |
| 2 | `dna runtime install` | Runtime + immune system |
| 3 | `dna plan rbac/compliance/feature` | Vertical-specific plans |
| 4 | Restructure per gap matrix | Feature folders, middleware, admin |
| 4b | Shared library consolidation | `packages/ui`, replaced imports, ui-patterns.md |
| 5 | `dna validate`, `dna context ivf` | AI-ready handoff |

---

## Two worlds (unchanged)

| Path | Audience |
|------|----------|
| `DNA/Impressions/` | Humans — product, architecture, security |
| `.DNA/` | AI, CLI, runtime — behaviour, memory, plans |

IVF documentation fills **Impressions** with as-is truth. The **IVF plan** lives in `.DNA/plans/` for AI execution.

---

## Related

- [Concepts](./concepts.md) — Behaviour, CellularMemory, neuralNetwork
- [CLI Reference](./cli-reference.md) — all commands
- [RBAC](./rbac.md) — `dna plan rbac` after IVF Phase 3
- [Compliance](./compliance.md) — `dna plan compliance`
