# HL7 FHIR R4 — Examples

## Happy path
- Base URL: `/fhir/R4/`
- SMART App Launch for user-facing apps
- Validate with FHIR validator; profile must cite IG (e.g. US Core, UK Core)
- Pagination: `_count`, `_since` for delta sync
- Provenance resource for audit trail

## Verify
Exercise the primary flow in staging; confirm logs omit secrets.
