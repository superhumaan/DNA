# Healthcare Overview — European Union — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **Country-specific pack** — prefer `healthcare/overview-de`, `-fr`, etc. over this generic EU pack when known
2. **National health APIs** — Gematik (DE), INS/DMP (FR), Nictiz (NL)
3. **iPaas** — Redox, MuleSoft for multi-country rollouts
4. **Data residency** — EU region; SCCs for transfers outside EEA

## Compliance actions
- Run `dna plan compliance --frameworks gdpr`
- CE marking path via `healthcare/mdr-eu` if SaMD
- Pair with: `healthcare/mdr-eu`, `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
