# Healthcare Overview — Germany — Architecture

## When to use
# Healthcare Technology — Germany

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **GDPR** + **BDSG** — strict health data rules
- **SGB V** — statutory health insurance law
- **DiGA** — digital health apps on prescription (BfArM directory)
- **MDR** — CE marking via notified bodies

## Health system
- **GKV** — ~90% statutory insurance via ~100 Krankenkassen
- **Gematik** — national agency for telematics infrastructure (TI)
- **ePA** — electronic patient record (rolling national)
- **KV-Connect, KIM** — secure messaging in ambulatory care

## Standards & profiles
- **KBV / Gematik FHIR** profiles (MIO, ePA)
- **TI connector** — certified middleware for practice systems
- **ICD-10-GM**; **SNOMED CT DE**

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
