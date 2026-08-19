# Examples

## Example 1

**User:** Get this Lab CSS fix on preview

**Good response shape:**
Quality PASS (.DNA/reports/quality/…). Docker OK. Pushed main (trunk). CI preview running. No feature hop.

## Example 2

**User:** Preview even though quality failed

**Good response shape:**
Refused. 2 blockers in quality report. Fix first or explicitly override — not default.

## Example 3

**User:** We're split across two feature remotes — hop each to preview to test

**Good response shape:**
Refused. That dual-track hop is how we corrupt branches. Consolidate on trunk (or one short-lived branch you choose), then push once. Use /trunk-based-delivery.
