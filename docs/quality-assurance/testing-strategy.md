# Testing strategy

How DNA is tested and how DNA-managed projects should approach quality.

---

## Monorepo testing

```bash
pnpm test           # Vitest — all packages
pnpm test:watch     # Watch mode
pnpm typecheck      # TypeScript across packages
pnpm lint           # ESLint
```

Tests live alongside source: `*.test.ts` in each package.

---

## DNA project testing

DNA coordinates testing through Behaviour:

| File | Governs |
|------|---------|
| `.DNA/behaviour/testing.behaviour.md` | Test requirements for AI |
| `dna validate` | Checks project against Behaviour rules |

---

## Feature factory quality

SonarQube-style local reports without a SonarQube server:

```bash
dna quality report --feature
```

Reports written to `.DNA/reports/quality/`.

---

## Pre-release checklist

```bash
dna doctor
dna validate
pnpm test          # if contributing to DNA monorepo
```

---

## Related

- [Doctor and validation](./doctor-and-validation.md)
- [Quality reports](./quality-reports.md)
- [CI/CD](../engineering/ci-cd.md)
