# Examples

## Example 1

**User:** We put the JWT in AsyncStorage

**Good response shape:**
P1. Migrate to expo-secure-store, clear old keys, rotate refresh tokens if this reached production. Plan in expo-auth.md.

## Example 2

**User:** Face ID to open the app

**Good response shape:**
Optional local gate after secure-store hydrate. Server session still required. Fallback passcode. iOS + Android biometry APIs via expo-local-authentication.

## Example 3

**User:** Keep tokens in memory only

**Good response shape:**
OK for access token; refresh still needs secure storage or user re-login every cold start. Documented trade-off.
