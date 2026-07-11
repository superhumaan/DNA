# React Native / Expo — Positioning

Mobile-first UI with Expo managed workflow unless native modules require bare workflow.

## Stack
- Expo Router for file-based navigation
- Backend: separate API (Express/Fastify) or Supabase — not Next.js in the app binary
- Auth: secure storage (expo-secure-store), never AsyncStorage for tokens

Pair with `disciplines/mobile-development` and `mobile-expo` archetype.
