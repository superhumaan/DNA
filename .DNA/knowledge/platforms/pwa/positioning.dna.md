# PWA — Positioning

Web app that installs like a native app: manifest, service worker, HTTPS.

## When to use
- Field apps, kiosks, internal tools where store distribution is optional
- Complement to responsive web — not a replacement for push-heavy native features on iOS

## Stack pairing
- Vite: `vite-plugin-pwa` (see `frameworks/vite/pwa-patterns.dna.md`)
- Next.js: custom SW or `@serwist/next` — document choice in Impressions

Use `pwa-react-vite` archetype or set `stack.platform` to include `pwa`.
