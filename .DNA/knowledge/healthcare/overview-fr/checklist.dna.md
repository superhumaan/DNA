# Healthcare Overview — France — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **Mon Espace Santé / DMP** — ANS interoperability specs
2. **HDS-certified** cloud — required for health data hosting
3. **MSSanté** — secure health messaging
4. **Pro Santé Connect** — clinician authentication

## Compliance actions
- Run `dna plan compliance --frameworks gdpr`
- HDS certification for infrastructure provider
- Pair with: `healthcare/overview-eu`, `healthcare/mdr-eu`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
