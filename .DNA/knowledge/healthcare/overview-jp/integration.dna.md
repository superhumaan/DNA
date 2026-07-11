# Healthcare Overview — Japan — Integration

1. **FHIR JP Core** for new integrations
2. **Hospital EMR** — vendor-specific; often per-facility VPN
3. Host in **ap-northeast-1** (Tokyo) for residency

## Compliance actions
- Run `dna plan compliance --frameworks appi`
- PMDA consultation if diagnostic/treatment claims
- Pair with: `healthcare/fhir-r4`