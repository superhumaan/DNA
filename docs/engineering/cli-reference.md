# CLI Reference

All commands run from your **project root** unless `--cwd` is specified.

`--cwd` is resolved relative to your **current shell directory**. If your shell is already inside the DNA project, omit `--cwd` or pass `--cwd .`. From a monorepo root, pass the path to the package that contains `.DNA/` (for example `packages/dna-cli`).

## Global

```bash
dna --help
dna --version
```

## init

Initialise DNA in the current project.

```bash
dna init
dna init -y                    # non-interactive defaults
dna init --cwd /path/to/project
```

Creates `.DNA/`, `DNA/Impressions/`, Behaviour, neuralNetwork, CellularMemory, immune system, and AI tool files.

## scan

Detect stack, dependencies, tests, CI, and risks.

```bash
dna scan
dna scan --cwd ./my-app
dna scan --open-pr          # when drift is critical, write sync plan
```

Includes an **Impressions drift** score when DNA is installed (missing docs, stack mismatch, stale CellularMemory).

## lab

Production observability portal at `/labs` — runtime issues, events, performance, quality, release tracking.

```bash
dna lab install
dna lab serve
dna lab serve --port 3200
dna register lab --url https://your-app.example.com
```

Local: no login. Production: email + password + OTP after `dna register lab` pairing.

