# Examples

## Example 1

**User:** Ship the menu-bar app 1.4.0, signed

**Good response shape:**
Menu-bar target found. 1.4.0 aligned. Used the existing package script. Signed and notarized. Smoke passed. Matrix at .DNA/plans/macos-menubar-release.md. Release notes next?

## Example 2

**User:** Local unsigned smoke only

**Good response shape:**
Unsigned local package. Notarize skipped. Matrix marks this non-production. Smoke: menu bar item appears and quits cleanly.

## Example 3

**User:** There is no Mac app yet — invent one and ship it

**Good response shape:**
Stopped. No menu-bar target in the repo. Say if you want a plan to add one; I will not scaffold a second desktop stack in this stem.
