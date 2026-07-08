/**
 * Admin / backoffice auto-pattern — triggered when users mention admin in plain language.
 */

export const ADMIN_PORTAL_DEFAULT_PATH = "/admin";

export const ADMIN_REQUEST_PATTERN =
  /\b(admin|backoffice|back office|back-office|admin portal|admin dashboard|admin panel|control panel)\b/i;

export function isAdminPortalRequest(text: string): boolean {
  return ADMIN_REQUEST_PATTERN.test(text);
}

export const ADMIN_PORTAL_KNOWLEDGE_PATHS = [
  "platforms/dna/admin-portal.dna.md",
  "platforms/dna/rbac-patterns.dna.md",
  "security/rbac-fundamentals.dna.md",
  "security/zero-trust.dna.md",
  "security/ui-surface-checklist.dna.md",
] as const;

export function appendAdminPortalRequirements(featureRequestMarkdown: string): string {
  return `${featureRequestMarkdown}

## DNA Admin Portal Requirements (auto-applied)

The user mentioned **admin** or **backoffice**. Apply the DNA admin portal pattern:

### Routing
- Dedicated path: \`${ADMIN_PORTAL_DEFAULT_PATH}\` (or \`/app/admin\` if the app uses an app shell prefix)
- Admin opens in a **new browser tab** from the main app — use \`target="_blank"\` and \`rel="noopener noreferrer"\`

### Access control (mandatory — all three layers)
1. **Link** — render the Admin/Backoffice nav link **only** when the user has admin access; no link, no hint for everyone else
2. **Client route guard** — direct navigation to \`${ADMIN_PORTAL_DEFAULT_PATH}\` redirects or shows 403 when unauthorized (no flash of admin UI)
3. **Server API** — every \`/api/**/admin/**\` route uses \`requireAdmin\` (or equivalent); default deny

### Shell
- Separate admin layout: nav groups (General, Directory, Security, Data, Logging, Settings)
- Lazy-load admin screens; do not bundle admin into the main user bundle when avoidable

### Knowledge
- Read \`.DNA/knowledge/platforms/dna/admin-portal.dna.md\`
- Read \`.cursor/rules/admin-portal.mdc\`
- Run \`dna plan feature admin-portal\` if a detailed plan is needed

### Definition of done
- [ ] Admin link opens new tab and is **hidden** without admin access
- [ ] \`${ADMIN_PORTAL_DEFAULT_PATH}\` is **blocked** without admin access (URL bar test)
- [ ] Admin APIs return 403 without admin access
- [ ] Tests cover authorized and unauthorized paths
`;
}

export function adminPortalCursorRule(projectName: string): string {
  return `# Admin / Backoffice Portal

_Auto-applies when the user mentions admin, backoffice, admin panel, or control panel._

Project: **${projectName}**

## Trigger

User says admin, backoffice, back office, admin portal, admin dashboard, or similar → **implement or extend the admin portal using this pattern**. Do not embed admin screens in the main app nav tree.

## Default shape

| Layer | Rule |
|-------|------|
| **Path** | \`${ADMIN_PORTAL_DEFAULT_PATH}\` (dedicated prefix, not mixed with user routes) |
| **Entry** | Link from main app opens admin in a **new tab** (\`target="_blank"\` + \`rel="noopener noreferrer"\`) |
| **Link visibility** | Wrap in permission check — **no link** if user lacks admin access |
| **Route guard** | Client blocks \`${ADMIN_PORTAL_DEFAULT_PATH}\` for unauthorized users (redirect or 403) |
| **API** | All admin endpoints behind \`requireAdmin\` middleware — never UI-only security |

## Implementation checklist

1. \`AdminPortalLink\` (or equivalent) — returns \`null\` without \`admin\` capability
2. Admin shell at \`${ADMIN_PORTAL_DEFAULT_PATH}\` with its own layout and lazy routes
3. \`AdminRouteGuard\` / \`ProtectedAdminRoute\` on every admin page
4. Server: \`requireAdmin\` on \`/api/**/admin/**\`
5. Tests: user without admin cannot see link, cannot load route, API returns 403

## Do not

- Show a disabled admin link to non-admins
- Rely on hiding buttons while leaving routes public
- Open admin in the same tab unless the user explicitly asks otherwise
- Skip API enforcement because the UI is "hidden"

## Reference

\`.DNA/knowledge/platforms/dna/admin-portal.dna.md\`, \`.DNA/knowledge/platforms/dna/rbac-patterns.dna.md\`
`;
}
