<!-- DNA Behaviour — DNA by Humaan -->
<!-- Do not edit unless explicitly requested. Managed by DNA. -->

# Security Behaviour

## Compliance

Compliance level: none

## Rules

- Never commit secrets, tokens, or credentials
- Use environment variables for sensitive configuration
- Maintain .env.example with all required variables (no real values)
- Validate and sanitize all user input
- Apply authentication and authorization checks on protected endpoints
- **RBAC:** enforce permissions on API, routes, menus, notifications, and actions — not API alone
- **Default deny:** users have no access until an admin grants a role
- **Zero trust:** never trust UI hiding alone; verify every request server-side
- Before RBAC work: run `dna plan rbac` and follow `.DNA/workflows/rbac.workflow.md`
- Before processing personal, health, or payment data: run `dna plan compliance` and follow tier + framework knowledge
- Before banking, healthcare, cross-border, or jurisdiction-specific features: run `dna legal advise` and follow `.DNA/workflows/legal.workflow.md`
- Compliance tier: infer from project stage or set via `dna plan compliance --tier startup|sme|corporate|enterprise`
- Complete Phase 6 verification checklist before marking RBAC done
- Redact sensitive data in logs and error reports
- Review dependencies for known vulnerabilities
- CI runs the package-manager-native audit command (`pnpm audit`, `yarn audit`, or `npm audit`) and optional OWASP ZAP baseline — see `.github/workflows/dna-security.yml`
- Follow OWASP ASVS L1 checklist in `.DNA/knowledge/testing/owasp-zap/` for DAST setup
