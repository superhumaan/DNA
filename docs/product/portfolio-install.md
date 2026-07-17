# Portfolio install — one squad, many products

Install DNA **once** on the parent folder that holds your related products — not on every repo. One squad, one brain, every app and how they connect.

**One command. Everything included. Nothing to regret.**

```bash
cd ~/work/your-squad-folder
npx @superhumaan/dna-by-humaan doctor
```

That single run is the install people keep forever — because it replaces a stack of subscriptions, scattered Cursor rules, forgotten chat context, and per-repo tooling with **one portable brain in git**.

---

## Landing page copy (~30 seconds)

Use this on [dna.humaan.app](https://dna.humaan.app), social posts, or conference intros.

### Hero

> **One squad. Many products. One install.**
>
> Run `npx @superhumaan/dna-by-humaan doctor` on the folder that holds them all.
>
> *“No amount of money ever bought a second of time.”* — Howard Stark, *Avengers: Endgame*

### Subhead

Most teams cannot afford Sentry on every service, premium AI memory on every seat, and GitHub Teams on top of rent. Cursor forgets your auth pattern by lunch. Each repo is an island.

**One `dna doctor`** installs the whole platform: **77 prompt stem packs**, **Cursor + Claude rules and skills**, **detection across every app**, **CellularMemory that never forgets**, **runtime observer**, **quality gates**, **GitHub automation**, and **897 knowledge packs** — on your **portfolio folder**, so AI remembers every product and how they interconnect.

Same feature template every time. Runtime errors become issues with context: what broke, why, what to fix — not a mystery diff at 2am.

### CTA

```bash
cd ~/work/your-squad-folder    # parent of all related apps
npx @superhumaan/dna-by-humaan doctor
dna analyze
dna context cursor
```

Type `/` in Cursor — **77 stems** and **`/dna-*` commands** are already there.

### One-liner (tweet / npm)

> The one install squads never regret — enterprise memory, AI rules, stems, detection, runtime, and delivery process. Free.

---

## What one `dna doctor` installs (everything)

`dna doctor` is not a health check. It is a **full platform bootstrap** — scaffold, detect, wire, and arm every layer below. Run it once at the portfolio parent; the whole squad inherits it from git.

### 1. Project intelligence (`.DNA/`)

| Asset | What it does |
|-------|----------------|
| **`config.dna.json`** | Single control plane — runtime, CI, GitHub, AI repair, feature factory, feedback, memory sync |
| **`neuralNetwork.json`** | Intent routing — which knowledge and behaviour apply to which tasks |
| **`behaviour/`** (8 files) | MUST/NEVER rules for AI, coding, testing, docs, delivery, discovery, security, runtime |
| **`CellularMemory/`** (7 regions) | Project memory that accumulates — plans, decisions, risks, patterns, system maps, UI standards |
| **`immuneSystem/`** | Severity rules, issue classifier, severity model — runtime events → actionable categories |
| **`knowledge/`** | Auto-installed foundation packs from stack scan + domain keywords (healthcare country, legal, compliance) |
| **`stems/`** (**77 packs**) | Full prompt engineering library — guidelines, expectations, examples, workflows per stem |
| **`workflows/`** | Feature factory, quality, admin-portal delivery workflows |
| **`runtime/`** | Install snippets, browser client, env examples — ready to wire into every app |
| **`data/runtime.db`** | SQLite store for runtime events and issues (local, under your control) |
| **`hooks/pre-push`** | Quality gate before every push — advisory by default, strict when configured |

### 2. Human documentation (`DNA/Impressions/`)

Structured docs for PMs, auditors, and engineers — product, architecture, security, compliance. Separate from machine-readable `.DNA/` so humans and AI each get the right format.

Brownfield: `dna document --from-code` reverse-engineers Impressions from existing code across **all apps** under the portfolio.

### 3. AI workbench — always on (no “use DNA” required)

| Surface | Installed paths |
|---------|-----------------|
| **`AGENTS.md`** | Root agent instructions — intent routing + mandatory 9-role loop for engineering work |
| **`CLAUDE.md`** | Claude Code always-on co-pilot |
| **Cursor rules** | `dna-workbench.mdc`, `dna.mdc`, `delivery-pipeline.mdc`, `product-process.mdc`, role rules (backend, frontend, UX, QA, code-quality, architecture, admin-portal), `dna-cli-commands.mdc` |
| **Cursor skills** | `dna-workbench/` (session flow, prompt patterns), `dna-cli/` (CLI obedience) |
| **Claude skills** | Same workbench + CLI skills under `.claude/skills/` |
| **Copilot / Windsurf / Gemini** | `.github/copilot-instructions.md`, `.windsurfrules`, `GEMINI.md` when detected |
| **Feature factory** | `ai/feature-request.md`, `ai/agent-loop.md` — 9-role playbook the AI follows automatically |

DNA is **active the moment you open the editor** — the user speaks in plain language; the agent runs DNA, loads context, and follows Behaviour. No copy-paste prompts. No “remember to use DNA.”

### 4. Prompt stem packs (77) + slash commands

Each stem in `.DNA/stems/<id>/` includes **README, prompt, guidelines, expectations, context, examples, workflow** — MUST/NEVER rules the agent reads before acting.

| Category | Examples | Portfolio value |
|----------|----------|-----------------|
| **session** | `work-with-dna`, `load-context`, `dna-doctor` | Bootstrap every AI session with real CLI output |
| **analysis** | `analyze-project`, `scan-project`, `runtime-investigate` | Map the whole suite — not one app |
| **features** | `ship-feature`, `plan-feature`, `generate-feature` | Same template for feature #1 and #5 |
| **agent-loop** | `product-analyst`, `solution-architect`, `qa-engineer`, … | Full product team in prompts |
| **quality** | `quality-gate`, `pre-push-review`, `security-audit` | Gates before ship — visible, not hidden |
| **compliance** | `plan-compliance`, `gdpr-engineering` | Tiered HIPAA/GDPR/SOC 2 by org size |
| **legal** | `legal-advise`, `plan-legal` | Regional legal packs + engineering gates |
| **delivery** | `write-spec`, `create-ticket`, `align-delivery` | Methodology alignment — Jira/Linear/Notion |
| **ivf** | `ivf-run`, `ivf-shared-library` | Brownfield without rewrite |
| **memory** | `memory-sync`, `memory-export` | Squad-wide CellularMemory |

**Plus `/dna-*` slash commands** in `.cursor/commands/` and `.claude/commands/` — one per CLI surface (`/dna-doctor`, `/dna-analyze`, `/dna-feature`, `/dna-quality-report`, …) with full obedience rules.

Refresh anytime: `dna update` or `dna workbench install`.

Catalog: [dna.humaan.app/intelligence](https://dna.humaan.app/intelligence)

### 5. Detection (automatic — no questionnaire)

Doctor and scan **detect**; they do not ask you to lie on a form.

| Detected | How | Portfolio use |
|----------|-----|---------------|
| **Stack** | `apps/*`, `packages/*`, root `package.json` — frontend, backend, DB, test runner | One scan covers every product |
| **Monorepo layout** | pnpm/yarn workspaces, nested packages | Shared libraries + duplicate components (IVF) |
| **CI / hosting** | Existing workflows, Vercel/Netlify signals | Preview workflow only when relevant |
| **AI tools** | Cursor, Claude Code, Copilot, Windsurf, Gemini | Installs the right rules files only |
| **GitHub remote** | `origin` URL | Auto-configures owner/repo; browser login |
| **Healthcare domain** | Description keywords → country overview packs (US, UK, AU, …) | Invitrace-style suites get the right HIPAA/NHS packs |
| **Legal jurisdiction** | Region keywords → legal tier packs | Engineering gates without a lawyer on retainer |
| **Impressions drift** | Code vs docs mismatch score | `dna scan --open-pr` opens sync PR when critical |
| **Auth / patterns** | `dna analyze` — guards, middleware, shared auth across apps | AI stops hallucinating per-app auth |
| **Runtime entrypoints** | Express, Fastify, Next.js | **Auto-wires** middleware — no manual hunt |

### 6. Runtime observer + immune system

| Piece | Behaviour |
|-------|-----------|
| **`@superhumaan/dna-by-humaan/runtime`** | Added to `package.json`; snippets in `.DNA/runtime/` |
| **Auto-wire** | Doctor patches Express/Fastify/Next.js entry files or `middleware.ts` |
| **Classification** | Errors → severity, category, discipline, confidence |
| **Storage** | `.DNA/data/runtime.db` + optional JSONL |
| **GitHub issues** | High/critical → contextual issues in **your** repo (never auto-merge) |
| **AI repair** | Armed by default — `dna ai repair --dry-run` plans branch + patch |
| **Upstream feedback** | DNA-platform bugs only → sanitized report to maintainers (opt-out) |

One runtime config at the portfolio level understands **which app** failed and **how it affects siblings**.

### 7. Delivery pipeline (CI, hooks, Docker, GitHub)

| Asset | Purpose |
|-------|---------|
| **`.github/workflows/dna-ci.yml`** | Lint, typecheck, tests, coverage (80% target), OWASP, SAST — advisory or strict |
| **`.github/workflows/dna-security.yml`** | Security scanning workflow |
| **`.github/workflows/dna-preview.yml`** | Preview deploy when hosting is Vercel/Netlify |
| **`.github/workflows/cleanup-failed-runs.yml`** | CI hygiene |
| **`.DNA/hooks/pre-push`** | Local quality report before push |
| **`Dockerfile`** | Container scaffold when applicable |
| **GitHub browser login** | One-time sign-in — no token copy-paste |
| **`dna github push`** | Push with quality gate awareness |

### 8. Knowledge marketplace (897 packs)

Foundation packs install automatically from stack + domain detection. Browse and add more:

```bash
dna marketplace list
dna marketplace install compliance/hipaa
dna marketplace install healthcare/overview-us
dna marketplace install frameworks/nextjs
```

Offline bundled fallback — works without network after install.

### 9. Feature factory + quality (why feature #5 matches feature #1)

| Mechanism | Effect |
|-----------|--------|
| **`ai/agent-loop.md`** | 9 roles sequential — plan → approve → build → QA → ship |
| **`.cursor/rules/product-process.mdc`** | Factory triggers on every build/add/fix/change |
| **Admin portal pattern** | `/admin` in new tab, RBAC, `requireAdmin` APIs — auto when mentioned |
| **`dna quality report --feature`** | Local SAST — blocker/critical must pass before complete |
| **`dna generate feature <id>`** | SSO, multi-tenant, feature-flags, audit-logging scaffolds |
| **Platform catalog** | Production patterns from reference apps (AIStudio, ColorParty, Humaan Ops, Soli) |

### 10. Squad sync (portfolio memory across machines)

```json
// .DNA/config.dna.json
{
  "memory": {
    "teamRegistry": "./.DNA/exports/squad-memory.json"
  }
}
```

```bash
dna memory export --out .DNA/exports/squad-memory.json
dna memory sync
dna watch    # optional — CellularMemory updates when files change
```

---

## Full tree after one portfolio install

```
your-squad-folder/                    ← dna doctor HERE (once)
├── AGENTS.md                         ← intent routing + 9-role loop
├── CLAUDE.md                         ← Claude Code co-pilot
├── ai/
│   ├── feature-request.md            ← auto-updated from user quotes
│   └── agent-loop.md                 ← full role playbook
├── .cursor/
│   ├── rules/                        ← dna-workbench, product-process, delivery, roles…
│   ├── skills/dna-workbench/         ← session flows + prompt patterns
│   ├── skills/dna-cli/               ← CLI obedience
│   └── commands/                     ← 77 stems + /dna-* slash commands
├── .claude/                          ← mirror for Claude Code
├── .github/workflows/                ← dna-ci, dna-security, dna-preview, cleanup
├── .DNA/
│   ├── config.dna.json
│   ├── neuralNetwork.json
│   ├── behaviour/                    ← 8 behaviour files
│   ├── CellularMemory/               ← 7 memory regions + system/dependency maps
│   ├── immuneSystem/
│   ├── knowledge/                    ← foundation + marketplace packs
│   ├── stems/                        ← 77 prompt stem packs
│   ├── workflows/
│   ├── runtime/
│   ├── hooks/pre-push
│   └── data/runtime.db
├── DNA/Impressions/                  ← human-facing docs
├── Dockerfile                        ← when applicable
├── product-a/
├── product-b/
├── shared-api/
└── admin-portal/
```

Commit `.DNA/`, `DNA/`, `AGENTS.md`, `ai/`, `.cursor/`, `.claude/`, and workflows — the squad shares **one install** forever.

---

## Who this is for

| Scenario | Parent folder | What DNA remembers |
|----------|---------------|-------------------|
| **Healthcare product suite** | One org folder (e.g. Invitrace) | Shared auth, PHI boundaries, API contracts across apps |
| **Monorepo squad** | `apps/` + `packages/` root | Shared libraries, feature patterns, dependency graph |
| **Agency client folder** | Client name directory | Brand rules, stack, deployment patterns across microsites |
| **Platform team** | Platform repo root | Service map, SSO, admin, multi-tenant patterns |

You do **not** need a separate `.DNA/` per app if the apps relate and live under one parent.

---

## Install (5 minutes)

```bash
# 1. Go to the folder that contains ALL related products
cd ~/work/invitrace          # example: enterprise health squad folder

# 2. One install — everything above
npx @superhumaan/dna-by-humaan doctor

# 3. Map every app and how they connect
dna analyze
dna scan

# 4. Domain packs (optional — or let detection install foundation)
dna marketplace install compliance/hipaa

# 5. Open Cursor at any child app — stems, rules, and context already active
dna context cursor
```

```bash
git add .DNA/ DNA/ AGENTS.md ai/ .cursor/ .claude/ .github/
git commit -m "chore: DNA portfolio install — one brain for the squad"
npm install   # if doctor added runtime package
```

---

## Why no one regrets this install

| If you skip DNA | What you pay instead |
|-----------------|----------------------|
| Cursor “memory” | $12–40/mo/seat — still forgets cross-product context |
| Scattered `.cursorrules` | Hours rewriting; lost on every machine |
| Sentry × N services | $26+/mo × every app |
| Backstage / portal team | Headcount you don’t have |
| Compliance consultant | $$$$ for docs AI can’t execute |
| “Just remember the auth pattern” | Every new chat, every new contractor, every 2am bug |

| If you keep DNA | What accumulates in git |
|-----------------|-------------------------|
| Week 1 | Stack detected, rules active, stems ready, CI running |
| Month 1 | CellularMemory — decisions, failures, patterns |
| Month 6 | System maps, dependency graph, suite-wide runtime history |
| Year 1 | Institutional memory no subscription can export |

**Removing DNA** means losing Behaviour, stems, maps, runtime classification rules, and months of CellularMemory — and going back to AI that hides what it changed. That’s why teams treat `.DNA/` like `tsconfig.json`: not optional fluff, **project infrastructure**.

---

## What you get that paid stacks charge for

| Enterprise stack | Typical cost | DNA portfolio equivalent |
|------------------|--------------|--------------------------|
| Cursor / Copilot premium memory | $20–40/seat/mo | `.DNA/` + CellularMemory — persists in git |
| Custom AI rules + prompt library | Consultant / staff time | 77 stems + rules + skills — installed |
| Sentry per service | $26+/mo per project | Runtime observer + immune system → contextual issues |
| GitHub Teams advanced | Per-seat | `dna github push` + quality gates (browser login) |
| Backstage / service catalog | Platform team headcount | `parietalLobe` system + dependency maps |
| Staff engineer “institutional memory” | Salary | Behaviour, decisions, repeated-failure learnings |
| Compliance consultant | $$$$ | Tiered HIPAA/GDPR packs + `dna plan compliance` |
| Delivery coach / agile consultant | $$$$ | Feature factory + methodology stems |

---

## Name one tool that does this today?

| Tool | Portfolio memory | Stems + rules | Auto detection | Runtime → issues | Same feature template | Free / OSS |
|------|------------------|---------------|----------------|-------------------|-------------------------|------------|
| Cursor alone | Per chat | Manual | Partial | No | No | $12+/mo |
| Sentry | No | No | Per service | Errors only | No | Per service |
| Nx / Turborepo | Build graph | No | Monorepo | No | No | Yes |
| Backstage | Catalog | No | Heavy setup | No | No | Yes (complex) |
| **DNA — one `doctor`** | **Yes** | **77 + rules** | **Yes** | **Yes** | **Yes** | **Yes** |

---

## Invitrace-style walkthrough

One squad handles all enterprise health products under one folder:

1. **`dna doctor`** at `invitrace/` — scaffolds everything in this doc, once
2. **Detection** — healthcare country packs, HIPAA compliance tier, monorepo apps
3. **`dna analyze`** — `product-a`, `product-b`, `shared-api`, shared auth, IVF gaps
4. **Open Cursor in `product-b`** — `/ship-feature` and `AGENTS.md` already active; AI knows Product A’s audit rules
5. **Feature #5** — same admin-portal pattern, RBAC template, quality gates as feature #1
6. **Runtime error in `shared-api`** — classified issue explains downstream product impact
7. **`dna memory sync`** — contractor laptop gets the same squad brain from git

That is a platform team in a folder — stems, rules, detection, memory, runtime, and delivery — without five Sentry bills and without hoping Cursor remembers last Tuesday.

---

## Keep it current

```bash
dna update              # CLI + stems + commands + knowledge packs
dna doctor              # repair any missing scaffolding
dna marketplace list    # new packs
```

---

## Related

- [Product concept](./product-concept.md)
- [Brownfield / IVF](../delivery/features/brownfield-ivf.md)
- [CLI reference](../engineering/cli-reference.md)
- [Intelligence catalog](https://dna.humaan.app/intelligence)
- [Team testing guide](../../TEAM-TESTING.md)
