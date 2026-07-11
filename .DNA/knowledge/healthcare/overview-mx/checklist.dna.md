# Healthcare Overview — Mexico — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **NOM-024** compliance for EHR certification
2. **Private hospital** — vendor-specific APIs
3. **AWS/Azure** US regions often used; document cross-border if so

## Compliance actions
- Run `dna plan compliance --frameworks lfpdppp`
- COFEPRIS if medical device
- Pair with: `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
