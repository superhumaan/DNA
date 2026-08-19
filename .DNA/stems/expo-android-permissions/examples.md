# Examples

## Example 1

**User:** Push notifications on Android 14

**Good response shape:**
POST_NOTIFICATIONS runtime on first meaningful event, not app start. FCM via expo-notifications. Matrix written.

## Example 2

**User:** We need location always on

**Good response shape:**
Challenge: background location needs a strong Play justification. Recommend foreground-only unless the product is tracking-as-a-feature. Block ‘always’ by default.

## Example 3

**User:** Reuse the iOS camera copy

**Good response shape:**
Rationale can match product, but Android uses runtime dialogs + possibly photo picker. Separate strings in the Android matrix.
