# Healthcare Overview — Austria — Architecture

## When to use
# Healthcare Technology — Austria

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **GDPR** + **DSG** (Datenschutzgesetz)
- **GDG-KH** — hospital governance law
- **BASG** — medical device authority
- **ELGA** — electronic health record law

## Health system
- **ELGA** — Elektronische Gesundheitsakte (national EHR)
- **ÖGK** — Austrian Health Insurance Fund
- **Regional hospitals** — mixed public/private
- **CGM, Dedalus** — practice and hospital systems

## Standards & profiles
- **ELGA FHIR** profiles
- **HL7 v2** in acute care
- **ICD-10**; **ICD-10-GM** influence

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
