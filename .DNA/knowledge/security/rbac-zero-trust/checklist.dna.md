# UI Surface Checklist — RBAC

Audit every surface. Users must not SEE what they cannot USE.

## Menus & navigation
- [ ] Sidebar items filtered by role
- [ ] Top nav links filtered by role
- [ ] Mobile menu filtered by role
- [ ] Breadcrumbs do not expose forbidden parent routes

## Notifications
- [ ] Notification bell hidden or empty for unauthorized roles
- [ ] Toast/action notifications filtered server-side
- [ ] Real-time feeds (WebSocket/SSE) respect permissions

## Routes & pages
- [ ] Direct URL access blocked
- [ ] Refresh does not flash forbidden content
- [ ] Deep links to sub-routes guarded

## Actions & widgets
- [ ] Buttons (export, shutdown, settings, delete) hidden per role
- [ ] Dashboard widgets filtered by permission
- [ ] Context menus filtered by role

## Verification
Test with fresh session per role. Refresh after login. Try direct URLs.
