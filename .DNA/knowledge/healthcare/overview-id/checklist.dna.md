# Healthcare Overview — Indonesia — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **SATUSEHAT** — register as system; OAuth + FHIR APIs
2. **BPJS** — claims integration via accredited pathways
3. **AWS ap-southeast-3** (Jakarta)

## Compliance actions
- Run `dna plan compliance --frameworks pdp_id`
- SATUSEHAT certification for clinical data exchange
- Pair with: `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
