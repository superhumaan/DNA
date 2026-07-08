# Impressions structure

`DNA/Impressions/` is the **human documentation** tree. It lives alongside `.DNA/` but serves a different audience.

---

## Principle

| Path | Audience | Format |
|------|----------|--------|
| `DNA/Impressions/` | People — PM, QA, auditors, engineers | Markdown prose |
| `.DNA/` | Machines — AI, CLI, runtime | JSON + structured markdown |

Never mix them. AI tools read Impressions *by reference* through neuralNetwork — they do not replace Behaviour or knowledge packs.

---

## Recommended layout

```
DNA/Impressions/
├── product/
│   ├── overview.md
│   ├── features.md
│   └── roadmap.md
├── architecture/
│   ├── overview.md
│   ├── data-flow.md
│   └── integrations.md
├── security/
│   ├── threat-model.md
│   └── access-control.md
├── compliance/
│   └── gdpr-register.md
├── operations/
│   ├── runbooks.md
│   └── deployment.md
└── releases/
    └── CHANGELOG-impressions.md
```

`dna init` scaffolds a starter tree. `dna document --from-code` reverse-engineers architecture Impressions from brownfield codebases.

---

## When to update Impressions

| Trigger | Action |
|---------|--------|
| New major feature | Update `product/features.md` |
| Architecture change | Update `architecture/*` |
| Compliance audit | Update `compliance/*` |
| Release | Update `releases/` or link to repo CHANGELOG |

---

## Related

- [Documentation standards](./documentation-standards.md)
- [Domain model](../product/domain-model-and-glossary.md)
- [Brownfield IVF](../delivery/features/brownfield-ivf.md)
