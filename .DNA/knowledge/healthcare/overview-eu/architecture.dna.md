# Healthcare Overview — European Union — Architecture

## When to use
# Healthcare Technology — European Union

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **GDPR** — Art. 9 special category (health); DPIA often mandatory
- **EU MDR 2017/745** — medical devices including SaMD; CE marking
- **EHDS** (European Health Data Space) — emerging cross-border framework
- **NIS2** — critical healthcare infrastructure cybersecurity

## Health system
- **National health systems** vary: Bismarck (DE/FR), Beveridge (ES/IT), mixed (NL)
- **Cross-border care** — EHIC, emerging EHDS
- **eHDSI** — patient summary exchange (MyHealth@EU)
- No single EHR — national programmes (Gematik DE, DMP FR, etc.)

## Standards & profiles
- **FHIR R4** with national IG overlays (DE Basisprofil, FR CI-SIS, etc.)
- **HL7 CDA** legacy in some countries
- **SNOMED CT** (national editions); **LOINC**; **ICD-10**

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
