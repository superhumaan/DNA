import fg from "fast-glob";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { writeFileEnsured } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import { ensureKnowledgeInstalled } from "../marketplace/ensure.js";
import { scanProject } from "../scanner.js";

const IGNORE = ["**/node_modules/**", "**/dist/**", "**/.DNA/**", "**/DNA/**", "**/.next/**"];

export interface MuiFoundationAnalysis {
  isWebProject: boolean;
  usesMui: boolean;
  muiPackages: string[];
  hasThemeProvider: boolean;
  themeFile: string | null;
}

export interface EnsureMuiFoundationOptions {
  root: string;
  quote?: string;
  force?: boolean;
}

export interface EnsureMuiFoundationResult {
  planPath: string;
  uiPatternsPath: string;
  visualStandardsPath: string;
  analysis: MuiFoundationAnalysis;
  muiPackInstalled: boolean;
  skipped: boolean;
}

function slugify(name: string): string {
  return name.replace(/[^a-z0-9-]/gi, "-").toLowerCase().replace(/-+/g, "-");
}

function isWebFrontend(frontend: string | null | undefined): boolean {
  if (!frontend) return false;
  return ["react", "next", "nextjs", "vue", "angular"].includes(frontend.toLowerCase());
}

async function detectMuiPackages(root: string): Promise<string[]> {
  const found = new Set<string>();
  const pkgFiles = [
    "package.json",
    ...(await fg(["apps/*/package.json", "packages/*/package.json"], { cwd: root, ignore: IGNORE })),
  ];
  for (const pkgFile of pkgFiles) {
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

async function detectThemeSetup(root: string): Promise<{ hasThemeProvider: boolean; themeFile: string | null }> {
  const files = await fg(["**/*.{ts,tsx,js,jsx}"], { cwd: root, ignore: IGNORE });
  let hasThemeProvider = false;
  let themeFile: string | null = null;

  for (const rel of files.slice(0, 300)) {
    let content: string;
    try {
      content = await readFile(join(root, rel), "utf-8");
    } catch {
      continue;
    }
    if (/ThemeProvider|createTheme/.test(content)) hasThemeProvider = true;
    if (!themeFile && /createTheme\s*\(/.test(content) && /theme/i.test(rel)) themeFile = rel;
  }

  return { hasThemeProvider, themeFile };
}

export async function analyzeMuiFoundation(root: string): Promise<MuiFoundationAnalysis> {
  const config = await loadDnaConfig(root);
  const scan = await scanProject(root);
  const frontend = scan.frontend ?? config?.stack.frontend ?? null;
  const muiPackages = await detectMuiPackages(root);
  const theme = await detectThemeSetup(root);

  return {
    isWebProject: isWebFrontend(frontend),
    usesMui: muiPackages.length > 0,
    muiPackages,
    hasThemeProvider: theme.hasThemeProvider,
    themeFile: theme.themeFile,
  };
}

function buildMuiFoundationBrief(analysis: MuiFoundationAnalysis, config: DnaConfig | null, quote?: string): string {
  const project = config?.projectName ?? "project";
  return `# MUI Foundation Plan: ${project}

_Web UI foundation layer. Build rules (list/report pages) are a separate layer on top of this._

## Goal

${quote?.trim() || "Standardise web UI on Material UI — theme, tokens, shared primitives. Use MUI to its fullest when no project-specific build rules exist yet."}

## Current state

- **MUI installed:** ${analysis.usesMui ? analysis.muiPackages.join(", ") : "no"}
- **ThemeProvider:** ${analysis.hasThemeProvider ? "detected" : "not detected"}
- **Theme file:** ${analysis.themeFile ?? "not detected"}

## Target stack

\`\`\`bash
pnpm add @mui/material @mui/icons-material @emotion/react @emotion/styled
# optional: @mui/x-data-grid @mui/x-date-pickers
\`\`\`

## Layer model

| Layer | Responsibility |
|-------|----------------|
| **MUI (this plan)** | Theme, palette, typography, spacing, primitives, shared package exports |
| **Build rules** | Project-specific page patterns — only when reference pages exist |

> If no build rules exist yet, **default to full MUI patterns** from \`tools/mui/list-report-pages.dna.md\`.

## AI workflow

1. Single \`createTheme\` + \`ThemeProvider\` at app root
2. Document tokens in \`occipitalLobe/visual-standards.md\`
3. Export primitives from shared UI package (Button, TextField, DataGrid wrapper, etc.)
4. Never hardcode colours — \`theme.palette\`, \`theme.spacing\` only
5. Install knowledge: \`tools/mui\` (automatic via DNA)

## Definition of done

- [ ] MUI packages installed and ThemeProvider wired
- [ ] \`occipitalLobe/visual-standards.md\` documents palette + typography
- [ ] \`occipitalLobe/ui-patterns.md\` documents MUI import conventions
- [ ] Shared UI package exports themed primitives (if monorepo)
`;
}

export async function ensureMuiFoundation(options: EnsureMuiFoundationOptions): Promise<EnsureMuiFoundationResult> {
  const config = await loadDnaConfig(options.root);
  if (!config) throw new Error("DNA not installed. Run `dna init` first.");

  const analysis = await analyzeMuiFoundation(options.root);
  const skipped = !analysis.isWebProject && !options.force;

  const slug = slugify(config.projectName);
  const planPath = join(options.root, ".DNA", "plans", `mui-foundation-${slug}.md`);
  const uiPatternsPath = join(options.root, ".DNA", "CellularMemory", "occipitalLobe", "ui-patterns.md");
  const visualStandardsPath = join(options.root, ".DNA", "CellularMemory", "occipitalLobe", "visual-standards.md");

  let muiPackInstalled = false;

  if (!skipped) {
    const knowledgeResult = await ensureKnowledgeInstalled(options.root, ["tools/mui"], config.channel);
    muiPackInstalled =
      knowledgeResult.installed.includes("tools/mui") || knowledgeResult.refreshed.includes("tools/mui");

    await writeFileEnsured(planPath, buildMuiFoundationBrief(analysis, config, options.quote));

    await writeFileEnsured(
      uiPatternsPath,
      `# UI Patterns

## Foundation: Material UI (MUI)

- **Packages:** ${analysis.usesMui ? analysis.muiPackages.join(", ") : "@mui/material, @mui/icons-material"}
- **Rule:** Use MUI components and theme tokens — no ad-hoc CSS for layout primitives
- **Theme:** ${analysis.hasThemeProvider ? "ThemeProvider detected" : "Add ThemeProvider at app root"}
- **Shared imports:** themed primitives from project UI package when available

## When no build rules exist

Use MUI list/report defaults from \`.DNA/knowledge/tools/mui/list-report-pages.dna.md\` in full.

_Build rules layer (project-specific patterns) is separate — see feature-building-rules.md if present._

_Updated by DNA MUI foundation._
`,
    );

    await writeFileEnsured(
      visualStandardsPath,
      `# Visual Standards

## MUI theme tokens

- **Page padding:** \`theme.spacing(3)\` (24px default)
- **Page title:** \`Typography variant="h5" component="h1"\`
- **Section title:** \`Typography variant="h6"\`
- **Body:** \`body1\` / table cells \`body2\`
- **Colours:** \`theme.palette.primary\`, \`secondary\`, \`error\`, \`text.primary\`, \`text.secondary\`

${analysis.themeFile ? `Theme defined in: \`${analysis.themeFile}\`` : "_Define createTheme in src/theme.ts or equivalent._"}

_Updated by DNA MUI foundation._
`,
    );
  }

  return { planPath, uiPatternsPath, visualStandardsPath, analysis, muiPackInstalled, skipped };
}

export function formatMuiFoundationSummary(analysis: MuiFoundationAnalysis): string {
  return [
    "MUI Foundation",
    "==============",
    "",
    `Web project:     ${analysis.isWebProject ? "yes" : "no"}`,
    `MUI packages:    ${analysis.usesMui ? analysis.muiPackages.join(", ") : "none"}`,
    `ThemeProvider:   ${analysis.hasThemeProvider ? "yes" : "no"}`,
    `Theme file:      ${analysis.themeFile ?? "none"}`,
    "",
  ].join("\n");
}
