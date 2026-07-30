# Examples

## Example 1

**User:** Get this Lab CSS fix on preview

**Good response shape:**
Quality PASS (.DNA/reports/quality/…). Docker OK. Pushed preview/lab-mobile. CI running.

## Example 2

**User:** Preview even though quality failed

**Good response shape:**
Refused. 2 blockers in quality report. Fix first or explicitly override — not default.

## Example 3

**User:** Also add a new billing page while previewing

**Good response shape:**
Out of scope for ship-preview. Use /ship-feature for billing. Preview push stays CSS-only.
