# Integrations

DNA connects to GitHub and AI providers for issue automation and repair workflows. This guide covers setup, safety boundaries, and environment configuration.

---

## GitHub

### Setup

```bash
dna github connect --owner superhumaan --repo your-project
export GITHUB_TOKEN=ghp_xxxxxxxx   # fine-grained or classic PAT
```

Enable in `.DNA/config.dna.json`:

```json
{
  "github": {
    "enabled": true,
    "owner": "superhumaan",
    "repo": "your-project"
  }
}
```

**Never** store tokens in config files or commit them to git.

### Auto-issues from runtime

When runtime is enabled and severity is **high** or **critical**, DNA creates GitHub issues with:

- Title, summary, severity, category
- Endpoint, method, status code
- Stack trace (redacted)
- Suspected cause
- Relevant Behaviour and CellularMemory paths
- Suggested fix and test recommendation

### Manual issue

```bash
dna github issue --file path/to/issue.json
```

Without `GITHUB_TOKEN`, runs in dry-run mode and prints the payload.

---

## AI repair

### Setup

```bash
dna ai connect --provider mock          # safe default for testing
dna ai connect --provider openai
dna ai connect --provider anthropic
```

Enable in config:

```json
{
  "ai": {
    "enabled": true,
    "provider": "mock",
    "model": "gpt-4o"
  }
}
```

### Run repair

```bash
dna ai repair --file .DNA/runtime/last-issue.json --dry-run
dna ai repair --file issue.json        # creates branch + PR
```

### Safety model

DNA **never**:

- Auto-merges pull requests
- Deploys without human approval
- Edits secrets or sends raw secrets to AI

DNA **always**:

- Creates a branch and PR with explanation
- Attempts to run tests
- Shows a confidence score
- Requires human review

### Workflow

```
Runtime event → classify → GitHub issue (optional)
  → load Behaviour + memory + knowledge
  → diagnose → branch → patch → test → PR → comment on issue
```

---

## Environment variables

| Variable | Required for | Notes |
|----------|--------------|-------|
| `GITHUB_TOKEN` | GitHub issues/PRs | Never commit; never put in config |
| `OPENAI_API_KEY` | OpenAI repair | |
| `ANTHROPIC_API_KEY` | Anthropic repair | |
| `DNA_PROJECT_ID` | Runtime | Defaults to `config.projectId` |
| `DNA_MARKETPLACE_URL` | Custom marketplace | Default: `https://dna.humaan.app/marketplace` |
| `DNA_REFERENCE_ROOT` | Platform reference repos | Parent of `AIStudio/`, `ColorParty/`, `Humaan/`, `Soli/` — see [Platform](./platform.md#reference-repos-on-your-machine) |
| `DNA_GDPR_SOURCE_DOCS` | GDPR doc ingest (contributors) | Source folder for `pnpm gdpr:ingest` |
| `GIT_SHA` | Runtime release tracking | CI commit SHA |

Set in shell, `.env` (not committed), or CI secrets — never in `.DNA/config.dna.json`.

---

## Recommended pilot stack

| Layer | Tool | DNA role |
|-------|------|----------|
| Monitoring | Sentry (or similar) | Production alerts |
| Intelligence | DNA | Context, behaviour, classification |
| Issues | GitHub | DNA auto-creates contextual issues |
| AI repair | DNA + human review | Draft PRs, never auto-merge |

---

## See also

- [Runtime Observer](./runtime.md)
- [CLI Reference — github & ai](./cli-reference.md)
- [Development](./development.md)
