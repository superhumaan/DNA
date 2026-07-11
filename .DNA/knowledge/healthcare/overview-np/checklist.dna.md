# Healthcare Overview — Nepal — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. MOHP health information system
2. NGO and hospital EMR often standalone
3. Low-bandwidth considerations for rural telehealth

## Compliance
- Pair with: `healthcare/overview-apac`, `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
