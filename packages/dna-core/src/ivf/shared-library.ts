import fg from "fast-glob";
import { readdir, readFile } from "node:fs/promises";
import { join, basename } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { writeFileEnsured, fileExists } from "../fs.js";
import { loadDnaConfig } from "../validator.js";

const SOURCE_GLOB = ["**/*.{ts,tsx,js,jsx,vue}"];
const IGNORE = ["**/node_modules/**", "**/dist/**", "**/.DNA/**", "**/DNA/**", "**/.next/**", "**/build/**"];

const SHARED_PACKAGE_NAMES = new Set([
  "ui",
  "shared",
  "shared-ui",
  "components",
  "design-system",
  "component-library",
  "common",
  "core-ui",
]);

const SHARED_LIB_DIR_PATTERNS = [
  /^packages\/(ui|shared|shared-ui|components|design-system|common|core-ui)(\/|$)/,
  /^libs\/(ui|shared|shared-ui|components|design-system|common)(\/|$)/,
  /^lib\/shared(\/|$)/,
];

export type SharedLibraryHealth = "good" | "needs-work" | "critical";

export interface ComponentLocation {
  name: string;
  path: string;
  scope: string;
}

export interface DuplicateComponentGroup {
  name: string;
  paths: string[];
  scopes: string[];
}

export interface SharedLibraryAnalysis {
  isMonorepo: boolean;
  monorepoTool: string | null;
  hasSharedPackage: boolean;
  sharedPackagePaths: string[];
  componentDirs: { path: string; count: number; scope: string }[];
  duplicateComponents: DuplicateComponentGroup[];
  duplicateCount: number;
  scatteredComponentDirs: boolean;
  hasUtilsGodModule: boolean;
  health: SharedLibraryHealth;
  recommendedPackagePath: string;
  recommendedPackageName: string;
}

export interface EnsureSharedLibraryOptions {
  root: string;
  quote?: string;
  /** Write plan even when health is good (default false) */
  force?: boolean;
}

export interface EnsureSharedLibraryResult {
  planPath: string;
  uiPatternsPath: string;
  analysis: SharedLibraryAnalysis;
  context: string;
  skipped: boolean;
}

function slugify(name: string): string {
  return name.replace(/[^a-z0-9-]/gi, "-").toLowerCase().replace(/-+/g, "-");
}

function inferScope(filePath: string): string {
  const parts = filePath.split("/");
  if (parts[0] === "apps" && parts[1]) return `apps/${parts[1]}`;
  if (parts[0] === "packages" && parts[1]) return `packages/${parts[1]}`;
  if (parts[0] === "src") return "src";
  if (parts[0] === "app") return "app";
  return parts.slice(0, 2).join("/") || ".";
}

function isComponentFile(filePath: string): boolean {
  return (
    filePath.includes("/components/") ||
    /\/[A-Z][A-Za-z0-9]*\.(tsx|jsx|vue)$/.test(filePath) ||
    filePath.endsWith("Component.tsx") ||
    filePath.endsWith("Component.jsx")
  );
}

async function detectMonorepo(root: string): Promise<{ isMonorepo: boolean; tool: string | null }> {
  const checks: [string, string][] = [
    ["pnpm-workspace.yaml", "pnpm"],
    ["turbo.json", "turborepo"],
    ["nx.json", "nx"],
    ["lerna.json", "lerna"],
  ];

  for (const [file, tool] of checks) {
    if (await fileExists(join(root, file))) return { isMonorepo: true, tool };
  }

  const pkgPath = join(root, "package.json");
  if (await fileExists(pkgPath)) {
    try {
      const pkg = JSON.parse(await readFile(pkgPath, "utf-8")) as { workspaces?: string[] | { packages: string[] } };
      const workspaces = Array.isArray(pkg.workspaces) ? pkg.workspaces : pkg.workspaces?.packages;
      if (workspaces?.length) return { isMonorepo: true, tool: "npm-workspaces" };
    } catch {
      /* ignore */
    }
  }

  const top = await readdir(root, { withFileTypes: true });
  const hasAppsAndPackages =
    top.some((e) => e.isDirectory() && e.name === "apps") &&
    top.some((e) => e.isDirectory() && e.name === "packages");
  if (hasAppsAndPackages) return { isMonorepo: true, tool: "apps-packages" };

  return { isMonorepo: false, tool: null };
}

