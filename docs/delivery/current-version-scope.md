# Current version scope

What ships in the current DNA release channel and what is explicitly out of scope.

---

## In scope (v0.4.x)

| Area | Delivered |
|------|-----------|
| **CLI** | Full `dna` command surface — init, scan, analyze, plan, context, marketplace |
| **Runtime** | Express, Fastify, NestJS, Next.js adapters (Next.js: duck-typed — consumer provides `next`) |
| **Supply chain** | **Zero production npm dependencies** (v0.4.5+), no install scripts, no self-dependencies, JSON catalog assets, npm provenance, [Socket transparency](../../SECURITY.md#supply-chain-transparency-socketdev--security-scanners) |
| **Marketplace** | 768 packs, remote + bundled offline |
| **Platform catalog** | Admin, SSO, RBAC, cloud deploy, CRM, CMS patterns |
| **Compliance** | Tiered GDPR, UK GDPR, HIPAA, ISO 27001, SOC 2, PCI DSS |
| **Brownfield** | IVF plans, `document --from-code`, deep analyze |
| **Feature factory** | Plain-language features + quality gates |
| **AI Workbench** | Prompt-first Cursor/Claude packages — default on init, doctor, update |
| **Prompt stem packs** | 43 copy-paste workflows in `.DNA/stems/` — guidelines, expectations, agent-loop roles |
| **`dna stems`** | List, show, and refresh prompt stem packs |
| **GitHub** | Connect, auto-issues, push gates, browser login (`dna github login`) |
| **Preview deploy** | `dna-preview.yml` scaffold with Vercel/Netlify + branch filter |
| **CI hygiene** | `cleanup-failed-runs.yml` deletes failed/cancelled runs after completion |
| **Doctor orchestrator** | `dna doctor` — scaffold, CI, runtime auto-wire, GitHub browser login |
| **Runtime auto-wire** | Express, Fastify, Next.js middleware; preload fallback for other stacks |
| **Sponsors & credits** | `dna credits`, public sponsor ledger, npm `funding` |
| **Dashboard (MVP)** | `dna dashboard` — local read-only runtime, quality, doctor, memory browser ([#12](https://github.com/superhumaan/DNA/issues/12)) |
| **CellularMemory sync (MVP)** | `dna memory export` / `import` ([#13](https://github.com/superhumaan/DNA/issues/13)) |
| **Impressions drift (MVP)** | Drift score in `dna scan`, `dna plan impressions-sync` ([#14](https://github.com/superhumaan/DNA/issues/14)) |
| **Platform codegen (MVP)** | `dna generate feature audit-logging` ([#17](https://github.com/superhumaan/DNA/issues/17)) |
| **IVF shared library (MVP)** | `dna ivf shared-library --dry-run` / `--scaffold` ([#16](https://github.com/superhumaan/DNA/issues/16)) |

---

## Out of scope (current)

| Item | Notes |
|------|-------|
| Hosted DNA SaaS | Self-hosted CLI + runtime only |
| Non-TypeScript primary stacks | Limited pack coverage |
| Auto-merge PRs | Safety boundary — never auto-merge |
| Real-time dashboard (live feed, charts) | MVP shipped (`dna dashboard`); live feed + trends in [#12](https://github.com/superhumaan/DNA/issues/12) |

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
