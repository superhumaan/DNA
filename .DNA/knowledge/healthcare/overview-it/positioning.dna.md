# Healthcare Overview — Italy

# Healthcare Technology — Italy

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **GDPR** + **Codice Privacy**
- **FSE** — Fascicolo Sanitario Elettronico (electronic health record)
- **AGENAS** — national agency for health services
- **MDR** via Ministero della Salute

## Health system
- **SSN** — Servizio Sanitario Nazionale (regional delivery)
- **20 regional health systems** — integration varies by region
- **TS** — Tessera Sanitaria (national health card)
- Hospital systems: Dedalus, Engineering, Epic Italy

## Standards & profiles
- **FHIR** — FSE 2.0 interoperability specs emerging
- **HL7 CDA** legacy
- **ICD-9-CM** procedures (transitioning); **ICD-10**

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions