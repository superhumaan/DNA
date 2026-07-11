# Healthcare Overview — Nepal — Architecture

## When to use
# Healthcare Technology — Nepal

APAC country pack. Pair with `healthcare/overview-apac` and `healthcare/overview-np`.

## Regulation
- **Privacy Act 2075** (2018)
- **Department of Drug Administration**
- **MOHP** — Ministry of Health and Population

## Health system
- **Public health posts and hospitals** — federal structure
- **NHSP** — Nepal Health Sector Programme
- **Private** — growing in Kathmandu valley

## Standards
- **DHIS2** used for public health reporting
- **HL7 v2** in tertiary hospitals
- **ICD-10**

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
