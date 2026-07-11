# Healthcare Overview — Vietnam — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **MOH digital health** — confirm current integration specs
2. **Hospital EMR** — vendor-specific (VNPT, Viettel health IT)
3. **AWS ap-southeast-1** or local VN cloud

## Compliance actions
- Run `dna plan compliance --frameworks pdpd_vn`
- Pair with: `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
