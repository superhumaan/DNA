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

Full DNA health check (structure, deps, docs, runtime).

```bash
dna doctor
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

## github

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
