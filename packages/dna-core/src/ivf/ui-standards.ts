import { scanProject } from "../scanner.js";
import { loadDnaConfig } from "../validator.js";
import { ensureMuiFoundation } from "./mui-foundation.js";
import { ensureFeatureBuildingRules } from "./build-rules.js";
import { ensureMobileTheming } from "./mobile-theming.js";
import { ensureMobileBuildRules } from "./mobile-build-rules.js";
import { ensureSharedLibrary } from "./shared-library.js";

export interface EnsureProjectUiStandardsOptions {
  root: string;
  quote?: string;
  /** Run shared library consolidation plan too */
  includeSharedLibrary?: boolean;
}

export interface EnsureProjectUiStandardsResult {
  web: {
    mui: Awaited<ReturnType<typeof ensureMuiFoundation>> | null;
    buildRules: Awaited<ReturnType<typeof ensureFeatureBuildingRules>> | null;
    sharedLibrary: Awaited<ReturnType<typeof ensureSharedLibrary>> | null;
  };
  mobile: {
    theming: Awaited<ReturnType<typeof ensureMobileTheming>> | null;
    buildRules: Awaited<ReturnType<typeof ensureMobileBuildRules>> | null;
  };
}

function isWebFrontend(frontend: string | null | undefined): boolean {
  if (!frontend) return false;
  return ["react", "next", "nextjs", "vue", "angular"].includes(frontend.toLowerCase());
}

function isMobileFrontend(frontend: string | null | undefined): boolean {
  if (!frontend) return false;
  const f = frontend.toLowerCase();
  return f.includes("react-native") || f.includes("expo") || f === "flutter" || f.includes("mobile");
}

/**
 * Auto-bootstrap UI layers for a project. No manual vertical flags required.
 *
 * Web: MUI foundation → build rules on top → optional shared library
 * Mobile: mobile theming → mobile build rules on top
 */
export async function ensureProjectUiStandards(
  options: EnsureProjectUiStandardsOptions,
): Promise<EnsureProjectUiStandardsResult> {
  await loadDnaConfig(options.root);
  const scan = await scanProject(options.root);
  const frontend = scan.frontend;

  const result: EnsureProjectUiStandardsResult = {
    web: { mui: null, buildRules: null, sharedLibrary: null },
    mobile: { theming: null, buildRules: null },
  };

  if (isWebFrontend(frontend)) {
    result.web.mui = await ensureMuiFoundation({ root: options.root, quote: options.quote });
    result.web.buildRules = await ensureFeatureBuildingRules({ root: options.root, quote: options.quote });
    if (options.includeSharedLibrary !== false) {
      result.web.sharedLibrary = await ensureSharedLibrary({ root: options.root, quote: options.quote });
    }
  }

  if (isMobileFrontend(frontend)) {
    result.mobile.theming = await ensureMobileTheming({ root: options.root, quote: options.quote });
    result.mobile.buildRules = await ensureMobileBuildRules({ root: options.root, quote: options.quote });
  }

  return result;
}
