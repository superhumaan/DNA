import fg from "fast-glob";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { DnaConfig, ScanResult } from "@superhumaan/dna-config";
import {
  BEHAVIOUR_FILES,
  DNA_CONFIG_FILE,
  IMPRESSIONS_PATHS,
  NEURAL_NETWORK_ALT,
  NEURAL_NETWORK_FILE,
} from "@superhumaan/dna-config";
import { fileExists } from "../fs.js";
import { scanProject } from "../scanner.js";
import { scanSurfaceInventory, type SurfaceInventory } from "../rbac/inventory.js";
import { loadDnaConfig } from "../validator.js";
import { validateStackCompatibility } from "../stack/validate.js";
import {
  DEFAULT_IVF_VERTICALS,
  getVerticalName,
  type IvfVerticalId,
  type VerticalGap,
  type VerticalGapPriority,
} from "./verticals.js";
import { analyzeSharedLibrary, type SharedLibraryAnalysis } from "./shared-library.js";
import { analyzeMuiFoundation, type MuiFoundationAnalysis } from "./mui-foundation.js";
import { analyzeFeaturePatterns, type FeaturePatternAnalysis } from "./build-rules.js";
import { analyzeMobileTheming, type MobileThemingAnalysis } from "./mobile-theming.js";
import { analyzeMobileBuildRules, type MobileBuildRulesAnalysis } from "./mobile-build-rules.js";

const SOURCE_GLOB = ["**/*.{ts,tsx,js,jsx,vue}"];
const IGNORE = ["**/node_modules/**", "**/dist/**", "**/.DNA/**", "**/DNA/**", "**/.next/**"];

const AUTH_PATTERNS = [
  /passport/i,
  /next-auth|NextAuth/i,
  /@clerk\//,
  /auth0/i,
  /supabase\.auth/i,
  /getSession|useSession|requireAuth|isAuthenticated/i,
  /jwt\.verify|jsonwebtoken/i,
  /middleware.*auth/i,
];

