# Organisation Tier — Startup

**Team:** 1–25 | **Goal:** ship safely without bureaucracy

## Mindset
Compliance is **risk reduction**, not checkbox theatre. Implement controls that prevent real harm and unblock enterprise sales later.

## Must-have (all frameworks)
- [ ] TLS on all endpoints; HSTS in production
- [ ] Secrets in env / cloud vault — never in git
- [ ] Authentication on all non-public routes; MFA for admin
- [ ] RBAC default deny (`dna plan rbac`)
- [ ] Privacy policy + subprocessors list published
- [ ] Data inventory (spreadsheet OK): what, why, where, how long
- [ ] Backup + one successful restore test documented
- [ ] Dependency scanning in CI (npm audit / Snyk)
- [ ] Incident contact list + breach awareness timeline

## GDPR at startup
- Lawful basis per feature (contract, consent, legitimate interest)
- Cookie consent if non-essential cookies
- DPA signed with cloud provider (AWS, Vercel, Supabase, etc.)
- Erasure/export process (manual ticket OK)

## HIPAA at startup
- **Avoid PHI** unless the product is healthcare-specific
- If PHI: BAA with every vendor; encrypt ePHI; no PHI in logs/AI

## ISO 27001 at startup
- Not certifiable yet — use Annex A as a **checklist**, not a project
- Document security owner and top 10 risks

## SOC 2 at startup
- Use trust criteria as engineering north star
- Git PR reviews = change management evidence

## When to level up to SME
Enterprise prospects send security questionnaires; team >25; processing special-category data at scale.
