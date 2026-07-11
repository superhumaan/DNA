# United States — Healthcare Systems & Integration

# United States — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems United States healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| Epic (Hyperspace / MyChart) | Hospital / acute EHR | Acute + ambulatory enterprise | Epic on FHIR + App Orchard; per-customer FHIR base URL; SMART launch | `healthcare/epic` |
| Oracle Health (Cerner Millennium) | Hospital / acute EHR | Acute care | Cerner CODE sandbox → SMART on FHIR; OAuth2 backend services | `healthcare/cerner-oracle-health` |
| MEDITECH Expanse | Hospital / acute EHR | Community hospitals | FHIR where enabled; often Redox/Mirth for v2 | `healthcare/meditech` |
| athenahealth athenaOne | Ambulatory / GP | Outpatient | REST API + webhooks; practice ID scoped | `healthcare/athenahealth` |
| eClinicalWorks / healow | Ambulatory / GP | Outpatient | healow patient engagement APIs | `healthcare/eclinicalworks` |
| Veradigm (Allscripts) | Ambulatory / GP | Ambulatory | Veradigm API programmes | `healthcare/veradigm` |
| Canvas Medical | Ambulatory / GP | Open API EMR | REST-first open EMR for startups | `healthcare/canvas-medical` |
| Redox | Integration platform | Multi-EHR network | Single API → 100+ EHRs; webhooks; normalization | `healthcare/redox` |
| Health Gorilla / Particle / Zus | HIE / data network | Clinical data networks | OAuth patient/clinician linking; FHIR aggregation | `healthcare/health-gorilla` |
| Change Healthcare / Availity | Payer / insurer | Claims + eligibility | X12 270/271, 837/835 via clearinghouse | `healthcare/availity` |
| CMS Interop (Patient Access API) | National platform | Regulated FHIR | US Core FHIR for MA/ACA/hospitals | `healthcare/cms-interop` |
| TEFCA / QHIN | National platform | Nationwide HIE | Purpose-of-use via QHIN or facilitator | `healthcare/tefca-qhin` |
| Da Vinci IGs | Payer / insurer | Payer FHIR | PDex, PAS, CDex for prior auth and claims | `healthcare/da-vinci` |

## Integration playbook

1. **Pick tier** — direct EHR FHIR (long certification) vs Redox/Health Gorilla (faster)
2. **Register** — Epic App Orchard or Cerner CODE before writing integration code
3. **SMART on FHIR** for clinician-facing; standalone OAuth for patient apps
4. **Claims** — never hand-roll X12; use clearinghouse + `healthcare/x12-edi`
5. **Per-org URLs** — every health system has its own FHIR base URL

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-us` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions