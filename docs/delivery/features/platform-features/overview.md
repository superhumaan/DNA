# Platform features overview

DNA's platform catalog encodes production patterns as planable, installable features.

---

## Browse the catalog

```bash
dna platform list
dna platform projects
dna platform project aistudio
```

Set reference repos on your machine:

```bash
export DNA_REFERENCE_ROOT=~/Projects
dna platform projects
```

---

## Feature categories

| Category | Examples |
|----------|----------|
| **auth** | `rbac-permissions`, `sso-bridge`, `azure-ad-b2c`, `mfa-2fa` |
| **admin** | `admin-portal`, `audit-logging` |
| **integration** | `google-oauth-directory`, `nginx-reverse-proxy`, `harvest-jira-integrations` |
| **cloud** | `azure-deploy`, `aws-deploy`, `vercel-supabase` |
| **product** | `feature-flags`, `kanban-workspace`, `multi-tenant`, `cms-content` |
| **ai** | `ai-governance` |
| **ops** | `surveys-nps-css`, `crm-pipeline`, `reporting-analytics` |

---

## Typical workflow

1. Describe what you need in plain language
2. `dna plan feature <id> --quote "..."`
3. `dna context platform --feature <id>`
4. Implement with AI using the generated plan
5. `dna quality report --feature` before close-out

---

## Related docs

| Feature | Guide |
|---------|-------|
| Admin portal | [Platform catalog](../../product/platform-catalog.md) |
| RBAC | [RBAC and zero trust](./rbac-and-zero-trust.md) |
| Full catalog | [Platform catalog](../../product/platform-catalog.md) |
