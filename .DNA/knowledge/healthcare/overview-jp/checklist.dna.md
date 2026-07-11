# Healthcare Overview — Japan — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **FHIR JP Core** for new integrations
2. **Hospital EMR** — vendor-specific; often per-facility VPN
3. Host in **ap-northeast-1** (Tokyo) for residency

## Compliance actions
- Run `dna plan compliance --frameworks appi`
- PMDA consultation if diagnostic/treatment claims
- Pair with: `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
