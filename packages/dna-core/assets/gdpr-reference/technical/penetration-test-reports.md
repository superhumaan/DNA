# Penetration Test Reports

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Technical - Operational Evidence Documents/Penetration Test Reports.docx`

---

Penetration Test Reports

## Uk Gdpr

Purpose

This document governs independent penetration testing of [Product Name].

It does NOT contain test results — it specifies what MUST be retained and how.

### The objective of this document is to ensure that

control effectiveness including tenant isolation, auth, and APIs is validated,

critical findings are remediated and retested,

auditors receive structured evidence without fictitious embedded results.

### This document establishes

pentest scope, ROE, remediation SLAs, and evidence repository structure.

### This document supports

Risk Register, Vulnerability Management Policy, and API Security Standards.

Scope

This document governs external penetration testing scope, frequency, remediation, and evidence handling for [Company Name] in relation to the [Product Name] platform.

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

Tester engagement, scope approval, remediation oversight

Engineering Lead

Fix implementation and retest coordination

Compliance

Evidence repository custody

Executive Sponsor

Risk acceptance for residual critical/high

Product and Platform Context

[Product Name] is a UK-hosted, non-clinical, non-medical workspace platform (notes, work boards, teams, search, optional AI and speech-to-text).

### Technical evidence in this document

describes operational reality and control implementation — not customer-facing policy alone,

supports UK GDPR Article 32 security of processing demonstrations,

must remain accurate within defined review SLAs after material architecture change.

[Product Name] does not provide diagnosis, treatment, clinical decision support, or regulated health-record functionality.

Required Test Scope

Application Gateway WAF bypass attempts,

Azure AD B2C authentication flows,

API authorisation and IDOR, tenant isolation,

AI endpoint abuse and prompt injection scenarios,

secrets exposure and configuration review.

Required Report Contents

Tester identity, dates, environment, tools, methodology (PTES or OWASP testing guide),

finding list with severity, CVSS, reproduction steps, affected component,

remediation recommendations mapped to [Product Name] control areas,

retest results section for critical/high.

Evidence Artefact Specification

PLACEHOLDER: No penetration test results are embedded in this document. Auditors request archived artefacts from Compliance.

Artefact

Format

Owner

Minimum retention

Storage location

Statement of work

PDF

Security Lead

6 years

Evidence repo /pentest/YYYY/

Rules of engagement

PDF signed

Security Lead + DPO

6 years

Same folder

Final penetration test report

PDF confidential

Security Lead

6 years

Encrypted storage; RBAC

Executive summary (customer)

PDF redacted

Compliance

6 years

Customer DD folder if shared

Finding register export

CSV

Security Operations

6 years

Linked to ticketing

Retest evidence

PDF or email PDF

Security Lead

6 years

Per finding subfolder

Risk acceptance memo

PDF if open high

Executive Sponsor

6 years

Legal + Compliance

Engagement

Frequency and tester

Independent penetration test MUST occur at least annually against production or staging representative of production — Enforcement: signed SOW in evidence repo; calendar reminder at 11 months

Tester MUST hold recognised credentials (CREST, CHECK, or documented equivalent) — Enforcement: vendor due diligence file

Scope checklist MUST be approved by Security Lead before test starts — Enforcement: scope includes WAF, B2C, API IDOR, tenant isolation, AI abuse

Rules of Engagement

Safety and data

Production testing MUST avoid destructive tests and personal data exfiltration — synthetic tenants mandatory — Enforcement: rules of engagement signed by DPO

Unauthorised third-party testing by customers MUST be coordinated via security contact — Enforcement: customer security guide

Executive summary MAY be shared with customers under NDA — full report internal only — Enforcement: Legal redaction template

Remediation

SLAs

Critical findings MUST be remediated within Vulnerability Management Policy SLA and retested — Enforcement: remediation tickets; retest letter archived

High findings MUST have remediation plan within 14 days and closure or risk acceptance within 90 days — Enforcement: risk register linkage

Re-test confirmation MUST be archived for all critical issues before audit pack claims closure — Enforcement: retest report or tester email PDF

Risk Register

Import

Findings MUST be imported to risk register within 10 working days — Enforcement: Compliance tracks import ticket

Skipping annual test is not permitted; deferral max 60 days requires Executive + DPO documented reason — Enforcement: compensating monitoring documented

Customer coordination prevents false-positive incident triggers during authorised tests — Enforcement: ticketing tag authorised-pentest

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Plan scope → ROE → execute test → daily sync → draft report → remediation sprint → retest → final report archived → risk register updated → leadership briefing.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Annual test contract

Signed SOW

Final report PDF

Confidential

Remediation log

Ticket IDs

Retest confirmation

Per critical finding

Escalation

Critical unmitigated finding at audit: Executive escalation; optional customer notification if actively exploited.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Deferral max 60 days with Executive + DPO documented reason and compensating monitoring.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
