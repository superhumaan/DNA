# Fintech & Banking — Best Practices

**Do:**
- Idempotency keys on all money-moving operations
- Double-entry ledger or proven accounting module
- Show fees and FX rates before confirmation
- Audit log every balance change with actor and reason
- Sandbox-first integration testing

**Don't:**
- Store PAN/CVV — use tokenization
- Skip KYC on onboarding shortcuts
- Mix prod and sandbox API keys
- Rely on client-side amount validation