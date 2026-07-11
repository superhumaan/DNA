# Sanity — Headless Pattern

- Schema in `sanity/schemaTypes/`
- GROQ queries in `sanity/lib/queries.ts`
- Preview: draft mode + `SANITY_API_READ_TOKEN` server-only
- Webhooks → ISR revalidation on publish
- Images: `@sanity/image-url` builder — never hotlink raw CDN without transforms
