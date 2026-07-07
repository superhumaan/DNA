# Access Review Records

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Technical - Operational Evidence Documents/Access Review Records.docx`

---

Access Review Records

## Uk Gdpr

Purpose

This document defines mandatory periodic access reviews for [Product Name] production systems.

Evidence placeholder governing what MUST be retained — not individual user lists in this document.

### The objective of this document is to ensure that

least privilege and Joiner-Mover-Leaver effectiveness are validated,

auditor-ready attestations and revocation proof exist,

break-glass accounts are governed.

### This document establishes

quarterly review pack structure and attestation workflow.

### This document supports

Access Control Policy, Joiner-Mover-Leaver Procedure, and Authentication Architecture.

Scope

This document governs access review records for personnel and service principals with access to production or customer personal data systems for [Company Name] in relation to the [Product Name] platform.

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

Conducts reviews, signs pack, tracks revocations

Line managers

Attest direct reports' access

IT / Engineering

Provide entitlement exports

DPO

Reviews high-privilege and cross-tenant access patterns

Product and Platform Context

[Product Name] is a UK-hosted, non-clinical, non-medical workspace platform (notes, work boards, teams, search, optional AI and speech-to-text).

### Technical evidence in this document

describes operational reality and control implementation — not customer-facing policy alone,

supports UK GDPR Article 32 security of processing demonstrations,

must remain accurate within defined review SLAs after material architecture change.

[Product Name] does not provide diagnosis, treatment, clinical decision support, or regulated health-record functionality.

Quarterly Review Scope

Production Azure subscription RBAC, Key Vault access, database admin roles,

CI/CD deploy rights, B2C tenant admins, SIEM/log access, break-glass accounts.

Customer support MUST NOT have standing access to workspace note content — attestation required.

Break-Glass Governance

Maximum two break-glass accounts with MFA.

Monthly verification they remain necessary — logged in same evidence folder.

Emergency access grant max 72 hours with retroactive review.

Evidence Artefact Specification

PLACEHOLDER: This policy does not list individual users. Auditors request quarterly pack folders from Compliance.

Artefact

Format

Owner

Minimum retention

Storage location

Entitlement export (Azure AD, RBAC)

CSV/JSON

IT Security

3 years

/access-reviews/YYYY-QN/

Manager attestation worksheet

Signed PDF or DocuSign

Line managers

3 years

Same folder

Service principal review

XLSX signed by Engineering Lead

Engineering Lead

3 years

Same folder

Revocation ticket list

CSV from ticketing

Security Operations

3 years

Linked by review ID

Security Lead sign-off

PDF

Security Lead

3 years

Same folder

Break-glass monthly check

PDF one-pager

Security Lead

3 years

/access-reviews/break-glass-YYYY-MM.pdf

Quarterly Review

Cadence and scope

Quarterly access review MUST cover production RBAC, Key Vault, DB admin, CI/CD, B2C admins, SIEM, break-glass — Enforcement: ticket template ACCESS-REVIEW-YYYY-QN

Entitlement exports MUST be collected at review start from Azure AD, RBAC, Key Vault, admin lists — Enforcement: automated scripts stored with timestamp in evidence folder

Security Lead MUST sign completed review pack within 10 working days of quarter end — Enforcement: PDF sign-off in evidence repo

Attestation and Revocation

Managers

Managers MUST attest each human account is required — No longer needed requires revocation within 5 working days — Enforcement: signed attestation worksheet per user

Service principals and Managed Identities MUST be reviewed by Engineering Lead for least privilege — Enforcement: separate worksheet tab

Revocation tickets MUST link to review ID — Enforcement: ticketing query proof

Dormant and PIM

Hygiene

Dormant accounts (>90 days inactive) MUST be disabled or justified — Enforcement: Azure AD sign-in log report

PIM activation history MUST be reviewed for unusual production access — Enforcement: export from Azure

Customer support MUST NOT have standing access to workspace note content — Enforcement: align Tenant Isolation Design attestation

Break-Glass

Monthly check

Break-glass accounts MUST be maximum two with MFA; monthly verification logged — Enforcement: monthly one-pager in evidence folder

Missed quarterly review triggers Executive notification and risk register gap — Enforcement: high governance finding

Emergency access grant max 72 hours with retroactive review at next monthly check — Enforcement: ticket required

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Day 1: export entitlements → Day 5: manager attestations → Day 10: revocations complete → Day 15: Security sign-off → Compliance indexes pack.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Quarterly review pack

Signed PDF + exports

Revocation tickets

Linked IDs

Break-glass monthly log

12 per year

Escalation

Missed quarterly review: Executive notification; high governance gap in risk register.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Emergency access grant max 72 hours with retroactive review at next monthly break-glass check.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
