# Integrations

DNA connects to GitHub and AI providers for issue automation and repair workflows. This guide covers setup, safety boundaries, and environment configuration.

---

## GitHub

### Setup (browser login — recommended)

During `dna init`, DNA opens a browser login. You can also sign in anytime:

```bash
dna github login
dna github connect --owner superhumaan --repo your-project
```

Credentials are stored in `~/.config/dna/github-credentials.json` (mode `0600`). DNA also reads `GITHUB_TOKEN` / `GH_TOKEN` or the GitHub CLI session if present.

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

### Device flow without GitHub CLI

If `gh` is not installed, set a GitHub OAuth App client ID:

```bash
export DNA_GITHUB_CLIENT_ID=your_oauth_app_client_id
dna github login
```

Register a GitHub OAuth App with **Device flow** enabled. Maintainers run `./scripts/setup-github-oauth-app.sh` to register the first-party app and patch the client ID ([#11](https://github.com/superhumaan/DNA/issues/11)).

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

Without a stored token or env var, runs in dry-run mode and prints the payload. Run `dna github login` first.

---

## Preview deploy

When `ci.pushToPreview` is true (default), `dna ci install` scaffolds `.github/workflows/dna-preview.yml`.

Configure in `.DNA/config.dna.json`:

```json
{
  "ci": {
    "pushToPreview": true,
    "previewProvider": "vercel",
    "previewBranch": "main"
  }
}
```

| Provider | GitHub secrets |
|----------|----------------|
| `vercel` (default) | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` |
| `netlify` | `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID` |

Run `dna doctor` to verify the preview workflow is installed and see setup hints.

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
| `GITHUB_TOKEN` / `GH_TOKEN` | GitHub issues/PRs (CI) | Optional locally if you use `dna github login` |
| `DNA_GITHUB_CLIENT_ID` | Device flow without `gh` CLI | OAuth App with device flow enabled |
| `OPENAI_API_KEY` | OpenAI repair | |
| `ANTHROPIC_API_KEY` | Anthropic repair | |
| `DNA_PROJECT_ID` | Runtime | Defaults to `config.projectId` |
| `DNA_MARKETPLACE_URL` | Custom marketplace | Default: `https://dna.humaan.app/marketplace` |
| `DNA_REFERENCE_ROOT` | Platform reference repos | Parent of `AIStudio/`, `ColorParty/`, `Humaan/`, `Soli/` — see [Platform](./platform.md#reference-repos-on-your-machine) |
| `DNA_GDPR_SOURCE_DOCS` | GDPR doc ingest (contributors) | Source folder for `pnpm gdpr:ingest` |
| `GIT_SHA` | Runtime release tracking | CI commit SHA |

Set in shell, `.env` (not committed), or CI secrets — never in `.DNA/config.dna.json`.

---

## Supply chain (npm)

`@superhumaan/dna-by-humaan` is published from this repository with **npm provenance** and **zero production npm dependencies** (v0.4.5+). The CLI bundles internal git, glob, GitHub REST, argument parsing, and config validation — no `commander`, `zod`, `simple-git`, or `@octokit/rest` at install time. Optional framework peers (`express`, `fastify`, `@nestjs/common`) apply only when you use runtime adapters.

Network, shell, and filesystem access are limited to documented CLI operations — see [SECURITY.md](../../SECURITY.md#supply-chain-transparency-socketdev--security-scanners) and the [Socket.dev report](https://socket.dev/npm/package/@superhumaan/dna-by-humaan).

Verify your install:

```bash
npm view @superhumaan/dna-by-humaan repository.url
npm view @superhumaan/dna-by-humaan version
```

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
