# Data Subject Rights Procedure

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Data Subject Rights Procedure.docx`

---

Data Subject Rights Procedure

## Uk Gdpr

Purpose

Defines handling of access, rectification, erasure, restriction, portability, and objection requests under UK GDPR Chapter III for [Product Name].

Clarifies routing between [Company Name] controller data and customer-controlled workspace content.

### The objective of this document is to ensure that

meet statutory timelines with verified identity,

document outcomes for accountability,

route processor vs controller requests correctly.

### This document establishes

DSR intake and identity verification

controller vs processor routing

### This document supports

Retention & Deletion Policy

Data Deletion Process

Scope

This document governs data subject rights requests relating to [Product Name] processing by [Company Name] or customer tenants for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Includes end users, customer admins, and corporate contacts

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Meet statutory timelines with verified identity.

Document outcomes for accountability.

Route processor vs controller requests correctly.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

Data Protection Officer

Oversight, complex cases, extension decisions, regulatory liaison

Privacy Operations

Intake, logging, identity verification, deadline tracking

Customer Success

Customer controller liaison for workspace content requests

Engineering Lead

Technical extraction, erasure jobs, portability exports

Legal Counsel

Manifestly unfounded or excessive request assessments

Controller and Processor Responsibilities

Customer organisation (controller)

Receives requests from their users for workspace content; fulfils using [Product Name] admin tools where they are controller.

May forward processor-only requests to [Company Name] with required identifiers.

[Company Name] (processor or controller)

Fulfils requests for [Company Name] controller data (account, billing, security logs about the individual).

Assists customer controllers with processor erasure/export APIs for tenant content per DPA timelines.

Intake and Timelines

Mandatory controls

DSR requests MUST be acknowledged within 72 hours via privacy inbox or authenticated portal.

Responses MUST be provided within one calendar month unless extension up to two months documented with reasons to data subject.

DSR log MUST record request type, dates, identity method, outcome, and systems searched.

No fee unless manifestly unfounded or excessive repeat requests per UK GDPR.

DSR metrics MUST be reported quarterly to Privacy Steering Forum.

Identity and Routing

Mandatory controls

Identity verification MUST be completed before disclosure using B2C account challenge or government ID for high-risk disclosures.

Workspace content requests where the customer is controller MUST be routed to that customer within two working days and handled per the DPA without undue delay.

Staff MUST NOT disclose personal data via informal channels; all via logged procedure.

Children's requests require heightened verification where [Company Name] is controller.

Rights Fulfilment

Mandatory controls

Erasure MUST invoke Data Deletion Process including backups within retention alignment.

Portability MUST provide structured, commonly used, machine-readable format for controller data.

Restriction processing MUST flag account to limit processing while preserving rights defense.

Objection under Article 21 MUST be assessed by DPO with cessation of processing unless compelling grounds documented.

Third-party data in exports MUST be redacted unless lawful basis permits disclosure.

Refusals

Mandatory controls

Manifestly unfounded or excessive requests MAY be refused with DPO and Legal approval and rationale to data subject.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Intake via privacy@ with auto-acknowledgement and ticket creation in DSR log.

2. Privacy Operations verifies identity and classifies controller vs processor scope.

3. If customer controller content: notify customer admin with template and offer API export assistance.

4. If [Company Name] controller: Engineering extracts from account systems and relevant logs (metadata only where content restricted).

5. DPO reviews complex refusals, extensions, and third-party data conflicts.

6. Erasure: trigger deletion jobs; confirm backup alignment; send completion to data subject.

7. Close ticket with outcome code; retain records per retention section.

8. Quarterly metrics review with process improvements.

9. Extension requests documented with reasons communicated to data subject.

10. Portability export delivered in machine-readable format within statutory timeline.

11. Article 21 objection assessed by DPO within 30 days.

12. Refusal letters reviewed by Legal before dispatch.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

DSR log

All requests with statutory dates

Identity verification

Method recorded per case

Responses

Copies of substantive replies (redacted store)

Erasure proof

Deletion job IDs linked to tickets

Quarterly metrics

Volume, timeliness, refusals

Escalation

ICO complaint risk or deadline miss within 48 hours: DPO → Legal → Executive.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Refusal of manifestly unfounded requests requires DPO and Legal written approval.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
