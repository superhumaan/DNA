# Healthcare Overview — Japan — Architecture

## When to use
# Healthcare Technology — Japan

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **APPI** — Act on Protection of Personal Information; health is sensitive
- **Next Generation Medical Infrastructure Act** — anonymized medical data use
- **PMDA** — pharmaceuticals and medical devices (SaMD guidance)
- **MHLW** — Ministry of Health, Labour and Welfare oversight

## Health system
- **Universal NHI** — statutory insurance societies (協会けんぽ, 組合, etc.)
- **Medical Information Network (医療情報ネット)** — national connectivity push
- **EMR adoption** — vendor landscape: IBM Japan, Fujitsu, Cerner JP
- **Online medical care** guidelines post-COVID

## Standards & profiles
- **HL7 FHIR JP Core** Implementation Guide
- **SS-MIX2** — standardized storage format (legacy transition)
- **JLAC10** labs; **ICD-10** Japanese

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
