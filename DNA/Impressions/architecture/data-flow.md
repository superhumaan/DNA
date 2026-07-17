# Data Flow

## Runtime observation

1. Consumer framework adapter observes request/error boundaries.
2. Runtime pipeline normalizes, fingerprints, classifies, and redacts events.
3. Atomic JSON persists events and issues under `.DNA/data/`.
4. DNA Lab collects summaries through short-lived cache/single-flight.
5. Browsers poll request-specific endpoints with ETag/304 and fetch detail on demand.

## Lab state

1. Auth, OTP, pairing, release, and source-map operations use the Lab store port.
2. Single-instance/local use defaults to atomic file storage.
3. Declared replicas require a configured healthy shared backend.
4. Backend or topology failures return 503 rather than creating split-brain state.

## Public health evidence

1. CI executes build, lint, typecheck, unit/coverage, browser, load, audit, and DNA quality.
2. A sanitizer composes results into a versioned public JSON/Markdown report.
3. GitHub displays the summary and stores full artifacts.
4. npm documentation and DNA-Web consume the same sanitized snapshot.

No production PostgreSQL database exists in this repository.
