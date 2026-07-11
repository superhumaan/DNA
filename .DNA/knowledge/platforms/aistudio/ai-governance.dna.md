# AI Governance (AI Studio)

## Pipeline (mandatory order)
validate → input guard → content policy → quota → prompt assembly → model → postprocess

## Rules
- **Server-proxy only** — API keys never in browser
- Content policy blocklist (built-in + admin custom terms)
- Clinical/domain safety in system prompts
- Usage quotas: daily per-user, org monthly caps
- Rate limits per bucket (auth, chat, admin)

## Admin
- AI Profiling overlay
- Content policy editor
- Knowledge document ingest (PDF + OCR)

## Audit
Classify issues; never store raw prompts in audit trail.
