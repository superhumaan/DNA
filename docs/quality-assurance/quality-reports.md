# Quality reports

Local SonarQube-style quality analysis for feature factory work — no external server required.

---

## Generate a report

```bash
dna quality report --feature
dna quality report --feature admin-portal
```

Reports are written to `.DNA/reports/quality/`.

---

## What is analysed

- SAST-style pattern checks
- Lint and typecheck integration
- Feature-scoped file scope from the active plan

---

## Agent workflow

Before marking feature work complete:

1. Run `dna quality report --feature`
2. Fix findings or document exceptions
3. Run `dna validate`
4. Proceed to `dna docker build` and `dna github push`

---

## Related

- [Feature factory](../delivery/features/feature-factory.md)
- [Testing strategy](./testing-strategy.md)
