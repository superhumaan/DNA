# Security hardening — PostgreSQL

## Threat sketch
Attackers will try credential theft, injection, privilege escalation, and supply-chain abuse against **PostgreSQL**.

## Controls
- Least-privilege DB roles per service
- SSL/TLS to database
- No public 5432; jump host or private network
- PII columns minimized; audit access

## DNA rules
- Never commit secrets from CLI output
- Admin surfaces: UI hide **and** API `requireAdmin` (or equivalent)
- Impression Guard: stub policy docs ≠ implemented controls

## Review checklist
- [ ] Secrets in vault/env — not repo
- [ ] Public endpoints rate-limited where abuse is cheap
- [ ] Dependency audit considered for this change
- [ ] PII/PHI paths minimized and audited
- [ ] Webhook/signature verification when inbound

## Evidence
Store control evidence under compliance packs / Impressions — do not claim SOC2/HIPAA from empty stubs.
