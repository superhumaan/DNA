# Healthcare Overview — Denmark

# Healthcare Technology — Denmark

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **GDPR** + **Data Protection Act**
- **Sundhedsloven** — health act
- **Datatilsynet** — DPA health guidance
- **MDR** via Lægemiddelstyrelsen

## Health system
- **Regions** — 5 regional health authorities
- **Sundhed.dk** — national health portal
- **EPJ** — electronic patient journal (national)
- **Systematic Columna** — common EMR

## Standards & profiles
- **FHIR** — MedCom standards (Danish profiles)
- **HL7 v2** legacy
- **ICD-10**; **SKS** procedure codes

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions