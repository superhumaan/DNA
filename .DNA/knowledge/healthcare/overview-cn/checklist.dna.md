# Healthcare Overview — China — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **Regulatory complexity** — often require local entity and ICP licence
2. **Hospital integration** — per-facility; rarely public cloud FHIR
3. **Data localisation** — health data must stay in China; no default AWS US

## Compliance actions
- Run `dna plan compliance --frameworks pipl`
- Security assessment for cross-border data
- Engage local legal counsel before PHI processing
- Pair with: `healthcare/fhir-r4` (reference only — adapt to national specs)

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
