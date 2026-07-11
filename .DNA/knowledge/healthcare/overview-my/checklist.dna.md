# Healthcare Overview — Malaysia — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **MOH HIE** — confirm current national integration programme
2. **Hospital EMR** — vendor-specific
3. **AWS ap-southeast-1** / Azure Singapore

## Compliance actions
- Run `dna plan compliance --frameworks pdpa_my`
- MDA if medical device
- Pair with: `healthcare/fhir-r4`, `healthcare/overview-sg`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
