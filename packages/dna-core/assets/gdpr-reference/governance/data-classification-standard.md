# Data Classification Standard

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Data Classification Standard.docx`

---

Data Classification Standard

## Uk Gdpr

Purpose

Defines classification levels and mandatory handling rules for [Product Name] data assets across cloud and corporate systems.

Drives encryption, access control, logging, and retention decisions proportionate to sensitivity.

### The objective of this document is to ensure that

apply consistent protection based on business impact and privacy risk,

support auditability of control selection per asset class,

prevent over- and under-classification through defined criteria.

### This document establishes

classification levels and handling matrix

downgrade approval process

### This document supports

Encryption Standard

Access Control Policy

Logging & Monitoring Policy

Retention & Deletion Policy

Scope

This document governs all data created, processed, or stored by [Product Name] platform and supporting [Company Name] systems for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Includes workspace content, authentication data, telemetry, secrets, and corporate records

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Apply consistent protection based on business impact and privacy risk.

Support auditability of control selection per asset class.

Prevent over- and under-classification through defined criteria.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

Security Lead

Standard owner, downgrade approvals, annual sample review

Data Protection Officer

Privacy alignment for personal data classifications

Engineering Lead

Implements technical controls per class in Azure services

Product Manager

Assigns classification in design documents for new features

Operations Lead

Ensures backup and monitoring treatment matches classification

Classification Levels

Mandatory controls

All [Product Name] data assets MUST be assigned one of: Public, Internal, Confidential, Restricted.

Customer workspace notes, work items, attachments, and cleaned transcripts MUST default to Confidential minimum.

Restricted classification MUST apply to authentication secrets, Key Vault material, break-glass credentials, and security incident forensics.

Public classification MUST NOT be used for personal data or tenant identifiers.

Classification MUST be recorded in asset register and feature design docs before production.

Handling Requirements

Mandatory controls

Confidential and Restricted data MUST use TLS 1.2+ in transit and Azure encryption at rest with RBAC least privilege.

Downgrading classification MUST require Security and DPO written approval with rationale recorded.

Logs MUST NOT contain Confidential workspace body text; diagnostic logging limited to hashed identifiers per Logging policy.

Internal telemetry MUST exclude content bodies; token counts and latency are Internal classification.

Third-party sharing of Confidential data requires vendor tier assessment and DPA.

Operational Controls

Mandatory controls

Printed or exported Confidential data MUST use approved secure channels and be destroyed when no longer needed.

Data leaving UK South MUST be reclassified and transfer-assessed before movement.

AI in-memory processing MUST treat inputs as Confidential for duration of request only.

Quarterly sample of 20 assets MUST be reviewed for classification accuracy.

Misclassification discovered in production MUST trigger incident ticket and remediation within 10 working days.

Asset Register Integration

Mandatory controls

Azure resources MUST be tagged with classification per Asset Management Policy.

Feature design documents MUST list data elements and assigned classification before production.

Training module updated when classification definitions change.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Product documents proposed classification in feature design with data elements listed.

2. Engineering maps elements to Azure stores (SQL, Blob, logs) and selects controls from matrix.

3. Security reviews classification in architecture review gate for new services.

4. DPO confirms personal data elements align with ROPA retention and lawful basis.

5. Asset register updated with classification, owner, and location tags in Azure.

6. Quarterly sample review corrects mislabels and updates standards if patterns emerge.

7. Downgrade requests submitted with business justification and alternative controls.

8. Training module updated when classification definitions change.

9. Misclassification incidents ticketed with 10-working-day remediation SLA.

10. Annual classification standard review incorporates incident lessons.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Asset register

Classification field populated for production stores

Design reviews

Architecture tickets showing classification sign-off

Quarterly sample

Review worksheet with corrections made

Downgrade log

Approved exceptions with Security and DPO signatures

Azure tags

Policy compliance report for classification tags

Escalation

Restricted data exposure: Sev-1 incident per Incident Response Plan within 30 minutes.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Temporary Internal handling of Confidential exports requires time-bound Security approval and secure deletion date.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
