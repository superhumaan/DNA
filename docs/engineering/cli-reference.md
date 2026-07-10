# CLI Reference

All commands run from your **project root** unless `--cwd` is specified.

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

## dashboard

Local read-only dashboard — runtime issues, quality reports, doctor health, Impressions, and CellularMemory.

```bash
dna dashboard
dna dashboard --port 3200
```

## memory

Export and import CellularMemory segments across projects.

```bash
dna memory export --out .DNA/exports/memory.json
dna memory import .DNA/exports/memory.json --merge
```

## generate

Platform feature code scaffolds.

```bash
dna generate feature audit-logging
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

Install **DNA Workbench** (`.cursor/skills/dna-workbench/`, `/work-with-dna`, `/ship-feature`, …) by default on init, doctor, and update. Optional CLI catalog: `dna commands install`.

```bash
dna commands install
dna commands list
dna commands export-catalog --out .DNA/intelligence-catalog.json
dna commands uninstall
```

**Installed automatically** with `dna init`, `dna feature-factory install`, and `dna doctor` (when feature factory is enabled).

Type `/` in Cursor or Claude Code and search for `dna-` — e.g. `/dna-doctor`, `/dna-analyze`, `/dna-feature`.

Full catalog: [dna.humaan.app/intelligence](https://dna.humaan.app/intelligence)

## workbench

**DNA Workbench** — prompt-first Cursor and Claude packages. Installed **by default** on `dna init`, `dna doctor`, and `dna update`.

The user works in plain language inside Cursor; the agent runs `npx dna` on their behalf and loads `.DNA/` context.

```bash
dna workbench install      # refresh prompts (also runs automatically)
dna workbench uninstall    # opt out — sets aiWorkbench.enabled=false
dna update                 # refreshes workbench + checks pack updates
dna update --skip-workbench
```

### Slash prompts (type `/` in chat)

| Command | Purpose |
|---------|---------|
| `/work-with-dna` | Start any DNA-aware session |
| `/ship-feature` | Feature factory → plan → ship |
| `/analyze-project` | Deep analysis + gap plan |
| `/health-check` | Doctor + validate |
| `/quality-gate` | Pre-push SAST gate |
| `/plan-compliance` | Tiered compliance |
| `/debug-issue` | Runtime debug loop |
| `/sync-impressions` | Doc/code reconciliation |
| `/load-context` | Load domain context |

Files: `.cursor/rules/dna-workbench.mdc`, `.cursor/skills/dna-workbench/`, `.cursor/commands/*.md` (and `.claude/` mirror).

Optional: `dna commands install` adds per-CLI `/dna-*` slash commands for power users.

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
