# Healthcare Overview — Pakistan — Architecture

## When to use
# Healthcare Technology — Pakistan

APAC country pack. Pair with `healthcare/overview-apac` and `healthcare/overview-pk`.

## Regulation
- **PEMRA / MOH** oversight
- **Personal Data Protection Bill** — monitor enactment status
- **DRAP** — drug regulatory authority

## Health system
- **Federal + provincial** health delivery (Punjab, Sindh, KP, Balochistan)
- **Sehat Sahulat** — public health insurance programme
- **Private** — Shaukat Khanum, Aga Khan network

## Standards
- **HL7 v2** dominant
- **FHIR** — emerging in tertiary hospitals
- **ICD-10**

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
