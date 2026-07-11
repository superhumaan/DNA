# Healthcare Overview — United Kingdom — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **NHS API platform** — GP Connect, e-RS, PDS FHIR
2. **Integration engines** — Mirth, InterSystems for legacy
3. **Private hospital** — Cerner, Epic UK instances, System C
4. Data **residency UK** — document subprocessors and transfers

## Compliance actions
- Run `dna plan compliance --frameworks uk_gdpr`
- Complete DSPT if processing NHS patient data
- Pair with: `healthcare/nhs-fhir`, `healthcare/mdr-eu`, `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
