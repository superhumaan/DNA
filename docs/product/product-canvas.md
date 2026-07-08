# Product canvas

High-level map of DNA capabilities and how they connect.

---

## Core loop

```
init → scan/analyze → context → build (AI) → validate → doctor
                         ↑                           ↓
                    marketplace              runtime observer
                         ↑                           ↓
                    plan feature/rbac          GitHub + AI repair
```

---

## Capability map

| Layer | Components |
|-------|------------|
| **Intelligence** | config.dna.json, neuralNetwork, Behaviour (6 files), CellularMemory (7 regions) |
| **Knowledge** | Marketplace packs → `.DNA/knowledge/` |
| **Planning** | Feature plans, RBAC plans, compliance plans, IVF plans |
| **Observation** | Runtime pipeline → immune system → issues.jsonl |
| **Automation** | GitHub issues, AI repair (dry-run by default) |
| **Human docs** | DNA/Impressions/ (product, architecture, security) |

---

## CLI command families

| Family | Examples |
|--------|----------|
| **Scaffold** | `init`, `scan`, `analyze`, `document` |
| **Context** | `context cursor`, `context platform`, `context compliance` |
| **Plan** | `plan feature`, `plan rbac`, `plan compliance`, `plan ivf` |
| **Marketplace** | `marketplace list`, `install`, `search`, `update` |
| **Health** | `doctor`, `validate`, `quality report` |
| **Integrations** | `github connect`, `ai repair`, `runtime install` |

Full reference: [CLI reference](../engineering/cli-reference.md)

---

## Reference production systems

DNA learned patterns from four Humaan reference apps:

| ID | Project | Patterns |
|----|---------|----------|
| `aistudio` | AI Studio | Azure B2C, AI governance, admin portal |
| `colorparty` | ColorParty | OAuth, SSO bridge, gamification |
| `humaan` | Humaan Ops | Roadmap, surveys, Jira/Harvest |
| `soli` | Soli | Multi-tenant, kanban, STT notes |

See [Platform catalog](./platform-catalog.md).

---

## Related

- [Features and platform overview](./features-and-platform-overview.md)
- [Domain model](./domain-model-and-glossary.md)
