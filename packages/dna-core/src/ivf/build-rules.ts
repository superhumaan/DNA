import { glob } from "../glob.js";
import { readFile } from "node:fs/promises";
import { join, basename, dirname, resolve } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { writeFileEnsured, fileExists } from "../fs.js";
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
  { id: "list-page-shell", pattern: /ListPageShell|HumaanPageShell|ListPageFilter|ListPageSearchField/ },
];

const FEATURE_FOLDER_PATTERNS = [
  /^(packages\/[^/]+\/)?src\/([^/]+)\//,
  /^(apps\/[^/]+\/)?src\/features\/([^/]+)\//,
  /^(apps\/[^/]+\/)?src\/pages\/([^/]+)\//,
  /^(apps\/[^/]+\/)?src\/([^/]+)\//,
  /^src\/features\/([^/]+)\//,
  /^app\/([^/]+)\//,
  /^src\/modules\/([^/]+)\//,
];

const DOMAIN_MODULE_EXCLUDED = new Set([
  "components",
  "hooks",
  "utils",
  "lib",
  "types",
  "test",
  "tests",
  "__tests__",
  "fixtures",
  "mocks",
  "assets",
  "styles",
  "constants",
  "config",
  "generated",
  "pages",
  "workspace",
  "company",
  "admin",
  "reporting",
  "routes",
  "services",
  "api",
  "contexts",
  "theme",
  "layouts",
  "shared",
]);

