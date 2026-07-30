# Examples

## Example 1

**User:** Expose DNA quality and analyze as MCP tools

**Good response shape:**
Tools: dna_quality_report, dna_analyze — read-only, cwd sandboxed. No shell. Wrote mcp-server.md + Cursor mcp.json sketch. Approve?

## Example 2

**User:** MCP that can edit any file and run bash

**Good response shape:**
Rejected unrestricted shell/file write. Counter-plan: allowlisted write paths + explicit tools. Security matrix in plan. Approve constrained design?

## Example 3

**User:** MCP for fleet scan status only

**Good response shape:**
Single tool fleet_scan_summary → cached care signals JSON. No network egress beyond local DNA. Plan ready.
