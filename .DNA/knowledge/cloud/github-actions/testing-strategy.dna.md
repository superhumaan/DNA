# Testing strategy — GitHub Actions

## Layers
| Layer | What |
|-------|------|
| Unit | Pure logic, validators, mappers |
| Integration | Real or testcontainers against GitHub Actions boundaries |
| Contract | OpenAPI / webhook payload fixtures |
| E2E smoke | One critical user journey |
| Chaos (optional) | Timeout / 5xx injection |

## DNA gate
Ship path expects tests + `dna quality report --feature` for product changes touching this pack's surface.

## Fixtures
Use `assets/fixtures/` as seeds. Prefer deterministic IDs and no production PII.

## Anti-patterns
- Only mocking the thing under test until nothing is real
- Skipping webhook signature tests
- Flaky time-dependent tests without fakes
