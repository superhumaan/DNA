# Incident Logs

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Technical - Operational Evidence Documents/Incident Logs.docx`

---

Incident Logs

## Uk Gdpr

Purpose

This document governs retention and content of security and privacy incident records for [Product Name].

Supports Incident Response Plan and breach notification decisions — does NOT embed incident data.

### The objective of this document is to ensure that

complete, contemporaneous incident records exist,

trend analysis and regulatory evidence are enabled,

breach register linkage occurs where personal data affected.

### This document establishes

ticket template fields, severity definitions, and PIR requirements.

### This document supports

Data Breach Response Procedure and Incident Response Plan.

Scope

This document governs incident logging for Sev-1–Sev-3 security events, personal data breaches, and major availability incidents affecting personal data for [Company Name] in relation to the [Product Name] platform.

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

Ticket creation, timeline, evidence attachment

Incident Commander

Severity, communications, closure

DPO

Breach determination and ICO/customer notification

Compliance

Retention and audit export

Product and Platform Context

[Product Name] is a UK-hosted, non-clinical, non-medical workspace platform (notes, work boards, teams, search, optional AI and speech-to-text).

### Technical evidence in this document

describes operational reality and control implementation — not customer-facing policy alone,

supports UK GDPR Article 32 security of processing demonstrations,

must remain accurate within defined review SLAs after material architecture change.

[Product Name] does not provide diagnosis, treatment, clinical decision support, or regulated health-record functionality.

Severity Definitions ([Product Name])

Sev-1: Active breach, cross-tenant exposure, widespread outage with data impact, or authentication bypass.

Sev-2: Contained breach risk, targeted exploitation attempt, partial outage affecting personal data processing.

Sev-3: Minor security event, policy violation without data exposure, isolated performance issue.

Mandatory Ticket Fields

detection time, reporter, severity, description, systems affected, tenantIds if known,

timeline, actions, owners, containment, eradication, recovery, closure code.

privacy-breach tag and DPO notification within 1 hour when personal data breach suspected.

Post-Incident Review

PIR for Sev-1/2 within 14 days. Lessons learned update risk register or control matrix within 30 days when material.

Synthetic exercises labelled exercise=true — excluded from regulatory counts.

Evidence Artefact Specification

PLACEHOLDER: No incident narratives are stored in this document. Auditors request exports by date range from Compliance.

Artefact

Format

Owner

Minimum retention

Storage location

Incident ticket

Ticketing record + PDF export

Security Operations

6 years

Ticketing + evidence repo

Timeline attachment

PDF/CSV log extract

Incident Commander

6 years

Ticket attachment

PIR report

PDF

Security Lead

6 years

Ticket attachment

Breach register entry

PDF

DPO

6 years

Privacy evidence repo

Notification records (ICO/customer)

PDF/email PDF

DPO/Legal

6 years

Legal hold folder

Quarterly metrics summary

PDF/PPTX

Security Operations

3 years

Security Committee archive

Logging Requirements

Sev-1 and Sev-2

All Sev-1 and Sev-2 incidents MUST be logged in designated ticketing system within 1 hour of detection — Enforcement: on-call runbook; missed logging is governance finding

Log entry MUST include mandatory template fields enforced by ticketing system — Enforcement: template validation on create

Personal data breach suspicion MUST tag privacy-breach and notify DPO within 1 hour — Enforcement: automated notification rule in ticketing

Breach and PIR

Privacy

Breach register cross-reference MUST be added when DPO confirms personal data breach — Enforcement: link field to breach record ID

Post-incident review MUST be completed for Sev-1/2 within 14 days — Enforcement: PIR document attached to ticket

Regulatory notification decisions MUST be documented with legal advice reference — Enforcement: DPO note attachment

Metrics and Access

Reporting

Quarterly metrics MUST report incident counts by category, MTTR, repeat causes — Enforcement: Security Committee deck archived

Lessons learned MUST create risk register or control matrix updates within 30 days when material — Enforcement: PIR action tracker

Access to incident tickets with personal data MUST be RBAC restricted — Enforcement: ticketing permissions reviewed in Access Review Records

Exercises

Tabletop

Synthetic or table-top incidents MUST be labelled exercise=true — Enforcement: excluded from regulatory breach counts

Repeat Sev-1 same root cause triggers mandatory remediation programme — Enforcement: Executive oversight

None for failing to log Sev-1/2 — no exceptions — Enforcement: governance finding and risk register entry

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Detect → log → classify → command → contain → investigate → notify (if breach) → remediate → PIR → close → quarterly trend review.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Incident ticket export

Quarterly CSV

PIR documents

Sev-1/2

Breach register links

Where applicable

Escalation

Repeat Sev-1 same root cause: mandatory remediation programme; Executive oversight.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

None for failing to log Sev-1/2.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
