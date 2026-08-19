# Examples

## Example 1

**User:** We need TestFlight and Play internal testing

**Good response shape:**
preview profile: iOS ad-hoc/TestFlight, Android internal track AAB. production reserved for store. Matrix in expo-eas-build.md. EXPO_TOKEN stays in CI secrets.

## Example 2

**User:** Local release builds only

**Good response shape:**
Documented: eas build --local as optional; still need signing. Not the default. Production store path remains EAS.

## Example 3

**User:** iOS build fails code signing

**Good response shape:**
Did not print certs. Next: eas credentials (names), match bundle ID, regenerate profile. Matrix marked iOS=blocked.
