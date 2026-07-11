# Healthcare Overview — Germany — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **Gematik FHIR APIs** — ePA, eRezept, eAU (sick note)
2. **Practice systems (PVS)** — via certified TI gateway — not direct scraping
3. **Hospital IS** — ORBIS, i.s.h.med, Epic/Cerner DE instances
4. **DiGA** pathway if qualifying as prescribed app

## Compliance actions
- Run `dna plan compliance --frameworks gdpr`
- DiGA/BfArM if reimbursable digital health app
- Pair with: `healthcare/overview-eu`, `healthcare/mdr-eu`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
