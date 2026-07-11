# Healthcare Overview — Brazil — Architecture

## When to use
# Healthcare Technology — Brazil

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **LGPD** — Lei Geral de Proteção de Dados; health is sensitive
- **ANVISA** — medical device regulation (RDC 657/2022 software)
- **CFM/COFEN** — professional council rules for telemedicine
- **SUS** — public system governance

## Health system
- **SUS** — Unified Health System (public, universal)
- **ANS** — private health insurance regulator
- **RNDS** — Rede Nacional de Dados em Saúde (national FHIR network)
- Major EHRs: Tasy (Philips), MV, Epic Brazil

## Standards & profiles
- **FHIR R4** — RNDS national profiles
- **HL7 v2** in hospitals
- **CID-10** diagnoses; **TUSS** procedures

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
