# QA Strategy

## Test layers

- **Unit:** pure business logic, schemas, sanitization, classifiers, generators
- **Integration:** filesystem stores, framework adapters, Lab auth/API contracts
- **Browser smoke:** critical DNA Lab shell, health, and overview behavior in Chromium
- **Capacity:** deterministic 200-viewer request-polling harness with JSON evidence
- **Supply chain:** package-manager-native audit plus Docker build verification

## Coverage policy

The blocking 80% threshold applies to documented product-critical behavioral
code. Generated catalogs, copied assets, and static UI/CSS payloads are reported
as inventory but excluded from the behavioral line gate. Exclusions must never
hide auth, storage, runtime, quality, or API logic.

## Evidence

CI produces one versioned public health summary plus private/full artifacts.
GitHub, npm documentation, and DNA-Web must cite the same generated result.
