import fg from "fast-glob";
import { readFile } from "node:fs/promises";
import { join, basename } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { writeFileEnsured } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import { analyzeMobileTheming } from "./mobile-theming.js";

const SOURCE_GLOB = ["**/*.{ts,tsx,js,jsx}"];
const IGNORE = ["**/node_modules/**", "**/dist/**", "**/.DNA/**", "**/DNA/**", "**/build/**"];

const LIST_SCREEN_SIGNALS: { id: string; pattern: RegExp }[] = [
  { id: "flat-list", pattern: /FlatList|SectionList|FlashList/ },
  { id: "search", pattern: /Searchbar|searchQuery|placeholder=.*[Ss]earch/ },
  { id: "filter", pattern: /Chip|filter|SegmentedButtons/ },
  { id: "header", pattern: /Appbar\.Header|Stack\.Screen|screenOptions/ },
  { id: "refresh", pattern: /RefreshControl|onRefresh|pull.*refresh/i },
  { id: "pagination", pattern: /onEndReached|loadMore|pageSize/ },
  { id: "empty", pattern: /ListEmptyComponent|empty.*state/i },
];

export interface MobileListScreenCandidate {
  path: string;
  score: number;
  signals: string[];
}

export interface MobileBuildRulesAnalysis {
  isMobileProject: boolean;
  listScreens: MobileListScreenCandidate[];
  referenceListScreen: MobileListScreenCandidate | null;
  screenPadding: string;
}

export interface EnsureMobileBuildRulesOptions {
  root: string;
  quote?: string;
  force?: boolean;
}

export interface EnsureMobileBuildRulesResult {
  rulesPath: string;
  templatesPath: string;
  projectKnowledgePath: string;
  cursorRulePath: string | null;
  analysis: MobileBuildRulesAnalysis;
  skipped: boolean;
}

function scoreListScreen(content: string, filePath: string): MobileListScreenCandidate {
  const signals: string[] = [];
  for (const { id, pattern } of LIST_SCREEN_SIGNALS) {
    if (pattern.test(content)) signals.push(id);
  }
  const nameBonus = /list|screen|index|report/i.test(basename(filePath)) ? 2 : 0;
  return { path: filePath, score: signals.length + nameBonus, signals };
}

export async function analyzeMobileBuildRules(root: string): Promise<MobileBuildRulesAnalysis> {
  const theming = await analyzeMobileTheming(root);
  const files = await fg(SOURCE_GLOB, { cwd: root, ignore: IGNORE });

  const screenFiles = files.filter(
    (f) =>
      f.endsWith(".tsx") &&
      (/\/(screens|app)\//i.test(f) || /Screen\.tsx$/i.test(f) || /List|Report/.test(basename(f))),
  );

  const listScreens: MobileListScreenCandidate[] = [];
  for (const rel of screenFiles.slice(0, 120)) {
    try {
      const content = await readFile(join(root, rel), "utf-8");
      const candidate = scoreListScreen(content, rel);
      if (candidate.score >= 2) listScreens.push(candidate);
    } catch {
      /* ignore */
    }
  }

  listScreens.sort((a, b) => b.score - a.score);

  return {
    isMobileProject: theming.isMobileProject,
    listScreens,
    referenceListScreen: listScreens[0] ?? null,
    screenPadding: "16",
  };
}

function buildMobileBuildRules(
  analysis: MobileBuildRulesAnalysis,
  config: DnaConfig | null,
  quote?: string,
): string {
  const project = config?.projectName ?? "project";
  const ref = analysis.referenceListScreen;

  return `# Mobile Build Rules

_${project} — screen patterns on top of mobile theming. Read mobile theming plan first._

## Principle

> Clone existing list screen structure. New screens get the same header, search, filters, list rows, and empty states.

## Foundation layer

Mobile **theming** (Paper/Tamagui tokens) is separate. This file is **build rules** only.

If no reference screen exists yet, use \`platforms/mobile-ui/list-screens.dna.md\` at full MUI/Paper defaults.

## User requirement

${quote?.trim() || "New mobile features must match established screen patterns and spacing."}

## Reference screen

${ref ? `**\`${ref.path}\`** — clone for every new list/report screen.` : "_No reference captured — use platforms/mobile-ui/list-screens.dna.md_"}

## Mandatory list screen structure

1. Screen header (title + actions)
2. Search bar
3. Filter chips or menu
4. FlatList with pull-to-refresh
5. Empty + loading states
6. Infinite scroll or pagination matching reference

## New screen workflow

\`\`\`
User: "Create ABC list screen"
AI:
  1. Read this file + project/mobile-list-screen-pattern.dna.md
  2. Clone reference screen
  3. Change: title, data source, row fields only
\`\`\`
`;
}

export async function ensureMobileBuildRules(
  options: EnsureMobileBuildRulesOptions,
): Promise<EnsureMobileBuildRulesResult> {
  const config = await loadDnaConfig(options.root);
  if (!config) throw new Error("DNA not installed. Run `dna init` first.");

  const analysis = await analyzeMobileBuildRules(options.root);
  const skipped = !analysis.isMobileProject && !options.force;

  const rulesPath = join(
    options.root,
    ".DNA",
    "CellularMemory",
    "prefrontalCortex",
    "mobile-building-rules.md",
  );
  const templatesPath = join(options.root, ".DNA", "CellularMemory", "occipitalLobe", "mobile-feature-templates.md");
  const projectKnowledgePath = join(
    options.root,
    ".DNA",
    "knowledge",
    "project",
    "mobile-list-screen-pattern.dna.md",
  );
  const cursorRulePath = join(options.root, ".cursor", "rules", "mobile-list-screens.mdc");

  if (!skipped) {
    const ref = analysis.referenceListScreen;
    await writeFileEnsured(rulesPath, buildMobileBuildRules(analysis, config, options.quote));
    await writeFileEnsured(
      templatesPath,
      `# Mobile Feature Templates

Reference: \`${ref?.path ?? "platforms/mobile-ui/list-screens.dna.md"}\`
`,
    );
    await writeFileEnsured(
      projectKnowledgePath,
      `# Mobile list screen pattern

${ref ? `Reference: \`${ref.path}\` (signals: ${ref.signals.join(", ")})` : "No reference — use platforms/mobile-ui/list-screens.dna.md"}

Screen padding: ${analysis.screenPadding}px
`,
    );
    await writeFileEnsured(
      cursorRulePath,
      `---
description: Mobile list screens — clone reference structure
globs: ["**/*.{tsx,jsx}", "app/**/*", "src/screens/**/*"]
---

# Mobile list screens

1. Read \`.DNA/CellularMemory/prefrontalCortex/mobile-building-rules.md\`
2. Clone \`${ref?.path ?? "platforms/mobile-ui/list-screens.dna.md"}\`
3. Do not invent new header/search/list layout
`,
    );
  }

  return {
    rulesPath,
    templatesPath,
    projectKnowledgePath,
    cursorRulePath: skipped ? null : cursorRulePath,
    analysis,
    skipped,
  };
}
