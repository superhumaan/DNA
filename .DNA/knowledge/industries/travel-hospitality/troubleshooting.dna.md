# Troubleshooting — Travel & Hospitality

## Top failure modes
1. Travel & Hospitality misconfiguration across environments
2. Dependency outage affecting Travel & Hospitality
3. Missing monitoring on Travel & Hospitality critical path

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
