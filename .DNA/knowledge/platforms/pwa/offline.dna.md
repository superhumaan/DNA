# PWA — Offline & Caching

## Strategies
- **App shell** — cache static assets; network-first for API
- **Stale-while-revalidate** for semi-static JSON
- Version cache on deploy — bump SW on breaking API changes

## Rules
- Never cache authenticated API responses without explicit TTL and scope
- Show offline UI state — do not fail silently
- Test airplane mode and slow 3G
