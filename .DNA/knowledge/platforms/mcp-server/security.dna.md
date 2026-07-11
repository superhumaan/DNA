# MCP Server — Security

- Authenticate every connection — no anonymous production MCP
- Tool inputs: validate with Zod; reject path traversal in file tools
- Scope tokens per user/org; audit tool invocations
- Read-only by default; write tools need explicit confirmation flow in client
- Never return secrets in tool results
