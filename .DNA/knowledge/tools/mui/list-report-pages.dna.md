# MUI — List & Report Pages

Every list/report page in this project follows the **same structure**. When asked for a new report (e.g. "ABC Report"), replicate this layout exactly — only data columns and filters change.

## Page anatomy (top to bottom)

```
┌─────────────────────────────────────────────────────────┐
│ PageTitle row          [actions: Export, Create, …]     │
├─────────────────────────────────────────────────────────┤
│ Toolbar: Search (left)  |  Filters (right)              │
├─────────────────────────────────────────────────────────┤
│ DataTable / DataGrid                                    │
├─────────────────────────────────────────────────────────┤
│ TablePagination (rows per page, page controls)          │
└─────────────────────────────────────────────────────────┘
```

## Spacing & layout (defaults — override only if project pattern differs)

| Element | MUI pattern |
|---------|-------------|
| Page container | `<Box sx={{ p: 3 }}>` or `Container maxWidth="xl"` |
| Title row | `<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>` |
| Page title | `<Typography variant="h5" component="h1">` |
| Toolbar | `<Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap">` |
| Search | `<TextField size="small" placeholder="Search…" InputProps={{ startAdornment: <SearchIcon /> }} />` |
| Filters | `<FormControl size="small"><Select>…</Select></FormControl>` or `Autocomplete` |
| Table wrapper | `<Paper variant="outlined" sx={{ width: '100%', overflow: 'hidden' }}>` |
| Pagination | `<TablePagination component="div" rowsPerPageOptions={[10, 25, 50]} />` |

## Shared components (import from project UI package)

```tsx
import {
  ListReportLayout,
  PageTitle,
  PageToolbar,
  DataTable,
} from "@<scope>/ui";
```

If shared components do not exist yet, scaffold them once in the shared library — then reuse forever.

## New report checklist

When creating **ABC Report**:

1. Read `.DNA/knowledge/project/list-report-pattern.dna.md` — copy the reference page
2. Read `.DNA/CellularMemory/prefrontalCortex/feature-building-rules.md`
3. Create folder per `project/feature-folder-structure.dna.md`
4. Compose `ListReportLayout` with title "ABC Report"
5. Wire search to the same debounce/hook pattern as reference page
6. Reuse filter components (date range, status select) — same props API
7. Define columns only — table chrome is shared
8. Pagination: same `rowsPerPage` default and server-side pattern as reference
9. Loading / empty / error states — same skeleton and `Alert` placement

## States (required on every list page)

- **Loading:** `Skeleton` rows or `DataGrid loading` prop
- **Empty:** centred `Typography color="text.secondary"` + optional CTA
- **Error:** `Alert severity="error"` above table, retry action
- **No results (filtered):** distinct copy from true empty state

## AI rule

> If the user asks for a new report or list page, **do not invent layout**. Clone the reference page structure from project knowledge and change only: route, title, columns, filter fields, and API endpoint.
