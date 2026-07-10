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
| **AI Workbench** | Prompt-first Cursor/Claude packages — default on init, doctor, update |
| **GitHub** | Connect, auto-issues, push gates, browser login (`dna github login`) |
| **Preview deploy** | `dna-preview.yml` scaffold with Vercel/Netlify + branch filter |
| **CI hygiene** | Inline failed-run cleanup in DNA-generated workflows |
| **Doctor orchestrator** | `dna doctor` — scaffold, CI, runtime auto-wire, GitHub browser login |
| **Runtime auto-wire** | Express, Fastify, Next.js middleware; preload fallback for other stacks |
| **Sponsors & credits** | `dna credits`, public sponsor ledger, npm `funding` |

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
