import type { KnowledgePack } from "@superhumaan/dna-config";
import { pack } from "./bundled-catalog-helpers.js";

export const DNA_STACK_PACK: KnowledgePack = pack(
  "platforms/dna-stack",
  "DNA Production Stack",
  "platforms",
  "Full-stack patterns from AIStudio, ColorParty, Humaan Ops, and Soli — auth, admin, integrations, cloud",
  [
    {
      path: "platforms/dna/admin-portal.dna.md",
      content: `# Admin Portal Pattern (DNA)

## Shell structure
- Separate route prefix: \`/admin\` or \`/app/admin\`
- Nav groups: General, Directory, Knowledge/Content, Security, Data, Logging, Analytics, Settings
- \`AdminPortal.jsx\` shell + \`adminNavConfig.js\` + lazy-loaded screens

## Server
- All routes under \`/api/.../admin/*\` use \`requireAdmin\` middleware
- Capabilities issued server-side: \`admin\` (read), \`adminWrite\` (mutations)

## Client
- \`AuthGate\` or \`ProtectedRoute\` checks role before render
- **Hide admin link** in main nav for non-admins — not just block on click

## Screens (minimum viable)
- Users/directory (invite, roles, force logout)
- Audit log (append-only)
- Settings relevant to product domain

## Reference projects
- AIStudio: AI governance, content policy, data export
- ColorParty: live map, feedback moderation, profanity
- Humaan Ops: org (people, departments), report config
- Soli: entity templates, data export, usage
`,
    },
    {
      path: "platforms/dna/rbac-patterns.dna.md",
      content: `# DNA RBAC Patterns

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
\`permissionMap.json\` — fine-grained toggles: \`reporting.view_dashboard\`, etc.

## Menu segments
\`menuSegments.js\` — each item declares required role/permission.
Filter segments before render; do not render disabled items for unauthorized users.

## SSO bridge
Cross-app auth between \`*.humaan.app\` subdomains — see integrations/sso-bridge.dna.md
`,
    },
    {
      path: "platforms/dna/multi-tenant.dna.md",
      content: `# Multi-Tenant (AIStudio, Soli)

## Models
- **Deployment-per-tenant** (AIStudio): one Container App per customer, account URL subdomain
- **Row-level tenant** (Soli): \`tenantId\` on every store bucket, SQL JSON row per tenant

## Rules
- Resolve tenant from session on every API call
- Never leak cross-tenant data in search/list endpoints
- Provision script seeds tenant config + starter content
- Admin scoped to own tenant only
`,
    },
    {
      path: "platforms/dna/product-roadmap.dna.md",
      content: `# Product Roadmap (Humaan Ops — ProdPad alternative)

## Hierarchy
Initiative → Project → Phase → Epic → Story

## Kanban lanes
backlog | now | next | later

## UI
- Company workspace segment in main nav
- Per-product workspace tabs: Roadmap (Gantt), Canvas, Initiatives, Phases, Epics, Stories
- Drag-and-drop kanban with drawer detail views

## Integrations
- Jira sync for delivery tracking
- Harvest for time/revenue attribution

## DNA workflow
Run \`dna plan feature feature-management\` before greenfield product tooling.
`,
    },
    {
      path: "platforms/dna/surveys.dna.md",
      content: `# Survey Programme (CSS + NPS)

## Types
- **CSS** — Client Satisfaction Score (numeric scale avg)
- **NPS** — Net Promoter Score (0–10)

## Customisation surfaces (per survey type)
- Target audience
- Email template
- Login/branding page
- Form builder (sections + fields, drag-drop)
- Schedule + campaign enable

## Public respondent flow
\`/survey/{css|nps}/enter\` → passcode → form → thank you

## Ops hub
\`/operations/surveys\` — manager role required

## Scheduler
Cron checks campaign_enabled; NPS tied to active CSS campaign in DNA production rule.
`,
    },
    {
      path: "platforms/dna/reporting.dna.md",
      content: `# Reporting (Humaan Ops)

## Layers
1. **Personal/team weekly** — workspace reporting submit
2. **Operations** — time tracking (Harvest), meeting efficiency, pipeline
3. **Admin config** — Google/Harvest report rules, dept report templates

## Permissions
\`reporting.view_dashboard\` + manager role for ops reports.

## Patterns
- Recharts dashboards
- Export CSV where needed
- Demo mode excluded from aggregates
`,
    },
    {
      path: "platforms/dna/audit.dna.md",
      content: `# Audit Logging

## Storage
- SQLite/Postgres \`audit_events\` + optional JSONL
- Append-only — no updates/deletes

## Client allowlist
Only approved action types from browser; reject unknown events.

## Admin UI
Filterable audit log in admin portal.

## Never log
Secrets, raw AI prompts, full PII payloads — redact.
`,
    },
    {
      path: "platforms/aistudio/ai-governance.dna.md",
      content: `# AI Governance (AI Studio)

## Pipeline (mandatory order)
validate → input guard → content policy → quota → prompt assembly → model → postprocess

## Rules
- **Server-proxy only** — API keys never in browser
- Content policy blocklist (built-in + admin custom terms)
- Clinical/domain safety in system prompts
- Usage quotas: daily per-user, org monthly caps
- Rate limits per bucket (auth, chat, admin)

## Admin
- AI Profiling overlay
- Content policy editor
- Knowledge document ingest (PDF + OCR)

## Audit
Classify issues; never store raw prompts in audit trail.
`,
    },
    {
      path: "platforms/colorparty/gamification.dna.md",
      content: `# Gamification (ColorParty)

## Badges
- Catalog with thresholds, prestige tiers, holiday badges
- Computed server-side on praise events
- Award modal + badge rail UI

## Scoreboards
- Direction: received | sent
- Period: today → last 12 months
- Server cache + bootstrap preload

## Location praise
- GPS proximity layout on canvas
- Office anchor + in-office radius
- Praise modal with location snapshot for admin map
`,
    },
    {
      path: "platforms/soli/kanban-workspace.dna.md",
      content: `# Kanban Workspace (Soli)

## Boards
- Personal (\`/work\`) and team (\`/team-work\`)
- Columns: To do → Doing → Reviewing → Approving → Done (customizable)
- Swimlanes on team boards
- DnD reorder + table view toggle

## Work items
- Personal: owner-scoped
- Team: assignee, comments, ETA, entity links, note links

## API
\`/api/v1/work-items\`, \`/api/v1/work-boards\`
`,
    },
    {
      path: "platforms/soli/notes-stt.dna.md",
      content: `# Notes + Markdown + STT (Soli)

## Notes
- Scopes: personal | team | shared
- Markdown editor with preview (marked + DOMPurify)
- Link to work items and entity records

## Speech-to-text
- Providers: demo | browser | azure
- Transcript segments timeline on note
- Tenant-configurable STT in admin

## Templates
Admin-managed note templates per industry.
`,
    },
    {
      path: "platforms/soli/custom-entities.dna.md",
      content: `# Custom Entities (Soli)

## Model
- singular/plural labels, icon, industry preset
- Field templates: text, date, status, relation, etc.
- Dynamic routes: \`/{plural}\`, \`/{singular}-detail\`

## Admin
Entity model + template builder in admin portal.

## Links
Entity ↔ notes ↔ work items ↔ team schedules
`,
    },
    {
      path: "cloud/azure.dna.md",
      content: `# Azure (AIStudio, Soli)

## Services used in production
- **Azure Container Apps** — SPA + API single container
- **Azure Files** — persistent SQLite/data mount
- **Azure Key Vault** — secrets
- **Azure AD B2C** — production SSO (MSAL + server session exchange)
- **Azure Communication Email** — transactional email
- **Azure SQL** — Soli multi-tenant persistence option
- **Log Analytics** — observability

## Terraform
Per-customer module: \`infra/terraform/modules/customer/\`

## Deploy flow
Build Docker image → push ACR → terraform apply → provision tenant script

## Env fail-fast
Reject AUTH_DEBUG, missing SESSION_SECRET in production.
`,
    },
    {
      path: "cloud/aws.dna.md",
      content: `# AWS Reference Patterns

## Recommended stack (greenfield)
- **ECS Fargate** or **App Runner** — containerized SPA+API
- **ALB** — TLS termination, path routing
- **RDS Postgres** — primary datastore
- **ElastiCache Redis** — rate limits, sessions
- **Cognito** — OAuth/OIDC (alternative to B2C)
- **S3 + CloudFront** — static assets (if split FE/BE)
- **Secrets Manager** — API keys
- **CloudWatch** — logs + alarms

## Nginx option
ALB → Nginx sidecar → app containers for custom routing.

## DNA pairing
Use with \`dna plan feature aws-deploy\` and \`integrations/nginx.dna.md\`.
`,
    },
    {
      path: "cloud/vercel-supabase.dna.md",
      content: `# Vercel + Supabase (ColorParty, Ops)

## Topology
- Vercel frontend (\`dist/\`)
- Vercel backend (\`backend/server.js\` serverless)
- Supabase Postgres
- Upstash Redis (rate limits)

## Patterns
- \`vercel.ts\` — CSP, API rewrite to backend project
- Migrations in \`supabase/migrations/\` + cold-start bootstrap
- Cron via Vercel cron or GitHub Actions
- \`sync:vercel-env\` for local dev parity

## SSO
Shared JWT secret with invitrace.humaan.app for cross-app bridge.
`,
    },
    {
      path: "integrations/nginx.dna.md",
      content: `# Nginx Reverse Proxy

## Use when
- Self-hosted on VM/bare metal
- TLS termination in front of Node containers
- Path-based routing to multiple services
- WebSocket upgrade for real-time features

## Baseline config
\`\`\`nginx
upstream app { server 127.0.0.1:8080; }
server {
  listen 443 ssl http2;
  location /api/ { proxy_pass http://app; proxy_set_header Host $host; }
  location / { proxy_pass http://app; }
}
\`\`\`

## Security headers
Add HSTS, X-Frame-Options, CSP (coordinate with app Helmet config).

## Rate limiting
\`limit_req_zone\` for auth endpoints.

## Custom systems
Route \`/legacy/\` to older upstream; document in Impressions integration-map.
`,
    },
    {
      path: "integrations/sso-bridge.dna.md",
      content: `# Cross-App SSO Bridge (DNA)

## Pattern
Apps on \`*.humaan.app\` share \`JWT_SECRET\`.

## Flow
1. User logged into invitrace.humaan.app (source)
2. Target app (e.g. color.humaan.app) probes \`/api/auth/session\` with \`X-Session-Probe: 1\`
3. Or OTT handoff: \`?ott=\` → exchange at source \`/api/auth/ott/exchange\`
4. Target \`POST /api/auth/establish-session\` → httpOnly cookie

## Implementation
- CORS allow \`*.humaan.app\`
- Verify shared SSO JWT; re-issue app-specific token
- Upsert user record on first bridge login

## Reference
ColorParty: \`invitraceSsoBridge.js\`
Ops: \`SsoBridge.jsx\`
`,
    },
    {
      path: "integrations/google-directory.dna.md",
      content: `# Google OAuth + Directory Sync

## OAuth sign-in
- Redirect to \`/api/auth/google\`
- Domain lock: \`ALLOWED_DOMAIN\` email suffix
- httpOnly JWT + encrypted refresh cookie

## Directory sync (admin)
- Service account + domain-wide delegation
- Sync: email, name, title, department, manager, photo
- Map job titles via Job Directory (Ops)
- Archive leavers; never auto-create departments from people alone

## Cron
Daily sync (Bangkok midnight in DNA production).

## Admin UI
Manual sync button + per-person resync.
`,
    },
    {
      path: "integrations/azure-ad-b2c.dna.md",
      content: `# Azure AD B2C

## Client
MSAL browser → acquire idToken → \`POST /api/v1/auth/b2c/session\`

## Server
Verify JWT via JWKS (\`jose\`)
Map claims: \`extension_accountUrl\`, \`extension_tenantId\`
Issue app session cookie

## Account URL
Users sign in at tenant-specific URL; validate at login.

## Local dev fallback
\`AUTH_PROVIDER=local\` with OTP for development.
`,
    },
    {
      path: "integrations/harvest-jira.dna.md",
      content: `# Harvest + Jira (Humaan Ops)

## Harvest
- Time tracking reports, recon, people sync
- Admin config tabs for report rules
- Product revenue attribution

## Jira
- Delivery insights dashboard
- Epic/story workflow alignment with company kanban
- Hourly sync cron

## Pattern
Integration routes in modular register; secrets from Vercel env.
`,
    },
    {
      path: "disciplines/feature-flags.dna.md",
      content: `# Feature Flags

## DNA production approach (no LaunchDarkly)
1. **Env toggles** — \`ENFORCE_USAGE_QUOTA\`, \`KNOWLEDGE_OCR\`, etc.
2. **Admin KV store** — per-tenant slices (content policy enabled, share redact default)
3. **Capability gates** — role-based feature visibility

## Rollout rules
- Default **off** for risky features in production
- Fail-fast validation rejects unsafe combos (e.g. AUTH_DEBUG in prod)
- Document each flag in \`.DNA/CellularMemory/prefrontalCortex/decisions.md\`

## When to add LaunchDarkly/Unleash
Multi-tenant SaaS with per-user gradual rollout — not yet in DNA stack.
`,
    },
    {
      path: "disciplines/feature-management.dna.md",
      content: `# End-to-End Feature Management

## Lifecycle
1. Intent captured (user story / initiative)
2. DNA plan generated (\`dna plan feature <id>\`)
3. Permission matrix if access-controlled
4. API + persistence
5. UI with all surfaces gated
6. Tests + Impressions update
7. Feature flag rollout
8. Audit + analytics

## Artifacts per feature
- \`.DNA/plans/feature-*.md\`
- Permission matrix (if RBAC)
- Impressions architecture update
- Admin config screen (if configurable)

## neuralNetwork
Route via intent matching feature category.
`,
    },
    {
      path: "disciplines/auth-mfa.dna.md",
      content: `# 2FA / MFA / OTP

## AIStudio + Soli pattern
- Email + password + OTP for local auth
- Invite-only onboarding with temp password
- Password reset via OTP flow
- HttpOnly session cookies in production
- Force password change on first login

## Azure B2C
MFA policies configured in B2C tenant for production.

## Rules
- Hash OTPs server-side (HMAC)
- Rate limit auth endpoints
- Never log OTP values
- Session teardown on logout (abort in-flight streams)
`,
    },
    {
      path: "disciplines/crm.dna.md",
      content: `# CRM Patterns (DNA)

## Pipeline kanban
- Pipedrive integration or native deals board
- Stages as columns; drag deals
- Pipeline tracking analytics

## Data model
Deal → organisation → contacts → activities

## Permissions
BD/manager roles for pipeline; admin for config.

## Reporting
Dept reports can pull pipeline snapshots.
`,
    },
    {
      path: "disciplines/cms.dna.md",
      content: `# CMS & Content Management

## Patterns in DNA stack
- **AIStudio knowledge docs** — admin PDF/URL ingest into chat context
- **Ops job directory** — structured content for people sync mapping
- **Survey form builder** — JSON-driven sections/fields (CMS-like)
- **Soli note/entity templates** — admin-managed content schemas

## Implementation
- Admin CRUD for content types
- Version or draft flag where needed
- Sanitize HTML (DOMPurify) on render
- RBAC on publish vs draft
`,
    },
  ],
);
