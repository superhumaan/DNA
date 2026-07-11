# United Kingdom — Healthcare Systems & Integration

# United Kingdom — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems United Kingdom healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| NHS Spine (PDS / SDS) | National platform | Identity + demographics | PDS FHIR API; SDS role lookup; CIS2 auth | `healthcare/nhs-fhir` |
| GP Connect | National platform | Primary care access | Structured record + appointments; accredited systems only | `healthcare/nhs-fhir` |
| NHS Login | National platform | Citizen identity | OAuth for patient-facing apps | `healthcare/nhs-fhir` |
| e-RS (e-Referral Service) | National platform | Referrals | FHIR APIs for secondary care referrals | `healthcare/nhs-fhir` |
| Epic (UK instances) | Hospital / acute EHR | Acute (select trusts) | Epic on FHIR UK Core profiles | `healthcare/epic` |
| Cerner / Oracle Health UK | Hospital / acute EHR | Acute | Millennium FHIR + UK Core | `healthcare/cerner-oracle-health` |
| System C Medway | Hospital / acute EHR | Acute PAS/EPR | HL7 v2 + FHIR emerging; trust-specific | — |
| EMIS / TPP SystmOne | Ambulatory / GP | GP systems | GP Connect accreditation path — do not scrape | — |
| Mirth / Rhapsody | Integration platform | Interface engine | v2 ↔ FHIR translation for legacy trusts | `healthcare/mirth` |

## Integration playbook

1. **UK Core FHIR** mandatory for NHS-facing APIs
2. **GP Connect accreditation** for primary care data — months-long programme
3. **CIS2** for clinician auth; **NHS Login** for patients
4. **DSPT** annual assurance required for NHS suppliers

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-uk` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions