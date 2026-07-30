# Examples

## Example 1

**User:** 502s on /api/admin/users since yesterday

**Good response shape:**
Fingerprint matches #88. Cause: requireAdmin NPE on missing session. Fix + test. Quality PASS. Pushed preview. Postmortem at .DNA/reports/incidents/….md.

## Example 2

**User:** Same error as last week

**Good response shape:**
Matched repeated-failures.md entry. Reopened pattern — fix was incomplete. Extended regression. Commented on existing issue #88 — no duplicate.

## Example 3

**User:** Just silence the toast

**Good response shape:**
Refused symptom-only patch. Root cause still 502 from origin. Investigating /health + deploy config per gateway guidance.
