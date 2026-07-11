# Da Vinci Implementation Guides — Architecture

## When to use
# Da Vinci IGs

US-specific FHIR profiles: PDex, CDex, PAS, Drug Formulary, etc.

Reference when integrating with US payers or prior auth workflows.

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
