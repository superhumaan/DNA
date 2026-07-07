# Subprocessor Management Procedure

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Subprocessor Management Procedure.docx`

---

Subprocessor Management Procedure

## Uk Gdpr

Purpose

Controls engagement, change notification, and documentation of subprocessors processing customer personal data on behalf of [Product Name].

Maintains accurate Subprocessor List for customers and ROPA linkage.

### The objective of this document is to ensure that

meet Article 28 subprocessor obligations and customer contract notice periods,

prevent unapproved subprocessor processing,

ensure subprocessors provide sufficient guarantees.

### This document establishes

Subprocessor List publication

customer objection handling

### This document supports

Records of Processing Activities (ROPA)

Vendor Management Policy

Scope

This document governs subprocessors used in production [Product Name] delivery in Azure UK South and supporting services for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Includes Microsoft, optional Azure OpenAI, email, monitoring, and support tools with data access

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Meet Article 28 subprocessor obligations and customer contract notice periods.

Prevent unapproved subprocessor processing.

Ensure subprocessors provide sufficient guarantees.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

Data Protection Officer

Subprocessor approval, customer notice content, ROPA updates

Vendor Manager

Maintains Subprocessor List publication and change log

Security Lead

Technical due diligence and access restrictions

Legal Counsel

DPA subprocessor clauses and objections handling

Engineering Lead

Confirms technical integration and data flows for new subprocessors

Controller and Processor Responsibilities

Customer organisation (controller)

May object to new subprocessors per DPA within contractual timeframe.

Remains controller for workspace content; receives subprocessor change notices from [Company Name].

[Company Name] (processor or controller)

Engages subprocessors only with customer-authorised general consent in DPA or specific consent where required.

Publishes Subprocessor List and provides advance change notification per contract.

Ensures subprocessors process only on documented instructions and UK South default for customer content.

Approval and Publication

Mandatory controls

New subprocessors MUST receive DPO and Security approval before processing customer personal data.

Customers MUST receive advance notice of subprocessor changes per DPA minimum lead time.

Subprocessor List MUST be updated within five working days of approved change and version-published externally.

Each subprocessor MUST have contract flow-down of Article 28 terms and UK GDPR-equivalent protections.

ROPA processor entries MUST list subprocessors with function and data categories.

Technical and Location Controls

Mandatory controls

Subprocessor processing location MUST default to UK South; other regions require transfer assessment.

Azure OpenAI subprocessor use MUST document in-memory processing and no training on customer content.

Subprocessor access MUST be disabled on contract end same day.

Shadow subprocessors discovered in architecture review MUST be remediated or removed within 10 working days.

Incidents and Review

Mandatory controls

Emergency subprocessor engagement MUST notify customers within 72 hours with retrospective assessment.

Annual subprocessor review MUST validate continued necessity and control effectiveness.

Customer objections MUST be handled per DPA with Legal and DPO within contractual timelines.

Material subprocessor security incidents MUST be assessed for customer breach notification within 24 hours.

Fourth parties MUST be identified in vendor assessment and prohibited without disclosure.

Termination

Mandatory controls

Termination of subprocessor MUST include certified deletion or return of personal data within 30 days.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Engineering or Vendor Manager proposes subprocessor with data flow diagram and purpose.

2. Security completes assessment; DPO reviews privacy and transfer; Legal confirms contract terms.

3. Approved change: update ROPA, Subprocessor List draft, and schedule customer notice.

4. Publish updated list after notice period elapses unless emergency path documented.

5. Configure technical integration with least privilege and UK region constraints.

6. Monitor subprocessor certificates and incident notifications quarterly.

7. On termination: revoke access, obtain deletion certificate, remove from list, notify customers if required.

8. Handle customer objections via Legal with documented outcome and alternative if needed.

9. Emergency path: DPO approval, customer notice within 72 hours, full assessment within 10 days.

10. Annual review validates necessity and UK South configuration.

11. Fourth-party mapping updated in vendor assessment.

12. Customer notice logs retained with version stamps.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Subprocessor List

Published version history with dates

Customer notices

Email or portal logs for changes

Approval tickets

DPO and Security sign-off

ROPA linkage

Processor entries matching list

Deletion certificates

Post-termination artifacts

Escalation

Unapproved subprocessor processing: cease processing, DPO and Legal notified within 4 hours.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Emergency subprocessor requires DPO approval and customer notice within 72 hours with full assessment within 10 days.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
