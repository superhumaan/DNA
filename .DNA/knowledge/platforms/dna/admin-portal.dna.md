# Admin Portal Pattern (DNA)

## Default routing
- **Dedicated path:** `/admin` (or `/app/admin` when the main app uses an `/app` shell)
- **Separate from user app** — admin is its own route tree and layout, not nested inside user dashboards
- **Opens in a new tab** from the main application

## Entry link (main app)
Wrap the admin entry in a permission check. Non-admins must not see any admin/backoffice link.

```tsx
// AdminPortalLink — only render when user has admin capability
function AdminPortalLink() {
  const { canAccessAdmin } = useAuth(); // server-issued capability, not client role string
  if (!canAccessAdmin) return null;

  return (
    <a href="/admin" target="_blank" rel="noopener noreferrer">
      Admin
    </a>
  );
}
```

Use `target="_blank"` and `rel="noopener noreferrer"` so admin work stays in a separate tab by default.

## Client route guard
Direct URL access to `/admin` must fail for unauthorized users — redirect home or show 403. No flash of admin chrome.

```tsx
function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { canAccessAdmin, isLoading } = useAuth();
  if (isLoading) return <Loading />;
  if (!canAccessAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}
```

Mount `AdminRouteGuard` on the admin layout root.

## Server enforcement
- All routes under `/api/.../admin/*` use `requireAdmin` middleware (or equivalent capability gate)
- Capabilities issued server-side: `admin` (read), `adminWrite` (mutations)
- Default deny — never trust client-only hiding

## Shell structure
- Nav groups: General, Directory, Knowledge/Content, Security, Data, Logging, Analytics, Settings
- `AdminPortal` shell + nav config + lazy-loaded screens
- Keep admin bundle separate where the bundler allows (lazy routes)

## Three-layer security (all required)
1. **UI** — hide admin link when no access
2. **Route** — block `/admin` navigation without access
3. **API** — 403 on admin endpoints without access

RBAC is incomplete if a non-admin can see the link, open the URL, or call the API.

## Screens (minimum viable)
- Users/directory (invite, roles, force logout)
- Audit log (append-only)
- Settings relevant to product domain

## Verification
- Log in as non-admin: no admin link, `/admin` blocked, admin API 403
- Log in as admin: link opens new tab, routes work, APIs succeed
- Test direct URL bar navigation for both roles

## Reference projects
- AIStudio: AI governance, content policy, data export
- ColorParty: live map, feedback moderation, profanity
- Humaan Ops: org (people, departments), report config
- Soli: entity templates, data export, usage
