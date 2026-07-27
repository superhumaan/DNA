# Security hardening — Industry Packs Overview

## Threat sketch
Attackers will try credential theft, injection, privilege escalation, and supply-chain abuse against **Industry Packs Overview**.

## Controls
- Least privilege for Industry Packs Overview
- Secrets never in git
- Validate inputs at Industry Packs Overview boundaries

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
