# HL7 FHIR R4 — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
- Base URL: `/fhir/R4/`
- SMART App Launch for user-facing apps
- Validate with FHIR validator; profile must cite IG (e.g. US Core, UK Core)
- Pagination: `_count`, `_since` for delta sync
- Provenance resource for audit trail

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