See [Runtime Observer](./runtime-observer.md#production-lab-labs).

## dashboard

Legacy alias — starts Lab at `/labs` on port 3200 (same as `dna lab serve`).

## memory

Export, import, and sync CellularMemory segments across projects and team registries.

```bash
dna memory export --out .DNA/exports/memory.json
dna memory import .DNA/exports/memory.json --merge
dna memory import .DNA/exports/memory.json --on-conflict newest
dna memory sync
dna memory sync --registry <path>
```

Conflict strategies: `newest` (default), `keep-local`, `keep-remote`.

## generate

Platform feature code scaffolds.

```bash
dna generate feature audit-logging
dna generate feature sso
dna generate feature multi-tenant
dna generate feature feature-flags
dna generate feature gradual-rollout
```

## plan impressions-sync

Generate a plan to reconcile Impressions with the codebase when drift is detected.

```bash
dna plan impressions-sync
dna plan impressions-sync --open-pr
```

## ivf shared-library

Shared library extraction for monorepos.

```bash
dna ivf shared-library --dry-run
dna ivf shared-library --scaffold
dna ivf shared-library --execute
```

## recommend

Suggest architecture and stack from scan + description.

```bash
dna recommend
dna recommend --description "Multi-tenant B2B SaaS"
```

## context

Generate AI-ready context for a target.

```bash
dna context cursor
dna context claude
dna context chatgpt
dna context copilot
dna context windsurf
dna context gemini
dna context backend
dna context frontend
dna context security
dna context qa
dna context devops
dna context multilingual
dna context all
```

`multilingual` loads language stem packs — bidirectional translation, sentiment, and localized documentation guidance.

## validate

Validate project structure and Behaviour compliance.

```bash
dna validate
```

Exits with code 1 on errors.

## watch

Watch filesystem changes and update CellularMemory.

```bash
dna watch
```

Runs until interrupted.

## doctor

One-command onboarding — scaffolds DNA, CI, Docker, hooks, runtime storage, GitHub sign-in, and auto-wires middleware for Express, Fastify, and Next.js.

```bash
npx @superhumaan/dna-by-humaan doctor
npm install   # when package.json was updated
```

Report only (no fixes, no browser login):

```bash
dna doctor --check-only
```

## credits

Show sponsors, funding links, and bundled package credits (also via `npm fund @superhumaan/dna-by-humaan`).

```bash
dna credits
```

## update

Check for knowledge pack updates.

```bash
dna update
dna update --channel beta
```

## runtime install

Write runtime integration snippets to `.DNA/runtime/`.

```bash
dna runtime install
```

## feature

Start the feature factory from a plain-language request (optional — Cursor/Claude do this automatically in chat).

```bash
dna feature "I want providers to record phone calls and transcribe the notes"
```

Writes `ai/feature-request.md`, a baseline quality report in `.DNA/reports/quality/`, and continues in your AI tool.

## quality

Local SonarQube-style code quality — no SonarQube server required. Runs automatically during feature factory.

### quality report

```bash
dna quality report --feature          # feature-scoped gate (git-changed files)
dna quality report                    # full repository scan
dna quality report --paths src/foo.ts
dna quality report --feature --json   # machine-readable output
```

Writes `.DNA/reports/quality/<slug>.md`. Exits with code 1 when the gate fails (blocker or critical issues).

### quality scan

Stdout-only scan without writing a report file.

```bash
dna quality scan --feature
```

## docker

Docker build verification — scaffolded on `dna init`, required at feature factory close-out.

### docker install

```bash
dna docker install
dna docker install --force
```

### docker build

```bash
dna docker build
dna docker build --tag myapp:local
```

Exits with code 1 if Docker is unavailable or the build fails.

## feature-factory install

Re-enable Cursor/Claude feature factory rules after uninstall.

```bash
dna feature-factory install
```

**Enabled by default** during `dna init`. DNA configures Cursor and Claude automatically — users describe features in plain language; agents run the factory without copy-paste prompts.

## feature-factory uninstall

Remove feature factory files from the project (does not remove `.cursor/rules/dna.mdc`).

```bash
dna feature-factory uninstall
```

Re-enable with `dna feature-factory install`.

## commands

Install **DNA Workbench**, **`AGENTS.md`**, **59 prompt stem packs**, and **`/dna-*` CLI slash commands** (`.DNA/stems/<id>/`, `.cursor/commands/`, skills, always-on rules) by default on init, doctor, and update. Engineering work routes through the mandatory 9-role agent loop (`ai/agent-loop.md`).

```bash
dna workbench install
dna stems list
dna stems show analyze-project
dna stems install
dna commands install    # refresh /dna-* CLI wrappers only
dna commands list
dna commands export-catalog --out .DNA/intelligence-catalog.json
dna commands uninstall
```

**Installed automatically** with `dna init`, `dna doctor`, and `dna update` (workbench + stems + `/dna-*` commands).

Copy-paste library: [dna.humaan.app/intelligence](https://dna.humaan.app/intelligence)

## workbench

**DNA Workbench** — prompt-first Cursor and Claude packages. Installed **by default** on `dna init`, `dna doctor`, and `dna update`. DNA is **always on** — users do not need to say “use DNA”. `AGENTS.md` classifies intent and enforces the agent loop for build/add/fix/change requests.

```bash
dna workbench install      # refresh prompts + stem packs (also runs automatically)
dna workbench uninstall    # opt out — sets aiWorkbench.enabled=false
dna update                 # download latest prompt stems from dna.humaan.app + pack updates
dna update --skip-workbench
```

### Prompt stem packs (`.DNA/stems/<id>/`)

Each stem includes: `prompt.md`, `guidelines.md`, `expectations.md`, `context.md`, `examples.md`.

| Category | Examples |
|----------|----------|
| Session | `/health-check`, `/dna-update`, `/work-with-dna` |
| Analysis | `/analyze-project`, `/what-next`, `/scan-project`, `/stack-hosting` |
| Features | `/ship-feature`, `/plan-rbac`, `/generate-feature`, `/platform-codegen` |
| Agent loop | `/agent-loop`, `/product-analyst`, `/solution-architect`, `/backend-engineer`, … |
| Quality | `/quality-gate`, `/pre-push-review` |
| IVF | `/ivf-shared-library`, `/ivf-execute`, `/plan-ivf` |
| Docs | `/sync-impressions`, `/drift-pr` |
| Memory | `/memory-sync`, `/memory-import`, `/memory-export` |
| Debug | `/dashboard-monitor`, `/runtime-investigate` |

Refresh: `npx dna update` downloads the latest catalog from `https://dna.humaan.app/intelligence/api/v1/catalog` (offline: bundled fallback).

```bash
dna stems list
dna stems show what-next-after-analyze
```

### Slash prompts (type `/` in chat)

Workbench installs slash commands for every stem that has one — e.g. `/work-with-dna`, `/ship-feature`, `/analyze-project`, `/agent-loop`, `/solution-architect`.

Files: `.cursor/rules/dna-workbench.mdc`, `.cursor/skills/dna-workbench/`, `.cursor/skills/dna-cli/`, `.cursor/commands/*.md`, `.DNA/stems/` (and `.claude/` mirror).

`/dna-*` commands install alongside stem slashes — both refresh on `dna workbench install`, `dna init`, `dna doctor`, and `dna update`.

## github

GitHub is connected during `dna init` via **browser login** — no `GITHUB_TOKEN` setup required.

### github login

Re-authenticate if push fails.

```bash
dna github login
```

Opens GitHub in your browser (via GitHub CLI or device flow). Token stored in `~/.config/dna/github-credentials.json` — never in the repo.

### github push

Commit and push the current feature branch (used by feature factory close-out).

```bash
dna github push --message "feat: add billing"
dna github push --branch feature/billing --create-branch
```

### github connect

Manual repo override (usually auto-detected from `git remote` during init).

```bash
dna github connect --owner ORG --repo REPO
```

### github issue

Create an issue from classified JSON.

```bash
dna github issue --file .DNA/runtime/issues.jsonl
```

## feedback

Report **DNA-platform failures** upstream to [superhumaan/DNA](https://github.com/superhumaan/DNA/issues). User app bugs stay in your project's repo. Enabled by default with `autoReport: "dna-only"`.

Configure in `.DNA/config.dna.json`:

```json
{
  "feedback": {
    "enabled": true,
    "upstream": true,
    "autoReport": "dna-only",
    "includeSuggestedFix": true
  }
}
```

| `autoReport` | Behaviour |
|--------------|-----------|
| `off` | Never send upstream |
| `dna-only` | DNA stack / CLI / `.DNA/` failures only (default) |
| `all` | All classified runtime issues upstream |

### feedback report

```bash
dna feedback report --message "doctor failed" --command "dna doctor"
dna feedback report --file error.json --dry-run
```

### feedback sync

Flush the offline queue when the feedback API was unreachable.

```bash
dna feedback sync
```

### feedback status

```bash
dna feedback status
```

### feedback ingest

Maintainer only — create a deduped GitHub issue from a payload JSON file.

```bash
DNA_FEEDBACK_TOKEN=ghp_... dna feedback ingest --file payload.json
DNA_FEEDBACK_TOKEN=ghp_... node scripts/feedback-ingest.mjs payload.json
```

Offline queue: `.DNA/data/feedback-queue.jsonl` (gitignored). Install fingerprint: anonymous UUID in `~/.config/dna/install-id`.

See [Integrations — Upstream feedback](./integrations.md#upstream-feedback).

## ai

### ai connect

```bash
dna ai connect --provider mock
dna ai connect --provider openai --model gpt-4o
dna ai connect --provider anthropic --model claude-sonnet-4-20250514
```

### ai repair

Run repair workflow from a classified issue file.

```bash
dna ai repair --file issue.json
dna ai repair --file issue.json --dry-run
```

**Never auto-merges.** Always requires human review.

### ai force-repair

Re-run repair for open Aggressive Repair Loop blockers (from CellularMemory / runtime fingerprints).

```bash
dna ai force-repair
dna ai force-repair --dry-run
```

Requires `ai.repair.aggressive` (default on). See [Lab and repair v0.6.3](./lab-and-repair-0.6.3.md) and [Lab + runtime v0.6.4](./lab-and-runtime-0.6.4.md).

Benign disconnects (`write EPIPE`, `ECONNRESET`) are not captured or repaired — see v0.6.4 noise filter.

## stack

Approved system shapes — prevents incoherent technology mixes (e.g. Next.js + Vite, Ghost + React).

### stack list

```bash
dna stack list
```

### stack recommend

```bash
dna stack recommend --description "B2B SaaS dashboard"
```

### stack show

```bash
dna stack show
```

Shows configured archetype, detected dependencies, and conflicts.

## marketplace

### marketplace list

```bash
dna marketplace list
dna marketplace list --channel stable
```

### marketplace search

```bash
dna marketplace search --query vite
dna marketplace search --category compliance
```

Categories: `languages`, `frameworks`, `platforms`, `disciplines`, `compliance`

### marketplace install

```bash
dna marketplace install frameworks/nextjs
dna marketplace install compliance/gdpr
```

Installs files into `.DNA/knowledge/` and records version in config.

## plan rbac

Generate a full RBAC + zero trust implementation plan from plain language.

```bash
dna plan rbac \
  --quote "No employee unless I grant access. Roles: manager, hr, operations, admin" \
  --feature dashboard

dna plan rbac --roles manager,hr,operations,admin --feature dashboard
dna context rbac
```

Writes `.DNA/plans/rbac-*.md`, permission matrix, and installs `security/rbac-zero-trust` knowledge pack.

## platform

Browse and plan features DNA learned from production reference projects (AIStudio, ColorParty, Humaan Ops, Soli).

```bash
dna platform list
dna platform projects
dna platform project humaan
```

See [platform.md](./platform.md).

## plan feature

Generate an end-to-end implementation plan for a platform feature.

```bash
dna plan feature admin-portal --quote "Admin portal with Google directory sync"
dna plan feature sso-bridge --quote "Silent SSO between subdomains"
dna plan feature azure-deploy --reference-project aistudio
dna context platform
dna context platform --feature admin-portal
```

Installs `platforms/dna-stack` knowledge pack. See [platform.md](./platform.md).

## plan compliance

Generate tiered compliance controls for GDPR, HIPAA, ISO 27001, SOC 2, or PCI.

```bash
dna compliance list
dna plan compliance --frameworks gdpr,iso27001 --tier sme --quote "EU B2B SaaS"
dna plan compliance --framework hipaa --tier corporate
dna context compliance --tier sme --frameworks gdpr,hipaa
```

Writes `.DNA/plans/compliance-*.md` and control matrix. See [compliance.md](./compliance.md).

## analyze

Deep analysis of an existing project: structure, auth, integrations, vertical gaps.

```bash
dna analyze --deep
dna analyze --verticals behaviour,runtime,rbac
```

## document

Reverse-engineer Impressions and system map from codebase.

```bash
dna document --from-code
dna document --from-code --force
```

## plan ivf

Generate an Integrating Vertical Functions plan for brownfield projects.

```bash
dna plan ivf --quote "B2B SaaS — RBAC, GDPR, runtime"
dna plan ivf --verticals behaviour,runtime,rbac,compliance,sharedLibrary,impressions
dna plan ivf --gaps-only
dna context ivf
```

See [ivf.md](./ivf.md).

## Environment variables

| Variable | Purpose |
|----------|---------|
| `GITHUB_TOKEN` | GitHub API access |
| `OPENAI_API_KEY` | OpenAI repair provider |
| `ANTHROPIC_API_KEY` | Anthropic repair provider |
| `DNA_PROJECT_ID` | Runtime project identifier |
| `DNA_MARKETPLACE_URL` | Override marketplace base URL |
| `DNA_REFERENCE_ROOT` | Parent directory for platform reference repos |
| `DNA_GDPR_SOURCE_DOCS` | Source path for GDPR doc ingest (contributors) |
| `GIT_SHA` | Runtime release tag |

Full notes: [integrations.md](./integrations.md#environment-variables).
