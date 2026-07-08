# Documentation standards

How DNA projects should write human documentation in `DNA/Impressions/` and how contributors write this wiki.

---

## Impressions writing rules

1. **Write for humans** — complete sentences, context, rationale
2. **No machine config** — Behaviour rules belong in `.DNA/behaviour/`
3. **Link, don't duplicate** — reference knowledge packs for stack guidance
4. **Version significant decisions** — note date and owner in architecture docs
5. **Keep product separate from engineering** — PMs read `product/`; engineers read `architecture/`

---

## Wiki structure (this repo)

This repository follows the Humaan / AI Studio Docusaurus pattern:

| Section | Purpose |
|---------|---------|
| **Business** | Strategy, audience, open-source model |
| **Product** | Concept, features, marketplace, compliance |
| **Design** | Naming, Impressions, documentation standards |
| **Delivery** | Features, IVF, feature factory, version scope |
| **Engineering** | Architecture, CLI, runtime, integrations |
| **Quality Assurance** | Testing, doctor, quality reports |

Browse locally: `pnpm run wiki:dev` — see [LOCAL_WIKI.md](../LOCAL_WIKI.md).

---

## Generated vs hand-written

| Source | Location |
|--------|----------|
| Hand-written wiki | `docs/` in DNA monorepo |
| Per-project Impressions | `DNA/Impressions/` in consumer repos |
| AI behaviour | `.DNA/behaviour/` |
| Reverse-engineered docs | `dna document --from-code` |

---

## Related

- [Naming conventions](./naming-conventions.md)
- [Impressions structure](./impressions-structure.md)
