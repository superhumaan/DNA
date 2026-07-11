# Healthcare Overview — New Zealand — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **Te Whatu Ora** interoperability programme
2. **GP integration** — via accredited practice management vendors
3. **AWS ap-southeast-2** (Sydney) or local NZ cloud

## Compliance actions
- Run `dna plan compliance --frameworks privacy_act_nz`
- HIPC compliance for all health apps
- Pair with: `healthcare/fhir-r4`, `healthcare/overview-au`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