async function detectSharedPackages(root: string): Promise<string[]> {
  const found: string[] = [];

  for (const dir of ["packages", "libs", "lib"]) {
    const dirPath = join(root, dir);
    if (!(await fileExists(dirPath))) continue;

    const entries = await readdir(dirPath, { withFileTypes: true });
    for (const entry of entries.filter((e) => e.isDirectory())) {
      const rel = `${dir}/${entry.name}`;
      if (SHARED_PACKAGE_NAMES.has(entry.name) || SHARED_LIB_DIR_PATTERNS.some((p) => p.test(rel))) {
        found.push(rel);
      }
    }
  }

  const files = await fg(["packages/*/package.json", "libs/*/package.json"], {
    cwd: root,
    ignore: IGNORE,
  });

  for (const pkgFile of files) {
    try {
      const pkg = JSON.parse(await readFile(join(root, pkgFile), "utf-8")) as { name?: string };
      const name = pkg.name ?? "";
      if (/@.+\/(ui|shared|components|design-system)/.test(name)) {
        found.push(pkgFile.replace("/package.json", ""));
      }
    } catch {
      /* ignore */
    }
  }

  return [...new Set(found)];
}

function assessHealth(
  duplicates: DuplicateComponentGroup[],
  hasSharedPackage: boolean,
  scattered: boolean,
): SharedLibraryHealth {
  if (duplicates.length >= 3 || (duplicates.length > 0 && !hasSharedPackage)) return "critical";
  if (duplicates.length > 0 || scattered || !hasSharedPackage) return "needs-work";
  return "good";
}

function recommendPackagePath(isMonorepo: boolean, projectName: string, existing: string[]): string {
  if (existing.length) return existing[0]!;
  if (isMonorepo) return "packages/ui";
  const scope = slugify(projectName).replace(/-+/g, "-") || "app";
  return `packages/${scope}-ui`;
}

function recommendPackageName(config: DnaConfig | null, packagePath: string): string {
  const folder = packagePath.split("/").pop() ?? "ui";
  const project = slugify(config?.projectName ?? "app");
  return `@${project}/${folder}`;
}

export async function analyzeSharedLibrary(root: string): Promise<SharedLibraryAnalysis> {
  const config = await loadDnaConfig(root);
  const { isMonorepo, tool: monorepoTool } = await detectMonorepo(root);
  const sharedPackagePaths = await detectSharedPackages(root);

  const files = await fg(SOURCE_GLOB, { cwd: root, ignore: IGNORE });
  const componentFiles = files.filter(isComponentFile);

  const dirCounts = new Map<string, { count: number; scope: string }>();
  for (const file of componentFiles) {
    const dir = file.includes("/components/")
      ? file.split("/components/")[0]! + "/components"
      : file.split("/").slice(0, -1).join("/");
    const scope = inferScope(file);
    const current = dirCounts.get(dir) ?? { count: 0, scope };
    current.count++;
    dirCounts.set(dir, current);
  }

  const componentDirs = [...dirCounts.entries()]
    .map(([path, { count, scope }]) => ({ path, count, scope }))
    .sort((a, b) => b.count - a.count);

  const byName = new Map<string, ComponentLocation[]>();
  for (const file of componentFiles) {
    const name = basename(file).replace(/\.(tsx|jsx|vue)$/, "");
    const scope = inferScope(file);
    const list = byName.get(name) ?? [];
    list.push({ name, path: file, scope });
    byName.set(name, list);
  }

  const duplicateComponents: DuplicateComponentGroup[] = [];
  for (const [name, locations] of byName) {
    const scopes = [...new Set(locations.map((l) => l.scope))];
    if (scopes.length > 1) {
      duplicateComponents.push({
        name,
        paths: locations.map((l) => l.path),
        scopes,
      });
    }
  }

  duplicateComponents.sort((a, b) => b.paths.length - a.paths.length);

  const uniqueScopes = new Set(componentDirs.map((d) => d.scope));
  const scatteredComponentDirs = uniqueScopes.size > 2 && componentDirs.length > 2;

  const hasUtilsGodModule = files.some(
    (f) =>
      (f.endsWith("/utils/index.ts") ||
        f.endsWith("/utils.ts") ||
        f.endsWith("/helpers.ts") ||
        f.endsWith("/lib/utils.ts")) &&
      files.filter((x) => x.includes("/utils/")).length > 8,
  );

  const recommendedPackagePath = recommendPackagePath(isMonorepo, config?.projectName ?? "app", sharedPackagePaths);
  const recommendedPackageName = recommendPackageName(config, recommendedPackagePath);

  const health = assessHealth(duplicateComponents, sharedPackagePaths.length > 0, scatteredComponentDirs);

  return {
    isMonorepo,
    monorepoTool,
    hasSharedPackage: sharedPackagePaths.length > 0,
    sharedPackagePaths,
    componentDirs,
    duplicateComponents,
    duplicateCount: duplicateComponents.length,
    scatteredComponentDirs,
    hasUtilsGodModule,
    health,
    recommendedPackagePath,
    recommendedPackageName,
  };
}

