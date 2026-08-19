# Examples

## Example 1

**User:** Notify when a job is assigned

**Good response shape:**
BFF sends Expo/FCM message with jobId only. Client opens /jobs/[id]. Android channel ‘jobs’. Plan in expo-notifications.md.

## Example 2

**User:** Include patient name in the push

**Good response shape:**
No. Title/body generic; fetch PHI in-app after auth. Healthcare legal stem if needed.

## Example 3

**User:** Works in Expo Go

**Good response shape:**
Go has limited push. Production needs a dev/prod binary + credentials. Next: expo-dev-client.
