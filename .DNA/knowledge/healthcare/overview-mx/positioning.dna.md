# Healthcare Overview — Mexico

# Healthcare Technology — Mexico

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **LFPDPPP** — federal personal data law; ARCO rights
- **NOM-024-SSA3** — electronic health record standard
- **COFEPRIS** — medical device regulation
- **IMSS/ISSSTE** — public insurer governance

## Health system
- **IMSS** — social security health (largest public)
- **ISSSTE** — state workers' health
- **INSABI** legacy transition; mixed private (Hospital Ángeles, etc.)
- **SINBA** — national health information system push

## Standards & profiles
- **HL7 v3/CDA** — NOM-024 historically
- **FHIR R4** — emerging in private sector
- **CIE-10** diagnoses

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions