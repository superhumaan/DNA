# Healthcare Overview — United Kingdom — Integration

1. **NHS API platform** — GP Connect, e-RS, PDS FHIR
2. **Integration engines** — Mirth, InterSystems for legacy
3. **Private hospital** — Cerner, Epic UK instances, System C
4. Data **residency UK** — document subprocessors and transfers

## Compliance actions
- Run `dna plan compliance --frameworks uk_gdpr`
- Complete DSPT if processing NHS patient data
- Pair with: `healthcare/nhs-fhir`, `healthcare/mdr-eu`, `healthcare/fhir-r4`