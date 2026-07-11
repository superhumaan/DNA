# Audit Logging

## Storage
- SQLite/Postgres `audit_events` + optional JSONL
- Append-only — no updates/deletes

## Client allowlist
Only approved action types from browser; reject unknown events.

## Admin UI
Filterable audit log in admin portal.

## Never log
Secrets, raw AI prompts, full PII payloads — redact.
