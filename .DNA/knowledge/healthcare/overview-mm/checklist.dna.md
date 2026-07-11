# Healthcare Overview — Myanmar — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. Verify current regulatory environment before PHI processing
2. NGO integration patterns (OpenMRS, DHIS2)
3. Sanctions and operational risk — legal review mandatory

## Compliance
- Engage local counsel; high operational risk market
- Pair with: `healthcare/overview-apac`, `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
