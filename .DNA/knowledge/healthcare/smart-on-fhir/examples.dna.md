# SMART on FHIR — Examples

## Happy path
- Register app in EHR developer portal (Epic App Orchard, Cerner CODE)
- PKCE for public clients
- Scope minimization: `patient/Observation.read` not blanket `patient/*.read`
- Test with open sandbox patients before production review

## Verify
Exercise the primary flow in staging; confirm logs omit secrets.
