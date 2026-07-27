# Redox — Examples

## Happy path
- Redox dev portal: environments (Development, Staging, Production)
- Webhook verification + idempotent processing
- Map `Meta.Source.ID` to your tenant/customer
- Data models: PatientAdmin, Clinical Summary, Orders, Results
- BAA with Redox; they maintain EHR-side BAAs where applicable

## Verify
Exercise the primary flow in staging; confirm logs omit secrets.
