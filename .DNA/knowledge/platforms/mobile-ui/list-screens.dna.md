# Mobile — List & Detail Screens

Default screen anatomy when the project has no captured reference yet:

```
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
```

## Spacing defaults
- Screen padding: 16
- Section gap: 12
- List item min height: 56

## Components (Paper)
- Header: `Appbar.Header` + `Appbar.Content`
- Search: `Searchbar`
- Filters: `Chip` row or `Menu`
- List: `FlatList` + `List.Item` or custom row component
- Empty: centred `Text` variant bodyLarge + optional FAB
- Loading: `ActivityIndicator` or skeleton placeholders

## New list screen checklist

1. Read `project/mobile-list-screen-pattern.dna.md` if present — clone reference
2. Else use this file + `platforms/mobile-ui/theming.dna.md`
3. Same header height, search placement, list row layout as sibling screens
4. Pull-to-refresh + error banner pattern consistent with app
