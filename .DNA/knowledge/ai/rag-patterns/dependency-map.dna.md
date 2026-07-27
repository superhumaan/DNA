# Dependency map — RAG Patterns

## Upstream
List services **RAG Patterns** calls (DB, auth, payments, AI, queues). Note timeout and retry policy per dependency.

## Downstream
Who breaks if **RAG Patterns** is down? (UI routes, jobs, webhooks, partner APIs)

## Contracts
- Versioned APIs / webhooks
- Idempotency where money or entitlement changes
- Schema registry or OpenAPI when multiple consumers

## Failure containment
Circuit breakers or graceful degradation paths documented in `troubleshooting.dna.md`. Prefer read-only degraded mode over hard 500s when safe.

## Change impact
Before merging: name the upstream/downstream blast radius in the PR and in `ai/feature-request.md` when product-facing.
