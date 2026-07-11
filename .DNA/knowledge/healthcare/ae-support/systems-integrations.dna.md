# United Arab Emirates — Healthcare Systems & Integration

# United Arab Emirates — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems United Arab Emirates healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| Malaffi (Abu Dhabi) | HIE / data network | Emirate HIE | FHIR specs; accredited EMR connection | — |
| NABIDH (Dubai) | HIE / data network | Emirate HIE | Facility connection programme | — |
| DHA / DOH / SHCC | National platform | Regulators | Emirate-specific health data policies | — |
| Cerner / Epic UAE | Hospital / acute EHR | Acute | FHIR where deployed | `healthcare/epic` |

## Integration playbook

1. **Emirate-first** — Abu Dhabi vs Dubai specs differ
2. **Malaffi/NABIDH accreditation** for HIE

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-ae` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions