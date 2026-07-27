# SaaS B2B — Best Practices

**Do:**
- Multi-tenancy isolation tested (no cross-tenant leaks)
- SSO and RBAC for enterprise deals
- Audit logs for admin actions
- Onboarding that reaches first value in <15 minutes
- Public status page and API versioning policy

**Don't:**
- Ship without export/delete for customer data (GDPR)
- Hardcode tenant IDs in queries
- Break API without deprecation window