# Concepts

DNA separates **human documentation** from **machine intelligence**. Understanding that split is the foundation for everything else.

## Two worlds

| Path | Audience | Purpose |
|------|----------|---------|
| `DNA/Impressions/` | Humans — PM, QA, auditors, engineers | Product, architecture, security, compliance docs |
| `.DNA/` | AI tools, CLI, runtime | Rules, memory, routing, validation, runtime logs |

Never mix them. Impressions are prose for people. `.DNA` is structured for machines.

---

## config.dna.json

The project manifest at `.DNA/config.dna.json`:

- Project identity and stack
- Compliance and stage
- AI tool configuration
- GitHub and runtime toggles
- Installed knowledge pack versions

---

## neuralNetwork

`.DNA/neuralNetwork.json` routes **intent → resources**.

Example intents:

- `build_frontend_component`
- `create_api_endpoint`
- `fix_runtime_error`
- `improve_security`
- `configure_ci_cd`
- `implement_admin_portal` (platform catalog)

Each intent declares:

- Required knowledge files
- Behaviour files to load
- CellularMemory regions to check
- Impressions to reference
- Validation steps

`dna context <target>` uses neuralNetwork to return only relevant chunks.

---

## Behaviour

Six behaviour files in `.DNA/behaviour/` govern how AI works on this project:

| File | Governs |
|------|---------|
| `ai.behaviour.md` | Master AI instructions |
| `coding.behaviour.md` | Code style and patterns |
| `testing.behaviour.md` | Test requirements |
| `documentation.behaviour.md` | Doc standards |
| `security.behaviour.md` | Security rules |
| `runtime.behaviour.md` | Incident and observability rules |

`dna validate` checks projects against these rules.

---

## CellularMemory

Project-specific learning in `.DNA/CellularMemory/`:

| Region | Stores |
|--------|--------|
| `hippocampus` | Recent changes, project summary |
| `prefrontalCortex` | Current plan, decisions, next actions |
| `amygdala` | Risks, blockers, repeated failures |
| `cerebellum` | Patterns, automation learnings |
| `temporalLobe` | Decision history |
| `parietalLobe` | System and dependency maps |
| `occipitalLobe` | UI and visual standards |

`dna watch` updates memory when files change. Runtime repeated failures append to `amygdala/repeated-failures.md`.

---

## Immune System

`.DNA/immuneSystem/` classifies runtime events:

- `rules.json` — severity rules
- `issue-classifier.json` — pattern → category mapping
- `severity-model.json` — auto-issue thresholds

Output dimensions: **severity**, **category**, **discipline**, **confidence**.

---

## Knowledge packs

Stack and compliance guidance in `.DNA/knowledge/`. Install from the [marketplace](./marketplace.md):

```bash
dna marketplace install frameworks/vite
dna marketplace install compliance/gdpr
dna marketplace install platforms/dna-stack
```

Retired pack IDs (e.g. `platforms/humaan-stack`) still resolve to current packs. See [CHANGELOG](../CHANGELOG.md).

---

## Runtime pipeline

When `@superhumaan/dna-by-humaan/runtime` captures an event:

1. Append to `.DNA/runtime/events.jsonl`
2. Classify via Immune System
3. Append to `.DNA/runtime/issues.jsonl`
4. Update CellularMemory if repeated
5. Optionally create GitHub issue (high/critical)
6. Optionally trigger AI repair workflow

See [Runtime Observer](./runtime.md).

---

## AI tool files

`dna init` generates tool-specific config:

- `.cursorrules` / Cursor rules
- Claude, Copilot, Windsurf, Gemini context files

These point AI at Behaviour, knowledge, and CellularMemory before any task.

---

## See also

- [Getting Started](./getting-started.md)
- [CLI Reference](./cli-reference.md)
- [Naming conventions](./naming.md)
