# Healthcare Overview — Bangladesh — Architecture

## When to use
# Healthcare Technology — Bangladesh

APAC country pack. Pair with `healthcare/overview-apac` and `healthcare/overview-bd`.

## Regulation
- **Digital Security Act** / **Cyber Security Act** — data protection evolving
- **MOHFW** — Ministry of Health and Family Welfare
- **DGDA** — drug and device regulation

## Health system
- **DGHS** — Directorate General of Health Services
- **Community clinics + district hospitals** — public tier
- **Private** — Apollo, Square, United growing in Dhaka

## Standards
- **HL7 v2** common in hospitals
- **FHIR** — early adoption; follow MOHFW digital health roadmap
- **ICD-10**

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
