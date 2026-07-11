# Drupal — Architecture

# Drupal — Positioning

Mature enterprise CMS. Use **decoupled** mode with JSON:API or GraphQL — not Drupal theme + React SPA in same PHP theme layer.

## When to pick Drupal
- Public sector RFPs, complex workflows, accessibility mandates
- Large editorial teams with granular permissions


## Content flow
- Editorial → API → frontend build or ISR
- Webhooks trigger cache invalidation
