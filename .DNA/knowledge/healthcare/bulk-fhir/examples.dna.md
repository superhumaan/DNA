# Bulk FHIR Export — Examples

## Happy path
- Requires system/*.read scopes — highest scrutiny
- Store exports encrypted; short TTL
- Prefer synthetic data in dev

## Verify
Exercise the primary flow in staging; confirm logs omit secrets.
