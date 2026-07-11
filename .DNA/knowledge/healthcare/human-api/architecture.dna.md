# Human API — Architecture

## When to use
# Human API

Patient-linked health data for apps and research.

Similar category to Flexpa/1up — evaluate vendor BAAs and payer coverage.

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
