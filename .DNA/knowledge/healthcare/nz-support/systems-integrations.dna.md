# New Zealand — Healthcare Systems & Integration

# New Zealand — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems New Zealand healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| Te Whatu Ora / NHI | National platform | National health entity + ID | NHI number; national interoperability programme | — |
| Hira (Health NZ) | National platform | Digital services | National digital health infrastructure | — |
| Medtech Evolution / Indici | Ambulatory / GP | GP PMS | Dominant GP systems; FHIR adoption via programmes | — |
| Orion Health Concerto | Integration platform | HIE / portal | Common integration hub in hospitals | — |
| Epic (select DHBs) | Hospital / acute EHR | Acute | FHIR where deployed | `healthcare/epic` |

## Integration playbook

1. **HIPC 2020** compliance for all health agencies
2. **NHI** as patient identifier — lawful use only
3. **Te Whatu Ora** specs for national programmes

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-nz` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions