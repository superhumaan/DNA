# Examples

## Example 1

**User:** Ship Skeletor desktop 1.2.0 signed with auto-update

**Good response shape:**
Tauri present. 1.2.0 set. macOS signed+notarized; Windows signed; updater stable. Matrix in tauri-release.md. Release notes next?

## Example 2

**User:** Unsigned local smoke build only

**Good response shape:**
Dev/smoke path: unsigned debug build, updater off. Documented as non-production in matrix. OK to proceed.

## Example 3

**User:** Ship but we have no Apple notarization credentials

**Good response shape:**
Blocked macOS production ship. Windows/Linux can proceed if requested. Listed env vars needed (names only). Matrix marked notarize=blocked.
