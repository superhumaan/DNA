# Healthcare Overview — Myanmar — Architecture

## When to use
# Healthcare Technology — Myanmar

APAC country pack. Pair with `healthcare/overview-apac` and `healthcare/overview-mm`.

## Regulation
- **Electronic Transactions Law** — privacy provisions evolving
- **MOH** — Ministry of Health
- **FDA Myanmar** — food and drug

## Health system
- **Public hospital system** under MOH
- **Private** — limited; Yangon-focused
- **Humanitarian** — NGO health systems significant

## Standards
- **HL7 v2** rare outside tertiary centres
- **Paper + EMR hybrid** common
- **ICD-10**

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
