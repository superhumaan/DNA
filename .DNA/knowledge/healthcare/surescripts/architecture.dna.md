# Surescripts — Architecture

## When to use
# Surescripts

National e-prescribing backbone. **EPCS** requires identity proofing and two-factor for prescribers.

## Use
- Medication ordering from your app

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
