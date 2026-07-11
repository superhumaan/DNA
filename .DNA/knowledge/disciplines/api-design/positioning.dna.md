# API Design

## REST defaults
- Nouns in URLs; HTTP verbs correct
- Cursor pagination for large lists
- Problem+json or consistent `{ error, code }` shape
- Version in path (`/v1/`) when breaking changes ship