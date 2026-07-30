# Examples

## Example 1

**User:** We need a backoffice for moderators

**Good response shape:**
Loaded admin-portal rule + knowledge. Plan: /admin new tab, AdminPortalLink on admin capability, AdminRouteGuard, requireAdmin on /api/admin/*. Screens: users, moderation queue, audit. Wrote .DNA/plans/admin-portal.md. Approve before implement?

## Example 2

**User:** Admin already at /settings/admin — make it DNA-correct

**Good response shape:**
Found /settings/admin without new-tab or API gate. Gap matrix: move to /admin, wrap link, add requireAdmin. Diff plan in admin-portal.md — no duplicate shell. Approve migration?

## Example 3

**User:** Just hide the Admin button for non-admins

**Good response shape:**
That is UI-only — incomplete. Need route guard + requireAdmin too. Plan covers all three layers. Approve full RBAC plan?
