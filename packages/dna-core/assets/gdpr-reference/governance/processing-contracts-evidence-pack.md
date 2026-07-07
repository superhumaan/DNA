# Processing Contracts Evidence Pack

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Processing Contracts Evidence Pack.docx`

---

Processing Contracts Evidence Pack

## Uk Gdpr

Purpose

Article 28 evidence

This pack evidences Article 28 UK GDPR compliant processing contracts for [Company Name] as processor (customer DPAs) and as controller (subprocessor/vendor DPAs).

Addresses WorkNest gap analysis non-compliance: data processing agreements not evidenced for Azure, GPT, and Whisper subprocessors.

Customer DPAs for trial partners require [Company Name] Azure subscriptions and executed agreements — see status below.

Part 1 — Subprocessor / vendor DPAs ([Company Name] as controller)

Executed vendor agreements

Vendor

Service

Agreement

Executed

Article 28 flow-down

Transfer ref

Evidence location

Microsoft Corporation

Azure (hosting, SQL, Blob, monitoring)

Microsoft Products and Services Data Protection Addendum (UK)

Yes — Jan 2026

Yes — processor terms in DPA

TR-003

contracts/vendors/microsoft-dpa-2026.pdf

Microsoft Corporation

Azure OpenAI (GPT, Whisper)

Microsoft DPA + Azure OpenAI terms (no training on customer data)

Yes — Mar 2026

Yes

TR-003

contracts/vendors/microsoft-openai-addendum-2026.pdf

Microsoft Corporation

Azure AD B2C

Microsoft Products and Services DPA

Yes — Jan 2026

Yes

TR-001

contracts/vendors/microsoft-dpa-2026.pdf

Microsoft Corporation

Microsoft 365 (business email)

Microsoft Products and Services DPA

Yes — Apr 2026

Yes

TR-002

contracts/vendors/microsoft-dpa-2026.pdf

Subscription prerequisite — [Company Name] Azure tenant

Microsoft DPAs are linked to the [Company Name] Limited Azure/M365 subscriptions (UK entity billing).

Action completed: UK entity subscriptions created under [Company Name] corporate email/domain.

DPA acceptance recorded in Microsoft Partner Center / Enterprise Agreement portal — screenshot archived in evidence/vendor-dpa-acceptance-jun2026.png.

Vendor due diligence cross-reference

Full assessments in Vendor Due Diligence File (GDPR/Documents/).

All production subprocessors on Subprocessor List have matching contract rows above.

No production subprocessor processes customer personal data without executed DPA.

Part 2 — Customer DPAs ([Company Name] as processor)

DPA template

Standard template: Data Processing Agreement (DPA) v2.2 — [Product Name] processor terms, Annex I processing description, Annex II TOMs, Annex III subprocessors.

Template meets Article 28 requirements per WorkNest WP13 review.

Template location: GDPR/External - Customer-Facing Documents/Data Processing Agreement (DPA).docx

Executed customer DPA register (trial phase)

Customer ID

Organisation

DPA version

Status

Effective

Notes

CUST-PILOT-001

[Trial Partner A — clinic/university]

v2.2

Pending subscription link

Execute on [Company Name] tenant onboarding

CUST-PILOT-002

[Trial Partner B]

v2.2

Pending subscription link

DPA sent — awaiting signature

CUST-PILOT-003

[Trial Partner C]

v2.2

Pending subscription link

Research agreement + DPA bundle

TEMPLATE

Future customers

v2.2

Ready

No production data until Executed = Yes

Implementation process

1. Create [Product Name] tenant under [Company Name] Azure subscription with customer admin on [Company Name]-managed identity.

2. Legal sends DPA v2.2 with Annex I pre-filled from ROPA processor entries (ROPA-P-001 through ROPA-P-014).

3. Customer signs; record in Executed DPA Register (GDPR/Documents/).

4. Engineering enables production data processing only after Legal confirms Executed = Yes.

5. Subprocessor List URL provided to customer per DPA Annex III.

Gap closure status

Subprocessor DPAs: COMPLETE — Microsoft agreements executed under UK entity subscriptions.

Customer DPAs: IN PROGRESS — template approved; execution blocked on trial partner onboarding with UK entity subscriptions.

Research/trial agreements: MUST include DPA or equivalent Article 28 terms before any personal data processing.

Part 3 — Audit evidence checklist

Documents to produce on request

Executed Microsoft DPA (redacted commercial terms permitted)

DPA acceptance portal screenshot ([Company Name] tenant)

Executed DPA Register export

Sample executed customer DPA (when available)

Subprocessor List matching Annex III

Vendor Due Diligence File

ROPA processor entries cross-referencing DPA Annex I

_Template — customize confidentiality and ownership statements for your organisation before distribution._
