# Backup & Recovery Policy

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Backup & Recovery Policy.docx`

---

Backup & Recovery Policy

## Uk Gdpr

Backup design

Scope

Azure SQL automated backups and geo-redundant storage pairs within UK.

Blob Storage versioning/lifecycle for attachments and recordings.

[Product Name] is offered exclusively in the United Kingdom (England, Wales, Scotland, and Northern Ireland). Customer data is processed and stored in Microsoft Azure UK South. [Company Name] does not offer multi-region tenancy, data residency selection, or services outside the UK.

Objectives

Tier

RPO

RTO

Method

Azure SQL (PITR)

5 minutes

4 hours

Point-in-time restore

Blob critical containers

24 hours

8 hours

GRS replicate + restore

Full region loss

24 hours

24 hours

DRP failover runbook

Testing

Quarterly restore test to isolated environment

Results recorded in Backup Architecture evidence doc

_Template — customize confidentiality and ownership statements for your organisation before distribution._
