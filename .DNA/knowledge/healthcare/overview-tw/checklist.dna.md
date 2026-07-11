# Healthcare Overview — Taiwan — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **NHI MediCloud** — cloud and data initiatives
2. **Hospital integration** — per-facility; VPN common
3. **AWS ap-east-1** (Hong Kong) or local — document cross-strait data rules

## Compliance actions
- Run `dna plan compliance --frameworks tw_pdpa`
- TFDA if SaMD
- Pair with: `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
