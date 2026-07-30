---
description: Plan /admin as a new-tab route tree with RBAC-wrapped link, route guards, and requireAdmin APIs.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Plan admin portal

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem. Mark stub Impressions as STUB — do not cite as truth.

## Mandatory loads

1. `.cursor/rules/admin-portal.mdc`
2. `.DNA/knowledge/platforms/dna/admin-portal.dna.md`
3. `.DNA/knowledge/platforms/dna/rbac-patterns.dna.md` (if present)
4. Existing auth / capability issuance in the repo

Optional: `npx dna plan rbac "<admin roles>"` · `npx dna context security`

## Checklist

- [ ] Path: `/admin` (or `/app/admin` if app shell requires)
- [ ] Entry: `AdminPortalLink` → `null` without capability; `target="_blank"` + `rel="noopener noreferrer"`
- [ ] Route guard: unauthorized blocked (no admin chrome flash)
- [ ] API: `requireAdmin` on all `/api/**/admin/**`
- [ ] Screens MVP: users/directory, audit log, settings — map to existing components
- [ ] Tests: non-admin no link / route / API 403; admin happy path
- [ ] Approval gate before any code

## Artifacts

| Artifact | Path |
|----------|------|
| Plan | `.DNA/plans/admin-portal.md` or `DNA/Impressions/architecture/admin-portal-plan.md` |
| RBAC matrix | Include in plan (roles × link × route × API) |
| Feature request | `ai/feature-request.md` (update) |

## Failure modes

| Mode | Response |
|------|----------|
| No auth system | Plan capability issuance first; do not fake client-only roles |
| Admin already exists | Diff against pattern; extend — do not duplicate route trees |
| Same-tab requested | Note exception; still keep RBAC three-layer |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; say what is absent; do not invent scaffolding unless asked |
| Ambiguous scope | One clarifying question max, then proceed with stated assumptions |
| Secrets / credentials needed | Never print them; list which env vars / keychain items are required |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |

## Output

Architect plan only → **STOP for approval** → hand off `ship-feature`.
