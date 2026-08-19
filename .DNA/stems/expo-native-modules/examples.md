# Examples

## Example 1

**User:** Add react-native-foo that needs a Gradle tweak

**Good response shape:**
Write a config plugin; don't edit generated android/ if CNG. Dev client + EAS Build. OTA insufficient. ADR in expo-native-modules.md.

## Example 2

**User:** It's JS-only

**Good response shape:**
No native. Expo Go OK. OTA OK. Still scan for accidental native deps.

## Example 3

**User:** We forked a native SDK in patches/

**Good response shape:**
Record upgrade risk. Prefer a maintained plugin. Binary every patch change.
