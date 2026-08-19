# DNA RBAC Patterns

## Role hierarchies used in production
| Project | Roles |
|---------|-------|
| production apps | owner → admin → employee |
| production apps | user → manager → hr → admin → owner |
| ops tooling | employee → manager → admin (+ custom per-person) |
| production apps | employee → admin → owner |

## Capability model
Issue capabilities from server JWT/session — never trust client role strings alone.

## Permission map (ops tooling)
`permissionMap.json` — fine-grained toggles: `reporting.view_dashboard`, etc.

## Menu segments
`menuSegments.js` — each item declares required role/permission.
Filter segments before render; do not render disabled items for unauthorized users.

## Optional patterns
App-layer auth patterns (if needed) belong in your app — not in DNA runtime.
