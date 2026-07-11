# Healthcare Overview — China — Integration

1. **Regulatory complexity** — often require local entity and ICP licence
2. **Hospital integration** — per-facility; rarely public cloud FHIR
3. **Data localisation** — health data must stay in China; no default AWS US

## Compliance actions
- Run `dna plan compliance --frameworks pipl`
- Security assessment for cross-border data
- Engage local legal counsel before PHI processing
- Pair with: `healthcare/fhir-r4` (reference only — adapt to national specs)