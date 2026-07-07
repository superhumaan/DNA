# Asset Management Policy

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Asset Management Policy.docx`

---

Asset Management Policy

## Uk Gdpr

Purpose

Inventories and governs hardware, software, and cloud assets supporting [Product Name].

Ensures accountability, lifecycle management, and alignment with data classification.

### The objective of this document is to ensure that

maintain accurate asset inventory with owners,

support vulnerability management and cost control,

detect shadow IT affecting personal data.

### This document establishes

Azure tagging and asset register

EOL remediation

### This document supports

Vendor Management Policy

Data Classification Standard

Scope

This document governs Azure subscriptions, production resources, corporate devices, software licences, and third-party SaaS used for [Product Name] operations for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Excludes customer-owned devices

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Maintain accurate asset inventory with owners.

Support vulnerability management and cost control.

Detect shadow IT affecting personal data.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

IT Manager

Corporate hardware and SaaS inventory

DevOps Lead

Cloud asset tagging and lifecycle in Azure

Security Lead

Shadow IT response and asset risk tiering

Finance

Licence compliance and renewal alerts

Engineering Lead

Application components and dependency inventory

Inventory and Tagging

Mandatory controls

All production Azure resources MUST be tagged with owner, environment, classification, and cost centre.

Asset register MUST list cloud resources, corporate devices, and critical SaaS with owner and review date.

Software licences MUST be tracked with renewal alerts 30 days before expiry.

Asset register MUST be reconciled quarterly against Azure Resource Graph and IT inventory.

Asset owners MUST attest accuracy quarterly.

Lifecycle and EOL

Mandatory controls

End-of-life software and runtime versions MUST have remediation plans within 90 days of EOL announcement.

Decommissioning MUST follow change ticket with data wipe or destruction certificate.

Non-production resources MUST auto-expire if tagged temporary >30 days.

Asset disposal MUST use certified destruction for hardware storing Restricted data.

Dependency bill of materials MUST be updated quarterly for [Product Name] application components.

Shadow IT and Risk

Mandatory controls

Unauthorised cloud resources processing personal data MUST be quarantined on discovery within 24 hours.

Third-party SaaS MUST be onboarded via Vendor Management Policy before connecting to production data.

Personal data on assets MUST match classification handling requirements.

Lost assets MUST be reported within one hour with incident if data present.

Corporate Devices

Mandatory controls

Corporate devices MUST be enrolled in MDM before accessing customer metadata.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. DevOps applies mandatory tags via Azure Policy on provisioning.

2. IT registers corporate devices and SaaS in asset tool at onboarding.

3. Quarterly reconciliation workshop compares registers to live inventory.

4. Shadow IT tickets assign owner to justify or decommission within 10 working days.

5. EOL remediation planned in engineering backlog with Security priority.

6. Decommission: backup verification, data wipe, remove from register, cancel licences.

7. Finance reviews licence utilisation annually.

8. Report asset metrics to Security committee monthly.

9. Temporary lab resources require auto-expiry tag and no production data.

10. Hardware disposal certificates filed within 5 working days.

11. SBOM updated quarterly with Engineering sign-off.

12. Owner attestation completed before quarterly reconciliation sign-off.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Asset register

Quarterly reconciled export

Azure Policy compliance

Tagging compliance report

Shadow IT tickets

Closure within SLA

Disposal certificates

Hardware destruction records

SBOM

Quarterly dependency inventory

Escalation

Shadow IT with customer data: Security incident within 24 hours.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Temporary lab resources require auto-expiry tag and no production data.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
