# Incident Response Plan

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `Governance & Compliance/Incident Response Plan.docx`

---

Incident Response Plan

## Uk Gdpr

Scope

Applies to

Security and privacy incidents affecting [Product Name] production in Azure UK South.

Includes personal data breaches under UK GDPR.

Response phases

1. Detect & triage (0–1 hour)

Alerts from Azure Monitor, Application Insights, Defender, WAF

On-call engineer validates and opens incident ticket (severity P1–P4)

Involve Security Lead and DPO if personal data may be affected

2. Contain (1–4 hours)

Isolate compromised accounts, rotate secrets, block malicious IPs

Disable affected feature flags if AI or API abuse

Preserve audit logs and forensic snapshots

3. Eradicate & recover

Patch, redeploy from known-good pipeline

Restore from backup only if integrity verified

Post-incident monitoring 72 hours

4. Notify

ICO within 72 hours if breach risk to individuals' rights

Affected customers without undue delay when high risk

Document timeline in Incident Logs register

_Template — customize confidentiality and ownership statements for your organisation before distribution._
