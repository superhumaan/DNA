# Secure SDLC Policy

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Secure SDLC Policy.docx`

---

Secure SDLC Policy

## Uk Gdpr

Secure development for [Product Name]

Requirements

Threat modelling for new API endpoints and AI features

Mandatory code review; no direct commits to main

SAST + dependency scan on CI; block critical/high without exception

Secrets via Azure Key Vault / Managed Identity — no keys in repo

Prompt template changes require security-aware review

Staging DAST before production; penetration test annually

Release gates

All tests pass; security scan clean or approved risk acceptance

Changelog and deployment runbook updated

Privacy impact noted in ticket if processing changes

_Template — customize confidentiality and ownership statements for your organisation before distribution._
