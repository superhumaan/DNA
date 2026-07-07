# OWASP-SAST-DAST Evidence

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Technical - Operational Evidence Documents/OWASP-SAST-DAST Evidence.docx`

---

OWASP/SAST/DAST Evidence

## Uk Gdpr

Purpose

This document governs application security testing evidence: SAST, SCA, DAST aligned to OWASP Top 10 and API Security Top 10.

Demonstrates proactive Article 32 testing — not a substitute for penetration testing.

### The objective of this document is to ensure that

critical vulnerabilities are detected before production,

auditable archive of scan results and remediation exists,

false positive handling is documented.

### This document establishes

tooling requirements, remediation SLAs, and OWASP coverage matrix.

### This document supports

Penetration Test Reports and CI/CD Security Controls.

Scope

This document governs automated security testing in CI/CD and periodic DAST against staging representative of production for [Company Name] in relation to the [Product Name] platform.

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

Security Operations

Tooling, triage, SLA tracking

Engineering Lead

Remediation implementation

Security Lead

False positive approval, risk acceptance

DPO

Immediate notification when testing exposes real customer personal data outside approved test scope; breach assessment opened within 4 hours

Product and Platform Context

[Product Name] is a UK-hosted, non-clinical, non-medical workspace platform (notes, work boards, teams, search, optional AI and speech-to-text).

### Technical evidence in this document

describes operational reality and control implementation — not customer-facing policy alone,

supports UK GDPR Article 32 security of processing demonstrations,

must remain accurate within defined review SLAs after material architecture change.

[Product Name] does not provide diagnosis, treatment, clinical decision support, or regulated health-record functionality.

Testing Scope

SAST and SCA

Execute on every production release candidate; block critical CVEs with known exploit unless time-bound waiver.

DAST

At least quarterly against staging with OWASP ZAP or equivalent authenticated scans.

API Security Top 10 included for tenant and auth endpoints; OpenAPI-driven scan config versioned.

False Positive Register

Document rule ID, rationale, approver, expiry max 12 months.

Register reviewed quarterly by Security Lead.

Evidence Artefact Specification

Mandatory artefacts for auditors — actual tool output files, not summaries embedded in policies.

Artefact

Format

Owner

Minimum retention

Storage location

SAST report (per RC)

PDF/JSON export

Security Operations

3 years

Evidence repo /release/

DAST report (quarterly)

PDF/HTML + raw scan

Security Operations

3 years

Evidence repo /dast/

OWASP coverage matrix

XLSX

Security Lead

3 years

Compliance pack

Remediation export

Ticket CSV

Engineering Lead

3 years

Linked to tickets

SAST and SCA

CI gates

SAST MUST execute on every production release candidate with results archived — Enforcement: CI artefact retention; Compliance index by release tag

SCA MUST run on every merge with blocking policy for critical CVEs with known exploit — Enforcement: Dependabot + pipeline gate; waiver requires Security sign-off

Tool signature updates MUST be applied within 30 days of vendor release for hosted scanners — Enforcement: Operations monthly patch report

DAST

Periodic testing

DAST MUST run at least quarterly against staging with authenticated scans — Enforcement: scheduled pipeline; report archived within 5 days

API Security Top 10 MUST be included in DAST scope for tenant and auth endpoints — Enforcement: OpenAPI-driven scan config versioned

Staging DAST MUST NOT use production customer accounts or real personal data — Enforcement: synthetic test tenants only

Remediation

Findings

Critical and high findings MUST have remediation ticket before production promotion unless time-bound risk acceptance — Enforcement: ticketing integration; release checklist

OWASP Top 10 coverage matrix MUST be updated per annual cycle — Enforcement: Security maintains matrix in evidence repo

Security regression tests for fixed CVEs MUST be added before production release unless DPO-approved exception with compensating monitoring — Enforcement: unit/security test in repo

Reporting

Leadership and pentest

Penetration test findings MUST be cross-referenced to ensure SAST/DAST gaps are tracked — Enforcement: PIR after pentest updates tool rules

Executive summary of open critical/high counts MUST be reported monthly — Enforcement: security metrics dashboard

False positives MUST be documented with approver and expiry max 12 months — Enforcement: false positive register reviewed quarterly

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Run tools → triage → assign Engineering → fix → rescan → close ticket → archive report → update OWASP matrix.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

SAST reports

Per release candidate

DAST reports

Quarterly minimum

False positive register

Current

Escalation

Unremediated critical at release window: Security blocks deploy; Executive notified if business pressure to waive.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Risk acceptance max 90 days for high with compensating controls documented.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
