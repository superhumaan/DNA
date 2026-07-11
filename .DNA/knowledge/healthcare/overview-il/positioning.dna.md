# Healthcare Overview — Israel

# Healthcare Technology — Israel

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **Privacy Protection Law** — health data is sensitive
- **Digital Health Law** — national health database framework
- **MOH** — Ministry of Health regulation
- **AMAR** — medical device registration

## Health system
- **Kupot Holim** — four sick funds (Clalit largest)
- **National health insurance** — universal
- **Chameleon, Meditech** — common hospital EMRs
- **Tehila** — government digital health initiatives

## Standards & profiles
- **HL7 v2** dominant
- **FHIR R4** — growing adoption
- **ICD-10**; local drug coding

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions