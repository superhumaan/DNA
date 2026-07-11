# FDA SaMD — Architecture

## When to use
# FDA SaMD

If software **diagnoses, treats, or drives clinical decisions**, may be SaMD — not just HIPAA.

## Tiers
IEC 62304 software lifecycle, ISO 14971 risk, clinical validation evidence

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
