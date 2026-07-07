# Access Control Policy

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Access Control Policy.docx`

---

Access Control Policy

## Uk Gdpr

Purpose

Defines logical access control requirements for [Product Name] systems, Azure resources, and customer tenants.

Enforces least privilege, tenant isolation, and prohibition of routine human access to customer workspace content.

### The objective of this document is to ensure that

prevent unauthorised access to personal data and tenant content,

ensure access is provisioned, reviewed, and revoked on defined timelines,

support forensic accountability through immutable access logs.

### This document establishes

RBAC matrix and break-glass rules

quarterly access review programme

### This document supports

Joiner-Mover-Leaver Procedure

Access Review Records

Logging & Monitoring Policy

Scope

This document governs access to production and staging Azure, [Product Name] APIs, databases, Blob containers, Key Vault, and administrative tooling for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Includes customer access via Azure AD B2C and [Company Name] personnel access

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Prevent unauthorised access to personal data and tenant content.

Ensure access is provisioned, reviewed, and revoked on defined timelines.

Support forensic accountability through immutable access logs.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

Security Lead

Access policy owner, break-glass approvals, quarterly review sign-off

Security Operations

Provisioning, RBAC maintenance, access review execution

Engineering Lead

Application RBAC implementation and service identity governance

IT / Identity Admin

Azure AD B2C and corporate Entra ID group management

HR

Timely joiner/mover/leaver notifications to trigger access changes

Tenant and Application Access

Mandatory controls

All [Product Name] API access MUST enforce tenant-scoped RBAC; cross-tenant access at API layer is prohibited.

Customer administrators MUST manage their users via Azure AD B2C; default roles MUST follow least privilege templates.

Service Bus, SQL, and Blob access for applications MUST use Managed Identity with least privilege; keys rotated on compromise.

Failed access attempts MUST be rate-limited and monitored with alerts on privilege escalation patterns.

Session management MUST invalidate tokens on logout and password reset per Authentication Architecture.

Privileged and Human Access

Mandatory controls

Azure resource access MUST use role assignments mapped to job function with no standing Owner for routine engineers.

Privileged access MUST use individual named accounts with MFA enforced; shared credentials are prohibited except vaulted break-glass with dual control and automatic expiry.

Administrative access to production Azure and operator tooling MUST require documented ticket approval, quarterly access review, and revocation within 24 hours of role termination or loss of business need.

[Company Name] personnel MUST NOT have routine read access to customer workspace content in SQL or Blob; automated service identities only.

Break-glass access to tenant content MUST require ticket, Security and DPO approval, time limit, and immutable audit log entry before access.

Separation of duties: personnel who approve access MUST NOT provision their own production privileges.

Lifecycle and Reviews

Mandatory controls

Access provisioning and revocation MUST follow Joiner/Mover/Leaver Procedure with leaver revocation within 24 hours.

Quarterly access reviews MUST compare active accounts to HR roster and RBAC matrix per Access Review Records.

Emergency support access MUST not export bulk customer content; read-only diagnostic metadata only unless break-glass approved.

Third-party vendor access MUST be time-bound, monitored, and prohibited from production tenant content.

Access logs MUST be retained per Logging & Monitoring Policy and protected from tampering.

Annual Assurance

Mandatory controls

Annual RBAC matrix review with Engineering updates role definitions and removes obsolete permissions.

Orphan accounts identified in quarterly review MUST be disabled within 10 working days.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Manager submits access request ticket with role, justification, and duration.

2. Security Operations validates role against RBAC matrix and approves or rejects within two working days.

3. Identity admin assigns Azure and application roles; confirmation posted to ticket.

4. Engineering verifies application permissions for new service identities in staging before production.

5. Quarterly: Security Operations exports access lists, managers attest, excess rights removed within 10 working days.

6. Leaver: HR notification triggers same-day disable of all accounts and token revocation.

7. Break-glass: Legal/DPO approval recorded; access expires automatically at ticket end time; post-use review within 48 hours.

8. Annual RBAC matrix review with Engineering updates role definitions and removes obsolete permissions.

9. Vendor access provisioned with hard expiry and sponsor attestation.

10. Failed access pattern alerts triaged daily by Security Operations.

11. Access review remediation tracked to closure before quarterly sign-off.

12. Break-glass usage reported to DPO within 24 hours of each event.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

RBAC matrix

Version-controlled role-to-permission mapping

Access review

Quarterly attestation with remediation tickets

Provisioning tickets

Approved requests with timestamps

Break-glass log

Immutable records of content access events

Leaver revocations

HR-triggered tickets closed within 24 hours

Escalation

Suspected unauthorised access: Sev-1 incident within 30 minutes; preserve logs before remediation.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Emergency support content access requires Security, DPO, and customer notification where contractually required.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
