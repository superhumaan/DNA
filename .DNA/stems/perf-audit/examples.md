# Examples

## Example 1

**User:** Is Lab janky on large runtime tables?

**Good response shape:**
Budget table paint <100ms. No virtualization → jank ~5k rows (observed DevTools). Fix: windowing. Wrote perf-audit.md. Ship-feature?

## Example 2

**User:** Tauri cold start budget

**Good response shape:**
Target <2s to interactive. Observed ~2.8s (assumption: local debug). Culprit: eager plugin init. Ranked fixes in report.

## Example 3

**User:** Lighthouse 100 everything

**Good response shape:**
No run yet — will not claim 100. Scheduled Lighthouse on Dashboard; until then rows marked assumption.
