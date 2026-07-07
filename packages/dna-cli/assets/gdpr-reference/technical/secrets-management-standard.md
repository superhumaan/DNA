# Secrets Management Standard

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Technical - Operational Evidence Documents/Secrets Management Standard.docx`

---

Secrets Management Standard

## Uk Gdpr

Purpose

This document governs lifecycle of secrets and keys: generation, Azure Key Vault UK South storage, rotation, access, and emergency revocation.

Supports Encryption Standard and Article 32 confidentiality.

### The objective of this document is to ensure that

secrets are eliminated from source code and logs,

Key Vault access is least privilege with audit trail,

rapid rotation on compromise is enabled.

### This document establishes

Key Vault RBAC, Managed Identity patterns, and rotation runbooks.

### This document supports

CI/CD Security Controls and Access Review Records.

Scope

This document governs all credentials, API keys, connection strings, signing keys, and certificates used by [Product Name] production and staging for [Company Name] in relation to the [Product Name] platform.

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

Security Lead

Key Vault RBAC, rotation policy, incident rotation

Engineering Lead

Managed Identity adoption, no secrets in code

Operations Lead

Certificate renewal monitoring

DPO

Breach assessment if secret exposure involved personal data

Product and Platform Context

[Product Name] is a UK-hosted, non-clinical, non-medical workspace platform (notes, work boards, teams, search, optional AI and speech-to-text).

### Technical evidence in this document

describes operational reality and control implementation — not customer-facing policy alone,

supports UK GDPR Article 32 security of processing demonstrations,

must remain accurate within defined review SLAs after material architecture change.

[Product Name] does not provide diagnosis, treatment, clinical decision support, or regulated health-record functionality.

Key Vault Architecture (UK South)

Production secrets in Key Vault UK South only — separate vault per environment.

Applications retrieve secrets at runtime via Managed Identity — Key Vault references in App Service.

Soft-delete and purge protection enabled; diagnostic logs to SIEM.

Rotation and Incident Response

Secrets rotated at least annually and within 4 hours of suspected compromise.

Shared integration secrets rotate within 5 working days on personnel change (JML).

Post-incident rotation includes all secrets in blast radius.

Storage and Access

Key Vault

Production secrets MUST reside in Azure Key Vault UK South; plaintext in repos, tickets, or chat prohibited — Enforcement: secret scanning in CI (gitleaks/trufflehog); commit blocked on match

Applications MUST retrieve secrets via Managed Identity — no hardcoded connection strings in App Service except Key Vault references — Enforcement: IaC review; Azure Policy audit

Key Vault access MUST use RBAC minimum roles; admin access via PIM where available — Enforcement: quarterly Access Review Records include Key Vault

Rotation and Monitoring

Lifecycle

Secrets MUST be rotated at least annually and within 4 hours of suspected compromise — Enforcement: rotation runbooks; incident war room checklist

Shared integration secrets MUST rotate on personnel change within 5 working days — Enforcement: Joiner-Mover-Leaver Procedure ticket linkage

Key Vault diagnostic logs MUST stream to SIEM with alerts on deny and unusual read volume — Enforcement: SIEM use cases tested semi-annually

Certificates and Environments

Operational

Certificates MUST be monitored for expiry with alert at 30 and 7 days — Enforcement: Azure Monitor; Operations weekly report

Development secrets MUST use separate vault — production values forbidden in dev — Enforcement: pre-commit hooks; annual environment segregation test

Backup of Key Vault MUST use soft-delete and purge protection — Enforcement: Azure Policy compliance

Break-Glass and Hygiene

Exceptions

Emergency break-glass secret access MUST be logged and reviewed within 24 hours — Enforcement: Security daily review of break-glass logs

Customer-provided secrets MUST be stored per-tenant namespaced keys with rotation notification — Enforcement: support runbook

Secret sprawl reviews MUST occur semi-annually to remove unused secrets — Enforcement: inventory export vs application manifest

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Provision via IaC → grant Managed Identity → deploy referencing secret URI → schedule rotation → audit access quarterly.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Key Vault access logs

SIEM 12+ months

Rotation records

Annual minimum

CI secret scan results

Per build

Escalation

Suspected secret leak: rotate within 4 hours; Incident Response Plan; customer notice if impact.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Local developer `.env` files must use fake values only — production values are incident + disciplinary.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
