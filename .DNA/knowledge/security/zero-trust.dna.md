# Zero Trust for Application RBAC

## Principles

1. **Never trust the client** — UI hiding is UX, not security
2. **Verify every request** — API and server actions check role server-side
3. **Least privilege** — grant minimum permissions per role
4. **Assume breach** — log denied access; no sensitive data in error messages

## Enforcement layers

| Layer | Requirement |
|-------|-------------|
| API | Middleware returns 403 when role lacks permission |
| Server actions | Check role before mutation |
| Route guard | Block navigation to forbidden paths |
| UI | Hide menus, notifications, buttons user cannot use |

## Failure mode

Adding auth to one endpoint while leaving menus visible is **not** zero trust and **not** complete RBAC.
