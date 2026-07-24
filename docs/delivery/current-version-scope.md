# Current version scope

What ships in the current DNA release channel and what is explicitly out of scope.

---

## In scope (v0.6.15)

| Area | Delivered |
|------|-----------|
| **CLI** | Full `dna` command surface — init, scan, analyze, plan, context, marketplace, `dna ai force-repair`, `dna lab installs [--fix]` |
| **Runtime** | Express 4/5, Fastify, NestJS, Next.js adapters (Next.js: duck-typed — consumer provides `next`); Aggressive Repair Loop fingerprints + CellularMemory; EPIPE/ECONNRESET noise filter; outbound third-party capture + browser ingest |
| **DNA Lab** | Production observability at `/labs` — **analytics Overview** + **Sentry-density Issues** + **upgrade DX** (health `dnaVersion` / labUi fingerprint, nested install detect, disk-backed `dist/lab-ui/*`); Humaan admin UI parity; Soli shell + Quality hub; fingerprint-grouped issues; local open access; production auth via `dna register lab`; CJS Express wire; Lite doctor polling; hardened `runtime.db` ([#12](https://github.com/superhumaan/DNA/issues/12), [lab-analytics-0.6.14](../engineering/lab-analytics-0.6.14.md), [lab-upgrade-dx-0.6.15](../engineering/lab-upgrade-dx-0.6.15.md)) |
| **Supply chain** | **Zero production npm dependencies** (v0.4.6+), no install scripts, no self-dependencies, JSON catalog assets, npm provenance, [Socket transparency](../../SECURITY.md#supply-chain-transparency-socketdev--security-scanners) |
| **Marketplace** | 965 packs, remote + bundled offline |
| **Platform catalog** | Admin, SSO, RBAC, cloud deploy, CRM, CMS patterns |
| **Compliance** | Tiered GDPR, UK GDPR, HIPAA, ISO 27001, SOC 2, PCI DSS |
| **Brownfield** | IVF plans, `document --from-code`, deep analyze |
| **Feature factory** | Plain-language features + mandatory 9-role agent loop (`AGENTS.md`) |
| **AI Workbench** | Always-on Cursor/Claude co-pilot — no “use DNA” required |
| **Prompt stem packs** | 88 copy-paste workflows in `.DNA/stems/` — guidelines, expectations, strategy ladder, product intelligence (diagnose/competitors/upgrades), agent-loop roles |
| **`dna stems`** | List, show, and refresh prompt stem packs |
| **GitHub** | Connect, auto-issues, push gates, browser login (`dna github login`) |
| **Preview deploy** | `dna-preview.yml` scaffold with Vercel/Netlify + branch filter |
| **CI hygiene** | `cleanup-failed-runs.yml` deletes failed/cancelled runs after completion; skips billing/infra instant failures and never cascades |
| **Strict quality gates** | Blocking lint/typecheck/test/coverage/load/audit/quality/Docker; product-critical coverage ≥80% per file; Playwright Lab smoke |
| **Canonical health report** | GitHub Step Summary + artifacts; npm Verified results; DNA-Web `/health` |
| **Shared Lab state** | Optional Redis-compatible adapter for multi-instance; file default remains fail-closed for undeclared replicas |
| **Lab CI billing** | `/labs` banners GitHub Actions payment/spending-limit blocks separately from code CI failures |
| **Doctor orchestrator** | `dna doctor` — scaffold, CI, runtime auto-wire, Lab scaffold, GitHub browser login |
| **Runtime auto-wire** | Express, Fastify, Next.js middleware; preload fallback for other stacks |
| **Sponsors & credits** | `dna credits`, public sponsor ledger, npm `funding` |
| **`dna lab serve`** | Local Lab at `http://localhost:3200/labs` (no login on localhost) |
| **`dna register lab`** | Pair local CLI to production Lab — paste Pairing ID + code at `/labs` (paste-verify; optional pre-notify via `pairing/init`) |
| **CellularMemory sync (MVP)** | `dna memory export` / `import` ([#13](https://github.com/superhumaan/DNA/issues/13)) |
| **Impressions drift (MVP)** | Drift score in `dna scan`, `dna plan impressions-sync` ([#14](https://github.com/superhumaan/DNA/issues/14)) |
| **Platform codegen (MVP)** | `dna generate feature audit-logging` ([#17](https://github.com/superhumaan/DNA/issues/17)) |
| **IVF shared library (MVP)** | `dna ivf shared-library --dry-run` / `--scaffold` ([#16](https://github.com/superhumaan/DNA/issues/16)) |
| **Upstream feedback (v0.4.8)** | `dna feedback report|sync|status` — DNA-only auto-report, sanitized queue, maintainer ingest to `superhumaan/DNA` |
| **Always-on co-pilot (v0.4.9)** | `AGENTS.md`, intent routing, mandatory 9-role loop; DNA active in Cursor + Claude without “use DNA” |
| **Legal advisor (v0.4.9)** | `dna legal advise`, `dna plan legal`, regional legal packs, engineering legal gates |
| **Delivery methodology (v0.4.9)** | `dna methodology`, `dna plan methodology`, ticket/doc system alignment stems |

---

## Out of scope (current)

| Item | Notes |
|------|-------|
| Hosted DNA SaaS | Self-hosted CLI + runtime + Lab only |
| Hosted feedback ingest API | Client POSTs to `dna.humaan.app/api/v1/feedback`; server endpoint planned — maintainer `ingest` works today via `DNA_FEEDBACK_TOKEN` |
| Non-TypeScript primary stacks | Limited pack coverage |
| Auto-merge PRs | Safety boundary — never auto-merge |
| External uptime monitoring | DNA Lab complements ping/uptime tools — does not replace them |

---

## Version channels

| Channel | Command |
|---------|---------|
| Stable | Default npm install (`@superhumaan/dna-by-humaan@0.6.13`) |
| Monorepo dev | `git clone` + `pnpm dna:link` |

---

## Related

- [Planning](../product/planning.md)
- [CHANGELOG](../../CHANGELOG.md)
- [Team testing](../../TEAM-TESTING.md)
