# Healthcare Overview — United Kingdom — Architecture

## When to use
# Healthcare Technology — United Kingdom

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **UK GDPR** + **Data Protection Act 2018** — special category health data
- **NHS DSPT** (Data Security and Protection Toolkit) — annual assurance for NHS-facing suppliers
- **DTAC** / **CQC** — digital health assessments for NHS procurement
- **Common Law Duty of Confidentiality** — additional to GDPR
- **UKCA / MHRA** — medical device regulation post-Brexit (EU MDR alignment)

## Health system
- **NHS** — publicly funded; integrated care systems (ICS)
- **GP Connect** — primary care record access
- **NHS Spine** — national services (PDS, SDS, GP2GP)
- **NHS Login** — citizen identity for patient-facing apps
- Private providers (Bupa, Nuffield) alongside NHS

## Standards & profiles
- **UK Core FHIR** profiles mandatory for NHS-facing APIs
- **CIS2** authentication for clinician access
- **SNOMED CT UK Edition** — problems and procedures
- **dm+d** — medications; **LOINC** for labs

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
