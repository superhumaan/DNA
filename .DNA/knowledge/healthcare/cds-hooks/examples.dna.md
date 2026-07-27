# CDS Hooks — Examples

## Happy path
- Return cards with suggestions — no auto-order without explicit clinician action
- Latency SLA < 2s or EHR disables service
- No PHI in logs; correlate by opaque session id

## Verify
Exercise the primary flow in staging; confirm logs omit secrets.
