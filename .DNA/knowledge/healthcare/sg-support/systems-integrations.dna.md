# Singapore — Healthcare Systems & Integration

# Singapore — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems Singapore healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| NEHR (National EHR) | National platform | National record | IHiS-accredited systems programme; FHIR specs | — |
| SingPass / Corppass | National platform | Identity | Citizen and corporate identity | — |
| IHiS | National platform | Health IT agency | Accreditation + integration specs for EMRs | — |
| SingHealth / NHG / NUHS clusters | Hospital / acute EHR | Public acute | Cluster EMRs — integration via IHiS | — |
| Raffles / Parkway Pantai | Hospital / acute EHR | Private | Vendor-specific FHIR/HL7 | — |
| GPITM / clinic systems | Ambulatory / GP | Primary care | Accredited clinic EMRs for NEHR | — |

## Integration playbook

1. **NEHR accreditation** for EMR vendors — confirm vendor status
2. **IHiS** publishes integration specs — do not guess endpoints
3. **ap-southeast-1** hosting

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-sg` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions