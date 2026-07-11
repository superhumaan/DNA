# Healthcare Overview — Australia — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **My Health Record** — NASH PKI, conformance testing for upload/view
2. **State clinical portals** — per-jurisdiction APIs
3. **GP software** — Best Practice, MedicalDirector via accredited integration
4. Host in **ap-southeast-2** (Sydney) where residency required

## Compliance actions
- Run `dna plan compliance --frameworks privacy_act_au`
- TGA classification if clinical decision support
- Pair with: `healthcare/fhir-r4`, `healthcare/phi-engineering`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
