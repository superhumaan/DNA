# Healthcare Overview — United States — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **Direct EHR FHIR** — Epic App Orchard, Cerner CODE (per health system base URL)
2. **Health data networks** — Redox, Health Gorilla, Particle, Zus, Metriport
3. **TEFCA/QHIN** — nationwide HIE with purpose-of-use documentation
4. **Payer APIs** — Flexpa, Availity, X12 EDI via clearinghouse

## Compliance actions
- Run `dna plan compliance --frameworks hipaa`
- Document TPO (treatment, payment, operations) vs marketing use
- State telehealth licensure for clinicians
- Pair with: `healthcare/epic`, `healthcare/cms-interop`, `healthcare/tefca-qhin`, `healthcare/phi-engineering`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
