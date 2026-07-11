# India — Healthcare Systems & Integration

# India — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems India healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| ABDM (Ayushman Bharat Digital Mission) | National platform | National health stack | ABHA ID; HIP/HIU; HIE-CM consent; FHIR R4 APIs | — |
| ABHA / Health ID | National platform | Patient identity | Create/link ABHA via ABDM gateway | — |
| UHI (Unified Health Interface) | National platform | Service discovery | Open protocol for health service booking | — |
| Apollo / Fortis / Max hospital EMRs | Hospital / acute EHR | Private chains | Hospital-specific; ABDM HIP registration | — |
| eHospital / Practo (private) | Ambulatory / GP | Clinic | Varies; ABDM alignment increasing | — |
| Redox / Innovaccer IN | Integration platform | Enterprise | Multi-hospital normalization | `healthcare/redox` |

## Integration playbook

1. **Register on ABDM sandbox** as HIP and/or HIU
2. **Consent Manager** — every data flow needs artefact
3. **FHIR R4** mandated; validate against ABDM profiles
4. **ap-south-1** (Mumbai) hosting

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-in` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions