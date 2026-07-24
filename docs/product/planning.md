# Planning and roadmap

DNA development priorities and public roadmap.

---

## Current release focus (v0.6.15)

- **Lab upgrade DX** — version on `/health`, nested-install detect, `dna lab installs --fix`, disk-backed Lab UI ([docs](../engineering/lab-upgrade-dx-0.6.15.md))
- Prior: Lab analytics Overview + Sentry-density Issues (v0.6.14)
- **Lab nav IA** — multi-open sections + Doctor / Installs / Intelligence / Quality peer pages ([docs](../engineering/lab-nav-ia.md))

## Shipped highlights

- `npx @superhumaan/dna-by-humaan` on npm — CLI + `/runtime` + `/lab` bundles (v0.6.15)
- **Lab upgrade DX (v0.6.15)** — health `dnaVersion` + install scan/fix; disk Lab UI revalidation ([docs](../engineering/lab-upgrade-dx-0.6.15.md))
- **Lab analytics + Issues depth (v0.6.14)** — Overview performance dashboard; Issues short IDs, sparklines, users/age; Issue detail Highlights / Stack / Tags / JSON / Trace ([docs](../engineering/lab-analytics-0.6.14.md))
- **Lab UI — Humaan admin parity** — icon-only DNA brand, Humaan primary pills + large pill tabs, list search → tabs → always-on tables, sidebar accordion ([docs](../engineering/lab-ui-humaan-0.6.7.md))
- **DNA Lab v4** — Soli admin shell, Quality hub, Sentry-depth envelopes ([docs](../engineering/lab-and-runtime-0.6.4.md))
- **Runtime safety** — EPIPE/ECONNRESET ignored; hardened `runtime.db` / lab-store; non-blocking GitHub repair path
- **Mock AI guardrails** — no placeholder patches; `applyPatches` will not invent junk files
- **Aggressive Repair Loop** — fingerprinted errors, CellularMemory blockers, GitHub issue dedup, `dna ai force-repair` ([docs](../engineering/lab-and-repair-0.6.3.md))
- **Zero npm dependencies** — published package has no production `dependencies`; internal git, glob, GitHub API, CLI parser, and config validators
- **Supply-chain transparency** — Socket.dev score improvements, npm provenance, documented network endpoints ([SECURITY.md](../../SECURITY.md))
- **88 prompt stem packs** — full Cursor/Claude prompt engineering with guidelines and expectations per workflow (includes strategy ladder: Golden Circle → canvases → initiatives → Now/Next/Later)
- **DNA Workbench** — default on init/doctor/update; `AGENTS.md` intent routing + mandatory 9-role agent loop for engineering work
- 965 knowledge packs in stable channel
- Platform catalog from four reference production apps
- Tiered compliance (GDPR, HIPAA, ISO, SOC 2)
- Feature factory with quality gates + per-role agent-loop stems
- GitHub onboarding (browser auth during `dna doctor`)
- One-command onboarding: `npx @superhumaan/dna-by-humaan doctor` scaffolds CI, runtime, Docker, hooks, and auto-wires middleware
- **Upstream feedback (v0.4.8)** — `dna feedback` commands, DNA-only auto-report, maintainer ingest with fingerprint dedup

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
| Prompt stem packs + intelligence library (v0.4.0) | ✅ Shipped |
| Strategy stem ladder — Golden Circle → canvases → North Star/OKRs/KPIs → initiatives → Now/Next/Later (catalog v7, 88 stems) | ✅ Shipped |
| Product intelligence stems — diagnose/SWOT/value/Kano + competitor + upgrade leverage (catalog v7) | ✅ Shipped |
| Supply-chain hardening + Socket transparency (v0.4.4) | ✅ Shipped |
| Zero npm dependencies — internal replacements for CLI/git/GitHub/glob (v0.4.5) | ✅ Shipped |
| npm `dna doctor` workbench asset path fix (v0.4.6) | ✅ Shipped |
| DNA always-on + `AGENTS.md` agent flow (v0.4.9) | ✅ Shipped |
| Legal advisor + delivery methodology (v0.4.9) | ✅ Shipped |
| Upstream feedback — DNA platform auto-report (v0.4.8) | ✅ Shipped |
| First-party GitHub OAuth app ([#11](https://github.com/superhumaan/DNA/issues/11)) | ✅ Shipped — setup script + OAuth scaffolding |
| Real-time dashboard UI / DNA Lab ([#12](https://github.com/superhumaan/DNA/issues/12)) | ✅ Shipped — `/labs`, `dna lab serve`, `dna register lab` |
| Lab hardening + Aggressive Repair Loop (v0.6.3) | ✅ Shipped — see [lab-and-repair-0.6.3](../engineering/lab-and-repair-0.6.3.md) |
| Lab UI v4 + runtime depth + EPIPE/repair harden (v0.6.4) | ✅ Shipped — see [lab-and-runtime-0.6.4](../engineering/lab-and-runtime-0.6.4.md) |
| Lab UI Humaan admin parity (v0.6.7) | ✅ Shipped — see [lab-ui-humaan-0.6.7](../engineering/lab-ui-humaan-0.6.7.md) |
| Lab CI billing blocker + cleanup anti-cascade (v0.6.8) | ✅ Shipped — see [lab-ci-billing-blocker](../engineering/lab-ci-billing-blocker.md) |
| Lab pairing store-first (v0.6.11) | ✅ Shipped — CLI must save via pairing/init; verify is store-only; gateway allowlist docs |
| Express 5 optional peer (v0.6.12) | ✅ Shipped — peer `express@^4.18.0 \|\| ^5.0.0` so npm installs cleanly with Express 5 |
| Production health & residual closure (v0.6.13) | ✅ Shipped — shared Lab state, strict CI, scoped coverage, Playwright smoke, GitHub/npm/DNA-Web health |
| Lab analytics Overview + Sentry-density Issues (v0.6.14) | ✅ Shipped — see [lab-analytics-0.6.14](../engineering/lab-analytics-0.6.14.md) |
| Lab upgrade DX — nested installs + disk UI (v0.6.15) | ✅ Shipped — see [lab-upgrade-dx-0.6.15](../engineering/lab-upgrade-dx-0.6.15.md) |
| Multi-project CellularMemory sync ([#13](https://github.com/superhumaan/DNA/issues/13)) | ✅ Shipped — import merge + team registry sync |
| Impressions drift → auto PR suggestions ([#14](https://github.com/superhumaan/DNA/issues/14)) | ✅ Shipped — `dna scan --open-pr` |
| Multi-tenant gradual rollout ([#15](https://github.com/superhumaan/DNA/issues/15)) | ✅ Shipped — platform codegen scaffolds |
| IVF Phase 4b — shared library extraction ([#16](https://github.com/superhumaan/DNA/issues/16)) | ✅ Shipped — `--execute` with rollback |
| Platform feature codegen ([#17](https://github.com/superhumaan/DNA/issues/17)) | ✅ Shipped — SSO, flags, multi-tenant, rollout |
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
