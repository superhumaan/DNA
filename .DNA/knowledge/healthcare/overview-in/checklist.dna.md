# Healthcare Overview — India — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **ABDM APIs** — ABHA creation, HIP/HIU registration, consent manager
2. **Health Information Provider (HIP)** / **User (HIU)** roles
3. **India region** cloud (AWS ap-south-1, Azure Central India)

## Compliance actions
- Run `dna plan compliance --frameworks dpdp`
- Register on ABDM sandbox before production HIP/HIU
- Pair with: `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
