# Healthcare Overview — United Arab Emirates

# Healthcare Technology — United Arab Emirates

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **UAE PDPL** — federal data protection (2021)
- **DHA/DOH/SHCC** — Dubai, Abu Dhabi, Sharjah health authorities
- **MOHAP** — federal Ministry of Health
- **UAE.SFDA** — medical device regulation

## Health system
- **Emirate-level** health systems — DHA (Dubai), DOH (Abu Dhabi)
- **Malaffi** — Abu Dhabi HIE
- **NABIDH** — Dubai health information exchange
- **Mandatory insurance** — in Dubai and Abu Dhabi

## Standards & profiles
- **FHIR R4** — Malaffi and NABIDH specs
- **HL7 v2** legacy
- **ICD-10**; **SNOMED CT**

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions