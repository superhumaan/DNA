# Healthcare Overview — Philippines — Architecture

## When to use
# Healthcare Technology — Philippines

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **DPA 2012** — Data Privacy Act; health is sensitive
- **Universal Health Care Act** — national policy
- **FDA Philippines** — medical device rules
- **PhilHealth** — national health insurance

## Health system
- **PhilHealth** — claims and provider accreditation
- **DOH** — Department of Health hospitals
- **Private** — Ayala Healthcare, Metro Pacific
- **eHealth** — national electronic health programme

## Standards & profiles
- **HL7 v2** common
- **FHIR** — PhilHealth digital transformation
- **ICD-10**; **PhilHealth case rates**

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
