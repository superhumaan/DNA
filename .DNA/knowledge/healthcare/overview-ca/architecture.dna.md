# Healthcare Overview — Canada — Architecture

## When to use
# Healthcare Technology — Canada

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **PIPEDA** — federal private-sector privacy
- **Provincial health laws** — PHIPA (ON), HIA (AB), FIPPA, etc. — often stricter than PIPEDA
- **Health Canada** — medical device classification (MDR-like)
- **Pan-Canadian standards** — Infoway interoperability framework

## Health system
- **Provincial single-payer** — OHIP, MSP, RAMQ, etc.
- **Canada Health Infoway** — national digital health strategy
- **Provincial EHRs** — ConnectCare (AB), ClinicalConnect, regional HIEs
- Epic and Cerner in large academic centres

## Standards & profiles
- **FHIR R4** with **Canadian Baseline** profiles (CIHI, Infoway)
- **HL7 v2** in hospitals
- **SNOMED CT CA Edition**; ICD-10-CA for billing

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
