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

## github

### github connect

```bash
dna github connect --owner ORG --repo REPO
```

Stores owner/repo in config. **Never** store tokens in config — use `GITHUB_TOKEN`.

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

Browse and plan features DNA learned from Humaan production projects.

```bash
dna platform list
dna platform projects
dna platform project humaan
```

## plan feature

Generate an end-to-end implementation plan for a platform feature.

```bash
dna plan feature admin-portal --quote "Admin portal with Google directory sync"
dna plan feature sso-bridge --quote "Silent SSO between subdomains"
dna plan feature azure-deploy --reference-project aistudio
dna context platform
dna context platform --feature admin-portal
```

Installs `platforms/humaan-stack` knowledge pack. See [platform.md](./platform.md).

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
dna plan ivf --verticals behaviour,runtime,rbac,compliance,impressions
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
| `GIT_SHA` | Runtime release tag |
