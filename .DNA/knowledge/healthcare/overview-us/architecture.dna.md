# Healthcare Overview — United States — Architecture

## When to use
# Healthcare Technology — United States

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **HIPAA** — Privacy, Security, Breach Notification Rules; BAA with every vendor touching ePHI
- **HITECH** — breach notification, enforcement
- **42 CFR Part 2** — substance use disorder records (stricter consent)
- **FDA SaMD** — if software diagnoses, treats, or drives clinical decisions
- **ONC/CMS** — interoperability and information blocking (patient access API)

## Health system
- Mixed public/private: Medicare, Medicaid, commercial payers
- Dominant hospital EHRs: Epic, Cerner/Oracle Health, MEDITECH
- Ambulatory: athenahealth, eClinicalWorks, Veradigm
- Clearinghouses and payers for claims (X12 837/835)

## Standards & profiles
- **FHIR R4** with **US Core** Implementation Guide
- **SMART on FHIR** + **CDS Hooks** for EHR-embedded apps
- **Da Vinci IGs** for payer workflows (PDex, PAS, CDex)
- **HL7 v2** still dominant in hospitals (ADT, ORM, ORU)
- Terminology: SNOMED CT US Edition, LOINC, RxNorm, ICD-10-CM

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
