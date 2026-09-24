> **DNA Prompt Stem:** `companion-client` — read `.DNA/stems/companion-client/` (all files) before proceeding.

# Companion client

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and this stem's contextLoads. Mark stub Impressions as STUB — do not cite them as truth.

## Preconditions

Identify the source-of-truth app and the API or contract companions must use. If that contract does not exist, **stop**. Do not invent a second database or a second settings product.

Satellites may be a menu-bar app, a browser extension, an issue-tracker panel, or a mobile client. Build only the one the user named.

## Checklist

- [ ] Source of truth named (which app owns settings, billing, and reports)
- [ ] Companion calls that API; it does not fork persistence
- [ ] Credentials travel in headers or the platform's secure store — never on a query string or in a page URL
- [ ] If the platform cannot set headers on a long-lived stream, pull on open instead of streaming with a token in the URL
- [ ] Settings, invoices, and admin stay on the source-of-truth app
- [ ] Offline behaviour matches what the API already allows
- [ ] Plan stops for approval before code when this is a new client

## Artifacts

| Artifact | Path |
|----------|------|
| Companion plan | `.DNA/plans/companion-client.md` |

## Failure modes

| Mode | Response |
|------|----------|
| No source-of-truth API | Stop |
| Design puts a device token in the query string | Reject the design |
| Companion needs its own user directory | Refuse; use the main app's auth |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; name what is absent; do not scaffold a new product unless asked |
| Ambiguous scope | One clarifying question, then proceed with stated assumptions |
| Secrets required | Never print them; list env var or keychain names only |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
