# Multi-Tenant (production apps, production apps)

## Models
- **Deployment-per-tenant** (production apps): one Container App per customer, account URL subdomain
- **Row-level tenant** : `tenantId` on every store bucket, SQL JSON row per tenant

## Rules
- Resolve tenant from session on every API call
- Never leak cross-tenant data in search/list endpoints
- Provision script seeds tenant config + starter content
- Admin scoped to own tenant only
