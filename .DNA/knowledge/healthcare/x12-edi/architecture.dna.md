# X12 EDI (Healthcare) — Architecture

## When to use
# X12 EDI

Legacy but mandatory for US billing. Often via clearinghouse not direct payer.

## Common sets
- 837P professional / 837I institutional
- 835 ERA
- 270/271 eligibility

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
