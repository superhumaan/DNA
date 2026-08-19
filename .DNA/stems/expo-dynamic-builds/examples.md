# Examples

## Example 1

**User:** Push a hotfix to production without the stores

**Good response shape:**
If JS-only and runtimeVersion matches production binaries: EAS Update to production channel + monitor. If you added a permission — blocked. Policy in expo-dynamic-builds.md.

## Example 2

**User:** Enable updates on a brand-new app

**Good response shape:**
Plan: fingerprint runtimeVersion, channels preview+production, disable updates until first store binary exists. Then OTA is allowed.

## Example 3

**User:** Android got the update, iOS didn't

**Good response shape:**
Debug: channel, runtimeVersion, and binary age per platform. Do not ‘fix’ by shipping a different JS bundle per OS unless native diverged. Documented investigation steps.
