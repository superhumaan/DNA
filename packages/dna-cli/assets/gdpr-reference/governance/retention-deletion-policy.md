# Retention & Deletion Policy

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Retention & Deletion Policy.docx`

---

Retention & Deletion Policy

## Uk Gdpr

Principles

UK GDPR alignment

[Product Name] is offered exclusively in the United Kingdom (England, Wales, Scotland, and Northern Ireland). Customer data is processed and stored in Microsoft Azure UK South. [Company Name] does not offer multi-region tenancy, data residency selection, or services outside the UK.

Data is kept no longer than necessary for the purpose collected.

Retention schedule ([Product Name] production)

Customer workspace data

Data type

Active tenant

After termination

Backups

Notes, work items, attachments

Subscription term

Delete within 90 days

Rolling 35 days

Voice recordings (Blob)

User-controlled / org policy

Delete with note or termination

Included in backup cycle

Audit logs (security)

24 months

24 months then archive/delete

Included

AI telemetry (metadata only)

13 months

13 months

Not in customer backup

Support correspondence

3 years

3 years

N/A

Deletion process

Procedures

Tenant deletion: automated job removes SQL rows and Blob objects by tenantId

Data subject erasure: verify identity → delete across SQL, Blob, B2C where applicable within 30 days

Backup purge: expired backups overwritten; no restore after deletion SLA

Certificate of deletion available for enterprise customers on request

_Template — customize confidentiality and ownership statements for your organisation before distribution._
