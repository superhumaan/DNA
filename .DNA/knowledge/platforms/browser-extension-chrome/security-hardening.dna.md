# Security hardening — Chrome Extension (MV3)

## Threat sketch
Attackers will try credential theft, injection, privilege escalation, and supply-chain abuse against **Chrome Extension (MV3)**.

## Controls
- Least privilege for Chrome Extension (MV3)
- Secrets never in git
- Validate inputs at Chrome Extension (MV3) boundaries

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
