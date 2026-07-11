# Australia — Healthcare Systems & Integration

# Australia — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems Australia healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| My Health Record (ADHA) | National platform | National shared record | NASH PKI; HI Service APIs; conformance testing | — |
| Medicare / PBS (Services Australia) | National platform | Claims + benefits | PRODA authentication; Medicare Online | — |
| Best Practice / MedicalDirector | Ambulatory / GP | GP software | Accredited software path to MHR | — |
| Cerner AU / Epic AU | Hospital / acute EHR | Acute | FHIR AU Base profiles | `healthcare/cerner-oracle-health` |
| NSW Health Cerner | Hospital / acute EHR | State health | State-specific integration programmes | — |
| Telstra Health / Fred IT | Pharmacy / eRx | Pharmacy + eRx | ePrescribing networks | — |
| HealthLink / Medical Objects | Integration platform | Messaging | Secure clinical messaging between practices | — |
| Redox | Integration platform | Multi-EHR | When hospital lacks public FHIR API | `healthcare/redox` |

## Integration playbook

1. **MHR conformance** before upload/view of clinical documents
2. **AU Base FHIR** for all new APIs
3. **State health** systems are separate from national — confirm jurisdiction
4. **ap-southeast-2** (Sydney) hosting

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-au` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions