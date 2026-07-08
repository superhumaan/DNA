# DNA Documentation

**DNA by Humaan** — project intelligence, runtime observation, and AI coordination for TypeScript teams.

| Resource | Link |
|----------|------|
| **Website** | [dna.humaan.app](https://dna.humaan.app) |
| **Marketplace** | [dna.humaan.app/marketplace](https://dna.humaan.app/marketplace) |
| **npm** | [@superhumaan/dna-by-humaan](https://www.npmjs.com/package/@superhumaan/dna-by-humaan) |
| **Repository** | [github.com/superhumaan/DNA](https://github.com/superhumaan/DNA) |
| **Changelog** | [CHANGELOG.md](../CHANGELOG.md) |

---

## Start here

| Guide | When to read |
|-------|----------------|
| [Getting Started](./getting-started.md) | First install, `dna init`, daily workflow |
| [Concepts](./concepts.md) | How `.DNA/` and `DNA/Impressions/` fit together |
| [Naming conventions](./naming.md) | Humaan vs DNA vs pack IDs — read once |

---

## Guides

| Guide | Description |
|-------|-------------|
| [Platform Catalog](./platform.md) | Production patterns — admin, SSO, Azure, flags, CRM, CMS |
| [RBAC & Zero Trust](./rbac.md) | Plain language → permission matrix + AI coordination |
| [Tiered Compliance](./compliance.md) | GDPR, HIPAA, ISO 27001, SOC 2 by org size |
| [Brownfield / IVF](./ivf.md) | Install DNA into existing codebases |
| [Runtime Observer](./runtime.md) | Express, Fastify, NestJS, Next.js integration |
| [Marketplace](./marketplace.md) | 768 knowledge packs — install, search, update |
| [Integrations](./integrations.md) | GitHub issues, AI repair, environment variables |

---

## Reference

| Doc | Description |
|-----|-------------|
| [CLI Reference](./cli-reference.md) | Every `dna` command and option |
| [Development](./development.md) | Build, test, publish, contribute to the monorepo |
| [Team Testing](../TEAM-TESTING.md) | Rollout guide for colleagues |

---

## Quick commands

```bash
npx @superhumaan/dna-by-humaan init -y
dna doctor
dna context cursor
dna marketplace list
dna plan feature admin-portal --quote "Admin portal with directory sync"
```

---

## Documentation map

```
getting-started ──► concepts ──► cli-reference
       │                │
       ├─ ivf (brownfield)
       ├─ platform + rbac + compliance
       ├─ runtime + marketplace + integrations
       └─ development + CONTRIBUTING
```

**Product naming:** [naming.md](./naming.md) · **Upgrades:** [CHANGELOG.md](../CHANGELOG.md)
