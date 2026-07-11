import { describe, it, expect } from "vitest";
import { detectPlatformFeaturesFromAnalysis } from "./detect-features.js";
import type { DeepAnalysis } from "../ivf/analyze.js";

function minimalAnalysis(overrides: Partial<DeepAnalysis> = {}): DeepAnalysis {
  const base: DeepAnalysis = {
    scan: {
      ciCd: [],
      docker: false,
      envFiles: [],
      docs: [],
      aiRules: [],
      securityRisks: [],
      missingDocs: [],
      missingTests: false,
      dependencies: [],
      scripts: {},
      hasDna: true,
      fileCount: 10,
      hasPackageJson: true,
      hasSourceCode: true,
    },
    config: null,
    inventory: { routes: [], apis: [], menus: [], notifications: [], pages: [] },
    structure: {
      topLevelDirs: [],
      sourceRoots: ["src"],
      hasFeaturesFolder: false,
      hasUtilsGodModule: false,
      hasAdminRoute: false,
      hasMiddlewareDir: false,
      componentDirs: [],
      apiDirs: [],
      testFileCount: 0,
    },
    authPatterns: [],
    integrations: [],
    behaviourState: {
      dnaBehaviourComplete: true,
      scatteredAiRules: [],
      behaviourFileCount: 6,
    },
    sharedLibrary: {
      isMonorepo: false,
      monorepoTool: null,
      health: "needs-work",
      hasSharedPackage: false,
      sharedPackagePaths: [],
      duplicateCount: 0,
      duplicateComponents: [],
      componentDirs: [],
      scatteredComponentDirs: false,
      hasUtilsGodModule: false,
      recommendedPackagePath: "packages/ui",
      recommendedPackageName: "@app/ui",
    },
    muiFoundation: {
      isWebProject: true,
      usesMui: false,
      muiPackages: [],
      hasThemeProvider: false,
      themeFile: null,
    },
    buildRules: {
      isWebProject: true,
      usesMui: false,
      muiPackages: [],
      listReportPages: [],
      referenceListPage: null,
      featureFolders: [],
      domainModules: [],
      referenceModule: null,
      projectKind: "web-ui",
      structureCaptured: false,
      scanRoots: ["src"],
      pagePadding: null,
      titleVariant: null,
      tableStyle: "unknown",
    },
    mobileTheming: {
      isMobileProject: false,
      mobileFramework: null,
      uiLibrary: "none",
      uiPackages: [],
      hasThemeProvider: false,
      themeFile: null,
    },
    mobileBuildRules: {
      isMobileProject: false,
      listScreens: [],
      referenceListScreen: null,
      screenPadding: "16",
    },
    stackErrors: [],
    verticalGaps: [],
  };
  return { ...base, ...overrides };
}

describe("detectPlatformFeaturesFromAnalysis", () => {
  it("detects admin portal from admin routes", () => {
    const features = detectPlatformFeaturesFromAnalysis(
      minimalAnalysis({
        structure: {
          ...minimalAnalysis().structure,
          hasAdminRoute: true,
        },
        inventory: {
          ...minimalAnalysis().inventory,
          routes: [{ type: "route", path: "/admin/users", source: "src/routes.tsx" }],
        },
      }),
    );
    expect(features).toContain("admin-portal");
  });

  it("detects rbac when auth patterns exist", () => {
    const features = detectPlatformFeaturesFromAnalysis(
      minimalAnalysis({
        authPatterns: [{ type: "jwt", source: "src/middleware/auth.ts" }],
      }),
    );
    expect(features).toContain("rbac-permissions");
  });

  it("detects supabase from integrations", () => {
    const features = detectPlatformFeaturesFromAnalysis(
      minimalAnalysis({
        integrations: [{ name: "Supabase", sources: ["src/lib/supabase.ts"] }],
        scan: { ...minimalAnalysis().scan, dependencies: ["@supabase/supabase-js"] },
      }),
    );
    expect(features).toContain("vercel-supabase");
  });
});
