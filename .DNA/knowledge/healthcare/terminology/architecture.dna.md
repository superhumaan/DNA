# Clinical Terminology — Architecture

## When to use
# Clinical Terminology

## Systems
| System | Use |
|--------|-----|
| SNOMED CT | Problems, procedures |
| LOINC | Labs, vitals |
| RxNorm | Medications |
| ICD-10-CM | Billing diagnoses |

FHIR: CodeSystem, ValueSet, `coding` arrays with system URI

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
