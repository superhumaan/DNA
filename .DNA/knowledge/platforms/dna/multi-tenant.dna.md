# Multi-Tenant (AIStudio, Soli)

## Models
- **Deployment-per-tenant** (AIStudio): one Container App per customer, account URL subdomain
- **Row-level tenant** (Soli): `tenantId` on every store bucket, SQL JSON row per tenant

## Rules
- Resolve tenant from session on every API call
- Never leak cross-tenant data in search/list endpoints
- Provision script seeds tenant config + starter content
- Admin scoped to own tenant only
