# Material UI — Positioning

DNA web projects standardise on **Material UI (MUI)** for UI consistency.

## Stack
- `@mui/material` — components, theme, `sx` prop
- `@mui/icons-material` — icons (outlined preferred)
- `@mui/x-data-grid` — data tables when licence allows; else `Table` + `TablePagination`
- `@emotion/react` + `@emotion/styled` — default styling engine

## Rules
- **One theme** — `ThemeProvider` at app root; no ad-hoc colours outside theme palette
- **Shared library** — page shells and table primitives live in the project shared UI package
- **No duplicate page layouts** — new reports/lists compose `ListReportLayout`, never reinvent
- Import UI from the project shared package first; MUI primitives only inside that package

## Do not
- Mix Tailwind utility layout with MUI page shells in the same feature
- Create one-off `Table` implementations when `DataTable` exists
- Hardcode hex colours — use `theme.palette` and `theme.spacing`
