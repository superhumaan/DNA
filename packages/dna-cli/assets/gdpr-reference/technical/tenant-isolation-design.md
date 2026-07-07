# Tenant Isolation Design

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Technical - Operational Evidence Documents/Tenant Isolation Design.docx`

---

Tenant Isolation Design

## Uk Gdpr

Isolation model

Logical tenancy

Every workspace record carries tenantId. API middleware rejects requests where JWT tenantId ≠ resource tenantId.

Azure SQL Row-Level Security policies enforce tenantId match for application roles.

Blob paths: /{tenantId}/... — SAS tokens scoped to prefix.

AI isolation

Prompt construction queries always filter tenantId.

Per-tenant rate limits; no shared prompt cache across tenants.

Telemetry tagged with tenantId — no content fields.

Testing

Automated integration tests for cross-tenant access attempts (expect 403)

Annual penetration test includes IDOR / tenant breakout scenarios

Tenant Data Access — No Human Access

Default posture

When a [Product Name] tenant database is provisioned, human operator access to that tenant's customer content is revoked by default.

Only automated system service identities (API, background jobs) access tenant data under strict RBAC — no routine [Company Name] staff browsing of customer workspaces.

Customer administrators and end users access their own tenant via application permissions only.

Customers may export their data and request erasure per Data Subject Rights Procedure.

[Company Name] does not provide a support console or back-door to read tenant note/work content.

Exception — valid court order or binding legal requirement: access only under Law Enforcement Request Policy, with customer notification where legally permitted and minimum statutory notice period observed before disclosure.

All disclosure events are logged immutably; Legal and DPO approval required.

UK legal compliance

Lawful basis and minimisation: access only what law requires and only for the period required

Processor duties: if [Company Name] is processor, inform customer controller without undue delay unless prohibited

Data subject notification: where permitted, notify affected users before disclosure and allow statutory response time (e.g. to challenge or seek clarification) — stricter than minimum where our policy commits to this

Document decision, legal basis, scope, and recipients in the legal disclosure register

Do not disclose more data than the order specifies

_Template — customize confidentiality and ownership statements for your organisation before distribution._
