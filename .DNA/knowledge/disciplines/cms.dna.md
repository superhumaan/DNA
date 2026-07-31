# CMS & Content Management

## Patterns in DNA stack
- **a production app knowledge docs** — admin PDF/URL ingest into chat context
- **Ops job directory** — structured content for people sync mapping
- **Survey form builder** — JSON-driven sections/fields (CMS-like)
- **a production app note/entity templates** — admin-managed content schemas

## Implementation
- Admin CRUD for content types
- Version or draft flag where needed
- Sanitize HTML (DOMPurify) on render
- RBAC on publish vs draft
