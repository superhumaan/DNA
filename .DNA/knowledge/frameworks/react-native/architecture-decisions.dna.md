# Expo — Architecture decisions

Write an ADR before scaffolding. Stems: `/expo-architect`, `/expo-workflow-decision`.

## Must decide
1. Expo Go vs **dev client** vs bare/CNG-owned native
2. Expo Router vs React Navigation
3. BFF vs direct BaaS vs public API
4. OTA policy (`runtimeVersion`) vs store binary
5. iOS vs Android deltas (permissions, back, stores)

## Never
- Use Expo Go for custom native modules or production-like push
- Collapse iOS and Android into one “mobile” checklist
- Invent a second UI kit when `platforms/mobile-ui` exists
