import fg from "fast-glob";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { writeFileEnsured } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import { ensureKnowledgeInstalled } from "../marketplace/ensure.js";
import { scanProject } from "../scanner.js";

const IGNORE = ["**/node_modules/**", "**/dist/**", "**/.DNA/**", "**/DNA/**", "**/build/**"];

export type MobileUiLibrary = "react-native-paper" | "tamagui" | "native-base" | "gluestack" | "custom" | "none";

export interface MobileThemingAnalysis {
  isMobileProject: boolean;
  mobileFramework: string | null;
  uiLibrary: MobileUiLibrary;
  uiPackages: string[];
  hasThemeProvider: boolean;
  themeFile: string | null;
}

export interface EnsureMobileThemingOptions {
  root: string;
  quote?: string;
  force?: boolean;
}

export interface EnsureMobileThemingResult {
  planPath: string;
  visualStandardsPath: string;
  analysis: MobileThemingAnalysis;
  mobilePackInstalled: boolean;
  skipped: boolean;
}

function slugify(name: string): string {
  return name.replace(/[^a-z0-9-]/gi, "-").toLowerCase().replace(/-+/g, "-");
}

function isMobileFrontend(frontend: string | null | undefined): boolean {
  if (!frontend) return false;
  const f = frontend.toLowerCase();
  return f.includes("react-native") || f.includes("expo") || f === "flutter" || f.includes("mobile");
}

async function detectMobilePackages(root: string): Promise<{ packages: string[]; library: MobileUiLibrary }> {
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
        if (
          name.startsWith("react-native") ||
          name.startsWith("expo") ||
          name === "react-native-paper" ||
          name.startsWith("@tamagui/") ||
          name.startsWith("native-base") ||
          name.startsWith("@gluestack-ui/")
        ) {
          found.add(name);
        }
      }
    } catch {
      /* ignore */
    }
  }

  const packages = [...found].sort();
  let library: MobileUiLibrary = "none";
  if (packages.some((p) => p === "react-native-paper")) library = "react-native-paper";
  else if (packages.some((p) => p.startsWith("@tamagui/"))) library = "tamagui";
  else if (packages.some((p) => p.startsWith("native-base"))) library = "native-base";
  else if (packages.some((p) => p.startsWith("@gluestack-ui/"))) library = "gluestack";
  else if (packages.some((p) => p.startsWith("react-native") || p.startsWith("expo"))) library = "react-native-paper";

  return { packages, library };
}

async function detectMobileTheme(root: string): Promise<{ hasThemeProvider: boolean; themeFile: string | null }> {
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
    if (/PaperProvider|TamaguiProvider|NativeBaseProvider|GluestackUIProvider|ThemeProvider/.test(content)) {
      hasThemeProvider = true;
    }
    if (!themeFile && /theme|Theme/.test(rel) && /(createTheme|MD3|tokens)/.test(content)) themeFile = rel;
  }

  return { hasThemeProvider, themeFile };
}

export async function analyzeMobileTheming(root: string): Promise<MobileThemingAnalysis> {
  const config = await loadDnaConfig(root);
  const scan = await scanProject(root);
  const frontend = scan.frontend ?? config?.stack.frontend ?? null;
  const mobile = await detectMobilePackages(root);
  const theme = await detectMobileTheme(root);

  const isMobileProject =
    isMobileFrontend(frontend) ||
    mobile.packages.some((p) => p.startsWith("expo") || p.startsWith("react-native"));

  return {
    isMobileProject,
    mobileFramework: frontend,
    uiLibrary: mobile.library,
    uiPackages: mobile.packages,
    hasThemeProvider: theme.hasThemeProvider,
    themeFile: theme.themeFile,
  };
}

function buildMobileThemingBrief(analysis: MobileThemingAnalysis, config: DnaConfig | null, quote?: string): string {
  const project = config?.projectName ?? "project";
  const lib =
    analysis.uiLibrary === "react-native-paper"
      ? "React Native Paper (MD3)"
      : analysis.uiLibrary === "none"
        ? "React Native Paper (recommended default)"
        : analysis.uiLibrary;

  return `# Mobile Theming Plan: ${project}

_Mobile UI foundation layer. Mobile build rules are a separate layer on top._

## Goal

${quote?.trim() || "Standardise mobile UI on a single theme system. Use the mobile UI library to its fullest when no project-specific build rules exist yet."}

## Current state

- **Framework:** ${analysis.mobileFramework ?? "not detected"}
- **UI library:** ${lib}
- **Packages:** ${analysis.uiPackages.length ? analysis.uiPackages.slice(0, 8).join(", ") : "none"}
- **Theme provider:** ${analysis.hasThemeProvider ? "detected" : "not detected"}
- **Theme file:** ${analysis.themeFile ?? "not detected"}

## Layer model

| Layer | Responsibility |
|-------|----------------|
| **Mobile theming (this plan)** | Theme, colours, spacing, Paper/Tamagui primitives |
| **Mobile build rules** | Project-specific screen patterns — only when reference screens exist |

> If no mobile build rules exist yet, use \`platforms/mobile-ui/list-screens.dna.md\` in full.

## Definition of done

- [ ] Theme provider at app root
- [ ] \`occipitalLobe/visual-standards.md\` documents mobile tokens
- [ ] Shared screen primitives in \`components/ui/\` or mobile package
`;
}

export async function ensureMobileTheming(
  options: EnsureMobileThemingOptions,
): Promise<EnsureMobileThemingResult> {
  const config = await loadDnaConfig(options.root);
  if (!config) throw new Error("DNA not installed. Run `dna init` first.");

  const analysis = await analyzeMobileTheming(options.root);
  const skipped = !analysis.isMobileProject && !options.force;

  const slug = slugify(config.projectName);
  const planPath = join(options.root, ".DNA", "plans", `mobile-theming-${slug}.md`);
  const visualStandardsPath = join(options.root, ".DNA", "CellularMemory", "occipitalLobe", "visual-standards.md");

  let mobilePackInstalled = false;

  if (!skipped) {
    const knowledgeResult = await ensureKnowledgeInstalled(options.root, ["platforms/mobile-ui"], config.channel);
    mobilePackInstalled =
      knowledgeResult.installed.includes("platforms/mobile-ui") ||
      knowledgeResult.refreshed.includes("platforms/mobile-ui");

    await writeFileEnsured(planPath, buildMobileThemingBrief(analysis, config, options.quote));

    await writeFileEnsured(
      visualStandardsPath,
      `# Visual Standards

## Mobile theme

- **UI library:** ${analysis.uiLibrary === "none" ? "react-native-paper (default)" : analysis.uiLibrary}
- **Screen padding:** 16px
- **List row min height:** 56px
- **Header:** Appbar / native stack header — consistent across screens

${analysis.themeFile ? `Theme file: \`${analysis.themeFile}\`` : "_Define theme.ts with brand colours._"}

## Web (if applicable)

See MUI section in ui-patterns.md for web surfaces.

_Updated by DNA mobile theming._
`,
    );
  }

  return { planPath, visualStandardsPath, analysis, mobilePackInstalled, skipped };
}
