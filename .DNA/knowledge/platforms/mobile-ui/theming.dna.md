# Mobile UI — Theming

DNA mobile projects standardise on a **single theme system** (React Native Paper by default).

## Default stack (Expo / React Native)
- `react-native-paper` — Material Design 3 components for RN
- `expo-router` — file-based navigation
- Theme: `MD3LightTheme` / `MD3DarkTheme` with brand overrides in `theme.ts`

## Rules
- One `PaperProvider` (or chosen library provider) at app root
- Colours and spacing from theme — no magic numbers in screens
- Shared components in `components/ui/` or `packages/mobile-ui`
- Safe area: `SafeAreaView` or `useSafeAreaInsets` on every screen

## Alternatives (if detected in repo)
- **Tamagui** — use tokens + themed components consistently
- **NativeBase / Gluestack** — follow library theme API, do not mix with Paper in same screen

## When no build rules exist

Use full Paper/MD3 defaults from `platforms/mobile-ui/list-screens.dna.md`.
