# Planning and roadmap

DNA development priorities and public roadmap.

---

## Current release focus (v0.3.x)

- `npx @superhumaan/dna-by-humaan` on npm — CLI + `/runtime` bundle
- 768 knowledge packs in stable channel
- Platform catalog from four reference production apps
- Tiered compliance (GDPR, HIPAA, ISO, SOC 2)
- Feature factory with quality gates
- GitHub onboarding (browser auth during `dna doctor`)
- One-command onboarding: `npx @superhumaan/dna-by-humaan doctor` scaffolds CI, runtime, Docker, hooks, and auto-wires middleware

See [Current version scope](../delivery/current-version-scope.md).

---

## Roadmap

| Item | Status |
|------|--------|
| Knowledge pack marketplace | ✅ Shipped |
| Fastify, NestJS, Next.js runtime adapters | ✅ Shipped |
| End-to-end delivery pipeline ([#1](https://github.com/superhumaan/DNA/issues/1)) | ✅ Shipped |
| Interactive onboarding wizard ([#2](https://github.com/superhumaan/DNA/issues/2)) | ✅ Shipped |
| Feature factory v2 + admin portal ([#3](https://github.com/superhumaan/DNA/issues/3)) | ✅ Shipped |
| Local quality module ([#4](https://github.com/superhumaan/DNA/issues/4)) | ✅ Shipped |
| CI, Docker, and git hooks ([#5](https://github.com/superhumaan/DNA/issues/5)) | ✅ Shipped |
| Doctor orchestrator + `dna ivf` ([#6](https://github.com/superhumaan/DNA/issues/6)) | ✅ Shipped |
| IVF UI layer stack ([#7](https://github.com/superhumaan/DNA/issues/7)) | ✅ Shipped |
| GitHub integration package ([#8](https://github.com/superhumaan/DNA/issues/8)) | ✅ Shipped |
| Runtime SQLite storage ([#9](https://github.com/superhumaan/DNA/issues/9)) | ✅ Shipped |
| Preview deployment workflow ([#10](https://github.com/superhumaan/DNA/issues/10)) | ✅ Shipped |
| First-party GitHub OAuth app ([#11](https://github.com/superhumaan/DNA/issues/11)) | 🚧 In progress — setup script shipped |
| Real-time dashboard UI ([#12](https://github.com/superhumaan/DNA/issues/12)) | 🚧 In progress — `dna dashboard` MVP |
| Multi-project CellularMemory sync ([#13](https://github.com/superhumaan/DNA/issues/13)) | 🚧 In progress — export/import CLI |
| Impressions drift → auto PR suggestions ([#14](https://github.com/superhumaan/DNA/issues/14)) | 🚧 In progress — drift score + sync plan |
| Multi-tenant gradual rollout ([#15](https://github.com/superhumaan/DNA/issues/15)) | 🚧 In progress — knowledge pack |
| IVF Phase 4b — shared library extraction ([#16](https://github.com/superhumaan/DNA/issues/16)) | 🚧 In progress — dry-run + scaffold |
| Platform feature codegen ([#17](https://github.com/superhumaan/DNA/issues/17)) | 🚧 In progress — audit-logging scaffold |
| Hosted DNA Cloud (optional) | Exploring |

Track on the [DNA Roadmap project board](https://github.com/users/superhumaan/projects/3/views/1). Defect and gap fixes are tracked on [DNA - Defects](https://github.com/users/superhumaan/projects/4/views/1).

Track releases: [CHANGELOG.md](../../CHANGELOG.md)

---

## Feature prioritisation

New capabilities should strengthen the core loop:

1. **Better context** — richer neuralNetwork intents, smarter `dna context`
2. **Safer automation** — GitHub + AI repair with explicit safety boundaries
3. **Broader stacks** — more marketplace packs, stem surfaces
4. **Brownfield depth** — IVF analysis, `document --from-code`
5. **Compliance depth** — tier-appropriate controls, not checkbox audits

---

## Related

- [Product concept](./product-concept.md)
- [Contributing](../../CONTRIBUTING.md)
