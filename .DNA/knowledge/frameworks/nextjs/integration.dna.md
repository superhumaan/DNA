# Integration

| Pack | Role |
|------|------|
| auth/clerk | Session + middleware |
| payments/stripe | Checkout / webhooks via Route Handlers |
| cloud/vercel | Deploy (or docker for self-host) |
| tools/tailwind-css | Styling |

## Env
Never commit secrets. Use `.env.local` + platform env. Validate with Zod at boot.
