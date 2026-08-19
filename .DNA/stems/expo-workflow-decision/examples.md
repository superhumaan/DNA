# Examples

## Example 1

**User:** We're on Expo Go but need bluetooth

**Good response shape:**
Go cannot ship custom native BLE. Decision: expo-dev-client + EAS development profile. OTA still OK after first binary. Wrote expo-workflow.md.

## Example 2

**User:** Keep managed workflow, never check in native folders

**Good response shape:**
CNG: prebuild on EAS only. Local: npx expo run:ios against a dev client. Documented as policy in expo-workflow.md.

## Example 3

**User:** We have a forked react-native-maps

**Good response shape:**
Bare/CNG with a config plugin or autolinking. Dev client required. Flag: OTA cannot update the native maps fork — binary bump on each native change.
