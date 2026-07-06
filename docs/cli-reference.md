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
dna context all
```

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

## Environment variables

| Variable | Purpose |
|----------|---------|
| `GITHUB_TOKEN` | GitHub API access |
| `OPENAI_API_KEY` | OpenAI repair provider |
| `ANTHROPIC_API_KEY` | Anthropic repair provider |
| `DNA_PROJECT_ID` | Runtime project identifier |
| `DNA_MARKETPLACE_URL` | Override marketplace base URL |
| `GIT_SHA` | Runtime release tag |
