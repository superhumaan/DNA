# Veradigm (Allscripts) — Architecture

## When to use
# Veradigm

Successor brand to Allscripts. Patient portal FollowMyHealth.

## Integration
- Veradigm Partner Program
- FHIR where enabled per deployment

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
