# RBAC & Zero Trust

DNA coordinates AI through full RBAC implementation so you don't need to know permission matrices, zero trust, or surface inventories yourself.

## The problem DNA solves

Your colleague asked Claude to add RBAC to a dashboard. After refresh, users still saw menus, notifications, and actions they shouldn't.

**Root cause:** AI secured one layer (maybe an API) but skipped menus, routes, notifications, and verification.

DNA prevents this by generating a **complete implementation plan** before any code is written.

## Plain-language → full plan

```bash
dna plan rbac \
  --quote "No employee should access unless I give them access. Roles: manager, hr, operations, admin" \
  --feature dashboard
```

Or shorter:

```bash
dna plan rbac --roles manager,hr,operations,admin --feature dashboard
```

## What DNA generates

| File | Purpose |
|------|---------|
| `.DNA/plans/rbac-dashboard.md` | Full AI briefing — paste into Cursor/Claude |
| `.DNA/CellularMemory/prefrontalCortex/rbac-permission-matrix.md` | Feature × role matrix |
| `.DNA/templates/rbac/permission-matrix.json` | Machine-readable matrix |
| `.DNA/knowledge/security/*` | RBAC, zero trust, UI checklist (auto-installed) |
| `.DNA/workflows/rbac.workflow.md` | Step-by-step workflow |

## Give context to AI

```bash
dna context rbac
```

Includes Behaviour, knowledge packs, neuralNetwork `implement_rbac` intent, and permission matrix.

## Implementation phases (DNA enforces order)

1. **Permission matrix** — roles and feature grid
2. **Server enforcement** — API middleware, default deny, zero trust
3. **Route guards** — block direct URL access
4. **UI surfaces** — hide menus, notifications, buttons *(the step that was missed)*
5. **Role management** — where admins grant access
6. **Verification** — test each role; refresh; no forbidden UI flash

## Definition of done

RBAC is **not complete** if a user without permission can still **see** a menu item, notification, or route — even if the API returns 403.

## Example verification checklist

- Employee with no role → cannot access platform
- Manager → sees only manager menus
- Refresh → menus still correct
- Direct URL to forbidden route → blocked
- Forbidden API → 403
- Notifications for forbidden actions → hidden

## neuralNetwork intent

`implement_rbac` routes AI to:

- `security/rbac-fundamentals.dna.md`
- `security/zero-trust.dna.md`
- `security/ui-surface-checklist.dna.md`
- security Behaviour + permission matrix memory

## Marketplace pack

```bash
dna marketplace install security/rbac-zero-trust
```

[CLI reference](./cli-reference.md) · [Concepts](./concepts.md)
