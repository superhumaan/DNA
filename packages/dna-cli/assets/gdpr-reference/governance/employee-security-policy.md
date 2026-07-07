# Employee Security Policy

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Employee Security Policy.docx`

---

Employee Security Policy

## Uk Gdpr

Purpose

Defines security obligations for [Company Name] personnel and contractors accessing [Product Name] systems or confidential information.

Complements technical controls with personnel accountability.

### The objective of this document is to ensure that

protect credentials, devices, and confidential information,

reduce insider risk to tenant data,

ensure timely reporting of security concerns.

### This document establishes

device and MFA requirements

prohibition on routine tenant content access

### This document supports

Joiner-Mover-Leaver Procedure

Training & Awareness Policy

Scope

This document governs employees, contractors, and temporary staff with access to corporate systems, Azure production, or customer metadata for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Excludes customers and end users covered by Terms of Service

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Protect credentials, devices, and confidential information.

Reduce insider risk to tenant data.

Ensure timely reporting of security concerns.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

HR Director

Background checks, policy acknowledgement, disciplinary process

Security Lead

Policy enforcement, MDM standards, incident coordination

IT Manager

Device provisioning, MFA, corporate identity

Line Managers

Ensure team compliance and timely JML notifications

Data Protection Officer

Privacy training content and breach reporting liaison

Devices and Access

Mandatory controls

Personnel MUST use company-managed or approved devices with disk encryption and screen lock ≤5 minutes.

MFA MUST be enabled on corporate Entra ID and all production Azure access.

Production access MUST be prohibited on unmanaged BYOD devices.

Credentials MUST NOT be shared; password managers required for authorised secrets.

Personnel MUST NOT attempt to access customer workspace content outside break-glass procedure.

Data Handling

Mandatory controls

Confidential [Product Name] information MUST NOT be stored on personal cloud, USB, or unapproved devices.

Removable media use MUST be prohibited unless Security-approved encrypted devices.

Physical documents with personal data MUST be shredded using cross-cut shredders.

Clear desk and clear screen MUST be followed in co-working and office environments.

Onboarding and Offboarding

Mandatory controls

Background checks MUST be completed before granting production access for roles with customer metadata access.

Personnel MUST complete onboarding security and privacy training before production access.

Offboarding MUST trigger JML leaver process same day with HR notification.

Security incidents involving personnel MUST be reported to Security within one hour.

Conduct

Mandatory controls

Conflicts of interest in vendor selection MUST be declared to HR and Compliance.

Disciplinary sanctions apply for deliberate policy violations up to termination and law enforcement referral.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. HR completes pre-employment checks per role risk tier.

2. IT issues managed device and corporate identity with MFA.

3. Security assigns training modules; access blocked until completion.

4. Manager requests production access via JML after training proof.

5. Annual refresher training and phishing simulations per Training & Awareness Policy.

6. HR notifies IT and Security on leaver same day; access revoked within 24 hours.

7. Security investigates personnel-related incidents with HR present.

8. Annual policy acknowledgement collected electronically.

9. MDM compliance reviewed quarterly.

10. BYOD requests rejected unless exceptional Security approval (production prohibited).

11. Insider threat indicators escalated to Security and HR within 2 hours.

12. Disciplinary outcomes documented in HR file with Security correlation.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Background checks

Completion records per role tier

MDM compliance

Encryption and screen lock reports

Training completion

Onboarding and annual refresher

Policy acknowledgements

Signed annual attestations

JML tickets

Leaver revocations within SLA

Escalation

Insider threat indicators: Security and HR within 2 hours; preserve logs before confrontation.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

BYOD for production access prohibited without exception.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
