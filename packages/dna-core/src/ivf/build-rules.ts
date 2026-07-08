import fg from "fast-glob";
import { readFile } from "node:fs/promises";
import { join, basename } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { writeFileEnsured } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import { scanProject } from "../scanner.js";
import { analyzeMuiFoundation } from "./mui-foundation.js";

const SOURCE_GLOB = ["**/*.{ts,tsx,js,jsx}"];
const IGNORE = ["**/node_modules/**", "**/dist/**", "**/.DNA/**", "**/DNA/**", "**/.next/**", "**/build/**"];

const LIST_PAGE_SIGNALS: { id: string; pattern: RegExp }[] = [
  { id: "mui-data-grid", pattern: /@mui\/x-data-grid|DataGrid/ },
  { id: "mui-table", pattern: /@mui\/material\/Table|TableContainer|TableHead|TableBody/ },
  { id: "pagination", pattern: /TablePagination|Pagination|rowsPerPage|pageSize/ },
  { id: "search", pattern: /placeholder=["'`].*[Ss]earch|SearchIcon|handleSearch|onSearch/ },
  { id: "filter", pattern: /FilterList|Autocomplete|FormControl.*Select|filterBy|setFilter/ },
  { id: "page-title", pattern: /variant=["'`]h[4-6]["'`]|PageTitle|ListReportLayout|ReportLayout/ },
  { id: "toolbar", pattern: /PageToolbar|Toolbar|Stack.*direction=["'`]row["'`]/ },
  { id: "paper-table", pattern: /Paper.*outlined|variant=["'`]outlined["'`]/ },
];

const FEATURE_FOLDER_PATTERNS = [
  /^(apps\/[^/]+\/)?src\/features\/([^/]+)\//,
  /^(apps\/[^/]+\/)?src\/pages\/([^/]+)\//,
  /^src\/features\/([^/]+)\//,
  /^app\/([^/]+)\//,
  /^src\/modules\/([^/]+)\//,
];

export interface ListReportPageCandidate {
  path: string;
  score: number;
  signals: string[];
  hasSearch: boolean;
  hasFilter: boolean;
  hasTable: boolean;
  hasPagination: boolean;
  hasTitle: boolean;
}

export interface FeatureFolderPattern {
  template: string;
  examples: string[];
}

export interface FeaturePatternAnalysis {
  isWebProject: boolean;
  usesMui: boolean;
  muiPackages: string[];
  listReportPages: ListReportPageCandidate[];
  referenceListPage: ListReportPageCandidate | null;
  featureFolders: FeatureFolderPattern[];
  pagePadding: string | null;
  titleVariant: string | null;
  tableStyle: "data-grid" | "table" | "unknown";
}

export interface EnsureFeatureBuildingRulesOptions {
  root: string;
  quote?: string;
  force?: boolean;
}

export interface EnsureFeatureBuildingRulesResult {
  rulesPath: string;
  templatesPath: string;
  projectKnowledgePaths: string[];
  cursorRulePath: string | null;
  analysis: FeaturePatternAnalysis;
  skipped: boolean;
}

function isWebFrontend(frontend: string | null | undefined): boolean {
  if (!frontend) return false;
  return ["react", "next", "nextjs", "vue", "angular"].includes(frontend.toLowerCase());
}

async function detectMuiPackages(root: string): Promise<string[]> {
  const found = new Set<string>();
  for (const pkgFile of ["package.json", ...await fg(["apps/*/package.json", "packages/*/package.json"], { cwd: root, ignore: IGNORE })]) {
    try {
      const raw = await readFile(join(root, pkgFile), "utf-8");
      const pkg = JSON.parse(raw) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      for (const name of Object.keys(deps)) {
        if (name.startsWith("@mui/")) found.add(name);
      }
    } catch {
      /* ignore */
    }
  }
  return [...found].sort();
}

function scoreListPage(content: string, filePath: string): ListReportPageCandidate {
  const signals: string[] = [];
  let hasSearch = false;
  let hasFilter = false;
  let hasTable = false;
  let hasPagination = false;
  let hasTitle = false;

  for (const { id, pattern } of LIST_PAGE_SIGNALS) {
    if (pattern.test(content)) {
      signals.push(id);
      if (id === "search") hasSearch = true;
      if (id === "filter") hasFilter = true;
      if (id === "mui-data-grid" || id === "mui-table") hasTable = true;
      if (id === "pagination") hasPagination = true;
      if (id === "page-title") hasTitle = true;
    }
  }

  const nameBonus =
    /report|list|index|dashboard/i.test(basename(filePath)) || /\/(reports|lists)\//i.test(filePath) ? 2 : 0;

  return {
    path: filePath,
    score: signals.length + nameBonus,
    signals,
    hasSearch,
    hasFilter,
    hasTable,
    hasPagination,
    hasTitle,
  };
}

function detectFeatureFolders(files: string[]): FeatureFolderPattern[] {
  const map = new Map<string, Set<string>>();

  for (const file of files) {
    for (const pattern of FEATURE_FOLDER_PATTERNS) {
      const match = file.match(pattern);
      if (match) {
        const feature = match[2] ?? match[1];
        if (!feature || feature.includes(".")) continue;
        const template = file.replace(feature, "{feature}");
        const set = map.get(template) ?? new Set();
        set.add(feature);
        map.set(template, set);
      }
    }
  }

  return [...map.entries()]
    .map(([template, examples]) => ({ template, examples: [...examples].slice(0, 8) }))
    .sort((a, b) => b.examples.length - a.examples.length);
}

function extractLayoutTokens(content: string): { padding: string | null; titleVariant: string | null } {
  const paddingMatch = content.match(/sx=\{\{[^}]*\bp:\s*(\d+)/) ?? content.match(/padding:\s*theme\.spacing\((\d+)\)/);
  const titleMatch = content.match(/Typography[^>]*variant=["'`](h[4-6])["'`]/);
  return {
    padding: paddingMatch ? `theme.spacing(${paddingMatch[1]})` : null,
    titleVariant: titleMatch?.[1] ?? null,
  };
}

export async function analyzeFeaturePatterns(root: string): Promise<FeaturePatternAnalysis> {
  const config = await loadDnaConfig(root);
  const scan = await scanProject(root);
  const frontend = scan.frontend ?? config?.stack.frontend ?? null;
  const isWebProject = isWebFrontend(frontend);
  const muiPackages = await detectMuiPackages(root);
  const usesMui = muiPackages.length > 0;

  const files = await fg(SOURCE_GLOB, { cwd: root, ignore: IGNORE });
  const featureFolders = detectFeatureFolders(files);

  const pageCandidates: ListReportPageCandidate[] = [];
  let pagePadding: string | null = null;
  let titleVariant: string | null = null;
  let tableStyle: FeaturePatternAnalysis["tableStyle"] = "unknown";

  const pageFiles = files.filter(
    (f) =>
      f.endsWith(".tsx") &&
      (/page\.tsx$/i.test(f) ||
        /\/(pages|reports|lists|features)\//i.test(f) ||
        /Report|List|Index/.test(basename(f))),
  );

  for (const rel of pageFiles.slice(0, 150)) {
    let content: string;
    try {
      content = await readFile(join(root, rel), "utf-8");
    } catch {
      continue;
    }
    const candidate = scoreListPage(content, rel);
    if (candidate.score >= 3) {
      pageCandidates.push(candidate);
      const tokens = extractLayoutTokens(content);
      if (!pagePadding && tokens.padding) pagePadding = tokens.padding;
      if (!titleVariant && tokens.titleVariant) titleVariant = tokens.titleVariant;
      if (candidate.signals.includes("mui-data-grid")) tableStyle = "data-grid";
      else if (candidate.signals.includes("mui-table") && tableStyle === "unknown") tableStyle = "table";
    }
  }

  pageCandidates.sort((a, b) => b.score - a.score);
  const referenceListPage = pageCandidates[0] ?? null;

  return {
    isWebProject,
    usesMui,
    muiPackages,
    listReportPages: pageCandidates,
    referenceListPage,
    featureFolders,
    pagePadding: pagePadding ?? "theme.spacing(3)",
    titleVariant: titleVariant ?? "h5",
    tableStyle,
  };
}

function featureFolderSection(folders: FeatureFolderPattern[]): string {
  if (!folders.length) {
    return `## Folder structure

\`\`\`
src/features/{feature-name}/
├── index.ts
├── {FeatureName}Page.tsx
├── components/
├── hooks/
└── api.ts
\`\`\`

_New features use \`{feature-name}\` kebab-case folders. Pages export a single route component._
`;
  }

  const primary = folders[0]!;
  return `## Folder structure (detected)

**Template:** \`${primary.template}\`

Examples: ${primary.examples.map((e) => `\`${e}\``).join(", ")}

${folders
  .slice(1, 4)
  .map((f) => `- \`${f.template}\` — ${f.examples.slice(0, 3).join(", ")}`)
  .join("\n")}
`;
}

function buildProjectListReportKnowledge(analysis: FeaturePatternAnalysis, config: DnaConfig | null): string {
  const ref = analysis.referenceListPage;
  const project = config?.projectName ?? "project";

  return `# ${project} — List & Report Page Pattern

_Detected from codebase. DNA uses this as the canonical template for new reports/lists._

## Reference page

${ref ? `- **Copy this file:** \`${ref.path}\`` : "- _No project reference yet — use MUI foundation defaults from `tools/mui/list-report-pages.dna.md` in full_"}

${ref ? `Signals: ${ref.signals.join(", ")}` : ""}

## Layout contract

| Element | Value |
|---------|-------|
| Page padding | \`${analysis.pagePadding}\` |
| Title variant | \`${analysis.titleVariant}\` |
| Table style | \`${analysis.tableStyle}\` |
| Search | ${ref?.hasSearch ? "yes — match reference hook/debounce" : "required — TextField + SearchIcon"} |
| Filters | ${ref?.hasFilter ? "yes — reuse filter components from reference" : "required — FormControl/Select or Autocomplete"} |
| Pagination | ${ref?.hasPagination ? "yes — same rowsPerPage defaults" : "required — TablePagination"} |

## UI foundation (separate layer)

- **MUI theming** is configured by the MUI foundation layer — see \`mui-foundation-*.md\` plan and \`occipitalLobe/ui-patterns.md\`
- This file is **build rules only** — page layout patterns on top of MUI
- If no reference page: use \`tools/mui/list-report-pages.dna.md\` at full MUI defaults

## When user asks for a new report (e.g. "ABC Report")

1. Clone structure from reference page \`${ref?.path ?? "(see MUI template)"}\`
2. Title: **ABC Report** using \`Typography variant="${analysis.titleVariant}"\`
3. Same toolbar, search, filters, table chrome — **only columns and API change**
4. Place files in folder per feature-folder-structure.dna.md
5. Run \`dna validate\` — no duplicate layout components

## Other list pages in this project

${
  analysis.listReportPages.length > 1
    ? analysis.listReportPages
        .slice(1, 8)
        .map((p) => `- \`${p.path}\` (score ${p.score})`)
        .join("\n")
    : "_Only one candidate detected._"
}
`;
}

function buildFeatureFolderKnowledge(folders: FeatureFolderPattern[], config: DnaConfig | null): string {
  const project = config?.projectName ?? "project";
  return `# ${project} — Feature Folder Structure

${featureFolderSection(folders)}

## Rules for new features

- One folder per feature — no loose pages in \`components/\`
- Colocate: page, feature components, hooks, API client, types
- Export page from \`index.ts\` for clean imports
- Name reports/lists: \`{name}-report\` or \`{name}-list\` folder, \`{Name}ReportPage.tsx\` file
`;
}

function buildFeatureBuildingRules(
  analysis: FeaturePatternAnalysis,
  config: DnaConfig | null,
  quote?: string,
): string {
  const project = config?.projectName ?? "project";
  const ref = analysis.referenceListPage;

  return `# Feature Building Rules

_${project} — enforced by DNA for every new feature. AI tools must read this before creating pages._

## Principle

> **Never invent UI layout.** Clone existing patterns. New reports get the same title row, padding, search, filters, table, and pagination as existing pages.

## User requirement

${quote?.trim() || "All new frontend features must match established structure, MUI styling, and shared components."}

## On top of MUI foundation

- **Foundation layer:** MUI (separate) — theme, primitives, visual-standards.md
- **This layer:** project page patterns — clone reference or fall back to MUI list-report defaults
- **Page padding:** \`${analysis.pagePadding}\`
- **Page title:** \`Typography variant="${analysis.titleVariant}" component="h1"\`

## List / report pages (mandatory structure)

1. **PageTitle row** — title left, primary actions right (\`Stack direction="row" justifyContent="space-between"\`)
2. **Toolbar** — search field left, filters right, \`spacing={2}\`, \`mb: 2\`
3. **Table** — ${analysis.tableStyle === "data-grid" ? "MUI DataGrid in Paper" : "MUI Table in Paper variant=outlined"}
4. **Pagination** — TablePagination or DataGrid pagination — same default page sizes as reference
5. **States** — loading skeleton, empty message, error Alert above table

## Reference implementation

${ref ? `**\`${ref.path}\`** — copy this file when building any new list/report page.` : "_Run dna plan ivf after adding your first report page to capture a reference._"}

## New feature workflow

\`\`\`
User: "Create ABC Report"
AI:
  1. Read this file + project/list-report-pattern.dna.md
  2. Copy reference page → ABCReportPage.tsx
  3. Change: title, route, columns, API endpoint, filter fields
  4. Do NOT change: layout, spacing, colours, table chrome, pagination pattern
\`\`\`

## Feature folder

${analysis.featureFolders[0] ? `Use template: \`${analysis.featureFolders[0].template}\`` : "Use \`src/features/{feature-name}/\`"}

## Checklist (definition of done)

- [ ] Matches reference page layout pixel-for-pixel (spacing, typography)
- [ ] Uses shared UI imports — no new one-off table or title components
- [ ] Search and filters behave like reference (debounce, URL sync if reference does)
- [ ] Loading / empty / error states present
- [ ] Tests for render + empty state
- [ ] \`dna validate\` passes
`;
}

function buildFeatureTemplates(analysis: FeaturePatternAnalysis, packageName: string): string {
  const ref = analysis.referenceListPage;
  return `# Feature Templates

_Copy-paste starting points. Prefer cloning \`${ref?.path ?? "reference page"}\` over these generics._

## ListReportLayout usage

\`\`\`tsx
import { ListReportLayout, PageTitle, PageToolbar, DataTable } from "${packageName}";

export function AbcReportPage() {
  return (
    <ListReportLayout>
      <PageTitle title="ABC Report" actions={<ExportButton />} />
      <PageToolbar
        searchPlaceholder="Search ABC…"
        filters={<StatusFilter />}
      />
      <DataTable columns={abcColumns} rows={rows} loading={loading} />
    </ListReportLayout>
  );
}
\`\`\`

## MUI primitives (inside shared library only)

\`\`\`tsx
import { Box, Stack, Typography, TextField, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="${analysis.titleVariant}" component="h1">{title}</Typography>
      </Stack>
      {children}
    </Box>
  );
}
\`\`\`

## New report prompt for AI

> Create **{Name} Report** using the exact layout from \`${ref?.path ?? "list-report-pattern"}\`. Same title row, padding (${analysis.pagePadding}), search, filters, table structure, and pagination. Only change: title, columns, API, and filter fields.
`;
}

function buildCursorListReportRule(analysis: FeaturePatternAnalysis, config: DnaConfig | null): string {
  const project = config?.projectName ?? "project";
  const ref = analysis.referenceListPage?.path ?? ".DNA/knowledge/project/list-report-pattern.dna.md";

  return `---
description: List and report pages — build rules on top of MUI foundation
globs: ["**/*.{tsx,jsx}", "src/**/*", "app/**/*", "apps/**/*"]
---

# List & Report Pages — ${project}

**Before creating any list, report, or data table page:**

1. Read \`.DNA/CellularMemory/prefrontalCortex/feature-building-rules.md\`
2. Read \`.DNA/knowledge/project/list-report-pattern.dna.md\`
3. Open reference file: \`${ref}\` and **clone its structure**

## Non-negotiable

- MUI foundation must be loaded first (ui-patterns.md, visual-standards.md)
- Same page padding: \`${analysis.pagePadding}\`
- Same title variant: \`${analysis.titleVariant}\`
- Same search + filter toolbar layout
- Same table wrapper and pagination pattern
- Import shared components from project UI package — **never** create a one-off page layout

## Example

User asks: "Create ABC Report" → copy reference page, rename to AbcReportPage, change title to "ABC Report", update columns/API only.

**Do not** redesign spacing, colours, or table chrome.
`;
}

export async function ensureFeatureBuildingRules(
  options: EnsureFeatureBuildingRulesOptions,
): Promise<EnsureFeatureBuildingRulesResult> {
  const config = await loadDnaConfig(options.root);
  if (!config) {
    throw new Error("DNA not installed. Run `dna init` first.");
  }

  const analysis = await analyzeFeaturePatterns(options.root);
  const skipped = !analysis.isWebProject && !options.force;

  const rulesPath = join(
    options.root,
    ".DNA",
    "CellularMemory",
    "prefrontalCortex",
    "feature-building-rules.md",
  );
  const templatesPath = join(options.root, ".DNA", "CellularMemory", "occipitalLobe", "feature-templates.md");
  const listReportKnowledge = join(options.root, ".DNA", "knowledge", "project", "list-report-pattern.dna.md");
  const folderKnowledge = join(options.root, ".DNA", "knowledge", "project", "feature-folder-structure.dna.md");
  const cursorRulePath = join(options.root, ".cursor", "rules", "list-report-pages.mdc");

  if (!skipped) {
    await analyzeMuiFoundation(options.root);

    const packageName = `@${config.projectName.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}/ui`;

    await writeFileEnsured(rulesPath, buildFeatureBuildingRules(analysis, config, options.quote));
    await writeFileEnsured(templatesPath, buildFeatureTemplates(analysis, packageName));
    await writeFileEnsured(listReportKnowledge, buildProjectListReportKnowledge(analysis, config));
    await writeFileEnsured(folderKnowledge, buildFeatureFolderKnowledge(analysis.featureFolders, config));
    await writeFileEnsured(cursorRulePath, buildCursorListReportRule(analysis, config));
  }

  return {
    rulesPath,
    templatesPath,
    projectKnowledgePaths: [listReportKnowledge, folderKnowledge],
    cursorRulePath: skipped ? null : cursorRulePath,
    analysis,
    skipped,
  };
}

export function formatFeaturePatternSummary(analysis: FeaturePatternAnalysis): string {
  const lines = [
    "Feature Pattern Analysis",
    "========================",
    "",
    `Web project:      ${analysis.isWebProject ? "yes" : "no"}`,
    `MUI detected:     ${analysis.usesMui ? analysis.muiPackages.join(", ") : "no"}`,
    `List/report pages: ${analysis.listReportPages.length}`,
    `Reference page:   ${analysis.referenceListPage?.path ?? "none"}`,
    `Feature folders:  ${analysis.featureFolders.length} pattern(s)`,
    `Table style:      ${analysis.tableStyle}`,
    "",
  ];
  return lines.join("\n");
}
