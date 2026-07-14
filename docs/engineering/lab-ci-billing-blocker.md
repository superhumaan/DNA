# Lab CI billing blocker

When GitHub Actions cannot start runners (failed account payment or Actions spending limit), every workflow job fails in a few seconds with empty steps. Lab used to show these as ordinary CI failures.

## Behaviour (DNA Lab)

1. `listCiRuns` enriches recent failed runs via `gh run view`
2. Failures are classified as `billing` when:
   - Annotation matches spending limit / payment failure text, or
   - Duration under 45s and all jobs have zero steps
3. `ciBillingBlocker` is returned on `/api/dna/labs/data`
4. Overview and Quality → CI show a banner linking to https://github.com/settings/billing

## Cleanup workflow

`cleanup-failed-runs.yml` skips the same pattern and uses `continue-on-error: true` so billing outages do not cascade into more failed runs.

## Upgrade Lab in a host app

`npx @superhumaan/dna-by-humaan@0.6.8` only runs the CLI (help / doctor / lab serve). It does **not** change `node_modules` in your app or reload a running API.

```bash
# In the host app (e.g. Humaan)
npm install @superhumaan/dna-by-humaan@0.6.8
# Restart the API that mounts createLabMiddleware / dnaLabMiddleware
# e.g. npm run dev:restart   or kill the process on your API port
```

Then hard-refresh `/labs`. Vite proxy alone will keep serving the old in-memory Lab bundle until the API restarts.
