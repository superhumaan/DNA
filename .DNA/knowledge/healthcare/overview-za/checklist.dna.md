# Healthcare Overview — South Africa — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **Provincial DOH** systems where applicable
2. **Medical aid schemes** — HL7/FHIR payer integration emerging
3. **AWS af-south-1** (Cape Town) for residency

## Compliance actions
- Run `dna plan compliance --frameworks popia`
- SAHPRA if SaMD
- Pair with: `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
