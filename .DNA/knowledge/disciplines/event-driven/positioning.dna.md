# Event-Driven Architecture

Use when domains decouple (orders → inventory → notifications).

## Patterns
- Outbox table for reliable publish
- Idempotent consumers (dedupe key)
- Avoid distributed monolith — clear ownership per event type