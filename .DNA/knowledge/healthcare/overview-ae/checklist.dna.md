# Healthcare Overview — United Arab Emirates — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **Malaffi** (Abu Dhabi) — accredited EMR integration
2. **NABIDH** (Dubai) — facility connection programme
3. **UAE cloud regions** — AWS me-central-1, Azure UAE

## Compliance actions
- Run `dna plan compliance --frameworks uae_pdpl`
- Emirate-specific health data policies (DHA Circulars)
- Pair with: `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
