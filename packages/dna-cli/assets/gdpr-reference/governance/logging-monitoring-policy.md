# Logging & Monitoring Policy

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Logging & Monitoring Policy.docx`

---

Logging & Monitoring Policy

## Uk Gdpr

Logging standard

What we log

Authentication success/failure, admin actions, API errors

Immutable audit_logs table: who, what, tenantId, timestamp

Infrastructure metrics via Azure Monitor / Application Insights

What we never log

Passwords, tokens, or session secrets

Full note bodies in debug logs (production)

AI prompts or raw model completions

Payment card data

Retention & access

Operational logs: 90 days hot, 12 months archive

Audit logs: 24 months minimum

Access restricted to Security and on-call; read-only for auditors under NDA

_Template — customize confidentiality and ownership statements for your organisation before distribution._
