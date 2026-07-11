# Healthcare Overview — Portugal — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **SPMS** — national health IT integration
2. **RNPI** — patient identification
3. EU hosting

## Compliance actions
- Run `dna plan compliance --frameworks gdpr`
- Pair with: `healthcare/overview-eu`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
