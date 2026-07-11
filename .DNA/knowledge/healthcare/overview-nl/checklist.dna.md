# Healthcare Overview — Netherlands — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **MedMij** — citizen-controlled health data exchange
2. **Zorg-AB** — healthcare provider directory
3. **NEN 7510** controls in security architecture

## Compliance actions
- Run `dna plan compliance --frameworks gdpr`
- NEN 7510 alignment for enterprise healthcare sales
- Pair with: `healthcare/overview-eu`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
