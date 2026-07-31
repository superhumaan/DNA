# DNA RBAC Patterns

## Role hierarchies used in production
| Project | Roles |
|---------|-------|
| a production app | owner → admin → employee |
| a production app | user → manager → hr → admin → owner |
| ops tooling | employee → manager → admin (+ custom per-person) |
| a production app | employee → admin → owner |

## Capability model
Issue capabilities from server JWT/session — never trust client role strings alone.

## Permission map (ops tooling)
`permissionMap.json` — fine-grained toggles: `reporting.view_dashboard`, etc.

## Menu segments
`menuSegments.js` — each item declares required role/permission.
Filter segments before render; do not render disabled items for unauthorized users.

## SSO bridge
Cross-app auth between `*.humaan.app` subdomains — see integrations/sso-bridge.dna.md
