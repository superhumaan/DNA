import type { KnowledgePack } from "@superhumaan/dna-config";
import { stemPack } from "./bundled-catalog-helpers.js";

/** Mobile UI theming + list screen patterns — foundation layer for React Native / Expo projects. */
export const MOBILE_UI_PACK: KnowledgePack = stemPack(
  "platforms/mobile-ui",
  "Mobile UI",
  "platforms",
  "React Native / Expo theming and list screen patterns for DNA mobile projects",
  [
    {
      path: "platforms/mobile-ui/theming.dna.md",
      content: `# Mobile UI — Theming

DNA mobile projects standardise on a **single theme system** (React Native Paper by default).

## Default stack (Expo / React Native)
- \`react-native-paper\` — Material Design 3 components for RN
- \`expo-router\` — file-based navigation
- Theme: \`MD3LightTheme\` / \`MD3DarkTheme\` with brand overrides in \`theme.ts\`

## Rules
- One \`PaperProvider\` (or chosen library provider) at app root
- Colours and spacing from theme — no magic numbers in screens
- Shared components in \`components/ui/\` or \`packages/mobile-ui\`
- Safe area: \`SafeAreaView\` or \`useSafeAreaInsets\` on every screen

## Alternatives (if detected in repo)
- **Tamagui** — use tokens + themed components consistently
- **NativeBase / Gluestack** — follow library theme API, do not mix with Paper in same screen

## When no build rules exist

Use full Paper/MD3 defaults from \`platforms/mobile-ui/list-screens.dna.md\`.
`,
    },
    {
      path: "platforms/mobile-ui/list-screens.dna.md",
      content: `# Mobile — List & Detail Screens

Default screen anatomy when the project has no captured reference yet:

\`\`\`
┌─────────────────────────────┐
│ Screen header (title + act) │
├─────────────────────────────┤
│ Search bar                  │
│ Filter chips / dropdown     │
├─────────────────────────────┤
│ FlatList / SectionList      │
│  - pull to refresh          │
│  - empty state              │
├─────────────────────────────┤
│ Pagination / infinite scroll│
└─────────────────────────────┘
\`\`\`

## Spacing defaults
- Screen padding: 16
- Section gap: 12
- List item min height: 56

## Components (Paper)
- Header: \`Appbar.Header\` + \`Appbar.Content\`
- Search: \`Searchbar\`
- Filters: \`Chip\` row or \`Menu\`
- List: \`FlatList\` + \`List.Item\` or custom row component
- Empty: centred \`Text\` variant bodyLarge + optional FAB
- Loading: \`ActivityIndicator\` or skeleton placeholders

## New list screen checklist

1. Read \`project/mobile-list-screen-pattern.dna.md\` if present — clone reference
2. Else use this file + \`platforms/mobile-ui/theming.dna.md\`
3. Same header height, search placement, list row layout as sibling screens
4. Pull-to-refresh + error banner pattern consistent with app
`,
    },
  ],
);
