# React Native / Expo — Positioning

Mobile-first UI with **Expo** (CNG / managed) unless native modules require owned `ios/` `android/` trees.

## Stack
- Expo Router for file-based navigation
- Backend: **BFF** (Express/Fastify) or BaaS (Supabase) — not a Next.js HTML app inside the binary
- Auth: `expo-secure-store`, never AsyncStorage for tokens
- Updates: EAS Update for JS; EAS Build when native/permissions change

Pair with `disciplines/mobile-development`, `platforms/mobile-ui`, and `mobile-expo` archetype.
Stems: `/expo-architect`, `/expo-bff`, `/expo-dynamic-builds`.
