# DNA RBAC Patterns

## Role hierarchies used in production
| Project | Roles |
|---------|-------|
| AIStudio | owner → admin → employee |
| ColorParty | user → manager → hr → admin → owner |
| Humaan Ops | employee → manager → admin (+ custom per-person) |
| Soli | employee → admin → owner |

## Capability model
Issue capabilities from server JWT/session — never trust client role strings alone.

## Permission map (Humaan Ops)
`permissionMap.json` — fine-grained toggles: `reporting.view_dashboard`, etc.

## Menu segments
`menuSegments.js` — each item declares required role/permission.
Filter segments before render; do not render disabled items for unauthorized users.

## SSO bridge
Cross-app auth between `*.humaan.app` subdomains — see integrations/sso-bridge.dna.md
