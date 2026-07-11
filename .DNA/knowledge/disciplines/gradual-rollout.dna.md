# Multi-Tenant Gradual Rollout

## DNA approach (tenant-scoped)
1. **Percentage rollout** — hash `tenantId` + `featureKey` for stable bucketing (0–100%)
2. **Allowlist / denylist** — explicit tenant IDs in admin KV store
3. **Kill switch** — global off overrides all tenants immediately
4. **Audit** — log every flag evaluation change in append-only audit log

## Rollout phases
| Phase | Scope | Gate |
|-------|-------|------|
| Internal | `tenantId IN allowlist` | Staff tenants only |
| Canary | 5–10% of tenants | Monitor error rate + latency |
| Gradual | 25 → 50 → 100% | Automated or manual promotion |
| GA | 100% | Remove flag after 2 releases |

## Tenant-scoped config
```typescript
interface TenantRollout {
  featureKey: string;
  enabled: boolean;
  percentage: number;       // 0–100
  allowlist?: string[];     // tenant IDs
  denylist?: string[];
}
```

## Integration with feature flags
- Env toggles for global kill switches
- Admin KV for per-tenant slices (`disciplines/feature-flags`)
- Capability gates for role-based visibility

## Codegen
Run `dna plan feature feature-flags` then `dna generate feature audit-logging` for audit trail.

## When NOT to use
Single-tenant apps — env toggles are sufficient.
