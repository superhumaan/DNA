# Joiner-Mover-Leaver Procedure

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Joiner-Mover-Leaver Procedure.docx`

---

Joiner/Mover/Leaver Procedure

## Uk Gdpr

Purpose

Controls provisioning, modification, and deprovisioning of access to [Product Name] systems and Azure resources.

Ensures timely revocation when personnel change roles or leave.

### The objective of this document is to ensure that

grant least privilege access aligned to role,

revoke access within 24 hours of termination,

maintain auditable provisioning trail.

### This document establishes

JML ticketing and HR integration

privileged access approval

### This document supports

Access Control Policy

Access Review Records

Scope

This document governs joiner, mover, and leaver events for employees and contractors with any [Product Name] or production Azure access for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Includes corporate identity, application admin, database roles, and break-glass eligibility

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Grant least privilege access aligned to role.

Revoke access within 24 hours of termination.

Maintain auditable provisioning trail.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

HR Director

Timely notifications of joiners, movers, leavers with effective dates

Line Managers

Access requests, role justification, and mover approvals

Security Operations

Provisioning, deprovisioning, quarterly attestation

IT Manager

Corporate identity and MFA lifecycle

Engineering Lead

Application-specific role assignments in [Product Name] admin tools

Joiners

Mandatory controls

All access MUST be requested via ticketing with manager approval before activation.

Joiners MUST complete security and privacy training before production access is enabled.

Access provisioning MUST map to RBAC matrix roles, not ad-hoc permissions.

HR system integration MUST deliver joiner/leaver events to IT ticketing within 4 hours of HR record change; missing feed triggers weekly Compliance exception report.

Rehire MUST be treated as new joiner with fresh assessments if gap >90 days.

Movers

Mandatory controls

Mover role changes MUST trigger access review and rights adjustment within 5 working days.

Privileged roles (production admin, Key Vault, break-glass) MUST require Security approval in addition to manager.

Contractors MUST have expiry dates on access with automatic disable on end date.

Emergency access for leaver knowledge transfer MUST be time-limited to 48 hours with Security approval.

Leavers

Mandatory controls

Leaver access MUST be revoked within 24 hours of termination effective time across all systems.

Same-day leavers MUST have access disabled before exit interview where possible.

Shared accounts are prohibited; individual accountability required.

JML failures (delayed revocation) MUST be reported as Sev-2 security incidents.

Attestation

Mandatory controls

Quarterly attestation MUST reconcile active accounts to HR roster; orphan accounts disabled within 10 working days.

Vendor contractors MUST follow same JML with Vendor Manager as sponsor.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. HR creates joiner record and notifies IT and manager.

2. Manager submits access request with role template; Security approves privileged items.

3. IT creates corporate identity with MFA; Security Operations assigns Azure and app roles after training.

4. Mover: manager submits change ticket; excess rights removed before new rights added.

5. Leaver: HR notifies IT and Security with termination time; all access disabled within 24 hours.

6. Security Operations confirms revocation across Azure, Git, [Product Name] admin, and support tools.

7. Quarterly: export accounts, managers attest, orphans remediated.

8. Document completion in JML log linked to HR record.

9. 48-hour knowledge transfer access documented with Security approval.

10. Contractor expiry monitored weekly for upcoming end dates.

11. Privileged role approvals filed with Security sign-off.

12. Sev-2 incident opened if leaver access remains after 24 hours.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

JML tickets

Joiner/mover/leaver with timestamps

Revocation proof

Leaver tickets closed within 24h

Quarterly attestation

Manager sign-offs and orphan remediation

Training gates

Access blocked until training complete

Privileged approvals

Security sign-off on elevated roles

Escalation

Leaver still active after 24h: Security Lead Sev-2 incident immediately.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

48-hour knowledge transfer access requires manager and Security written approval.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
