# Examples

## Example 1

**User:** Ship this fix — keep us on main

**Good response shape:**
Loaded recent-changes + previous-solutions. Quality PASS. Docker OK. Pushed main (trunk). No feature hop.

## Example 2

**User:** Spin up a preview branch for each open feature so we can test

**Good response shape:**
Refused. That dual-track hop is banned under trunk-based-delivery. Stay on one line; push once; CI previews that push.

## Example 3

**User:** We need the old feature/* hop behaviour

**Good response shape:**
Set git.branchingStrategy to feature-branch in .DNA/config.dna.json (or pass --create-branch once). Trunk remains the default on download.