function duplicateTable(duplicates: DuplicateComponentGroup[]): string {
  if (!duplicates.length) return "_No cross-scope duplicate component names detected._";

  const header = "| Component | Copies | Scopes | Paths |";
  const sep = "|-----------|--------|--------|-------|";
  const rows = duplicates.slice(0, 20).map((d) => {
    const paths = d.paths.slice(0, 3).map((p) => `\`${p}\``).join(", ");
    const more = d.paths.length > 3 ? ` (+${d.paths.length - 3})` : "";
    return `| ${d.name} | ${d.paths.length} | ${d.scopes.join(", ")} | ${paths}${more} |`;
  });

  return [header, sep, ...rows].join("\n");
}

export function buildSharedLibraryBrief(
  analysis: SharedLibraryAnalysis,
  config: DnaConfig | null,
  quote?: string,
): string {
  const projectName = config?.projectName ?? "project";
  const frontend = config?.stack.frontend ?? "react";

  const lines = [
    `# Shared Library Consolidation Plan — ${projectName}`,
    "",
    `_Generated by DNA IVF. Give this plan to your AI tool to scaffold a shared library and replace duplicated UI with standardised components._`,
    "",
    "## Goal",
    "",
    quote?.trim() ||
      "Create a shared component library, extract duplicated UI, and replace local copies with imports — improving code quality, consistency, and maintainability.",
    "",
    "## Current state",
    "",
    `- **Health:** ${analysis.health}`,
    `- **Monorepo:** ${analysis.isMonorepo ? `yes (${analysis.monorepoTool})` : "no — will introduce packages/ workspace"}`,
    `- **Shared package:** ${analysis.hasSharedPackage ? analysis.sharedPackagePaths.join(", ") : "none detected"}`,
    `- **Component directories:** ${analysis.componentDirs.length}`,
    `- **Duplicate component names (cross-scope):** ${analysis.duplicateCount}`,
    `- **Scattered component dirs:** ${analysis.scatteredComponentDirs ? "yes" : "no"}`,
    `- **Utils god-module:** ${analysis.hasUtilsGodModule ? "yes — split shared helpers into library" : "no"}`,
    "",
    "## Duplicate inventory",
    "",
    duplicateTable(analysis.duplicateComponents),
    "",
    "## Target architecture",
    "",
    "```",
    `${analysis.isMonorepo ? "apps/\npackages/" : ""}`,
    `└── ${analysis.recommendedPackagePath}/`,
    "    ├── src/",
    "    │   ├── components/     # canonical UI primitives + composites",
    "    │   ├── hooks/          # shared React hooks",
    "    │   ├── utils/          # pure helpers (no app-specific logic)",
    "    │   └── index.ts        # public API barrel",
    "    ├── package.json",
    "    └── tsconfig.json",
    "```",
    "",
    `- **Package name:** \`${analysis.recommendedPackageName}\``,
    `- **Import rule:** apps import UI only from \`${analysis.recommendedPackageName}\` — no cross-app component copies`,
    "",
    "## AI execution workflow",
    "",
    "Work in small PRs. AI should follow this order:",
    "",
    "### Step 1 — Scaffold shared library",
    "",
    "```bash",
    "mkdir -p " + analysis.recommendedPackagePath + "/src/components",
    "# Add package.json with name " + analysis.recommendedPackageName,
    "# Wire into workspace (pnpm-workspace / package.json workspaces)",
    "# Export from " + analysis.recommendedPackagePath + "/src/index.ts",
    "```",
    "",
    `- Match stack: **${frontend}**`,
    "- Consolidate UI into shared package — MUI foundation is a separate DNA layer",
    "- Update `occipitalLobe/ui-patterns.md` with import conventions",
    "",
    "### Step 2 — Extract canonical components",
    "",
    ...(analysis.duplicateComponents.length
      ? analysis.duplicateComponents.slice(0, 10).flatMap((d) => [
          `- **${d.name}:** pick the best implementation from \`${d.paths[0]}\`, move to shared lib, delete other copies`,
        ])
      : ["- Inventory high-value primitives (Button, Input, Modal, Card, Layout shells) and move to shared lib"]),
    "",
    "### Step 3 — Replace imports across apps",
    "",
    "```typescript",
    `// Before`,
    `import { Button } from "../components/Button";`,
    "",
    `// After`,
    `import { Button } from "${analysis.recommendedPackageName}";`,
    "```",
    "",
    "- Run codemod or AI-assisted find-replace per app scope",
    "- Do not leave re-export shims longer than one release — delete local files",
    "- Update tests to import from shared package",
    "",
    "### Step 4 — Standardise and optimise",
    "",
    "- Unify prop APIs — one Button, not three variants",
    "- Extract shared hooks (useMediaQuery, useDisclosure) into `hooks/`",
    "- Move pure utils from god-modules into `utils/`",
    "- Enforce: `dna validate` + `no_duplicate_components` neural check",
    "",
    "## Definition of done",
    "",
    "- [ ] Shared package builds and is consumed by all apps",
    "- [ ] Zero cross-scope duplicate component names",
    "- [ ] `occipitalLobe/ui-patterns.md` documents the shared library contract",
    "- [ ] `dna validate` passes (no DUPLICATE_COMPONENTS warnings)",
    "- [ ] Impressions architecture docs mention the shared library boundary",
    "",
    "## Commands",
    "",
    "```bash",
    "dna analyze --deep",
    "dna plan ivf --verticals sharedLibrary",
    "dna context ivf",
    "```",
    "",
  ];

  return lines.join("\n");
}

