# Architecture — Next.js App Router

```
app/
  layout.tsx          # RSC shell
  page.tsx            # route UI
  loading.tsx         # Suspense fallback
  error.tsx           # error boundary
  api/**/route.ts     # Route Handlers
```

| Concern | Pattern |
|---------|---------|
| Data fetch | async Server Components / `fetch` cache |
| Mutations | Server Actions or Route Handlers |
| Auth | Middleware + server helpers |
| Admin | Separate `/admin` tree + RBAC |
