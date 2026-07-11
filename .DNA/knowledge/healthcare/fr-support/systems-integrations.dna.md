# France — Healthcare Systems & Integration

# France — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems France healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| Mon Espace Santé / DMP | National platform | Shared health record | ANS CI-SIS FHIR; patient consent | — |
| Pro Santé Connect | National platform | Clinician identity | OAuth2 OIDC for health professionals | — |
| MSSanté | National platform | Secure messaging | Health professional secure email | — |
| INS (NIR) | National platform | National health ID | Identity matching for records | — |
| DxCare (Dedalus) | Hospital / acute EHR | Acute | HL7 CDA + FHIR ANS profiles; hospital-specific | — |
| Orbis (Dedalus) | Hospital / acute EHR | Acute | Common in public hospitals | — |
| Epic France | Hospital / acute EHR | Acute (select) | Epic on FHIR + CI-SIS overlays | `healthcare/epic` |
| Maincare / Mediboard | Ambulatory / GP | Practice | Ambulatory APIs vary by vendor | — |
| Redox / Enovacom | Integration platform | Integration | When hospital lacks public FHIR | `healthcare/redox` |

## Integration playbook

1. **HDS-certified hosting** before production PHI
2. **ANS IG packages** — validate every resource in CI
3. **DMP** integration requires ANS conformance + legal agreements
4. **CCAM / CIM-10** coding for procedures and diagnoses

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-fr` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions