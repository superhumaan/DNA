# Healthcare Overview — China

# Healthcare Technology — China

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **PIPL** — Personal Information Protection Law
- **DSL** — Data Security Law; health = important data
- **Cybersecurity Law** — localisation and security assessment
- **NMPA** — medical device regulation (including AI diagnostic)

## Health system
- **NHSA** — National Healthcare Security Administration
- **Hospital tiers** — 三级甲等 (Grade A tertiary) classification
- **EMR vendors** — Neusoft, Winning, iFlytek health, etc.
- **Internet hospital** — regulated online care licences

## Standards & profiles
- **HL7 v2** common domestically
- **FHIR** — limited; national interoperability standards differ
- **ICD-10** Chinese; **national drug codes**

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions