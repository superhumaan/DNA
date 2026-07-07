# Data Storage Matrix

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Technical - Operational Evidence Documents/Data Storage Matrix.docx`

---

Data Storage Matrix

## Uk Gdpr

Purpose

This document maps [Product Name] data categories to storage systems, region, encryption, retention, and classification.

Supports ROPA, security assessments, and Article 30 records.

### The objective of this document is to ensure that

auditors have a single table of stores,

new stores are registered before use,

retention links to Data Retention Schedule.

### This document establishes

the master storage matrix and quarterly attestation process.

### This document supports

ROPA accuracy, DPIAs, and Environment Segregation cross-checks.

Scope

This document governs all production and staging-persistent stores handling personal data or authentication metadata for [Company Name] in relation to the [Product Name] platform.

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

Approved Stack Inventory

### Production components SHALL match

Approved production stack: Internet → Azure Application Gateway (WAF) → Azure App Service (Node.js API) + Azure Static Web Apps (React); private endpoints to Azure SQL, Blob Storage, Azure OpenAI, and Azure Key Vault (UK South); Azure AD B2C (OIDC) for customer identity; Azure Monitor / Application Insights / Microsoft Defender for Cloud.

Azure UK South: Application Gateway WAF, App Service (API), Static Web Apps, Azure SQL, Blob Storage, Key Vault, Service Bus, Azure AD B2C, optional Azure OpenAI (private endpoint), Application Insights, Azure Monitor.

Reference Matrix (Production)

Store

Region

Contents

Encryption

Retention anchor

Azure SQL ([database-name])

UK South

Users, notes, work, teams, audit metadata

TDE + TLS

Data Retention Schedule

Blob ([blob-storage-account])

UK South

Attachments, voice recordings

SSE + TLS

Per-asset schedule; DSR erasure

Azure AD B2C

UK/EU tenant config

Auth identities, profile attributes

Platform

Account lifetime + legal hold

Key Vault

UK South

Secrets, certificates

HSM-backed

Rotation policy; no personal data

Application Insights

UK South

Telemetry metadata

Platform

90–365 days per Logging policy

Log Analytics / SIEM

UK South

Security and audit events

Platform

12+ months audit

Azure OpenAI

UK South

Transient inference only

TLS + private link

No content retention by design

Matrix Row Requirements

Store name, UK region, data categories, classification, encryption method, retention period, owner, ROPA activity IDs.

AI ephemeral memory marked Not persisted with AI Processing Flow reference.

Deletion mechanism column describes erasure path per store.

Completeness

Coverage

Matrix MUST list every store: SQL, Blob, B2C, Key Vault, Application Insights, Log Analytics, Service Bus if persisting, backup vaults — Enforcement: Compliance master spreadsheet; new Azure resource tagged until reviewed

New production store MUST be added to matrix before go-live — Enforcement: change advisory board checklist; deploy blocked if missing

Matrix version MUST be published with date and DPO + Security sign-off quarterly — Enforcement: signed export in evidence repo

Encryption and Region

Article 32 alignment

Encryption column MUST reference Encryption Standard (TDE, SSE, TLS) — Enforcement: Azure Policy compliance export attached quarterly

Disaster recovery copy locations MUST be UK-only for customer content — Enforcement: backup config cross-check monthly

Staging stores MUST NOT hold production customer data — Enforcement: Environment Segregation scans; violation is incident

AI and Logs

Special rows

AI ephemeral memory MUST be marked Not persisted with AI Processing Flow reference — Enforcement: architecture review confirms no hidden stores

Azure OpenAI row MUST note transient inference only — Enforcement: Model Vendor Assessment linkage

Log stores MUST distinguish security logs vs telemetry vs audit — Enforcement: Audit Logging Design cross-reference

Customer and DSR

Disclosure and erasure

Deletion mechanism column MUST describe erasure path per store — Enforcement: DSR drill validates matrix accuracy annually

Customer-facing redacted matrix MAY be provided under NDA — Enforcement: Legal approval; remove internal-only stores

Each row MUST include ROPA activity IDs — Enforcement: quarterly completeness review by DPO and Engineering

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Engineering proposes store → Security classifies → DPO maps ROPA → Compliance updates matrix → quarterly attestation.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Storage matrix export

Quarterly dated

ROPA crosswalk

Activity IDs populated

Azure Policy report

Encryption and region

Escalation

Undocumented production store: change freeze; incident if customer data already written.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Ephemeral cache TTL <24h with no disk persistence may use simplified row with Security approval.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
