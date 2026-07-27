# Lab APIs reference + deep links (v0.6.18)

## Summary

Lab **APIs** tab is a full HTTP reference for every Lab route, plus project OpenAPI when present. Lab UI also uses URL deep links and never toasts raw `"Unauthorized"`.

## APIs tab

`GET /api/dna/labs/apis` returns `operations[]` from:

1. **`LAB_OPERATIONS`** — complete catalog mirroring `lab/server.ts` (assets, health, bootstrap, data, auth, pairing, issues, releases, sourcemaps, …)
2. **Project OpenAPI** — discovered `openapi.json` / `swagger.json` (enriched when the spec has description / requestBody / responses)

Each operation includes:

| Field | Meaning |
|-------|---------|
| **Description** | What the endpoint does |
| **Usage** | Auth (public / session / local), typical caller |
| **Received** | Path/query/body (or OpenAPI summary) |
| **Sent** | Status codes + response shape |

UI: expandable rows under **API reference**; KPIs + live/probe traffic table unchanged. Completeness locked by `collect-apis.test.ts`.

## Auth open mode

`lab.requireAuthInProduction: false` is honored for open Lab APIs on public hosts (default remains closed). See [lab-open-auth-requireAuthInProduction.md](./lab-open-auth-requireAuthInProduction.md).

## Deep links + 401 UX

- Paths: `/labs/<tab>`, `/labs/issues/<id>` (History API + `popstate`)
- Bare `/labs` restores last tab from `sessionStorage`
- 401 on Lab APIs → sign-in view (no `"Unauthorized"` toast)

## Related

- [lab-depth-pass.md](./lab-depth-pass.md)
- [CHANGELOG](../../CHANGELOG.md)
