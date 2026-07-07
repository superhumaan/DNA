# Backup Architecture

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Technical - Operational Evidence Documents/Backup Architecture.docx`

---

Backup Architecture

## Uk Gdpr

Architecture

Components

Azure SQL: automated backups, LTR optional for enterprise

Blob: GRS within UK pairs; soft delete 7 days

Configuration exported to secure vault

No backup of ephemeral AI prompt buffers

Restore flow

1. Declare incident / data loss

2. Identify recovery point (timestamp)

3. Restore SQL to new or existing server in UK South

4. Reconcile Blob prefixes for affected tenantIds

5. Validate application connectivity and audit trail

_Template — customize confidentiality and ownership statements for your organisation before distribution._
