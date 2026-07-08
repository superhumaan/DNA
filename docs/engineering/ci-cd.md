# CI/CD

Continuous integration for the DNA monorepo and recommended CI patterns for DNA-managed projects.

---

## DNA monorepo CI

GitHub Actions on push/PR to `main`:

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
```

Workflow: `.github/workflows/` in this repository.

---

## Recommended consumer project CI

Add DNA health checks to your pipeline:

```yaml
# Example GitHub Actions step
- name: DNA health check
  run: |
    npx @superhumaan/dna-by-humaan doctor
    npx @superhumaan/dna-by-humaan validate
```

---

## Feature factory gates

Close-out sequence for feature factory work:

```bash
dna quality report --feature
dna docker build
dna github push
```

---

## Wiki CI

Build the local Docusaurus wiki:

```bash
pnpm run wiki:build
```

---

## Related

- [Local development](./local-development.md)
- [Doctor and validation](../quality-assurance/doctor-and-validation.md)
