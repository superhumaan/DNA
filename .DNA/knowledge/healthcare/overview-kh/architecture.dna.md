# Healthcare Overview — Cambodia — Architecture

## When to use
# Healthcare Technology — Cambodia

APAC country pack. Pair with `healthcare/overview-apac` and `healthcare/overview-kh`.

## Regulation
- **Cambodia Data Protection Law** (2023)
- **MOH** — Ministry of Health
- **DAU** — Department of Drugs and Food

## Health system
- **Public health centres** — MOH network
- **Private** — Royal Phnom Penh, Raffles growing
- **HMIS** — health management information system

## Standards
- **DHIS2** for public reporting
- **HL7 v2** limited to major hospitals
- **ICD-10**

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
