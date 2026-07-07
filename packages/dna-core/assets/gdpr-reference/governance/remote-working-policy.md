# Remote Working Policy

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Remote Working Policy.docx`

---

Remote Working Policy

## Uk Gdpr

Purpose

Secures remote access to [Product Name] development and operations when personnel work outside [Company Name] offices.

Defines physical and technical safeguards for home and mobile working.

### The objective of this document is to ensure that

maintain security equivalent to office controls where practicable,

prevent data exposure in public spaces and personal networks,

enable rapid response to lost devices.

### This document establishes

VPN and MDM requirements

restrictions on production access from abroad

### This document supports

Incident Response Plan

Employee Security Policy

Scope

This document governs remote work accessing corporate systems, source code, Azure production, or customer metadata for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Applies UK-wide for personnel locations

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Maintain security equivalent to office controls where practicable.

Prevent data exposure in public spaces and personal networks.

Enable rapid response to lost devices.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

Security Lead

VPN, MDM standards, and remote access approvals

IT Manager

Device provisioning and remote wipe capability

Line Managers

Approve remote work arrangements and verify compliance

HR Director

Remote work agreements and health/safety coordination

Data Protection Officer

Privacy guidance for home processing environments

Technical Controls

Mandatory controls

Remote access to production Azure MUST use corporate VPN and MFA on managed devices.

Customer workspace content MUST NOT be accessed from remote sessions except break-glass with approvals.

Home Wi-Fi MUST use WPA2 or WPA3; guest networks MUST NOT be used for corporate access.

Personnel MUST use corporate password manager; no credentials in browser personal profiles for work.

USB devices MUST be encrypted if used; default prohibition on copying customer data.

Physical and Environmental

Mandatory controls

Screens MUST be positioned to prevent shoulder surfing; privacy filters encouraged for travel.

Devices MUST be locked when unattended; full disk encryption required.

Printing Confidential data at home is prohibited unless Security-approved secure disposal available.

Personal assistants and smart speakers MUST NOT be active during confidential calls in home offices.

Co-working spaces require additional screen privacy and no unattended devices.

Travel and Location

Mandatory controls

Remote work abroad for production access is prohibited without DPO transfer assessment and Security approval.

Lost or stolen devices MUST be reported within one hour for remote wipe.

Incident during remote work follows Incident Response Plan with device isolation steps.

Security reviews remote access quarterly including VPN logs sampling.

Communications

Mandatory controls

Video meetings discussing customer data MUST use corporate approved tools with access controls.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Manager approves remote work arrangement documented in HR system.

2. IT verifies managed device compliance before enabling VPN production access.

3. Security briefs personnel on home setup checklist annually.

4. Personnel report device loss immediately to IT hotline; wipe initiated.

5. Quarterly VPN and MDM compliance report reviewed by Security.

6. Non-compliant devices blocked from production until remediated.

7. DPO consulted when remote work involves new international location.

8. Annual policy acknowledgement with remote-specific reminders.

9. Abroad production access request assessed via International Transfer Assessment.

10. VPN anomaly alerts triaged weekly.

11. Co-working guidance issued annually.

12. Lost device incidents linked to Incident Response if metadata access possible.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

VPN logs

Access records for production roles

MDM compliance

Encryption and patch status

HR remote agreements

Approved arrangements list

Device wipe

Lost device incident tickets

Quarterly review

Security sign-off memo

Escalation

Lost device with customer metadata access potential: Incident Response within 1 hour.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

Non-VPN production access prohibited.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
