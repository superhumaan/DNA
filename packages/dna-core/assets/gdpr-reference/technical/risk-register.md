# Risk Register

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Technical - Operational Evidence Documents/Risk Register.docx`

---

Risk Register

## Uk Gdpr

Purpose

This document governs the privacy, security, availability, and AI risk register for [Product Name].

Supports Article 24 risk-based measures and management oversight.

### The objective of this document is to ensure that

material risks are visible, owned, and treated,

findings from DPIAs, pentests, and incidents are imported promptly,

accepted residual risk is documented.

### This document establishes

risk scoring methodology, quarterly forum, and acceptance rules.

### This document supports

Control Matrix, Penetration Test Reports, and AI Risk Assessment.

Scope

This document governs operational risk register entries affecting [Product Name] personal data processing and platform security for [Company Name] in relation to the [Product Name] platform.

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

Executive Sponsor

Accepts residual critical risks

Security Lead

Maintains security and AI risk entries

DPO

Privacy risk scoring and acceptance co-sign

Compliance

Register integrity and quarterly forum

Product and Platform Context

[Product Name] is a UK-hosted, non-clinical, non-medical workspace platform (notes, work boards, teams, search, optional AI and speech-to-text).

### Technical evidence in this document

describes operational reality and control implementation — not customer-facing policy alone,

supports UK GDPR Article 32 security of processing demonstrations,

must remain accurate within defined review SLAs after material architecture change.

[Product Name] does not provide diagnosis, treatment, clinical decision support, or regulated health-record functionality.

Risk Register Fields

unique ID, description, owner, inherent/residual score, treatment plan, target date, status.

AI risks reference AI Risk Assessment and feature name.

Supplier risks reference Supplier Risk Assessments vendor ID.

Reference Risks (Platform)

Risk ID

Description

Owner

Treatment

Residual

T-R01

Cross-tenant data leakage via API or storage misconfiguration

Engineering

RLS, middleware, CI tests, annual pentest

Low with monitoring

T-R02

Authentication bypass or token forgery

Security

B2C, JWT validation, WAF, pentest

Low

T-R03

Undocumented production data store

Compliance

Storage matrix gate, Azure tagging

Low

T-R04

Backup/restore failure beyond RTO

Operations

Quarterly restore tests, DR exercise

Medium — tested

T-R05

Critical unremediated vulnerability

Security

Vuln mgmt SLA, SAST/DAST, pentest

Low with process

T-R06

Subprocessor change affecting UK residency or security

DPO

Supplier assessments, Subprocessor List

Low

Quarterly Review Forum

Privacy Steering Forum or Security Committee reviews register quarterly — minutes archived.

Pentest, DAST critical, and DPIA high risks imported within 10 working days.

Register Integrity

Mandatory fields

Material risks MUST be logged with unique ID, owner, scores, treatment plan, target date, status — Enforcement: GRC spreadsheet or system; no orphan verbal risks

Closed risks MUST retain closure rationale and evidence — rows not deleted — Enforcement: status Closed only with evidence link

Risk scoring methodology MUST be documented and applied consistently — Enforcement: methodology appendix versioned

Import and Linkage

External findings

Pentest, DAST critical, and DPIA high risks MUST be imported within 10 working days — Enforcement: Compliance import checklist ticket

AI-specific risks MUST reference AI Risk Assessment — Enforcement: cross-link in register

Supplier risks MUST reference Supplier Risk Assessments entry — Enforcement: vendor ID key

Acceptance and Review

Governance

Quarterly review MUST occur with Security, DPO, Engineering, Operations — minutes archived — Enforcement: forum minutes in evidence repo

Residual high risks MUST have DPO and Executive written acceptance with expiry max 12 months — Enforcement: signed acceptance PDF in evidence repo

Register export MUST be available for audit within 3 working days — Enforcement: Compliance runbook

Incident-Driven Risks

PIR actions

Incident-driven risks MUST be created for repeat root causes within 30 days — Enforcement: PIR action tracker

Unaccepted critical risk triggers Executive decision within 48 hours — Enforcement: Executive MUST restrict production deployment for that feature until treated or formally accepted

Low risks (score ≤8) MAY use lightweight scoring with Security Lead sign-off recorded in risk register — Enforcement: documented in methodology appendix

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Identify → assess → treat → monitor → escalate → close → quarterly review.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Risk register export

Dated CSV/PDF

Quarterly review minutes

Signed

Risk acceptance memos

High residual

Escalation

Unaccepted critical risk: Executive decision within 48 hours; unresolved critical risk MUST block production release until accepted or remediated.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Low risks (score ≤8) MAY use lightweight scoring with Security Lead sign-off in risk register.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
