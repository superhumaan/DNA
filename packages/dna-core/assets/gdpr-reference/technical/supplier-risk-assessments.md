# Supplier Risk Assessments

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Technical - Operational Evidence Documents/Supplier Risk Assessments.docx`

---

Supplier Risk Assessments

## Uk Gdpr

Purpose

This document governs privacy and security due diligence for suppliers and subprocessors including Microsoft Azure and Azure OpenAI.

Implements Article 28 due diligence per Vendor Management Policy and Subprocessor Management Procedure.

### The objective of this document is to ensure that

subprocessors meet UK GDPR and contractual requirements before onboarding,

reassessment cycle for critical suppliers is maintained,

assessments link to Subprocessor List.

### This document establishes

questionnaire standards, scoring, and onboarding gates.

### This document supports

Model Vendor Assessment for Azure OpenAI; International Transfer Assessment if needed.

Scope

This document governs supplier risk assessments for vendors processing personal data or providing security-critical infrastructure to [UK Hosting Region] for [Company Name] in relation to the [Product Name] platform.

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

Vendor Management / Procurement

Questionnaire dispatch, contract alignment

Security Lead

Security review and scoring

DPO

Privacy and international transfer assessment

Legal

DPA and terms review

Product and Platform Context

[Product Name] is a UK-hosted, non-clinical, non-medical workspace platform (notes, work boards, teams, search, optional AI and speech-to-text).

### Technical evidence in this document

describes operational reality and control implementation — not customer-facing policy alone,

supports UK GDPR Article 32 security of processing demonstrations,

must remain accurate within defined review SLAs after material architecture change.

[Product Name] does not provide diagnosis, treatment, clinical decision support, or regulated health-record functionality.

Critical Subprocessors (Reference)

Subprocessor

Function

Data location

Reassessment

Microsoft Azure

Hosting SQL, Blob, App Service, Key Vault, monitoring

UK South (customer content)

Annual

Azure OpenAI

LLM and Whisper inference

UK South private endpoint

Annual + Model Vendor Assessment

Microsoft Entra / B2C

Customer authentication

UK/EU tenant configuration

Annual

Microsoft 365 (if support email)

Business operations metadata

UK

Annual

Assessment Questionnaire Topics

security certifications, data location, sub-subprocessors, breach history,

encryption, access control, audit rights, deletion support,

AI: no training on customer content (Model Vendor Assessment for OpenAI).

Evidence Artefact Specification

This section defines mandatory evidence artefacts. Placeholder status in the audit pack means the artefact class is governed here; actual reports and exports are stored in the controlled evidence repository — not embedded in this document.

Artefact

Format

Owner

Minimum retention

Storage location

Completed assessment

PDF per supplier

Vendor Management

6 years

Evidence repo /vendors/

SOC 2 / ISO report

PDF

Security Lead

6 years

Vendor file

Risk acceptance memo

PDF if high residual

Executive + DPO

6 years

Legal folder

Offboarding deletion certificate

PDF

Vendor Management

6 years

Termination checklist

Onboarding

Before production

Assessment MUST be completed before subprocessor processes personal data in production — Enforcement: onboarding gate; no prod API keys until approved

Questionnaire MUST cover security, location, sub-subprocessors, breach history, encryption, access, audit rights, deletion — Enforcement: standard template version controlled

Contract MUST include Article 28 clauses via DPA before processing — Enforcement: Legal checklist

Critical Suppliers

Reassessment

Critical suppliers (Azure, Azure OpenAI, B2C) MUST be reassessed annually — Enforcement: calendar reminders; assessment dated in Subprocessor List

UK South or UK adequacy MUST be confirmed for personal data location — Enforcement: International Transfer Assessment if exception

Supplier SOC 2 / ISO reports MUST be obtained for critical vendors or equivalent assurance — Enforcement: report stored in vendor file

Risk Acceptance

Residual risk

High residual risk MUST have Executive and DPO acceptance with compensating controls — Enforcement: risk acceptance memo archived

Assessment outcome MUST update Subprocessor List and ROPA within 10 working days — Enforcement: Compliance cross-check

Fourth-party AI providers MUST document no training on customer content — Enforcement: Model Vendor Assessment for Azure OpenAI

Offboarding

Termination

Offboarding assessment MUST verify data return/deletion certificates — Enforcement: termination checklist

Failed assessment blocks onboarding; existing supplier critical failure triggers remediation or exit within 30 days — Enforcement: vendor escalation procedure

Low-risk non-data suppliers (no personal data access) MAY use abbreviated screening with Security Lead sign-off — documented in vendor file — Enforcement: documented in methodology

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Identify need → send questionnaire → review evidence → score risk → Legal/DPA → approve/reject → list update → annual refresh.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Completed assessments

Per supplier PDF

Subprocessor List version

Aligned dates

SOC/ISO reports

Critical vendors

Escalation

Failed assessment blocks onboarding; existing supplier critical failure triggers remediation or exit plan within 30 days.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Low-risk non-data suppliers may use abbreviated screening with Security approval.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
