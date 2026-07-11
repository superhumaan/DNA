# Healthcare Overview — Canada — Integration

1. **Provincial integration** — confirm target province APIs (often per health authority)
2. **Infoway-certified** interfaces where required for public funding
3. **Telus Health, Epic Canada** — vendor-specific FHIR where exposed
4. Bilingual (EN/FR) for federal and Quebec-facing products

## Compliance actions
- Run `dna plan compliance --frameworks pipeda` + document province
- Data residency: prefer Canadian regions (AWS ca-central-1, Azure Canada)
- Pair with: `healthcare/fhir-r4`, `healthcare/phi-engineering`