const DOMAIN_MODULE_FILE_SIGNALS: { id: string; pattern: RegExp }[] = [
  { id: "plan", pattern: /\/plan\.(ts|tsx)$/ },
  { id: "context", pattern: /\/context\.(ts|tsx)$/ },
  { id: "index", pattern: /\/index\.(ts|tsx)$/ },
  { id: "test", pattern: /\.(test|spec)\.(ts|tsx)$/ },
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

export interface DomainModuleCandidate {
  path: string;
  moduleName: string;
  files: string[];
  score: number;
  signals: string[];
  hasTests: boolean;
}

export type FeatureProjectKind = "web-ui" | "library" | "mixed";

export interface FeaturePatternAnalysis {
  isWebProject: boolean;
  usesMui: boolean;
  muiPackages: string[];
  listReportPages: ListReportPageCandidate[];
  referenceListPage: ListReportPageCandidate | null;
  featureFolders: FeatureFolderPattern[];
  domainModules: DomainModuleCandidate[];
  referenceModule: DomainModuleCandidate | null;
  projectKind: FeatureProjectKind;
  structureCaptured: boolean;
  scanRoots: string[];
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

function isUiSourceFile(filePath: string): boolean {
  return /\.(tsx|jsx)$/.test(filePath);
}

function isListPageFile(filePath: string): boolean {
  return (
    isUiSourceFile(filePath) &&
    (/page\.(tsx|jsx)$/i.test(filePath) ||
      /\/(pages|reports|lists|features)\//i.test(filePath) ||
      /(Report|List|Index)Page\.(tsx|jsx)$/i.test(filePath) ||
      /Report|List/.test(basename(filePath)))
  );
}

function isWebFrontend(frontend: string | null | undefined): boolean {
  if (!frontend) return false;
  return ["react", "next", "nextjs", "vue", "angular"].includes(frontend.toLowerCase());
}

async function findWorkspaceRoot(root: string): Promise<string | null> {
  let current = resolve(root);
  for (let depth = 0; depth < 6; depth++) {
    for (const marker of ["pnpm-workspace.yaml", "turbo.json", "nx.json", "lerna.json"]) {
      if (await fileExists(join(current, marker))) return current;
    }

    const pkgPath = join(current, "package.json");
    if (await fileExists(pkgPath)) {
      try {
        const pkg = JSON.parse(await readFile(pkgPath, "utf-8")) as {
          workspaces?: string[] | { packages: string[] };
        };
        const workspaces = Array.isArray(pkg.workspaces) ? pkg.workspaces : pkg.workspaces?.packages;
        if (workspaces?.length) return current;
      } catch {
        /* ignore */
      }
    }

    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return null;
}

async function resolveScanRoots(root: string): Promise<string[]> {
  const resolvedRoot = resolve(root);
  const roots = new Set<string>([resolvedRoot]);
  const workspaceRoot = await findWorkspaceRoot(resolvedRoot);
  if (workspaceRoot && workspaceRoot !== resolvedRoot) roots.add(workspaceRoot);
  return [...roots];
}

function hasWebUiSource(files: string[]): boolean {
  return files.some(
    (f) =>
      isUiSourceFile(f) &&
      (/\/(pages|features|app|components|routes|views)\//i.test(f) ||
        /Page\.(tsx|jsx)$/i.test(f) ||
        /Report|List/.test(basename(f))),
  );
}

function detectWebProject(
  frontend: string | null | undefined,
  usesMui: boolean,
  files: string[],
  pageCandidates: ListReportPageCandidate[],
): boolean {
  if (!isWebFrontend(frontend)) return false;
  if (usesMui || pageCandidates.length > 0) return true;
  return hasWebUiSource(files);
}

function inferProjectKind(
  isWebProject: boolean,
  referenceListPage: ListReportPageCandidate | null,
  referenceModule: DomainModuleCandidate | null,
): FeatureProjectKind {
  if (referenceListPage && referenceModule) return "mixed";
  if (referenceListPage || isWebProject) return "web-ui";
  return "library";
}

export function hasStructureRules(analysis: Pick<
  FeaturePatternAnalysis,
  "referenceListPage" | "referenceModule" | "featureFolders" | "structureCaptured"
>): boolean {
  return (
    analysis.structureCaptured ||
    !!analysis.referenceListPage ||
    !!analysis.referenceModule ||
    analysis.featureFolders.length > 0
  );
}

function scoreDomainModule(modulePath: string, files: string[]): DomainModuleCandidate {
  const signals: string[] = [];
  let hasTests = false;

  for (const file of files) {
    for (const { id, pattern } of DOMAIN_MODULE_FILE_SIGNALS) {
      if (pattern.test(file) && !signals.includes(id)) {
        signals.push(id);
        if (id === "test") hasTests = true;
      }
    }
  }

  const implFiles = files.filter(
    (f) => !/\.(test|spec)\.(ts|tsx|js|jsx)$/.test(f) && !f.endsWith(".d.ts"),
  );
  const moduleName = modulePath.split("/").pop() ?? modulePath;
  const depth = modulePath.split("/").length;
  const nameBonus = /^(ivf|compliance|rbac|platform|marketplace|quality|surveys|survey)/i.test(moduleName) ? 2 : 0;
  const depthBonus = depth >= 3 ? 2 : 0;

  const score =
    Math.min(implFiles.length, 8) +
    (hasTests ? 3 : 0) +
    (signals.includes("plan") ? 2 : 0) +
    (signals.includes("context") ? 2 : 0) +
    (signals.includes("index") ? 1 : 0) +
    (signals.includes("plan") && signals.includes("context") && hasTests ? 4 : 0) +
    nameBonus +
    depthBonus;

  return {
    path: modulePath,
    moduleName,
    files: files.slice(0, 12),
    score,
    signals,
    hasTests,
  };
}

function detectDomainModules(files: string[]): DomainModuleCandidate[] {
  const moduleFiles = new Map<string, string[]>();

  for (const file of files) {
    if (!/\.(ts|tsx|js|jsx)$/.test(file)) continue;

    const match =
      file.match(/^(packages\/[^/]+\/src\/[^/]+\/[^/]+)\//) ??
      file.match(/^(apps\/[^/]+\/src\/[^/]+\/[^/]+)\//) ??
      file.match(/^(src\/[^/]+\/[^/]+)\//) ??
      file.match(/^(packages\/[^/]+\/src\/[^/]+)\//) ??
      file.match(/^(apps\/[^/]+\/src\/[^/]+)\//) ??
      file.match(/^(src\/[^/]+)\//);

    if (!match) continue;

    const modulePath = match[1]!;
    const moduleName = modulePath.split("/").pop() ?? modulePath;
    if (DOMAIN_MODULE_EXCLUDED.has(moduleName) || moduleName.startsWith(".")) continue;

    const list = moduleFiles.get(modulePath) ?? [];
    list.push(basename(file));
    moduleFiles.set(modulePath, list);
  }

  return [...moduleFiles.entries()]
    .filter(([, moduleFileNames]) => moduleFileNames.length >= 2)
    .map(([modulePath, moduleFileNames]) => scoreDomainModule(modulePath, moduleFileNames))
    .filter((candidate) => candidate.score >= 3)
    .sort((a, b) => b.score - a.score);
}

async function detectMuiPackages(root: string): Promise<string[]> {
  const found = new Set<string>();
  for (const pkgFile of ["package.json", ...await glob(["apps/*/package.json", "packages/*/package.json"], { cwd: root, ignore: IGNORE })]) {
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
  const paddingMatch =
    content.match(/sx=\{\{[^}]*\bp:\s*(\d+)/) ??
    content.match(/padding:\s*theme\.spacing\((\d+)\)/) ??
    content.match(/ListPageShell|HumaanPageShell/);
  const titleMatch = content.match(/Typography[^>]*variant=["'`](h[4-6])["'`]/);
  return {
    padding: paddingMatch?.[1] ? `theme.spacing(${paddingMatch[1]})` : paddingMatch ? "ListPageShell/HumaanPageShell" : null,
    titleVariant: titleMatch?.[1] ?? null,
  };
}

export async function analyzeFeaturePatterns(root: string): Promise<FeaturePatternAnalysis> {
  const config = await loadDnaConfig(root);
  const scan = await scanProject(root);
  const frontend = scan.frontend ?? config?.stack.frontend ?? null;
  const scanRoots = await resolveScanRoots(root);
  const muiPackages = await detectMuiPackages(root);
  const usesMui = muiPackages.length > 0;

  const filesByRoot = await Promise.all(
    scanRoots.map(async (scanRoot) => ({
      scanRoot,
      files: await glob(SOURCE_GLOB, { cwd: scanRoot, ignore: IGNORE }),
    })),
  );

  const fileOrigins = new Map<string, string>();
  for (const { scanRoot, files: rootFiles } of filesByRoot) {
    for (const rel of rootFiles) {
      if (!fileOrigins.has(rel) || scanRoot === resolve(root)) fileOrigins.set(rel, scanRoot);
    }
  }
  const files = [...fileOrigins.keys()];
  const featureFolders = detectFeatureFolders(files);
  const domainModules = detectDomainModules(files);
  const referenceModule = domainModules[0] ?? null;

  const pageCandidates: ListReportPageCandidate[] = [];
  let pagePadding: string | null = null;
  let titleVariant: string | null = null;
  let tableStyle: FeaturePatternAnalysis["tableStyle"] = "unknown";

  const pageFiles = files.filter((f) => isListPageFile(f));

  for (const rel of pageFiles.slice(0, 150)) {
    const absRoot = fileOrigins.get(rel) ?? resolve(root);
    let content: string;
    try {
      content = await readFile(join(absRoot, rel), "utf-8");
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
  const isWebProject = detectWebProject(frontend, usesMui, files, pageCandidates);
  const projectKind = inferProjectKind(isWebProject, referenceListPage, referenceModule);
  const structureCaptured = !!referenceListPage || !!referenceModule || featureFolders.length > 0;

  return {
    isWebProject,
    usesMui,
    muiPackages,
    listReportPages: pageCandidates,
    referenceListPage,
    featureFolders,
    domainModules,
    referenceModule,
    projectKind,
    structureCaptured,
    scanRoots,
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

function buildFeatureFolderKnowledge(
  folders: FeatureFolderPattern[],
  analysis: FeaturePatternAnalysis,
  config: DnaConfig | null,
): string {
  const project = config?.projectName ?? "project";
  const refModule = analysis.referenceModule;
  const moduleSection = refModule
    ? `## Reference module (detected)

Clone folder layout from \`${refModule.path}/\`:

- Files in reference: ${refModule.files.map((f) => `\`${f}\``).join(", ")}
- Signals: ${refModule.signals.join(", ") || "implementation files"}
- Include co-located tests when reference has them (${refModule.hasTests ? "yes" : "add tests"})
`
    : "";

  return `# ${project} — Feature Folder Structure

${featureFolderSection(folders)}

${moduleSection}

## Rules for new features

- One folder per feature — no loose pages in \`components/\`
- Colocate: page or module entry, feature components, hooks, API client, types
- Export public surface from \`index.ts\` when the reference module does
- Match file naming from the reference module (\`plan.ts\`, \`context.ts\`, \`*.test.ts\`)
- Name reports/lists: \`{name}-report\` or \`{name}-list\` folder, \`{Name}ReportPage.tsx\` file
`;
}

function structureRulesSection(analysis: FeaturePatternAnalysis): string {
  const refModule = analysis.referenceModule;
  if (!refModule) return "";

  const fileList = refModule.files.map((f) => `- \`${f}\``).join("\n");
  return `## Code structure (detected from existing project)

> **Never invent folder or file layout.** Clone the reference module below. New features reuse the same file types, naming, and colocation — only domain logic changes.

**Reference module:** \`${refModule.path}/\`

Typical files:
${fileList}

### New feature workflow (structure-first)

\`\`\`
User: "Add billing vertical"
AI:
  1. Read this file + project/feature-folder-structure.dna.md
  2. Copy folder layout from ${refModule.path}/
  3. Create packages/.../src/billing/ with the same file types (plan.ts, context.ts, tests, etc.)
  4. Wire exports the same way the reference module does
  5. Do NOT invent a new folder convention
\`\`\`
`;
}

function webUiRulesSection(analysis: FeaturePatternAnalysis): string {
  if (!analysis.isWebProject && !analysis.referenceListPage) return "";

  const ref = analysis.referenceListPage;
  return `## On top of MUI foundation

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

## Reference page

${ref ? `**\`${ref.path}\`** — copy this file when building any new list/report page.` : "_No list/report page yet — use MUI defaults from `tools/mui/list-report-pages.dna.md` until one exists._"}
`;
}

function buildFeatureBuildingRules(
  analysis: FeaturePatternAnalysis,
  config: DnaConfig | null,
  quote?: string,
): string {
  const project = config?.projectName ?? "project";
  const refModule = analysis.referenceModule;
  const structureFirst = analysis.projectKind === "library" || (!analysis.referenceListPage && !!refModule);
  const principle = structureFirst
    ? "**Never invent folder or module layout.** Clone existing domain modules. New features get the same files, naming, exports, and test placement as the reference module."
    : "**Never invent UI layout.** Clone existing patterns. New reports get the same title row, padding, search, filters, table, and pagination as existing pages.";

  const defaultQuote = structureFirst
    ? "All new features must match established module structure, file naming, exports, and test placement from the reference module."
    : "All new frontend features must match established structure, MUI styling, and shared components.";

  return `# Feature Building Rules

_${project} — enforced by DNA for every new feature. AI tools must read this before creating pages or modules._

## Principle

> ${principle}

## Detected project pattern

- **Kind:** \`${analysis.projectKind}\`
- **Structure captured:** ${analysis.structureCaptured ? "yes — from existing codebase" : "partial — add a reference feature to improve rules"}
${analysis.scanRoots.length > 1 ? `- **Scanned roots:** ${analysis.scanRoots.map((r) => `\`${r}\``).join(", ")}` : ""}

## User requirement

${quote?.trim() || defaultQuote}

${structureRulesSection(analysis)}

${webUiRulesSection(analysis)}

## Feature folder

${analysis.featureFolders[0] ? `Use template: ${"`"}${analysis.featureFolders[0].template}${"`"}` : refModule ? `Use module folder: ${"`"}${refModule.path}/${"`"}` : "Use `src/features/{feature-name}/`"}

## Checklist (definition of done)

- [ ] Matches reference module or page layout — no invented structure
- [ ] Same file naming and export pattern as reference
- [ ] Co-located tests when reference has them
${analysis.isWebProject ? "- [ ] Uses shared UI imports — no new one-off table or title components" : ""}
${analysis.isWebProject ? "- [ ] Search, filters, loading / empty / error states match reference pages" : ""}
- [ ] \`dna validate\` passes
`;
}

function buildFeatureTemplates(analysis: FeaturePatternAnalysis, packageName: string): string {
  const ref = analysis.referenceListPage;
  const refModule = analysis.referenceModule;
  const moduleSection = refModule
    ? `## Reference module layout

Clone \`${refModule.path}/\` — files: ${refModule.files.join(", ")}

\`\`\`
${refModule.path}/
${refModule.files.map((f) => `├── ${f}`).join("\n")}
\`\`\`
`
    : "";

  return `# Feature Templates

_Copy-paste starting points. Prefer cloning detected references over these generics._

${moduleSection}

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

## New feature prompt for AI

> Create **{Name}** using the exact structure from \`${refModule?.path ?? ref?.path ?? "feature-folder-structure"}\`. Same folder layout, file types, exports, and tests. Only change domain logic, routes, and API wiring.
`;
}

function buildCursorListReportRule(analysis: FeaturePatternAnalysis, config: DnaConfig | null): string {
  const project = config?.projectName ?? "project";
  const ref = analysis.referenceListPage?.path;
  const refModule = analysis.referenceModule?.path;
  const primaryRef = ref ?? refModule ?? ".DNA/knowledge/project/feature-folder-structure.dna.md";

  return `---
description: Feature structure — clone existing project patterns (UI pages + domain modules)
globs: ["**/*.{ts,tsx,jsx}", "src/**/*", "app/**/*", "apps/**/*", "packages/**/*"]
---

# Feature structure — ${project}

**Before creating any new feature, page, or domain module:**

1. Read \`.DNA/CellularMemory/prefrontalCortex/feature-building-rules.md\`
2. Read \`.DNA/knowledge/project/feature-folder-structure.dna.md\`
${ref ? `3. Open reference page: \`${ref}\` and **clone its layout**` : refModule ? `3. Open reference module: \`${refModule}/\` and **clone its folder layout**` : "3. Follow detected folder templates in feature-folder-structure.dna.md"}

## Non-negotiable

- Clone \`${primaryRef}\` — do not invent new structure
${analysis.isWebProject ? "- MUI foundation must be loaded first (ui-patterns.md, visual-standards.md)" : ""}
${analysis.isWebProject ? `- Same page padding: \`${analysis.pagePadding}\`` : ""}
${analysis.isWebProject ? `- Same title variant: \`${analysis.titleVariant}\`` : ""}
- Same file naming, exports, and test placement as reference
- Import shared components from project packages — **never** duplicate patterns that already exist

## Example

User asks: "Add billing feature" → copy reference module/page, rename files, update domain logic only.

**Do not** redesign folder layout, spacing, or module conventions.
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
  const skipped = !analysis.isWebProject && !analysis.structureCaptured && !options.force;

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
    await writeFileEnsured(folderKnowledge, buildFeatureFolderKnowledge(analysis.featureFolders, analysis, config));
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
    `Project kind:     ${analysis.projectKind}`,
    `Structure:        ${analysis.structureCaptured ? "captured from codebase" : "not captured yet"}`,
    `Web project:      ${analysis.isWebProject ? "yes" : "no"}`,
    `MUI detected:     ${analysis.usesMui ? analysis.muiPackages.join(", ") : "no"}`,
    `List/report pages: ${analysis.listReportPages.length}`,
    `Reference page:   ${analysis.referenceListPage?.path ?? "none"}`,
    `Domain modules:   ${analysis.domainModules.length}`,
    `Reference module: ${analysis.referenceModule?.path ?? "none"}`,
    `Feature folders:  ${analysis.featureFolders.length} pattern(s)`,
    `Table style:      ${analysis.tableStyle}`,
    "",
  ];
  return lines.join("\n");
}
