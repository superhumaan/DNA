# Healthcare Overview — Israel — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **Sick fund APIs** — partner agreements required
2. **Hospital EMR** — per-facility integration
3. **AWS/Azure** — EU or local hosting; document transfers

## Compliance actions
- Run `dna plan compliance --frameworks israel_privacy`
- AMAR if medical device
- Pair with: `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
