# Healthcare Overview — Poland

# Healthcare Technology — Poland

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **GDPR** + **UODO** guidance on health data
- **Patient Rights Act** — access to medical records
- **URPL** — medical device office
- **CEZ** — Centre for eHealth

## Health system
- **NFZ** — National Health Fund
- **e-Zdrowie** — national eHealth programme
- **IKP** — Internetowe Konto Pacjenta (patient account)
- **Asseco, Comarch** — hospital information systems

## Standards & profiles
- **FHIR** — P1 platform interoperability specs
- **HL7 CDA** legacy
- **ICD-10**; **ICF**

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions