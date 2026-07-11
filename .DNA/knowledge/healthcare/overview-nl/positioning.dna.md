# Healthcare Overview — Netherlands

# Healthcare Technology — Netherlands

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **GDPR** + **WGBO** (medical treatment agreement)
- **NEN 7510** — healthcare information security standard
- **AGREEMENT ON MEDICAL TREATMENT** — patient rights
- **MDR** via IGJ

## Health system
- **Zorgverzekeringswet** — mandatory insurance
- **EPD** — electronic patient dossier (national push)
- **Nictiz** — national eHealth standards body
- **Chipsoft HiX**, **Epic NL** in hospitals

## Standards & profiles
- **Nictiz FHIR** profiles (MedMij for citizen access)
- **HL7 v3/CDA** legacy
- **SNOMED CT NL**; **ICD-10**

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions