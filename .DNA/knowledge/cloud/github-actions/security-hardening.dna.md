# Security hardening — GitHub Actions

## Threat sketch
Attackers will try credential theft, injection, privilege escalation, and supply-chain abuse against **GitHub Actions**.

## Controls
- Least privilege for GitHub Actions credentials
- Validate inputs at GitHub Actions trust boundaries
- No secrets in git or client bundles

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
