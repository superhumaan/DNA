# Healthcare Overview — Sri Lanka — Architecture

## When to use
# Healthcare Technology — Sri Lanka

APAC country pack. Pair with `healthcare/overview-apac` and `healthcare/overview-lk`.

## Regulation
- **PDPA Sri Lanka** (2022)
- **NMRA** — National Medicines Regulatory Authority
- **Ministry of Health** — national policy

## Health system
- **Free public healthcare** — MOH hospitals nationwide
- **Private** — Asiri, Nawaloka, Durdans
- **IMIS** — health management information system push

## Standards
- **HL7 v2** in hospitals
- **FHIR** — pilot stages in digital health strategy
- **ICD-10**

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
