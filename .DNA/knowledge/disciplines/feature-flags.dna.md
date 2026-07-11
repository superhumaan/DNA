# Feature Flags

## DNA production approach (no LaunchDarkly)
1. **Env toggles** — `ENFORCE_USAGE_QUOTA`, `KNOWLEDGE_OCR`, etc.
2. **Admin KV store** — per-tenant slices (content policy enabled, share redact default)
3. **Capability gates** — role-based feature visibility

## Rollout rules
- Default **off** for risky features in production
- Fail-fast validation rejects unsafe combos (e.g. AUTH_DEBUG in prod)
- Document each flag in `.DNA/CellularMemory/prefrontalCortex/decisions.md`

## When to add LaunchDarkly/Unleash
Multi-tenant SaaS with per-user gradual rollout — see `disciplines/gradual-rollout`.