const INTEGRATION_PATTERNS: { name: string; pattern: RegExp }[] = [
  { name: "Stripe", pattern: /stripe/i },
  { name: "SendGrid", pattern: /sendgrid|@sendgrid/i },
  { name: "Twilio", pattern: /twilio/i },
  { name: "AWS SDK", pattern: /@aws-sdk|aws-sdk/i },
  { name: "Azure", pattern: /@azure\//i },
  { name: "Google APIs", pattern: /googleapis|@google-cloud/i },
  { name: "OpenAI", pattern: /openai|@anthropic-ai/i },
  { name: "Supabase", pattern: /@supabase\//i },
  { name: "Prisma", pattern: /@prisma\//i },
  { name: "Sentry", pattern: /@sentry\//i },
];

export interface ProjectStructure {
  topLevelDirs: string[];
  sourceRoots: string[];
  hasFeaturesFolder: boolean;
  hasUtilsGodModule: boolean;
  hasAdminRoute: boolean;
  hasMiddlewareDir: boolean;
  componentDirs: string[];
  apiDirs: string[];
  testFileCount: number;
}

export interface AuthPattern {
  type: string;
  source: string;
}

export interface DetectedIntegration {
  name: string;
  sources: string[];
}

export interface BehaviourState {
  dnaBehaviourComplete: boolean;
  scatteredAiRules: string[];
  behaviourFileCount: number;
}

export interface DeepAnalysis {
  scan: ScanResult;
  config: DnaConfig | null;
  inventory: SurfaceInventory;
  structure: ProjectStructure;
  authPatterns: AuthPattern[];
  integrations: DetectedIntegration[];
  behaviourState: BehaviourState;
  sharedLibrary: SharedLibraryAnalysis;
  muiFoundation: MuiFoundationAnalysis;
  buildRules: FeaturePatternAnalysis;
  mobileTheming: MobileThemingAnalysis;
  mobileBuildRules: MobileBuildRulesAnalysis;
  stackErrors: ReturnType<typeof validateStackCompatibility>;
  verticalGaps: VerticalGap[];
}

async function detectStructure(root: string): Promise<ProjectStructure> {
  const entries = await readdir(root, { withFileTypes: true });
  const topLevelDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  const sourceRoots: string[] = [];
  for (const candidate of ["src", "app", "apps", "packages", "lib", "server"]) {
    if (topLevelDirs.includes(candidate)) sourceRoots.push(candidate);
  }
  if (!sourceRoots.length) sourceRoots.push(".");

  const files = await fg(SOURCE_GLOB, { cwd: root, ignore: IGNORE });

  const hasFeaturesFolder = files.some((f) => f.includes("/features/") || f.startsWith("features/"));
  const hasUtilsGodModule = files.some(
    (f) =>
      (f.endsWith("/utils/index.ts") ||
        f.endsWith("/utils.ts") ||
        f.endsWith("/helpers.ts") ||
        f.endsWith("/lib/utils.ts")) &&
      files.filter((x) => x.includes("/utils/")).length > 8,
  );
  const hasAdminRoute =
    files.some((f) => f.includes("/admin/") || f.includes("admin-portal")) ||
    (await scanSurfaceInventory(root)).routes.some((r) => r.path.includes("/admin"));

  const hasMiddlewareDir = files.some((f) => f.includes("/middleware/") || f.endsWith("/middleware.ts"));

  const componentDirs = [...new Set(files.filter((f) => f.includes("/components/")).map((f) => f.split("/components/")[0]))];
  const apiDirs = [...new Set(files.filter((f) => f.includes("/api/") || f.includes("/routes/")).map((f) => f.split("/")[0]))];
  const testFileCount = files.filter((f) => f.includes(".test.") || f.includes(".spec.")).length;

  return {
    topLevelDirs,
    sourceRoots,
    hasFeaturesFolder,
    hasUtilsGodModule,
    hasAdminRoute,
    hasMiddlewareDir,
    componentDirs: componentDirs.slice(0, 10),
    apiDirs: apiDirs.slice(0, 10),
    testFileCount,
  };
}

async function detectAuthPatterns(root: string): Promise<AuthPattern[]> {
  const files = await fg(SOURCE_GLOB, { cwd: root, ignore: IGNORE, absolute: true });
  const found: AuthPattern[] = [];
  const seen = new Set<string>();

  for (const file of files.slice(0, 200)) {
    let content: string;
    try {
      content = await readFile(file, "utf-8");
    } catch {
      continue;
    }

    for (const pattern of AUTH_PATTERNS) {
      if (pattern.test(content)) {
        const type = pattern.source.replace(/\\/g, "").slice(0, 40);
        const key = `${type}:${file}`;
        if (!seen.has(key)) {
          seen.add(key);
          found.push({ type, source: file.replace(root + "/", "") });
        }
      }
    }
  }

  return found.slice(0, 20);
}

async function detectIntegrations(root: string): Promise<DetectedIntegration[]> {
  const files = await fg(SOURCE_GLOB, { cwd: root, ignore: IGNORE, absolute: true });
  const map = new Map<string, Set<string>>();

  for (const file of files.slice(0, 300)) {
    let content: string;
    try {
      content = await readFile(file, "utf-8");
    } catch {
      continue;
    }

    const rel = file.replace(root + "/", "");
    for (const { name, pattern } of INTEGRATION_PATTERNS) {
      if (pattern.test(content)) {
        const sources = map.get(name) ?? new Set();
        sources.add(rel);
        map.set(name, sources);
      }
    }
  }

  return [...map.entries()].map(([name, sources]) => ({
    name,
    sources: [...sources].slice(0, 5),
  }));
}

async function assessBehaviourState(root: string, scan: ScanResult): Promise<BehaviourState> {
  let behaviourFileCount = 0;
  for (const file of BEHAVIOUR_FILES) {
    if (await fileExists(join(root, ".DNA", "behaviour", file))) behaviourFileCount++;
  }

  return {
    dnaBehaviourComplete: behaviourFileCount === BEHAVIOUR_FILES.length,
    scatteredAiRules: scan.aiRules,
    behaviourFileCount,
  };
}

function gap(
  vertical: IvfVerticalId,
  currentState: string,
  targetState: string,
  restructureNeeded: boolean,
  priority: VerticalGapPriority,
  why: string,
  actions: string[],
): VerticalGap {
  return {
    vertical,
    name: getVerticalName(vertical),
    currentState,
    targetState,
    restructureNeeded,
    priority,
    why,
    actions,
  };
}

export function assessVerticalGaps(
  analysis: Omit<DeepAnalysis, "verticalGaps">,
  selectedVerticals: IvfVerticalId[] = DEFAULT_IVF_VERTICALS,
): VerticalGap[] {
  const gaps: VerticalGap[] = [];
  const { scan, config, structure, authPatterns, behaviourState } = analysis;
  const selected = new Set(selectedVerticals);

  if (selected.has("behaviour")) {
    const scattered = behaviourState.scatteredAiRules.length > 0;
    const complete = behaviourState.dnaBehaviourComplete;
    gaps.push(
      gap(
        "behaviour",
        complete
          ? `${behaviourState.behaviourFileCount}/6 behaviour files present`
          : scattered
            ? `Scattered AI rules (${behaviourState.scatteredAiRules.join(", ") || "none"})`
            : "No DNA behaviour layer",
        "Six behaviour files in .DNA/behaviour/",
        scattered && complete,
        scattered ? "P1" : complete ? "P3" : "P0",
        scattered
          ? "Conflicting AI instructions between .cursorrules and Behaviour"
          : "AI tools need one source of truth before integration work",
        scattered
          ? ["Consolidate .cursorrules into .DNA/behaviour/ai.behaviour.md", "Remove duplicate AI rule files"]
          : complete
            ? ["Review behaviour files match project conventions"]
            : ["Run dna init to scaffold behaviour files", "Customize coding.behaviour.md for this repo"],
      ),
    );
  }

  if (selected.has("cellularMemory")) {
    const hasMemory = scan.hasDna;
    gaps.push(
      gap(
        "cellularMemory",
        hasMemory ? "DNA CellularMemory scaffolded" : "No project memory layer",
        "Seven memory regions with live system map",
        !hasMemory,
        hasMemory ? "P2" : "P0",
        "AI and runtime need project history and system maps",
        hasMemory
          ? ["Run dna document --from-code to seed parietalLobe/system-map.md", "Run dna watch during development"]
          : ["Run dna init", "Seed parietalLobe from code analysis"],
      ),
    );
  }

  if (selected.has("runtime")) {
    const hasBackend = !!scan.backend;
    const runtimeEnabled = config?.runtime?.enabled;
    gaps.push(
      gap(
        "runtime",
        runtimeEnabled
          ? "Runtime observer enabled"
          : hasBackend
            ? `Backend (${scan.backend}) without DNA runtime`
            : "No backend detected",
        "dnaRuntime middleware + Immune System classification",
        hasBackend && !runtimeEnabled,
        hasBackend && !runtimeEnabled ? "P1" : "P3",
        "Classify production errors with project context, not generic stack traces",
        hasBackend
          ? ["pnpm add @superhumaan/dna-by-humaan", "dna runtime install", "Wire express/fastify/next adapter"]
          : ["Enable when API server is added"],
      ),
    );
  }

  if (selected.has("rbac")) {
    const hasAuth = authPatterns.length > 0;
    const hasCentralMiddleware = structure.hasMiddlewareDir;
    gaps.push(
      gap(
        "rbac",
        hasAuth
          ? `Auth detected (${authPatterns.length} patterns)${hasCentralMiddleware ? ", middleware dir present" : ", no central middleware"}`
          : "No auth patterns detected",
        "Permission matrix + server middleware + surface hiding",
        hasAuth && !hasCentralMiddleware,
        hasAuth ? (hasCentralMiddleware ? "P2" : "P1") : "P2",
        "RBAC plans need a single server enforcement point",
        [
          "dna plan rbac --quote \"...\"",
          hasCentralMiddleware ? "Extend existing middleware" : "Create src/middleware/auth.ts or api/middleware/",
          "Hide admin routes and menus from unauthorized roles",
        ],
      ),
    );
  }

  if (selected.has("compliance")) {
    const compliance = config?.compliance ?? "none";
    gaps.push(
      gap(
        "compliance",
        compliance === "none" ? "No compliance framework configured" : `Framework: ${compliance}`,
        "Tiered control matrix + GDPR document checklist",
        compliance === "none",
        compliance === "none" ? "P2" : "P1",
        "Document data flows before adding controls",
        [
          "dna plan compliance --frameworks gdpr,iso27001",
          "dna document --from-code (data-flow, integration-map)",
          "dna compliance install-examples (if GDPR)",
        ],
      ),
    );
  }

  if (selected.has("platform")) {
    gaps.push(
      gap(
        "platform",
        structure.hasAdminRoute ? "Admin route group detected" : "No /admin route group",
        "Admin shell for platform features (directory, flags, audit)",
        !structure.hasAdminRoute,
        structure.hasAdminRoute ? "P2" : "P1",
        "Platform feature plans assume an admin surface exists",
        structure.hasAdminRoute
          ? ["dna plan feature admin-portal", "Wire requireAdmin on admin APIs"]
          : ["Scaffold /admin or /app/admin route group", "dna plan feature admin-portal"],
      ),
    );
  }

  if (selected.has("knowledge")) {
    const packs = config?.knowledgePacks?.length ?? 0;
    gaps.push(
      gap(
        "knowledge",
        packs > 0 ? `${packs} knowledge pack(s) installed` : "No knowledge packs",
        "Stack-matched packs in .DNA/knowledge/",
        packs === 0,
        packs === 0 ? "P1" : "P3",
        "AI loads correct patterns per task instead of guessing",
        [
          scan.frontend ? `dna marketplace install frameworks/${scan.frontend}` : "dna marketplace list",
          config?.compliance && config.compliance !== "none"
            ? `dna marketplace install compliance/${config.compliance}`
            : "",
        ].filter(Boolean),
      ),
    );
  }

  if (selected.has("neuralNetwork")) {
    gaps.push(
      gap(
        "neuralNetwork",
        scan.hasDna ? "neuralNetwork.json present" : "No intent routing",
        "Intent → knowledge/behaviour/memory routing",
        !scan.hasDna,
        scan.hasDna ? "P2" : "P0",
        "dna context returns only relevant chunks per task type",
        scan.hasDna
          ? ["Align folder layout with neuralNetwork intents", "Add custom intents for feature folders"]
          : ["Run dna init to generate neuralNetwork.json"],
      ),
    );
  }

  if (selected.has("sharedLibrary")) {
    const sl = analysis.sharedLibrary;
    const needsPackage = !sl.hasSharedPackage;
    const hasDupes = sl.duplicateCount > 0;
    gaps.push(
      gap(
        "sharedLibrary",
        sl.hasSharedPackage
          ? `Shared package at ${sl.sharedPackagePaths.join(", ")}${hasDupes ? `, ${sl.duplicateCount} duplicate component name(s)` : ""}`
          : hasDupes
            ? `No shared library — ${sl.duplicateCount} duplicate component name(s) across scopes`
            : sl.scatteredComponentDirs
              ? `Scattered component dirs (${sl.componentDirs.length}) — no shared package`
              : "No shared component library",
        `Canonical UI in ${sl.recommendedPackagePath} (${sl.recommendedPackageName})`,
        needsPackage || hasDupes || sl.scatteredComponentDirs,
        sl.health === "critical" ? "P0" : sl.health === "needs-work" ? "P1" : "P3",
        "Duplicated components drift in style and behaviour — a shared library standardises UI and reduces maintenance",
        [
          "Run ensureSharedLibrary (via dna plan ivf --verticals sharedLibrary)",
          sl.hasSharedPackage
            ? `Extract duplicates into ${sl.sharedPackagePaths[0]} — see shared-library plan`
            : `Scaffold ${sl.recommendedPackagePath} and wire workspace imports`,
          hasDupes
            ? `Replace copies: ${sl.duplicateComponents
                .slice(0, 3)
                .map((d) => d.name)
                .join(", ")}${sl.duplicateCount > 3 ? "…" : ""}`
            : "Move primitives (Button, Input, Modal) into shared lib before they duplicate",
          "Update occipitalLobe/ui-patterns.md with import conventions",
          "dna validate — confirm no DUPLICATE_COMPONENTS warnings",
        ],
      ),
    );
  }

  if (selected.has("mui")) {
    const mui = analysis.muiFoundation;
    if (mui.isWebProject) {
      gaps.push(
        gap(
          "mui",
          mui.usesMui
            ? `MUI installed (${mui.muiPackages.join(", ")})${mui.hasThemeProvider ? ", ThemeProvider present" : ", no ThemeProvider"}`
            : "Web project without MUI foundation",
          "Material UI theme + primitives — use MUI fully when no build rules exist",
          !mui.usesMui || !mui.hasThemeProvider,
          !mui.usesMui ? "P1" : !mui.hasThemeProvider ? "P2" : "P3",
          "MUI is the web foundation layer; build rules sit on top",
          [
            "MUI foundation auto-configured on init/context (tools/mui knowledge pack)",
            !mui.usesMui ? "Install @mui/material @mui/icons-material @emotion/react @emotion/styled" : "Wire ThemeProvider at app root",
            "Document tokens in occipitalLobe/visual-standards.md",
          ],
        ),
      );
    }
  }

  if (selected.has("buildRules")) {
    const br = analysis.buildRules;
    if (br.isWebProject) {
      const hasRef = !!br.referenceListPage;
      gaps.push(
        gap(
          "buildRules",
          hasRef
            ? `Reference list page: ${br.referenceListPage!.path}`
            : br.listReportPages.length
              ? `${br.listReportPages.length} list page candidate(s) — no strong reference`
              : "No build rules captured — using MUI defaults",
          "Project build rules on top of MUI (clone reference for new reports)",
          !hasRef,
          hasRef ? "P3" : "P2",
          "Build rules prevent Cursor from inventing layout; without them, MUI foundation defaults apply",
          [
            "Build rules auto-configured on init/context",
            hasRef ? `Clone ${br.referenceListPage!.path} for new list/report pages` : "Add a list page, then DNA captures it as reference",
            "Read prefrontalCortex/feature-building-rules.md before new features",
          ],
        ),
      );
    }
  }

  if (selected.has("mobileTheming")) {
    const mt = analysis.mobileTheming;
    if (mt.isMobileProject) {
      gaps.push(
        gap(
          "mobileTheming",
          mt.uiPackages.length
            ? `${mt.uiLibrary} (${mt.uiPackages.slice(0, 3).join(", ")})`
            : "Mobile project without theme foundation",
          "Single mobile theme provider + design tokens",
          !mt.hasThemeProvider,
          !mt.uiPackages.length ? "P1" : !mt.hasThemeProvider ? "P2" : "P3",
          "Mobile theming is the foundation; mobile build rules sit on top",
          [
            "Mobile theming auto-configured on init/context",
            mt.uiLibrary === "none" ? "Default to react-native-paper (MD3)" : `Standardise on ${mt.uiLibrary}`,
            "Document tokens in occipitalLobe/visual-standards.md",
          ],
        ),
      );
    }
  }

  if (selected.has("mobileBuildRules")) {
    const mbr = analysis.mobileBuildRules;
    if (mbr.isMobileProject) {
      const hasRef = !!mbr.referenceListScreen;
      gaps.push(
        gap(
          "mobileBuildRules",
          hasRef
            ? `Reference list screen: ${mbr.referenceListScreen!.path}`
            : "No mobile build rules — using mobile-ui defaults",
          "Mobile screen patterns on top of theming",
          !hasRef,
          hasRef ? "P3" : "P2",
          "Without build rules, use platforms/mobile-ui/list-screens.dna.md in full",
          [
            "Mobile build rules auto-configured on init/context",
            hasRef ? `Clone ${mbr.referenceListScreen!.path} for new list screens` : "Add a list screen to capture reference",
            "Read prefrontalCortex/mobile-building-rules.md",
          ],
        ),
      );
    }
  }

  if (selected.has("impressions")) {
    const missing = scan.hasDna
      ? scan.missingDocs.length
      : IMPRESSIONS_PATHS.length;
    const total = IMPRESSIONS_PATHS.length;
    const actualMissing = scan.hasDna ? missing : total;
    gaps.push(
      gap(
        "impressions",
        actualMissing === 0 ? "All Impressions paths present" : `${actualMissing}/${total} Impressions missing`,
        "Accurate as-is docs in DNA/Impressions/",
        actualMissing > 0,
        actualMissing > total / 2 ? "P0" : actualMissing > 0 ? "P1" : "P3",
        "Humans and auditors read Impressions; AI references them for architecture",
        ["dna document --from-code", "Review and refine generated architecture docs", "Do not mix with .DNA machine files"],
      ),
    );
  }

  const priorityOrder: Record<VerticalGapPriority, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
  return gaps.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

export async function analyzeProject(
  root: string,
  options?: { verticals?: IvfVerticalId[] },
): Promise<DeepAnalysis> {
  const scan = await scanProject(root);
  const config = await loadDnaConfig(root);
  const inventory = await scanSurfaceInventory(root);
  const structure = await detectStructure(root);
  const authPatterns = await detectAuthPatterns(root);
  const integrations = await detectIntegrations(root);
  const behaviourState = await assessBehaviourState(root, scan);
  const sharedLibrary = await analyzeSharedLibrary(root);
  const muiFoundation = await analyzeMuiFoundation(root);
  const buildRules = await analyzeFeaturePatterns(root);
  const mobileTheming = await analyzeMobileTheming(root);
  const mobileBuildRules = await analyzeMobileBuildRules(root);
  const stackErrors = validateStackCompatibility(config, scan);

  const partial = {
    scan,
    config,
    inventory,
    structure,
    authPatterns,
    integrations,
    behaviourState,
    sharedLibrary,
    muiFoundation,
    buildRules,
    mobileTheming,
    mobileBuildRules,
    stackErrors,
  };

  const verticalGaps = assessVerticalGaps(partial, options?.verticals);

  return { ...partial, verticalGaps };
}

export function formatAnalysisSummary(analysis: DeepAnalysis): string {
  const { scan, structure, inventory, authPatterns, integrations, sharedLibrary, verticalGaps, stackErrors } =
    analysis;

  const lines = [
    "DNA Deep Analysis",
    "=================",
    "",
    `Package manager: ${scan.packageManager ?? "unknown"}`,
    `Frontend:        ${scan.frontend ?? "not detected"}`,
    `Backend:         ${scan.backend ?? "not detected"}`,
    `Database:        ${scan.database ?? "not detected"}`,
    `Stage:           ${analysis.config?.stage ?? "unknown"}`,
    `DNA installed:   ${scan.hasDna ? "yes" : "no"}`,
    "",
    "Structure",
    `  Source roots:     ${structure.sourceRoots.join(", ")}`,
    `  Features folder:  ${structure.hasFeaturesFolder ? "yes" : "no"}`,
    `  Admin routes:     ${structure.hasAdminRoute ? "yes" : "no"}`,
    `  Middleware dir:   ${structure.hasMiddlewareDir ? "yes" : "no"}`,
    `  Utils god-module: ${structure.hasUtilsGodModule ? "yes (consider splitting)" : "no"}`,
    `  Test files:       ${structure.testFileCount}`,
    "",
    "Surfaces",
    `  Routes:       ${inventory.routes.length}`,
    `  API endpoints: ${inventory.apis.length}`,
    `  Pages:        ${inventory.pages.length}`,
    "",
    `Auth patterns: ${authPatterns.length}`,
    ...authPatterns.slice(0, 5).map((a) => `  • ${a.type} in ${a.source}`),
    "",
    `Integrations: ${integrations.length}`,
    ...integrations.map((i) => `  • ${i.name} (${i.sources.length} file(s))`),
    "",
    "Shared library",
    `  Health:        ${sharedLibrary.health}`,
    `  Shared pkg:    ${sharedLibrary.hasSharedPackage ? sharedLibrary.sharedPackagePaths.join(", ") : "none"}`,
    `  Duplicates:    ${sharedLibrary.duplicateCount}`,
    `  Recommended:   ${sharedLibrary.recommendedPackagePath}`,
    "",
  ];

  if (stackErrors.length) {
    lines.push("Stack issues:", ...stackErrors.map((e) => `  ⚠ ${e.message}`), "");
  }

  lines.push("Vertical gaps (by priority):", "");
  for (const g of verticalGaps) {
    lines.push(`  [${g.priority}] ${g.name}: ${g.currentState}`);
    lines.push(`       → ${g.targetState}${g.restructureNeeded ? " (restructure needed)" : ""}`);
  }

  return lines.join("\n");
}

export async function hasNeuralNetwork(root: string): Promise<boolean> {
  return (
    (await fileExists(join(root, NEURAL_NETWORK_FILE))) ||
    (await fileExists(join(root, NEURAL_NETWORK_ALT)))
  );
}

export async function hasDnaConfig(root: string): Promise<boolean> {
  return fileExists(join(root, DNA_CONFIG_FILE));
}
