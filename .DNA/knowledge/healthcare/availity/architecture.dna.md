# Availity — Architecture

## When to use
# Availity

Multi-payer portal and APIs for administrative transactions.

## Use
- Real-time eligibility (270/271)
- Prior auth status

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
