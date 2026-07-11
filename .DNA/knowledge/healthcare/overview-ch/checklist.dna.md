# Healthcare Overview — Switzerland — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **EPD** — canton-specific endpoints
2. **eHealth Suisse** interoperability specs
3. Data residency Switzerland preferred

## Compliance actions
- Run `dna plan compliance --frameworks swiss_nFADP`
- Swissmedic if SaMD
- Pair with: `healthcare/overview-eu`, `healthcare/overview-de`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