export async function ensureSharedLibrary(options: EnsureSharedLibraryOptions): Promise<EnsureSharedLibraryResult> {
  const config = await loadDnaConfig(options.root);
  if (!config) {
    throw new Error("DNA not installed. Run `dna init` first.");
  }

  const analysis = await analyzeSharedLibrary(options.root);
  const skipped = analysis.health === "good" && !options.force;

  const slug = slugify(config.projectName);
  const planPath = join(options.root, ".DNA", "plans", `shared-library-${slug}.md`);
  const uiPatternsPath = join(options.root, ".DNA", "CellularMemory", "occipitalLobe", "ui-patterns.md");
  const context = buildSharedLibraryBrief(analysis, config, options.quote);

  if (!skipped) {
    await writeFileEnsured(planPath, context);

    const uiSection = [
      "# UI Patterns",
      "",
      "## Shared library",
      "",
      `- **Package:** \`${analysis.recommendedPackageName}\``,
      `- **Path:** \`${analysis.recommendedPackagePath}/\``,
      `- **Health:** ${analysis.health}`,
      `- **Rule:** Import shared UI only from \`${analysis.recommendedPackageName}\` — never duplicate components across apps`,
      "",
      analysis.duplicateComponents.length
        ? [
            "## Components to consolidate",
            "",
            ...analysis.duplicateComponents.slice(0, 15).map((d) => `- \`${d.name}\` (${d.paths.length} copies)`),
            "",
          ].join("\n")
        : "## Components to consolidate\n\n_No cross-scope duplicates detected yet — add primitives to shared lib as you build._\n",
      "",
      "_MUI foundation and build rules are separate DNA layers. Updated by shared library plan._",
      "",
    ].join("\n");

    await writeFileEnsured(uiPatternsPath, uiSection);
  }

  return { planPath, uiPatternsPath, analysis, context, skipped };
}

