import type { KnowledgePack } from "@superhumaan/dna-config";
import { stemPack } from "./bundled-catalog-helpers.js";

/** MUI patterns for consistent list/report pages — DNA default for web IVF projects. */
export const MUI_REPORT_PATTERN_PACK: KnowledgePack = stemPack(
  "tools/mui",
  "Material UI",
  "platforms",
  "Material UI + MUI X — theming, layout, list/report page patterns for DNA web projects",
  [
    {
      path: "tools/mui/positioning.dna.md",
      content: `# Material UI — Positioning

DNA web projects standardise on **Material UI (MUI)** for UI consistency.

## Stack
- \`@mui/material\` — components, theme, \`sx\` prop
- \`@mui/icons-material\` — icons (outlined preferred)
- \`@mui/x-data-grid\` — data tables when licence allows; else \`Table\` + \`TablePagination\`
- \`@emotion/react\` + \`@emotion/styled\` — default styling engine

## Rules
- **One theme** — \`ThemeProvider\` at app root; no ad-hoc colours outside theme palette
- **Shared library** — page shells and table primitives live in the project shared UI package
- **No duplicate page layouts** — new reports/lists compose \`ListReportLayout\`, never reinvent
- Import UI from the project shared package first; MUI primitives only inside that package

## Do not
- Mix Tailwind utility layout with MUI page shells in the same feature
- Create one-off \`Table\` implementations when \`DataTable\` exists
- Hardcode hex colours — use \`theme.palette\` and \`theme.spacing\`
`,
    },
    {
      path: "tools/mui/list-report-pages.dna.md",
      content: `# MUI — List & Report Pages

Every list/report page in this project follows the **same structure**. When asked for a new report (e.g. "ABC Report"), replicate this layout exactly — only data columns and filters change.

## Page anatomy (top to bottom)

\`\`\`
┌─────────────────────────────────────────────────────────┐
│ PageTitle row          [actions: Export, Create, …]     │
├─────────────────────────────────────────────────────────┤
│ Toolbar: Search (left)  |  Filters (right)              │
├─────────────────────────────────────────────────────────┤
│ DataTable / DataGrid                                    │
├─────────────────────────────────────────────────────────┤
│ TablePagination (rows per page, page controls)          │
└─────────────────────────────────────────────────────────┘
\`\`\`

## Spacing & layout (defaults — override only if project pattern differs)

| Element | MUI pattern |
|---------|-------------|
| Page container | \`<Box sx={{ p: 3 }}>\` or \`Container maxWidth="xl"\` |
| Title row | \`<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>\` |
| Page title | \`<Typography variant="h5" component="h1">\` |
| Toolbar | \`<Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap">\` |
| Search | \`<TextField size="small" placeholder="Search…" InputProps={{ startAdornment: <SearchIcon /> }} />\` |
| Filters | \`<FormControl size="small"><Select>…</Select></FormControl>\` or \`Autocomplete\` |
| Table wrapper | \`<Paper variant="outlined" sx={{ width: '100%', overflow: 'hidden' }}>\` |
| Pagination | \`<TablePagination component="div" rowsPerPageOptions={[10, 25, 50]} />\` |

## Shared components (import from project UI package)

\`\`\`tsx
import {
  ListReportLayout,
  PageTitle,
  PageToolbar,
  DataTable,
} from "@<scope>/ui";
\`\`\`

If shared components do not exist yet, scaffold them once in the shared library — then reuse forever.

## New report checklist

When creating **ABC Report**:

1. Read \`.DNA/knowledge/project/list-report-pattern.dna.md\` — copy the reference page
2. Read \`.DNA/CellularMemory/prefrontalCortex/feature-building-rules.md\`
3. Create folder per \`project/feature-folder-structure.dna.md\`
4. Compose \`ListReportLayout\` with title "ABC Report"
5. Wire search to the same debounce/hook pattern as reference page
6. Reuse filter components (date range, status select) — same props API
7. Define columns only — table chrome is shared
8. Pagination: same \`rowsPerPage\` default and server-side pattern as reference
9. Loading / empty / error states — same skeleton and \`Alert\` placement

## States (required on every list page)

- **Loading:** \`Skeleton\` rows or \`DataGrid loading\` prop
- **Empty:** centred \`Typography color="text.secondary"\` + optional CTA
- **Error:** \`Alert severity="error"\` above table, retry action
- **No results (filtered):** distinct copy from true empty state

## AI rule

> If the user asks for a new report or list page, **do not invent layout**. Clone the reference page structure from project knowledge and change only: route, title, columns, filter fields, and API endpoint.
`,
    },
    {
      path: "tools/mui/theming.dna.md",
      content: `# MUI — Theming

- Define \`createTheme({ palette, typography, spacing, components })\` once
- Override component defaults in \`theme.components\` (e.g. \`MuiButton.defaultProps\`)
- Use \`theme.spacing(n)\` — default page padding is \`spacing(3)\` (24px)
- Typography: page titles \`h5\`, section headers \`h6\`, body \`body1\`, table cells \`body2\`
- Document token choices in \`.DNA/CellularMemory/occipitalLobe/visual-standards.md\`
`,
    },
  ],
);
