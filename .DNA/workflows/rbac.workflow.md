# RBAC + Zero Trust Workflow

Use when a user requests permissions, roles, or access control.

## Before writing any code

1. Run `dna plan rbac` with the user's plain-language requirement
2. Read `.DNA/plans/rbac-*.md` — this is the AI briefing
3. Read `.DNA/CellularMemory/prefrontalCortex/rbac-permission-matrix.md`
4. Load knowledge: security/rbac-fundamentals, zero-trust, ui-surface-checklist
5. Read security.behaviour.md

## Implementation order (mandatory)

1. **Permission matrix** — agree roles and feature × role grid
2. **Server enforcement** — middleware on every API; default deny
3. **Route guards** — block direct URL navigation
4. **UI surfaces** — hide menus, notifications, buttons, widgets (most commonly missed)
5. **Role management** — document where admins grant access
6. **Verification** — test each role; refresh browser; confirm no forbidden UI flash

## Definition of done

RBAC is NOT complete if a user without permission can still SEE a menu item, notification, or route — even if the API returns 403.

## After completion

- Update DNA/Impressions/security/security-baseline.md
- Update CellularMemory decisions
- Run `dna validate`
