# Chrome Extension — Positioning

Manifest V3 only for new extensions. Service worker background (not persistent background page).

## Structure
`manifest.json` — permissions minimal by default
`service-worker` — events, messaging
`content-scripts/` — DOM injection on matched URLs
`popup/` or `sidepanel/` — UI (React/Vite build into extension dist)

Use `browser-extension-chrome` archetype.
