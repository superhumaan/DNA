# Test Plan

## Required release gates

1. Build all workspace packages from a clean checkout.
2. Lint and typecheck every package.
3. Run Vitest unit/integration suites.
4. Enforce ≥80% on the product-critical coverage scope.
5. Run Playwright Chromium smoke against DNA Lab.
6. Run the 200-viewer Lab polling gate with zero errors.
7. Run dependency audit and DNA quality/SAST.
8. Build and verify the Docker image.

## Critical journeys

- Local Lab boots and serves `/labs` and `/api/dna/labs/health`
- Auth/local trust, pairing callback, and session boundaries reject unsafe input
- File state is safe for one instance; shared state is required for replicas
- Polling returns cached 200/304 responses and issue detail stays off the hot path
- Health reporting removes private paths/events and handles missing evidence

## Manual release checks

- npm package contents and README show the current version/result
- GitHub summary links to downloadable artifacts
- DNA-Web `/health` is responsive, accessible, current, and fail-soft when stale
