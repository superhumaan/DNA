# Environment Segregation Standard

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Technical - Operational Evidence Documents/Environment Segregation Standard.docx`

---

Environment Segregation Standard

## Uk Gdpr

Purpose

This document separates development, staging, and production [Product Name] environments.

Supports Change Management Policy and Secure SDLC.

### The objective of this document is to ensure that

production customer data is prevented in non-production,

production credentials do not function in lower environments,

promotions follow change management.

### This document establishes

environment map, validation tests, and prod-copy restrictions.

### This document supports

Infrastructure Architecture Diagram and CI/CD Security Controls.

Scope

This document governs Azure subscriptions/resource groups, CI/CD targets, data, credentials, and personnel access across environments for [Company Name] in relation to the [Product Name] platform.

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

Environment Map

Production: separate Azure subscription or resource group; distinct Managed Identities and Key Vaults.

Staging: production-equivalent controls where AI enabled; synthetic data only for DAST.

Development: no production connection strings; engineers default to staging access; production via PIM.

Prohibited Actions

Copying production database or Blob to lower environments without Security + DPO approval, isolated network, 7-day max expiry.

Dev workstations direct access to production SQL — private endpoints; jump host with logging if used.

Third-party SaaS integrations in dev pointing to production tenant IDs.

Infrastructure Separation

Azure boundaries

Production MUST reside in separate subscription or resource group from dev/staging with distinct Managed Identities and Key Vaults — Enforcement: IaC enforced; Azure Policy deny cross-env peering without approval

Production connection strings and API keys MUST NOT be valid in dev/staging configuration — Enforcement: config drift scan weekly

Network rules MUST prevent dev workstations direct access to production SQL — Enforcement: private endpoints; VPN/jump host with logging if used

Data and Testing

Test data

Copying production database or Blob to lower environments is prohibited without Security + DPO written approval and 7-day expiry — Enforcement: automated copy scripts blocked; manual attempts audited

Test data MUST be synthetic or statistically anonymised — Enforcement: data generation scripts in repo; review on refresh

Staging DAST MUST use synthetic accounts only — no production customer accounts — Enforcement: test account registry

Access and CI/CD

Personnel and pipelines

Engineers default to staging access only; production Azure RBAC via PIM time-bound — Enforcement: Access Review Records

CI/CD MUST deploy to production only from protected main branch with required reviewers — Enforcement: branch protection; audit log of bypasses

Environment labels MUST appear in telemetry to prevent mis-routed alerts — Enforcement: Application Insights cloud_RoleName convention

Validation

Annual test

Annual segregation validation MUST attempt prohibited actions and document results — Enforcement: signed validation report

Customer demo tenants in production MUST be labelled demo=true with same controls — Enforcement: tenant metadata flag

Forensic production copy permitted only per Backup Architecture exception — Enforcement: DPO + Security approval ticket

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Provision env via IaC → assign RBAC → validate no prod secrets → annual test → remediate gaps.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Environment map

Subscription and RG IDs

Annual validation report

Signed

Config drift scan

Weekly

Escalation

Production data found in dev: Sev-1 incident, immediate deletion, DPO assessment.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Forensic copy per Backup Architecture exception only.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
