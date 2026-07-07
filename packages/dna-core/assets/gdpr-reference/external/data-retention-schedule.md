# Data Retention Schedule

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `External - Customer-Facing Documents/Data Retention Schedule.docx`

---

Data Retention Schedule

## Uk Gdpr

Purpose

Defines mandatory retention periods by data category for [Product Name] to implement storage limitation under UK GDPR Article 5(1)(e).

Aligns production deletion jobs, backup expiry, and legal holds with Retention & Deletion Policy.

### The objective of this document is to ensure that

Map every ROPA personal data category to a maximum retention period and deletion method.

Prevent backup and log retention from undermining erasure.

Publish customer-facing summary consistent with internal operational schedule.

### This document supports

Records of Processing Activities (ROPA)

Retention & Deletion Policy

Data Deletion Process

Logging & Monitoring Policy

Scope

This document governs Applies to all personal data categories processed in [Product Name] production UK South environments. for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Production customer personal data SHALL remain in Microsoft Azure UK South only; no multi-region tenancy or data residency selection is offered.

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Every personal data category in ROPA MUST appear in this schedule with maximum retention period.

Deletion jobs MUST run at least daily for expired categories with failure alerting.

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

Retention periods — [Product Name] production

Data category

Active tenant maximum

After termination

Backups

Notes, work items, attachments, teams

Subscription term

Delete within 90 days

35-day rolling

Search indexes

Aligned with workspace

Purge with workspace

35-day rolling

Voice recordings (Blob)

User/org controlled

Delete with content or termination

35-day rolling

Saved AI outputs

Until user deletes

Delete with workspace

35-day rolling

AI telemetry (no content)

13 months

13 months

Not in customer backup

Security audit logs

24 months

24 months

Included in ops backup

Support correspondence

3 years

3 years

N/A

Billing / tax

6 years post-transaction

6 years

Per finance policy

Legal hold governance

Legal holds MUST block deletion only with Legal owner, scope description, and review date every 90 days.

Legal hold register MUST be reconciled with deletion tickets monthly.

Permanent extension of retention requires DPO and Executive approval with risk register entry.

Backup and derivative alignment

Backup retention MUST NOT exceed 35 days rolling for production Customer data copies.

Search indexes and AI-derived stored outputs MUST be deleted concurrently with primary workspace objects.

Anonymised analytics MUST be excluded from schedule only if truly non-personal under UK GDPR.

Customer-facing publication

Customer-facing summary MUST be published alongside Privacy Policy and reference Data Deletion Process for termination.

Material schedule changes MUST trigger Privacy Policy review within 30 days.

Workspace and content retention

Mandatory controls

Every personal data category in ROPA MUST appear in this schedule with maximum retention period.

Workspace notes, boards, teams, and attachments MUST be deleted per Customer termination within 90 days unless longer contract.

Active subscription data MUST be retained only for subscription term plus contractual wind-down.

Voice/STT audio blobs MUST be deleted when user deletes parent note or per org policy, not exceeding workspace retention.

Search indexes MUST be deleted concurrently with primary workspace objects.

Saved AI outputs MUST be deleted when user deletes or with workspace termination.

Operational and statutory retention

Mandatory controls

AI telemetry (metadata only) MUST NOT exceed 13 months.

Security audit logs MUST be retained 24 months then deleted or archived per Logging & Monitoring Policy.

Support tickets involving personal data MUST be retained maximum 3 years.

Billing records MUST be retained 6 years for UK tax/legal obligation.

Marketing contacts MUST be retained until opt-out plus 2 years unless shorter consent withdrawal.

Implementation and review

Mandatory controls

Backup retention MUST NOT exceed 35 days rolling for production Customer data copies.

Schedule changes MUST have DPO and Engineering written approval before implementation.

Deletion jobs MUST run at least daily for expired categories with failure alerting.

Monthly metrics MUST report volumes deleted vs retained exceptions.

Post-termination export window MUST be documented before deletion begins.

Annual schedule review MUST coincide with ROPA annual review.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. DPO and Engineering extract current ROPA categories.

2. Map each category to retention period and deletion mechanism (SQL job, Blob lifecycle, index purge).

3. Operations confirms backup and log alignment.

4. Legal reviews statutory retention overrides.

5. Approve schedule version.

6. Implement or update automated jobs in production.

7. Run validation test on non-production tenant.

8. Publish customer-facing summary in Data Retention Schedule external page.

9. Monitor monthly deletion metrics.

10. Review legal holds quarterly.

11. Archive schedule version and approval.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Approved schedule

Version and sign-off

Deletion job logs

Daily success/failure

Monthly metrics

Deletion volumes and exceptions

ROPA mapping

Category parity check

Legal hold register

Active holds with review dates

Backup retention config

Azure policy screenshots

Escalation

Over-retention beyond schedule MUST escalate to DPO within 2 working days; Sev-2 if systemic.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Extended retention requires Legal hold record; permanent extension requires DPO and Executive approval.

Review and Maintenance

### This document SHALL be reviewed

at least annually with ROPA review,

after changes to backup architecture or deletion automation,

after legal hold policy changes,

after customer contract retention amendments.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
