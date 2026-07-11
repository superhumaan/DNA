# Oracle Health (Cerner) — Architecture

## When to use
# Cerner / Oracle Health

Major US EHR. **Cerner Open Developer Experience (CODE)** for FHIR apps.

## Notes
- Oracle Health rebrand — APIs migrating; verify docs per release
- Millennium domains per health system

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
