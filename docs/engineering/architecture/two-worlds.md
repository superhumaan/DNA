# Two worlds: `.DNA` vs Impressions

The foundational architectural split in every DNA-managed project.

---

## Rule

**Never mix human documentation and machine intelligence.**

| Path | Audience | Purpose |
|------|----------|---------|
| `DNA/Impressions/` | Humans — PM, QA, auditors, engineers | Product, architecture, security, compliance docs |
| `.DNA/` | AI tools, CLI, runtime | Rules, memory, routing, validation, runtime logs |

---

## `.DNA/` contents

| Component | File(s) | Role |
|-----------|---------|------|
| Config | `config.dna.json` | Project manifest, toggles, pack versions |
| Routing | `neuralNetwork.json` | Intent → resources |
| Behaviour | `behaviour/*.md` | AI governance (6 files) |
| Memory | `CellularMemory/*` | Project learning (7 regions) |
| Immune | `immuneSystem/*` | Severity and classification |
| Knowledge | `knowledge/*` | Installed marketplace packs |
| Runtime | `runtime/*` | Events and issues (when enabled) |
| Plans | `plans/*` | Generated feature, RBAC, compliance, IVF plans |

---

## `DNA/Impressions/` contents

Human-readable markdown for stakeholders who will never read JSON or Behaviour files.

See [Impressions structure](../../design/impressions-structure.md).

---

## How they connect

`neuralNetwork.json` declares which Impressions to reference for each intent. `dna context` loads the right combination of Behaviour, knowledge, memory, and Impressions paths.

---

## Related

- [Domain model](../../product/domain-model-and-glossary.md)
- [Architecture overview](./overview.md)
