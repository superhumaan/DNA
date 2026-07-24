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

`npx @superhumaan/dna-by-humaan@x.y.z` only runs the CLI. It does **not** change `node_modules` in your app or reload a running API. Nested backends are a common trap.

```bash
# Preferred (v0.6.16+) — CLI + packs + nested Lab installs
npx @superhumaan/dna-by-humaan@latest update

# Or force every owner package.json dir
npx dna lab installs --fix

# REQUIRED
# 1. Restart the API that mounts createLabMiddleware / dnaLabMiddleware
# 2. Hard-refresh /labs (Cmd+Shift+R)
curl -s http://localhost:<api>/api/dna/labs/health | jq '{dnaVersion,labUi}'
```

Vite proxy alone will keep serving the old in-memory Lab bundle until the API restarts. Full checklist: [lab-upgrade-dx](./lab-upgrade-dx-0.6.15.md).
