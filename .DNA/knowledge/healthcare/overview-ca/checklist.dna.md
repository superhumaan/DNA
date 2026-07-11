# Healthcare Overview — Canada — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **Provincial integration** — confirm target province APIs (often per health authority)
2. **Infoway-certified** interfaces where required for public funding
3. **Telus Health, Epic Canada** — vendor-specific FHIR where exposed
4. Bilingual (EN/FR) for federal and Quebec-facing products

## Compliance actions
- Run `dna plan compliance --frameworks pipeda` + document province
- Data residency: prefer Canadian regions (AWS ca-central-1, Azure Canada)
- Pair with: `healthcare/fhir-r4`, `healthcare/phi-engineering`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
