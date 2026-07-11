# MCP Server — Positioning

Expose tools, resources, and prompts to AI clients via Model Context Protocol.

## When to build
- Internal dev tools (Jira, deploy, DB read-only)
- Product feature: user connects their account to an AI assistant

Use `mcp-server` archetype. TypeScript SDK common; stdio for local, SSE/HTTP for remote.
