# International Transfer Assessment

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/International Transfer Assessment.docx`

---

International Transfer Assessment

## Uk Gdpr

Assessment summary

Outcome

Default position for [Company Name] [Product Name] production: personal data remains in Microsoft Azure UK South with no routine transfer outside the United Kingdom.

Permitted restricted transfers are limited to subprocessors where UK IDTA or UK Addendum applies, as recorded in the International Transfer Register.

[Product Name] is offered exclusively in the United Kingdom. Customer data is processed and stored in Microsoft Azure UK South. [Company Name] does not offer multi-region tenancy or services outside the UK.

Assessment date: June 2026 | Assessor: Data Protection Officer | Approved by: Executive Sponsor

Gap analysis remediation

This completed assessment addresses WorkNest gap analysis findings (Articles 45–46): adequacy decisions, third-country safeguards, and intra-group transfers.

Evidence is linked from ROPA transfer fields, Vendor Due Diligence File, and quarterly Azure UK South attestation.

Transfer register — production paths

Active transfer records

Transfer ID

Recipient

Data category

Destination

Mechanism

Supplementary measures

Status

TR-001

Microsoft Azure AD B2C

Identity attributes, session tokens

UK / EEA (Microsoft tenant configuration)

UK International Data Transfer Agreement (IDTA) + Microsoft Product Terms / DPA

Encryption in transit; MFA; minimal identity data; annual Microsoft attestation

Approved — active

TR-002

Microsoft 365 ([Company Name] business email/support)

Support correspondence if personal data in email

UK / EEA

UK IDTA + Microsoft DPA

Business use only; no bulk export of customer workspace content via email

Approved — active

TR-003

N/A — production workload

All customer workspace content

Azure UK South only

No transfer — domestic UK processing

Resource Graph policy audit quarterly; deny public endpoints; UK South resource tags

Approved — active

TR-004

[Company Name] (Thailand) parent entity

UK entity corporate data; emergency support metadata only — not customer workspace content

Thailand (remote access)

Intra-Group Transfer Agreement + UK IDTA where personal data accessed

VPN; time-bound access; no routine customer content access; access logged

Approved — active

Subprocessor transfer analysis

Microsoft Azure (hosting, SQL, Blob, monitoring)

Primary region: UK South. Failover: UK geo-redundant pairs only.

No production customer content stored outside UK.

Contract: Microsoft Products and Services DPA (UK) — Vendor Due Diligence File row 1.

Transfer mechanism: N/A for primary processing; TR-003 attestation.

Microsoft Azure OpenAI (GPT, Whisper)

Endpoint: UK South private endpoint via Managed Identity.

Processing: in-memory per request; [Company Name] does not persist prompts or completions.

Microsoft contractual terms: no training on customer data; no retention by [Company Name].

Transfer mechanism: N/A — UK South inference only.

Azure AD B2C

Identity processing may occur in UK/EEA Microsoft data centre per tenant configuration.

Transfer mechanism: TR-001 — UK IDTA.

Annual review: Microsoft subprocessor attestation and B2C geo configuration check.

Technical evidence — environment safeguards

UK-only production controls

Azure Policy: production subscriptions tagged region=uksouth; deny creation of resources outside UK pairs

Azure OpenAI: private endpoint UK South only; public network access disabled

Network: TLS 1.2+; no customer data sent to non-Microsoft third parties in production

Quarterly attestation: Resource Graph export comparing live inventory to UK South standard (evidence/azure-uk-south/)

Engineering release gate: privacy gate blocks deployment without ROPA ID and transfer field validation

Transfer Risk Assessment (TRA) — TR-001 B2C

Factor

Assessment

Nature of data

Low sensitivity identity attributes — not workspace content

Destination law

UK/EEA — adequacy or IDTA-covered Microsoft processing

Onward transfer risk

Mitigated by Microsoft DPA and subprocessor restrictions

Supplementary measures

Encryption, access control, data minimisation

Conclusion

Transfer permitted with UK IDTA — residual risk Low

Transfer Risk Assessment (TRA) — TR-004 intra-group

Factor

Assessment

Nature of data

Corporate/administrative data only; customer workspace content excluded by default

Purpose

Group support, governance, engineering coordination — not data processing for Thai entity commercial purposes

Access model

Named individuals; VPN; time-bound; logged; DPO notification for any content access

Mechanism

Intra-Group Transfer Agreement; UK IDTA if personal data transferred

Conclusion

Permitted with agreement and controls — residual risk Low-Medium; reviewed annually

Prohibited transfers

Default prohibitions

Production customer workspace content MUST NOT be transferred to Thailand, US, or other non-UK jurisdictions without Executive and DPO approval and customer notice where required

Telemetry or logs to non-UK SIEM prohibited without completed transfer assessment

Emergency vendor support outside UK MUST be logged and assessed within 5 working days

Remote support from Thailand MUST NOT access customer note content without break-glass approval and Intra-Group Agreement compliance

Maintenance and reconciliation

Review cycle

This record is reconciled quarterly by the DPO with Product and Engineering against architecture diagrams, the Subprocessor List, and live Azure inventory.

Material changes (new AI feature, subprocessor, data category, or transfer path) MUST update this record within five working days of approval.

Version history is retained for six years. Prior versions remain readable for audit.

Evidence cross-references

International Transfer Register (GDPR/Documents/)

Vendor Due Diligence File (GDPR/Documents/)

Executed DPA Register (GDPR/Documents/)

DPIA Register — DPIA-0001 [Product Name] Platform (GDPR/Documents/)

Data Storage Matrix and Data Flow Diagrams (Technical evidence pack)

Quarterly Azure UK South Resource Graph attestation (evidence/azure-uk-south/)

_Template — customize confidentiality and ownership statements for your organisation before distribution._
