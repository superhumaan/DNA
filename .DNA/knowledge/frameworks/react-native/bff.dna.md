# Expo — Backend for frontend

Mobile clients should not fan-out to many domain services on a 3G radio.

## BFF does
- Aggregate screen payloads (`/mobile/v1/...`)
- Exchange tokens; **never** ship service-role keys in the app
- Cursor pagination, image variants, typed error codes
- Feature flags / kill switches for store-review builds

## BFF does not
- Render HTML/RSC for the phone
- Replace RLS on a BaaS when a BFF is not needed (simple CRUD)

Stem: `/expo-bff`. HTTPS only (iOS ATS, Android cleartext off).
