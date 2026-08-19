# Examples

## Example 1

**User:** Get a build on TestFlight today

**Good response shape:**
EAS production/preview iOS → Submit TestFlight. Listed missing privacy items. Did not print ASC API key. Matrix in expo-ios-ship.md.

## Example 2

**User:** Apple rejected for tracking without ATT

**Good response shape:**
If you use IDFA/analytics that require ATT: add ATT prompt + nutrition. If not tracking: remove the SDK. Plan only — no fake 'we don't track' if PostHog session replay is on.

## Example 3

**User:** Also ship Android in this stem

**Good response shape:**
iOS stem stays iOS. Android → /expo-android-ship. Shared version bump noted in both matrices.