export function formatSharedLibrarySummary(analysis: SharedLibraryAnalysis): string {
  const lines = [
    "Shared Library Analysis",
    "=======================",
    "",
    `Health:           ${analysis.health}`,
    `Monorepo:         ${analysis.isMonorepo ? analysis.monorepoTool : "no"}`,
    `Shared package:   ${analysis.hasSharedPackage ? analysis.sharedPackagePaths.join(", ") : "none"}`,
    `Component dirs:   ${analysis.componentDirs.length}`,
    `Duplicates:       ${analysis.duplicateCount}`,
    `Recommended:      ${analysis.recommendedPackagePath} (${analysis.recommendedPackageName})`,
    "",
  ];

  if (analysis.duplicateComponents.length) {
    lines.push("Top duplicates:");
    for (const d of analysis.duplicateComponents.slice(0, 8)) {
      lines.push(`  • ${d.name} (${d.scopes.join(", ")})`);
    }
  }

  return lines.join("\n");
}

export interface SharedLibraryExecutionItem {
  component: string;
  sourcePath: string;
  targetPath: string;
  action: "move" | "scaffold";
}

export interface SharedLibraryExecutionPlan {
  analysis: SharedLibraryAnalysis;
  items: SharedLibraryExecutionItem[];
  packagePath: string;
  packageName: string;
}

export function planSharedLibraryExecution(analysis: SharedLibraryAnalysis): SharedLibraryExecutionPlan {
  const packagePath = analysis.recommendedPackagePath;
  const packageName = analysis.recommendedPackageName;
  const items: SharedLibraryExecutionItem[] = [];

  for (const dup of analysis.duplicateComponents) {
    const source = dup.paths[0]!;
    const fileName = source.split("/").pop()!;
    items.push({
      component: dup.name,
      sourcePath: source,
      targetPath: `${packagePath}/src/components/${fileName}`,
      action: "move",
    });
  }

  if (!items.length) {
    items.push({
      component: "index",
      sourcePath: "(new)",
      targetPath: `${packagePath}/src/index.ts`,
      action: "scaffold",
    });
  }

  return { analysis, items, packagePath, packageName };
}

export function formatSharedLibraryDryRun(plan: SharedLibraryExecutionPlan): string {
  const lines = [
    "Shared Library Execution Plan (dry-run)",
    "========================================",
    "",
    formatSharedLibrarySummary(plan.analysis),
    "",
    `Target package: ${plan.packagePath} (${plan.packageName})`,
    "",
    "Planned actions:",
  ];

  for (const item of plan.items) {
    lines.push(`  • ${item.action.toUpperCase()} ${item.component}`);
    lines.push(`      ${item.sourcePath} → ${item.targetPath}`);
  }

  lines.push(
    "",
    "Next steps:",
    "  dna ivf shared-library --scaffold   # create package skeleton",
    "  dna ivf shared-library --execute    # full extraction (coming soon)",
  );

  return lines.join("\n");
}

export async function scaffoldSharedLibraryPackage(root: string): Promise<{ created: string[]; packagePath: string }> {
  const analysis = await analyzeSharedLibrary(root);
  const config = await loadDnaConfig(root);
  if (!config) throw new Error("DNA not installed. Run `dna init` first.");

  const created: string[] = [];
  const pkgPath = join(root, analysis.recommendedPackagePath);

  const pkgJson = {
    name: analysis.recommendedPackageName,
    version: "0.1.0",
    private: true,
    type: "module",
    main: "./src/index.ts",
    exports: { ".": "./src/index.ts" },
  };

  const tsconfig = {
    compilerOptions: {
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "bundler",
      jsx: "react-jsx",
      strict: true,
      skipLibCheck: true,
      declaration: true,
      outDir: "dist",
    },
    include: ["src"],
  };

  const indexTs = `/** Shared UI library — ${config.projectName} */\nexport {};\n`;

  await writeFileEnsured(join(pkgPath, "package.json"), JSON.stringify(pkgJson, null, 2) + "\n");
  created.push(join(analysis.recommendedPackagePath, "package.json"));

  await writeFileEnsured(join(pkgPath, "tsconfig.json"), JSON.stringify(tsconfig, null, 2) + "\n");
  created.push(join(analysis.recommendedPackagePath, "tsconfig.json"));

  await writeFileEnsured(join(pkgPath, "src", "index.ts"), indexTs);
  created.push(join(analysis.recommendedPackagePath, "src/index.ts"));

  await writeFileEnsured(
    join(pkgPath, "src", "components", ".gitkeep"),
    "# Components extracted by dna ivf shared-library --execute\n",
  );
  created.push(join(analysis.recommendedPackagePath, "src/components/.gitkeep"));

  return { created, packagePath: analysis.recommendedPackagePath };
}
