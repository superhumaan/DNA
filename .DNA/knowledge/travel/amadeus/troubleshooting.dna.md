# Troubleshooting — Amadeus GDS

## Top failure modes
1. Amadeus GDS misconfiguration
2. Vendor outage / rate limit
3. Webhook or auth drift

## Triage tree
1. **Is it down for everyone or one tenant/user?** → blast radius
2. **Did a deploy land in the last 2h?** → rollback candidate
3. **Are dependencies healthy?** (DB, auth, payment, AI provider)
4. **Do logs show 4xx (client) or 5xx (ours)?**
5. **Is config drift present?** (env, feature flags, migrations)

## Commands / evidence (adapt to stack)
```bash
npx dna analyze
npx dna scan
# plus provider dashboards, `kubectl`/`docker` logs, APM traces
```

## Known gotchas
- Staging ≠ prod config (especially auth callbacks and webhook URLs)
- Clock skew breaking signatures
- Connection pool exhaustion under load
- Cached negatives after permission changes

## When to escalate
Sev1 data loss, auth bypass, payment mischarge, or prolonged outage → page + incident procedure.
