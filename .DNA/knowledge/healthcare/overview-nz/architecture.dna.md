# Healthcare Overview — New Zealand — Architecture

## When to use
# Healthcare Technology — New Zealand

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **Privacy Act 2020** — health information is sensitive
- **HIPC** — Health Information Privacy Code 2020
- **Medsafe** — medical device regulation
- **Te Whatu Ora** — Health New Zealand (national health entity)

## Health system
- **Te Whatu Ora** — consolidated national health service
- **NHI** — National Health Index number
- **GP systems** — Medtech, Indici dominate primary care
- Regional DHB legacy systems consolidating

## Standards & profiles
- **FHIR R4** — NZ adoption growing via Te Whatu Ora
- **HL7 v2** in hospitals
- **ICD-10-AM**; **SNOMED CT NZ**

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
