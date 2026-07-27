# Security hardening — Data HQ (Data Headquarters)

## Threat sketch
Attackers will try credential theft, injection, privilege escalation, and supply-chain abuse against **Data HQ (Data Headquarters)**.

## Controls
- Least privilege for Data HQ (Data Headquarters)
- Secrets never in git
- Validate inputs at Data HQ (Data Headquarters) boundaries

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
