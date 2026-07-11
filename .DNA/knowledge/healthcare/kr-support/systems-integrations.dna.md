# South Korea — Healthcare Systems & Integration

# South Korea — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems South Korea healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| NHIS (National Health Insurance) | Payer / insurer | Single payer | Claims and provider registration | — |
| HIRA | Payer / insurer | Review + assessment | Quality and claims review APIs (partner access) | — |
| EZCaretech / U2Bio / Samsung SDS EMR | Hospital / acute EHR | Hospital EMR | High penetration; site-specific integration | — |
| FHIR KR Core | National platform | FHIR profiles | KHIS-led profiles | — |

## Integration playbook

1. **PIPA explicit consent** for health data
2. **Hospital EMR** direct integration most common path
3. **ap-northeast-2** (Seoul)

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-kr` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions