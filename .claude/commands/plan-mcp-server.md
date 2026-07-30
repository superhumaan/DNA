---
description: Plan an MCP server for Cursor/Claude — tools, security, and client wiring.
argument-hint: [context or scope]
allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write
---# Plan MCP server

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem. Mark stub Impressions as STUB — do not cite as truth.

## Loads

- `.DNA/knowledge/platforms/mcp-server/` (positioning, security, architecture, checklist, anti-patterns)
- Neural intent `build_mcp_server`

## Checklist

- [ ] Purpose: what AI clients can do
- [ ] Tool list: name, input schema, side effects, authz
- [ ] Security: secrets, path sandbox, deny-by-default, audit
- [ ] Transport: stdio / SSE; Cursor + Claude host config sketch
- [ ] Tests: contract + security negatives
- [ ] Boundary: DNA CLI vs MCP (no duplicate unbounded shell)
- [ ] Plan only → approval → `ship-feature`

## Artifacts

| Artifact | Path |
|----------|------|
| MCP plan | `.DNA/plans/mcp-server.md` |
| Tool matrix | Inside plan (tool × side-effect × auth) |
| Client config sketch | `mcp.json` / Claude config snippet in plan (no secrets) |

## Failure modes

| Mode | Response |
|------|----------|
| User wants unrestricted shell | Refuse; propose allowlisted tools |
| Secrets in tool output | Design redaction; never return env dumps |
| Overlap with DNA CLI | Prefer thin MCP wrappers over reimplementing CLI |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; say what is absent; do not invent scaffolding unless asked |
| Ambiguous scope | One clarifying question max, then proceed with stated assumptions |
| Secrets / credentials needed | Never print them; list which env vars / keychain items are required |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
