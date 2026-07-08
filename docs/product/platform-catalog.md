# DNA Platform Catalog

DNA learned production patterns from four reference systems and encodes them as **knowledge packs**, **feature plans**, and **neuralNetwork intents** so AI can build end-to-end — from Azure/AWS deploy through nginx, directory sync, SSO bridges, admin portals, feature flags, CRM, CMS, and RBAC.

See [naming conventions](./naming.md) for how **DNA** (product) relates to **Humaan** (company) and reference project IDs.

## Reference projects

| ID | Project | What DNA learned |
|----|---------|------------------|
| `aistudio` | AI Studio | Custom GPT, AI governance, Azure B2C, quotas, admin portal |
| `colorparty` | ColorParty | Location praise, gamification, Google OAuth, SSO bridge |
| `humaan` | Humaan Ops | ProdPad-style roadmap, CSS/NPS surveys, Harvest/Jira, reporting |
| `soli` | Soli | Multi-tenant, notes/STT, kanban, custom entities |

## Reference repos on your machine

`dna platform projects` and feature plans can point at real code paths when you clone the reference apps. Set the parent directory:

```bash
export DNA_REFERENCE_ROOT=~/Projects   # contains AIStudio/, ColorParty/, Humaan/, Soli/
dna platform projects
```

Without `DNA_REFERENCE_ROOT`, the CLI shows folder names only (no author-specific paths). Knowledge packs and plans still work — they use `.DNA/knowledge/`, not your local clones.

## Commands

```bash
# Browse the catalog
dna platform list
dna platform projects
dna platform project humaan

# Generate an implementation plan from plain language
dna plan feature admin-portal --quote "Admin portal with Google directory sync and audit log"
dna plan feature sso-bridge --quote "Silent SSO between invitrace and color subdomains"
dna plan feature azure-deploy --reference-project aistudio
dna plan feature feature-flags --quote "Env toggles plus admin KV for per-tenant flags"

# Load full platform context for your AI tool
dna context platform
dna context platform --feature admin-portal

# Pair with RBAC when access control is involved
dna plan rbac --quote "Only managers see operations reports"
dna context rbac
```

## Knowledge pack

Installing a feature plan auto-installs:

- `platforms/dna-stack` — admin, auth, cloud, integrations, product patterns
- `security/rbac-zero-trust` — permission matrix and surface hiding

Manual install:

```bash
dna marketplace install platforms/dna-stack
```

> **Upgrading?** `platforms/humaan-stack` is retired — DNA resolves it automatically. Run `dna marketplace install platforms/dna-stack` to refresh files. See [CHANGELOG](../CHANGELOG.md).

## Feature categories

| Category | Examples |
|----------|----------|
| **auth** | `rbac-permissions`, `sso-bridge`, `azure-ad-b2c`, `mfa-2fa` |
| **admin** | `admin-portal`, `audit-logging` |
| **integration** | `google-oauth-directory`, `nginx-reverse-proxy`, `harvest-jira-integrations` |
| **cloud** | `azure-deploy`, `aws-deploy`, `vercel-supabase` |
| **product** | `feature-flags`, `feature-management`, `kanban-workspace`, `multi-tenant`, `cms-content` |
| **ai** | `ai-governance` |
| **ops** | `surveys-nps-css`, `crm-pipeline`, `reporting-analytics` |

## Typical workflow

1. **Describe** what you need in plain language.
2. **`dna plan feature <id> --quote "..."`** — DNA writes `.DNA/plans/feature-<id>.md` with phases, knowledge paths, and production reference notes.
3. **`dna context platform`** — paste into Cursor/Claude with behaviour + knowledge loaded.
4. **`dna plan rbac`** — if roles/permissions are involved (menus, routes, APIs must all align).
5. **`dna validate`** — confirm DNA structure before shipping.

## neuralNetwork intents

Platform work routes through intents such as:

- `implement_admin_portal`
- `implement_sso_bridge`
- `implement_feature_flags`
- `deploy_azure` / `deploy_aws`
- `implement_google_directory`
- `implement_ai_governance`
- `implement_multi_tenant`
- `implement_rbac`

## What DNA coordinates

DNA does not replace your app code — it **coordinates AI** across layers that teams often miss:

- Permission matrix before UI
- Server enforcement + route guards + menu/notification hiding
- Admin portal screens for configurable features
- Directory identity (Google / Azure B2C) — no manual user duplication
- Integration secrets in env/Key Vault only
- Feature flags default-off in production
- Audit without logging secrets or raw AI prompts

See also: [RBAC](./rbac.md), [Marketplace](./marketplace.md), [CLI reference](./cli-reference.md).
