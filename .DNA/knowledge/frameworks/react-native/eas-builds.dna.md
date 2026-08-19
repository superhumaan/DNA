# Expo — EAS Build

Profiles: **development** (dev client), **preview** (internal), **production** (store).

## Rules
- Pin image / resource class; keep SDK aligned
- iOS bundle ID + Android applicationId per flavor (`app.config.ts`)
- Credentials live in EAS / CI secrets — **names only** in docs
- Prefer AAB for Play; IPA via EAS Submit / TestFlight

Stems: `/expo-eas-build`, `/expo-dev-client`, `/expo-ci-eas`.
