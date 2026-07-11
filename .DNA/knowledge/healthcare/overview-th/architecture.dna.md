# Healthcare Overview — Thailand — Architecture

## When to use
# Healthcare Technology — Thailand

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **PDPA** — Personal Data Protection Act (2022)
- **Medical Facility Act** — licensing
- **Thai FDA** — medical device regulation
- **NHSO** — National Health Security Office

## Health system
- **UC** — Universal Coverage scheme
- **NHSO** — single payer for UC
- **Ministry of Public Health** — hospital network
- **Private** — BDMS, Bangkok Hospital Group

## Standards & profiles
- **HL7 v2** in hospitals
- **FHIR** — emerging in HDC (Health Data Center) initiatives
- **ICD-10**; **TMT** drug codes

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
