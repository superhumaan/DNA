# Current version scope

What ships in the current DNA release channel and what is explicitly out of scope.

---

## In scope (v0.3.x)

| Area | Delivered |
|------|-----------|
| **CLI** | Full `dna` command surface — init, scan, analyze, plan, context, marketplace |
| **Runtime** | Express, Fastify, NestJS, Next.js adapters |
| **Marketplace** | 768 packs, remote + bundled offline |
| **Platform catalog** | Admin, SSO, RBAC, cloud deploy, CRM, CMS patterns |
| **Compliance** | Tiered GDPR, UK GDPR, HIPAA, ISO 27001, SOC 2, PCI DSS |
| **Brownfield** | IVF plans, `document --from-code`, deep analyze |
| **Feature factory** | Plain-language features + quality gates |
| **GitHub** | Connect, auto-issues, push gates |
| **npm** | `@superhumaan/dna-by-humaan` single package |

---

## Out of scope (current)

| Item | Notes |
|------|-------|
| Hosted DNA SaaS | Self-hosted CLI + runtime only |
| Non-TypeScript primary stacks | Limited pack coverage |
| Auto-merge PRs | Safety boundary — never auto-merge |
| Real-time web dashboard | Roadmap item |

---

## Version channels

| Channel | Command |
|---------|---------|
| Stable | Default npm install |
| Monorepo dev | `git clone` + `pnpm dna:link` |

---

## Related

- [Planning](../product/planning.md)
- [CHANGELOG](../../CHANGELOG.md)
- [Team testing](../../TEAM-TESTING.md)
