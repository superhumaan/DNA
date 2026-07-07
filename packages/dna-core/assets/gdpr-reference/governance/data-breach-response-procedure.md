# Data Breach Response Procedure

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Data Breach Response Procedure.docx`

---

Data Breach Response Procedure

## Uk Gdpr

Purpose

Defines assessment, notification, and documentation for personal data breaches involving [Product Name] under UK GDPR Articles 33–34.

Coordinates controller and processor obligations when customer workspace data is affected.

### The objective of this document is to ensure that

meet 72-hour ICO notification requirement where applicable,

notify customer controllers without undue delay when [Company Name] is processor,

maintain complete breach register for accountability.

### This document establishes

breach register and notifiability assessment

processor notification templates

### This document supports

Incident Response Plan

Records of Processing Activities (ROPA)

Scope

This document governs personal data breaches involving [Product Name] systems, personnel, subprocessors, or customer tenants for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Includes confidentiality, integrity, and availability breaches with personal data

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Meet 72-hour ICO notification requirement where applicable.

Notify customer controllers without undue delay when [Company Name] is processor.

Maintain complete breach register for accountability.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

Data Protection Officer

Breach lead, notifiability assessment, ICO and data subject coordination

Security Lead

Containment, forensics, evidence for breach facts

Legal Counsel

Regulatory submissions, law enforcement, customer contract notices

Customer Success Lead

Customer controller notifications and relationship management

Executive Sponsor

Approval for high-impact decisions and public statements

Controller and Processor Responsibilities

Customer organisation (controller)

Assesses breach impact on data subjects for workspace content they control.

Notifies ICO and data subjects where controller obligations apply to their processing.

Instructs [Company Name] on containment and remediation when processor breach affects their tenant.

[Company Name] (processor or controller)

Notifies customer controllers without undue delay when processor breach affects customer personal data.

Assesses and notifies ICO for [Company Name] controller processing (accounts, billing, corporate data) where required.

Provides breach facts, affected categories, and remedial measures to support customer notifications.

Detection and Assessment

Mandatory controls

Suspected personal data breaches MUST be reported to the DPO within one hour of discovery.

DPO MUST assess likelihood and severity of risk to rights and freedoms within 24 hours with written record.

Breach register MUST record date, nature, categories, approximate numbers, consequences, and measures for every notifiable and near-miss event.

Containment MUST not destroy evidence needed for assessment; forensic copies MUST be taken before wipe unless live-system isolation is required — waiver logged with incident ID.

Near-miss events with personal data exposure risk MUST be registered with lessons learned.

Notification

Mandatory controls

ICO notification MUST be submitted within 72 hours of awareness where Article 33 threshold met.

Customer controllers MUST receive initial processor breach notice within 24 hours of [Company Name] awareness (facts known at time) and a supplemental report within 72 hours including affected categories, approximate volumes, and remedial measures.

Data subjects MUST be notified under Article 34 when high risk to rights unless exception applies with documented rationale.

Subprocessor breaches MUST be assessed within 24 hours of vendor notification with customer impact analysis.

Public communications MUST be approved by Legal and Executive; no admission beyond verified facts.

Remediation and Content Access

Mandatory controls

Breach involving tenant content MUST document whether human access or exfiltration occurred; routine access denied by design is noted.

Remediation actions MUST be tracked to closure with verification before incident closure.

Cross-border breach implications MUST involve transfer assessment records if data left UK.

Breach records MUST be available to ICO on request within regulatory timelines.

Assurance

Mandatory controls

Annual breach tabletop MUST include processor-to-controller notification drill.

Annual review of breach trends presented to Privacy Steering Forum.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Reporter notifies DPO and Security via emergency channel with initial facts and systems affected.

2. Security contains threat; preserves logs from App Service, SQL audit, Key Vault, and SIEM.

3. DPO opens breach register entry and begins notifiability assessment with Legal.

4. Within 24 hours: draft assessment of risk, affected data categories, and approximate data subject count.

5. If notifiable: prepare ICO submission; notify customer controllers with processor breach template.

6. Executive approves external communications; Customer Success delivers customer notices.

7. Implement remediation; verify controls; update risk register and policies if needed.

8. Close breach with final register update and PIR linkage within 20 working days.

9. Annual review of breach trends presented to Privacy Steering Forum.

10. Subprocessor breach assessed within 24 hours of vendor notice.

11. Article 34 decision documented with rationale when not notifying data subjects.

12. Forensic evidence retained per retention requirements.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Breach register

Complete entries with assessment and outcomes

ICO submissions

Acknowledgements and reference numbers

Customer notices

Timestamped notifications to controllers

Forensic logs

Preserved evidence for notifiable events

Tabletop

Annual breach drill report

Escalation

Ambiguous notifiability: DPO and Legal same-day decision; Executive if reputational impact high.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Late ICO notification requires Executive documented decision and regulator explanation prepared by Legal.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
