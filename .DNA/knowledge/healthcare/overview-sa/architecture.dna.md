# Healthcare Overview — Saudi Arabia — Architecture

## When to use
# Healthcare Technology — Saudi Arabia

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **PDPL** — Personal Data Protection Law (2023)
- **NCA** — cybersecurity controls for critical sectors
- **SFDA** — medical device regulation
- **MOH** — Ministry of Health licensing

## Health system
- **MOH** — public healthcare delivery
- **Seha Virtual Hospital** — national telehealth
- **NPHIES** — National Platform for Health Insurance Exchange Services
- **Private sector** — growing (Saudi German, Dr. Sulaiman Al Habib)

## Standards & profiles
- **FHIR R4** — NPHIES mandated for insurance
- **HL7 v2** in hospitals
- **ICD-10-AM**; **SNOMED CT**

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
