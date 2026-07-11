# NHS FHIR (UK) — Architecture

## When to use
# NHS FHIR UK

## Programs
- **GP Connect** — primary care data access
- **NHS Login** — citizen identity
- **UK Core FHIR** profiles mandatory

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
