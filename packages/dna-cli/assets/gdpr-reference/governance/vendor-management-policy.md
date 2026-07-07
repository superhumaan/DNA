# Vendor Management Policy

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Vendor Management Policy.docx`

---

Vendor Management Policy

## Uk Gdpr

Purpose

Governs selection, contracting, monitoring, and termination of vendors supporting [Product Name] processing of personal data or critical services.

Ensures Article 28 processor requirements and security due diligence are met before data sharing.

### The objective of this document is to ensure that

assess and mitigate supplier risk proportionate to data access,

maintain enforceable contractual protections,

prevent unapproved processing locations or purposes.

### This document establishes

vendor tiering and assessment

termination and deletion requirements

### This document supports

Subprocessor Management Procedure

International Transfer Assessment

Scope

This document governs third-party vendors and subprocessors including Microsoft Azure, identity, communications, and tooling with access to personal data for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Excludes pure non-data suppliers with no personal data access

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Assess and mitigate supplier risk proportionate to data access.

Maintain enforceable contractual protections.

Prevent unapproved processing locations or purposes.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

Vendor Manager

Vendor register, assessments, renewal tracking

Security Lead

Security questionnaire review and tiering

Data Protection Officer

DPA clauses, transfer mechanisms, subprocessor approval

Legal Counsel

Contract negotiation and termination provisions

Procurement

Commercial terms and purchase controls

Onboarding and Contracts

Mandatory controls

New vendors processing personal data MUST complete risk assessment before contract signature.

Contracts MUST include Article 28 processor terms, breach notification, audit rights, and deletion on termination where applicable.

Vendor risk tier MUST drive control depth: critical, important, standard.

Microsoft Azure DPA and product terms MUST be maintained for UK South workloads.

Unapproved vendors processing customer data MUST trigger immediate cessation and Executive notification.

Access and Processing Location

Mandatory controls

Vendor access to [Product Name] production MUST be least-privilege, time-bound, and logged.

Non-UK processing by vendors MUST be assessed per International Transfer Assessment before approval.

Vendor personnel MUST NOT access customer workspace content except under written subprocessor need and contract.

Fourth-party subprocessors MUST be disclosed and approved per Subprocessor Management Procedure.

Software supply chain vendors for production builds MUST meet Secure SDLC requirements.

Monitoring and Incidents

Mandatory controls

Critical vendors MUST be reviewed at least annually with updated assessment on file.

Vendor security incidents MUST be reported to Vendor Manager within contract timelines; [Product Name] impact assessed within 24 hours.

Vendor performance and SLA breaches MUST be tracked with remediation or exit plans.

Single-source critical vendors MUST have continuity mitigations documented in BCP.

Termination

Mandatory controls

Termination MUST include data return or deletion certification within 30 days.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Business owner submits vendor request with data categories and access scope.

2. Security sends questionnaire; Vendor Manager scores risk tier.

3. DPO reviews privacy and subprocessors; Legal drafts or reviews contract.

4. Executive or delegated authority approves critical tier vendors.

5. Vendor onboarded with access provisioned via ticket; monitoring calendar set.

6. Annual review: refresh assessment, certificates (SOC/ISO), and DPA alignment.

7. Termination: revoke access, obtain deletion certificate, update subprocessor list.

8. Quarterly vendor committee reviews open incidents and concentration risk.

9. Fourth-party disclosure verified in assessment.

10. Pilot vendors time-bound with no production customer data without full contract.

11. Vendor access reviewed quarterly for expiry compliance.

12. Concentration risk report to Executive annually.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Vendor register

Tier, review dates, and owners

Assessments

Completed security/privacy questionnaires

Contracts

Executed DPAs and SLAs

Deletion certificates

Termination records

Annual reviews

Signed review summaries

Escalation

Critical vendor failure: Vendor Manager escalates to Executive and activates BCP within 4 hours.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Pilot vendors require time-bound assessment, DPO approval, and no production customer data without full contract.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
