# AI Acceptable Use Policy

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/AI Acceptable Use Policy.docx`

---

AI Acceptable Use Policy

## Uk Gdpr

Purpose

Defines permitted and prohibited uses of [Product Name] AI features by customers and [Company Name] personnel.

Clarifies human responsibility for AI outputs and restrictions on clinical and unlawful use.

### The objective of this document is to ensure that

prevent misuse for clinical decision-making, unlawful content, and security attacks,

align customer obligations with Terms of Service and AI Transparency Notice,

support enforcement through technical abuse controls.

### This document establishes

prohibited use categories

enforcement and progressive sanctions

### This document supports

Terms of Service

AI Transparency Notice

AI Abuse Prevention Controls

Scope

This document governs customer and personnel use of AI-assisted features within [Product Name] tenants for [Company Name] in relation to the [Product Name] platform.

Territorial scope: United Kingdom (England, Wales, Scotland, and Northern Ireland) only.

Platform scope: multi-tenant SaaS hosted in Microsoft Azure UK South; excludes non-production sandboxes unless explicitly stated.

Includes speech-to-text, summarisation, commands, and search augmentation

Regulatory Alignment

This document implements [Company Name] accountability under UK GDPR and the Data Protection Act 2018.

Compliance MUST be demonstrated with operational records assignable to named owners — not policy text alone.

Accountability under Article 5(2) and Article 24 UK GDPR.

Control Objectives

Prevent misuse for clinical decision-making, unlawful content, and security attacks.

Align customer obligations with Terms of Service and AI Transparency Notice.

Support enforcement through technical abuse controls.

Governance Structure

Governance Authority

Governance authority resides with [Company Name] Executive leadership, the Data Protection Officer, Information Security, and Engineering.

Material exceptions and residual risks require Executive or DPO approval as specified in this document.

Roles and Responsibilities

Function

Responsibility

AI Governance Lead

Policy interpretation, enforcement standards, and customer communication

Security Lead

Abuse detection, investigation, and account suspension recommendation

Legal Counsel

Contract enforcement and law enforcement referrals

Customer Success

Customer education and acceptable use reminders

Support Lead

Escalates suspected violations without accessing customer AI content routinely

Prohibited Customer Uses

Mandatory controls

Users MUST NOT submit special category health data for clinical decision-making or diagnosis through [Product Name] AI.

Users MUST NOT use AI to generate unlawful, harassing, discriminatory, or malware-enabling content.

Users MUST verify AI-generated content before operational, financial, or compliance reliance.

Use of AI to process third-party personal data without authority is prohibited.

AI outputs MUST NOT be represented as human-authored official records without disclosure.

Technical Abuse Prevention

Mandatory controls

Automated scraping of AI endpoints or circumvention of rate limits is prohibited.

Prompt injection and jailbreak attempts MUST be blocked where technically feasible and logged for investigation.

Uploaded audio for transcription MUST belong to the user or their organisation with lawful basis to process.

Security research on production AI MUST follow coordinated disclosure programme rules.

Personnel and Tenant Enforcement

Mandatory controls

Personnel MUST NOT disable abuse filters or access customer AI content except under Law Enforcement Request Policy.

Tenant administrators MUST enforce acceptable use within their organisation; [Company Name] may suspend tenants for serious violations.

Repeated violations MUST trigger progressive enforcement: warning, throttle, suspension per contract.

Personnel violations MUST result in HR disciplinary process and access revocation within 24 hours.

Customer notification of enforcement action MUST occur except where law enforcement investigation requires delay.

Vulnerable Users and Governance

Mandatory controls

Children's vulnerable use cases require customer governance; [Product Name] does not provide clinical safeguards.

Quarterly review of abuse trends presented to AI governance forum.

Prohibited use list updated when new attack patterns identified.

Operational Procedure

The following procedure SHALL be executed for every in-scope event. Deviations require DPO approval.

1. Publish acceptable use requirements in Terms of Service and AI Transparency Notice at onboarding.

2. Configure rate limits, content filters, and input/output screening in production pipeline.

3. Security monitors abuse signals daily from metadata logs without reading workspace content.

4. Investigate alerts with ticket, classification, and evidence hashes; escalate severe cases to Legal.

5. Apply contractual remedies: throttle, feature disable, or tenant suspension with Customer Success notice.

6. Document closure and retain records for three years.

7. Quarterly review of abuse trends presented to AI governance forum.

8. Update prohibited use list when new attack patterns identified.

9. Coordinated disclosure researchers onboarded with written scope before testing.

10. Criminal content or imminent harm escalated to Legal same day.

11. Personnel violations referred to HR with access revocation within 24 hours.

12. Enforcement log reviewed annually for consistency and fairness.

Monitoring and Assurance

Monitoring demonstrates continuous operation of controls.

Control area

Expected evidence

Terms incorporation

Version showing AI acceptable use clauses

Abuse alerts

Investigation tickets with timestamps

Enforcement log

Suspensions and throttles with customer notices

Filter configuration

Export of active screening rules

Quarterly trend report

AI governance presentation slides

Escalation

Criminal content or imminent harm: Security → Legal → law enforcement referral same day.

Exceptions and Deviations

### Exceptions MUST

be documented with business justification,

include compensating controls and risk assessment,

name an approval authority (DPO or Executive),

include an expiry date not exceeding 90 days unless renewed.

Expired exceptions SHALL be remediated, renewed, or formally closed within five working days of expiry.

No exceptions for prohibited categories; research exemptions require Security written approval.

Review and Maintenance

### This document SHALL be reviewed

at least annually,

after material changes to [Product Name] processing or architecture,

after personal data breaches or regulatory contact,

after significant subprocessors or transfer mechanism changes.

_Template — customize confidentiality and ownership statements for your organisation before distribution._
