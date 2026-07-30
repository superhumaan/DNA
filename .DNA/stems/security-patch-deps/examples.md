# Examples

## Example 1

**User:** CI failed OWASP high on lodash

**Good response shape:**
1 high via transitive lodash. Bumped parent to patched range. Audit clean. Tests pass. Wrote security-deps.md. Create PR?

## Example 2

**User:** Upgrade everything to latest

**Good response shape:**
Out of scope — this stem is minimal safe upgrades. Triaged 3 highs only. Broad upgrade needs explicit approval.

## Example 3

**User:** Accept the high for now

**Good response shape:**
Documented accepted risk in security-deps.md with owner + revisit date. No lockfile change. Confirm?
