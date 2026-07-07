# Business Continuity Plan (BCP)

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Business Continuity Plan (BCP).docx`

---

Business Continuity Plan (BCP)

## Uk Gdpr

Purpose

Maintains continuity of [Product Name] service and [Company Name] critical functions during disruptive events affecting personnel, suppliers, or facilities.

Coordinates with Disaster Recovery Plan for technical recovery while addressing communications and staffing.

### The objective of this document is to ensure that

identify critical activities and dependencies with measurable recovery priorities,

ensure customer and regulator communications during prolonged disruption,

validate continuity capabilities through annual exercises.

### This document establishes

critical function map

crisis communications playbook

### This document supports

Disaster Recovery Plan

Remote Working Policy

Scope

This document governs business continuity for [Product Name] customer-facing services and supporting corporate functions in the UK for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Includes cyber, supplier, pandemic, and facility scenarios

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Identify critical activities and dependencies with measurable recovery priorities.

Ensure customer and regulator communications during prolonged disruption.

Validate continuity capabilities through annual exercises.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

Operations Lead

BCP owner, activation authority, status communications

Executive Sponsor

Declares BCP activation and resource allocation

Engineering Lead

Technical workarounds within DRP scope

Customer Success Lead

Customer notifications and SLA management

Data Protection Officer

Privacy and breach assessments during continuity events

Critical Functions and Dependencies

Mandatory controls

Critical [Product Name] functions MUST be mapped to dependencies: Azure UK South, key personnel, subprocessors, and identity providers.

RTO for customer-facing API availability MUST align with DRP targets and be published internally.

Alternate personnel MUST be named for Security, Engineering, Operations, and DPO cover roles.

Third-party critical vendors (Azure, identity, payment) MUST have contact trees and escalation paths documented.

Supply chain single points of failure MUST be reviewed annually with mitigation plans.

Activation and Communications

Mandatory controls

BCP MUST be exercised at least annually including customer communication playbook.

BCP activation criteria MUST be defined (e.g., >4h outage, loss of two critical roles, regional Azure impairment).

Status page updates MUST begin within 60 minutes of customer-impacting continuity event.

Customer enterprise contacts MUST be updatable within 4 hours during crisis using on-call roster.

BCP documents MUST be stored offline-accessible to on-call leads.

Scenarios and Remote Work

Mandatory controls

Pandemic, supplier failure, and cyber scenarios MUST be included in exercise rotation.

Work-from-home continuity MUST rely on Remote Working Policy controls for production access.

Financial and contractual obligations during outage MUST be tracked by Finance and Legal.

Review and Regulatory

Mandatory controls

Post-exercise report MUST list gaps with owners and due dates within 20 working days.

Regulatory notifications during continuity events MUST involve DPO when personal data at risk.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Operations maintains critical function map reviewed annually with Engineering and Security.

2. On-call roster published weekly with backup contacts.

3. Upon trigger, Executive declares BCP; Operations opens crisis bridge channel.

4. Customer Success publishes status updates every 60 minutes until resolved.

5. Engineering executes DRP technical steps; Operations tracks RTO clock.

6. DPO assesses privacy impacts if data loss or unauthorised access suspected.

7. Finance tracks SLA credits and contractual notices.

8. Post-event: hot wash within 5 days; formal report and corrective actions within 20 working days.

9. Alternate personnel confirmed at start of each quarter.

10. Offline BCP pack verified accessible annually.

11. Regulator contact tree tested in annual exercise.

12. Corrective actions from exercise tracked to closure.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

BCP exercise report

Annual scenario with attendees and gaps

Critical function map

Current version with RTO/RPO

Status page log

Incident communication timestamps

On-call roster

Weekly published schedule

Corrective actions

Closed tickets from last exercise

Escalation

Outage >4 hours: Executive Sponsor leads customer executive briefings same day.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Skipping annual exercise requires Executive written approval with alternative tabletop within quarter.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
