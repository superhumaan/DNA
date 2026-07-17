# Decision History

## 2026-07-11

DNA project intelligence initialised.

## 2026-07-17

- Kept DNA Lab request-polling rather than introducing sockets; added cache,
  single-flight, ETag/304, visibility-aware jitter, and on-demand detail.
- Made loopback the only local-auth trust boundary and authenticated pairing callbacks.
- Kept atomic JSON as the zero-config default while failing closed for unsafe replicas.
- Standardised CI on the active package manager and clean-checkout build ordering.
- Chose a sanitized, versioned health artifact as the boundary between private
  engineering reports and public GitHub/npm/DNA-Web transparency.
- Chose scoped coverage over line-testing generated catalogs; product-critical
  behavior remains subject to the 80% gate.
