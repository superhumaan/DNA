# Features and platform overview

DNA ships as a single npm package with a broad feature surface. This page is the product-level index.

---

## Intelligence & AI coordination

| Feature | Command / path | Purpose |
|---------|----------------|---------|
| Behaviour rules | `.DNA/behaviour/` | Govern how AI writes code, tests, docs, security |
| neuralNetwork routing | `.DNA/neuralNetwork.json` | Intent → knowledge + Behaviour + memory |
| AI tool files | `.cursorrules`, etc. | Generated on `dna init` |
| Context export | `dna context <target>` | Feed Cursor, Claude, Copilot |

---

## Marketplace & knowledge

| Feature | Command | Purpose |
|---------|---------|---------|
| 768 knowledge packs | `dna marketplace list` | Frameworks, compliance, cloud, healthcare |
| Offline fallback | Bundled in npm package | Works without remote marketplace |
| Stack stems | `stem` tagged packs | Delivery surfaces (MUI, mobile UI, quality) |
| Language stems | `languages/*` | i18n AI coordination |

See [Marketplace](./marketplace.md).

---

## Platform catalog (production patterns)

End-to-end patterns for admin portals, SSO, Azure deploy, feature flags, CRM, CMS, RBAC.

```bash
dna platform list
dna plan feature admin-portal --quote "Admin portal with directory sync"
```

See [Platform catalog](./platform-catalog.md).

---

## Compliance (tiered)

Proportionate GDPR, HIPAA, ISO 27001, SOC 2, PCI DSS by org tier.

```bash
dna plan compliance --frameworks gdpr,iso27001 --tier sme
```

See [Compliance tiers](./compliance-tiers.md).

---

## Brownfield & IVF

Install DNA into existing codebases without a rewrite.

```bash
dna analyze --deep
dna plan ivf --quote "Integrate DNA without a rewrite"
```

See [Brownfield IVF](../delivery/features/brownfield-ivf.md).

---

## Runtime & production

| Feature | Purpose |
|---------|---------|
| Runtime observer | Capture exceptions, 500s, slow requests |
| Immune system | Classify severity, category, discipline |
| GitHub auto-issues | High/critical runtime events → issues |
| AI repair | Contextual fix PRs (dry-run default) |

See [Runtime observer](../engineering/runtime-observer.md).

---

## Quality & gates

| Feature | Purpose |
|---------|---------|
| `dna doctor` | Full project health check |
| `dna validate` | Behaviour rule compliance |
| Quality reports | SonarQube-style SAST per feature |
| Docker + push gates | Feature factory close-out |

See [Doctor and validation](../quality-assurance/doctor-and-validation.md).
