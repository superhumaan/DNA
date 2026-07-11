# Canada — Healthcare Systems & Integration

# Canada — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems Canada healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| Canada Health Infoway | National platform | Interop standards | Canadian Baseline FHIR profiles | — |
| Ontario Health / ConnectCare (AB) | National platform | Provincial EHR | Province-specific FHIR/API endpoints | — |
| Epic Canada | Hospital / acute EHR | Acute (academic) | Epic on FHIR Canadian Baseline | `healthcare/epic` |
| Cerner Canada | Hospital / acute EHR | Acute | Millennium FHIR | `healthcare/cerner-oracle-health` |
| Telus Health / TELUS PS Suite | Ambulatory / GP | Practice + community | Vendor APIs; provincial programmes | — |
| Meditech Canada | Hospital / acute EHR | Community hospitals | FHIR/v2 mix | `healthcare/meditech` |
| Redox | Integration platform | Multi-province | When provincial API unavailable | `healthcare/redox` |

## Integration playbook

1. **Target province first** — OHIP/MSP/RAMQ rules differ
2. **Canadian Baseline FHIR** for new integrations
3. **Bilingual** EN/FR for federal and Quebec
4. **ca-central-1** data residency

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-ca` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions