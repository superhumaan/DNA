# Strapi — Headless Pattern

- Content API: `/api/{collection}` with API tokens scoped per role
- Public routes: never expose draft; use `publicationState=live`
- Webhooks on `entry.publish` → frontend rebuild or tag revalidation
- Admin on separate subdomain; WAF + IP allowlist for internal teams
