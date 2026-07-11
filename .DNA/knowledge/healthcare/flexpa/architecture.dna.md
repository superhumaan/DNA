# Flexpa — Architecture

## When to use
# Flexpa

Members connect payer portals; your app receives FHIR via Flexpa token.

## Use
- Benefits apps, clinical trials recruitment, personal health records

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
