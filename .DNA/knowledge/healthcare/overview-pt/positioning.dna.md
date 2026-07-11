# Healthcare Overview — Portugal

# Healthcare Technology — Portugal

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **GDPR** + **Lei de Proteção de Dados**
- **SNS** — Serviço Nacional de Saúde governance
- **INFARMED** — medical devices
- **SPMS** — health IT agency

## Health system
- **SNS** — national health service (5 regional ARS)
- **SNS 24** — telehealth line
- **RNPI** — national patient index
- **Glintt, Philips Tasy** — hospital EMRs

## Standards & profiles
- **FHIR** — SPMS interoperability roadmap
- **HL7 v2** in hospitals
- **ICD-10-CM** adapted

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions