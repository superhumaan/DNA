# Admin Portal Workflow

Auto-triggered when the user mentions admin, backoffice, or admin panel.

## Pattern

- Path: `/admin` (dedicated prefix)
- Main app link opens **new tab** (`target="_blank"` + `rel="noopener noreferrer"`)
- Link visible **only** with admin access
- Route guard blocks direct URL without access
- APIs: `requireAdmin` on `/api/**/admin/**`

## Knowledge

- `.DNA/knowledge/platforms/dna/admin-portal.dna.md`
- `.cursor/rules/admin-portal.mdc`

## Verify

Non-admin: no link · `/admin` blocked · admin API 403  
Admin: link opens new tab · routes work · APIs succeed
