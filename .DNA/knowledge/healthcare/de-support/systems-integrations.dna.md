# Germany — Healthcare Systems & Integration

# Germany — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems Germany healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| Gematik TI (ePA / eRezept / eAU) | National platform | Telematics infrastructure | FHIR via certified TI-Konnektor — not direct to PVS | — |
| KBV MIO | National platform | Medical documents | Structured outpatient documents | — |
| ORBIS / i.s.h.med | Hospital / acute EHR | Acute | Hospital IS; FHIR via TI or interface engine | — |
| Epic / Cerner DE | Hospital / acute EHR | Acute (select) | FHIR + Gematik where deployed | `healthcare/epic` |
| CGM / Medistar / Turbomed | Ambulatory / GP | PVS practice systems | TI gateway required — no ad hoc scraping | — |
| DiGA Directory (BfArM) | National platform | Prescribed apps | Separate from general wellness apps | — |

## Integration playbook

1. **TI-Konnektor** certification for practice-facing integrations
2. **ePA** FHIR APIs for patient record access with consent
3. **DiGA** path if app is reimbursable digital health

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-de` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions