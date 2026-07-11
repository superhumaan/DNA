# Healthcare Overview — Malaysia — Architecture

## When to use
# Healthcare Technology — Malaysia

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **PDPA 2010** — Personal Data Protection Act
- **Private Healthcare Facilities Act** — licensing
- **MDA** — Medical Device Authority
- **MOH** — Ministry of Health

## Health system
- **MOH** — public hospitals and clinics
- **MyHDW** — Malaysian Health Data Warehouse (emerging)
- **Private** — IHH (Pantai), KPJ Healthcare
- **1Care** — primary care reform (historical)

## Standards & profiles
- **HL7 v2** common
- **FHIR R4** — MOH digital health roadmap
- **ICD-10**; **Malaysian drug codes**

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
