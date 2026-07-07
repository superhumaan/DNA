# Audit Logging Design

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Technical - Operational Evidence Documents/Audit Logging Design.docx`

---

Audit Logging Design

## Uk Gdpr

Purpose

This document specifies security, audit, and privacy-aligned logging for [Product Name].

Implements Logging & Monitoring Policy at technical level.

### The objective of this document is to ensure that

forensic reconstruction of who did what, when, and to which tenant — without routine logging of note content,

breach investigation and access reviews are supported,

privacy impact is minimised through metadata-first logging.

### This document establishes

event taxonomy, redaction rules, SIEM integration, and retention.

### This document supports

Article 32 logging measures and AI Auditability Standard cross-reference.

Scope

This document governs audit and security logging across API, admin actions, AI invocation metadata, and platform configuration for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Production customer personal data SHALL remain in Microsoft Azure UK South only; no multi-region tenancy or data residency selection is offered.

[Product Name] is a non-medical, non-clinical workspace platform (notes, work boards, teams, search, optional AI and STT). It does not provide diagnosis, treatment, or clinical decision support.

Approved production stack: Internet → Azure Application Gateway (WAF) → Azure App Service (Node.js API) + Azure Static Web Apps (React); private endpoints to Azure SQL, Blob Storage, Azure OpenAI, and Azure Key Vault (UK South); Azure AD B2C (OIDC) for customer identity; Azure Monitor / Application Insights / Microsoft Defender for Cloud.

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Aligns with ICO Data Protection Audit Framework — Information & cyber security and Records management toolkits.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

Engineering Lead

Architecture accuracy, diagram updates, control implementation

Security Lead

Security review, evidence acceptance, access and pentest governance

DPO

Privacy alignment, retention, DPIA and ROPA linkage

Operations Lead

Backup, restore, availability evidence

Compliance

Audit pack curation and control matrix alignment

Product and Platform Context

[Product Name] is a UK-hosted, non-clinical, non-medical workspace platform (notes, work boards, teams, search, optional AI and speech-to-text).

### Technical evidence in this document

describes operational reality and control implementation — not customer-facing policy alone,

supports UK GDPR Article 32 security of processing demonstrations,

must remain accurate within defined review SLAs after material architecture change.

[Product Name] does not provide diagnosis, treatment, clinical decision support, or regulated health-record functionality.

Event Taxonomy

Mandatory event types

authentication success/failure, authorisation denial,

admin configuration changes, AI feature invocation (metadata only),

data export, DSR job execution, break-glass access.

Prohibited log content

customer note body, attachment bytes, prompts, model completions in standard audit logs,

passwords, tokens, secrets, full JWT payloads.

Log Field Schema

UTC timestamp, correlationId, tenantId (where applicable), actorId, action, resource type/id, result, source IP (hashed or truncated per policy).

AI logs: feature, model deployment, token counts, latency — never prompt/response body unless DPO-approved diagnostic window max 72 hours.

SIEM and Retention

Logs ship to Log Analytics / SIEM with minimum 12 months online retention; integrity and tamper alerts configured.

Retention and deletion follow Retention & Deletion Policy and Logging & Monitoring Policy.

Schema and Redaction

Design standards

Log schema MUST define required event types and fields; new types require Security approval — Enforcement: schema document versioned in evidence repo

Customer note body, prompts, and model completions MUST NOT be written to standard audit logs by default — Enforcement: log injection tests; code review blocks content field loggers; DPO sample review quarterly

Design changes logging new personal data categories MUST receive DPO review — Enforcement: privacy checklist on schema PRs

Pipeline and Integrity

Operations

Logs MUST ship to immutable or WORM-capable storage / SIEM with minimum 12 months online retention — Enforcement: Log Analytics retention locks; tamper detection alerts

Clock synchronisation MUST use trusted time source across all log producers — Enforcement: NTP monitoring on App Service; alert on skew

Log integrity failures for Sev-1 events MUST be remediated within 24 hours — Enforcement: on-call runbook; incident if sustained >4 hours

Access and Tenant Visibility

RBAC

Log access MUST be RBAC-restricted; export containing personal data requires DPO approval — Enforcement: Azure RBAC reviews in Access Review Records

Customer administrators MUST access tenant audit logs only for their tenant via API — Enforcement: authorisation tests; no cross-tenant audit read

Integration with Incident Response Plan MUST use correlationId to stitch timelines — Enforcement: incident template requires correlationId field

AI and Alerting

AI-specific logging

AI diagnostic full prompt logging max 72 hours requires DPO ticket, scoped tenant, automatic purge — Enforcement: AI Auditability Standard cross-check; diagnostic flag in ticket

Administrative actions on tenant configuration MUST generate high-severity audit events — Enforcement: SIEM alert rules; weekly sample review by Security

Log volume anomalies (denials, export jobs) MUST alert Security Operations — Enforcement: SIEM use cases tested quarterly

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Define schema → implement emitters → validate redaction in staging → Security approves SIEM parsing → production enable → quarterly sample audit.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Log schema document

Current version

SIEM retention config

12+ months

Redaction sample review

Quarterly signed

Alert test results

Semi-annual

Escalation

Missing audit trail for confirmed breach scope: Sev-1 incident; regulatory notification assessment by DPO.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Temporary full prompt logging max 72 hours with DPO ticket, scoped tenant, and automatic purge job.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
