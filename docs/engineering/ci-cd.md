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

Failed workflow runs are cleaned up by `.github/workflows/cleanup-failed-runs.yml`, which listens for completed `workflow_run` events from CI, DNA CI/Preview/Security, Publish npm, and path-style workflow names (used when a workflow file fails validation) and deletes failures immediately after they finish. A six-hourly schedule and manual `workflow_dispatch` sweep any backlog. DNA `ci install` scaffolds the same cleanup workflow for consumer projects.

---

## Preview deploy (consumer projects)

When `ci.pushToPreview` is true, `dna ci install` scaffolds `.github/workflows/dna-preview.yml` with Vercel or Netlify templates and an optional branch filter. See [Integrations](./integrations.md#preview-deploy).

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
