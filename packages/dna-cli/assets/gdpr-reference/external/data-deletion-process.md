# Data Deletion Process

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `External - Customer-Facing Documents/Data Deletion Process.docx`

---

Data Deletion Process

## Uk Gdpr

Purpose

Operationalises secure, verifiable deletion of [Product Name] Customer and user personal data on termination, contract request, or erasure instruction.

Supports processor deletion obligations under the DPA and Customer controller erasure requests.

### The objective of this document is to ensure that

Ensure complete, timely deletion across primary stores, derivatives, and searchable indexes.

Provide auditable evidence and optional Customer certificates.

Align with Data Retention Schedule and backup expiry without restore of deleted tenants to production.

### This document supports

Data Processing Agreement (DPA)

Data Subject Rights Procedure

Retention & Deletion Policy

Data Retention Schedule

Data Breach Response Procedure

Scope

This document governs Applies to production deletion of workspace data, indexes, AI-derived stored outputs, voice blobs, and associated logs where required. for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Includes Customer-initiated termination and data subject erasure coordinated with controller.

Production customer personal data SHALL remain in Microsoft Azure UK South only; no multi-region tenancy or data residency selection is offered.

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Production deletion MUST complete within contractual SLA (default 30 days from validated request; 90 days post-termination unless shorter).

Verification queries MUST confirm zero remaining tenant records in primary stores before closure.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

Data Protection Officer

UK GDPR compliance review, lawful basis validation, ICO liaison

Legal

Drafting, regulatory wording, version control, contract alignment

Product

Feature accuracy, in-app notices, AI labelling

Engineering

Technical accuracy of data flows, retention, and security statements

Customer Success

Enterprise customer queries and controller/processor clarification

Security Lead

Article 32 statements, whitepaper accuracy, incident coordination

Roles in deletion requests

Customer organisation (controller)

Initiates deletion of workspace content and user accounts under their organisation

Provides processor instructions for erasure under DPA

Handles employee DSR for content where [Company Name] is processor

[Company Name] (processor or controller)

Executes technical deletion on documented instructions

Assists controller DSR where applicable

Deletes [Company Name] controller data (account/billing) per Privacy Policy when [Company Name] is controller

Deletion scope matrix

Store

Deletion method

Verification

Azure SQL tenant rows

Tenant-scoped delete job

COUNT(*) = 0 by tenantId

Blob objects

Prefix purge by tenantId

Storage inventory scan

Search indexes

Index purge job

Query returns no tenant hits

Ephemeral AI caches

Cache invalidation

No prompt storage by design

Backups

Lifecycle expiry — no production restore

Ops attestation

Deletion certificates

Deletion completion certificate MUST be issued to Customer on request within 10 business days of verification.

Certificates MUST reference ticket ID, tenant ID, scope, and verification date without embedding deleted content.

Certificates and logs MUST be retained six years; deleted content MUST NOT appear in logs.

Authority and ticketing

Mandatory controls

All deletion requests MUST be ticketed with Customer identifier, scope, and legal authority.

Authority MUST be verified: Customer admin for tenant deletion; written controller instruction for processor deletion; DSR via Data Subject Rights Procedure when [Company Name] is controller.

Legal holds MUST block deletion until Legal releases in writing with ticket reference.

Controller/processor disputes on erasure MUST escalate to Legal before any partial deletion.

Technical deletion controls

Mandatory controls

Production deletion MUST complete within contractual SLA (default 30 days from validated request; 90 days post-termination unless shorter).

Deletion MUST cover Azure SQL tenant rows, Blob objects, search indexes, and cached derivatives.

Ephemeral AI caches MUST be invalidated; no prompt storage SHALL remain by design.

Backup media MUST expire per Data Retention Schedule without restore to production except documented disaster recovery tests.

Cross-tenant deletion MUST be impossible; jobs MUST require tenantId parameter validated twice.

Subprocessor deletion MUST be confirmed where subprocessors store Customer data (e.g. support copies).

Verification and evidence

Mandatory controls

Verification queries MUST confirm zero remaining tenant records in primary stores before closure.

Deletion completion certificate MUST be issued to Customer on request within 10 business days of verification.

Failed deletion MUST be retried automatically; three failures escalate to Engineering lead.

Support exports before deletion MUST be offered during contractual export window.

Deletion logs MUST record actor, timestamp, scope, and verification result without retaining deleted content.

Emergency erroneous deletion MUST follow Incident Response Plan with Customer notification.

Annual tabletop exercise MUST walk through termination deletion for sample tenant.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Receive deletion request via support or automated termination workflow; create ticket.

2. Customer Success or DPO validates authority and scope (full tenant vs user vs category).

3. Legal confirms no legal hold applies.

4. Notify Customer of scheduled deletion date and final export deadline if applicable.

5. Engineering disables tenant access within 24 hours of termination effective date.

6. Run export tooling if Customer requested during export window.

7. Execute primary deletion job for SQL, Blob, and search indexes by tenantId.

8. Purge derivative caches and queue dead-letter messages containing personal data.

9. Run automated verification queries; manual sample for enterprise tiers.

10. Operations confirms backup lifecycle will not restore deleted tenant beyond retention window.

11. DPO reviews verification evidence and closes ticket.

12. Issue deletion certificate to Customer if contracted.

13. Archive deletion log entry for six years.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Deletion tickets

Scope, authority, timestamps, status

Verification reports

Query results showing zero records

Certificates issued

Copy for enterprise Customers

Failed job alerts

Resolution time

Legal hold register

Blocks with release dates

Annual tabletop

Exercise report

Escalation

Failed verification with residual data MUST escalate to Engineering lead within 24 hours and DPO within 48 hours.

Controller/processor dispute on erasure MUST escalate to Legal before any partial deletion.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Legal hold pauses deletion until released; scope of hold documented on ticket.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after changes to deletion automation or Tenant Isolation Design,

after failed deletion incidents,

after DPA or Data Retention Schedule amendments affecting timelines.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
