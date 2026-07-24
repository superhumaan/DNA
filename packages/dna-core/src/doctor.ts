import { join } from "node:path";
import { BEHAVIOUR_FILES, DNA_CONFIG_FILE, DNA_RUNTIME_DB } from "@superhumaan/dna-config";
import { resolveGitHubToken } from "@superhumaan/dna-github";
import { fileExists } from "./fs.js";
import { loadDnaConfig, validateProject } from "./validator.js";
import { scanProject } from "./scanner.js";
import { isRealAiProvider } from "./ai-connect.js";
import { verifyAiInjection } from "./generators/ai-injector.js";
import { reportLabInstalls } from "./lab/sync-installs.js";

export interface DoctorReport {
  dna: { installed: boolean; version?: string };
  documentation: { impressionsCount: number; missing: number };
  behaviour: { files: number; missing: string[] };
  immuneSystem: { configured: boolean };
  cellularMemory: { configured: boolean };
  github: { enabled: boolean; configured: boolean; signedIn: boolean };
  ai: { enabled: boolean; provider?: string; connected: boolean };
  runtime: { enabled: boolean; configured: boolean };
  ci: { enabled: boolean; workflowInstalled: boolean };
  docker: { dockerfileInstalled: boolean };
  hooks: { prePushInstalled: boolean; hooksPathConfigured: boolean };
  preview: { enabled: boolean; workflowInstalled: boolean; provider: string };
  injection: { expected: boolean; complete: boolean; missing: string[]; stale: string[] };
  labInstalls: {
    count: number;
    versions: string[];
    multiVersion: boolean;
    staleCount: number;
    ok: boolean;
    warnings: string[];
  };
  sourceMaps: { count: number; scanned: number };
  validation: { valid: boolean; issueCount: number };
}

async function isGitHubSignedIn(): Promise<boolean> {
  const creds = await resolveGitHubToken();
  return !!creds?.token;
}

export async function runDoctor(root: string): Promise<DoctorReport> {
  const config = await loadDnaConfig(root);
  const validation = await validateProject(root);
  const scan = await scanProject(root);

  const behaviourMissing: string[] = [];
  for (const file of BEHAVIOUR_FILES) {
    if (!(await fileExists(join(root, ".DNA", "behaviour", file)))) {
      behaviourMissing.push(file);
    }
  }

  const immuneConfigured = await fileExists(join(root, ".DNA", "immuneSystem", "rules.json"));
  const memoryConfigured = await fileExists(
    join(root, ".DNA", "CellularMemory", "hippocampus", "project-summary.md"),
  );
  const runtimeDb = await fileExists(join(root, DNA_RUNTIME_DB));
  const runtimeJsonl = await fileExists(join(root, ".DNA", "runtime", "events.jsonl"));
  const runtimeConfigured = runtimeDb || runtimeJsonl;
  const ciWorkflow = await fileExists(join(root, ".github", "workflows", "dna-ci.yml"));
  const previewWorkflow = await fileExists(join(root, ".github", "workflows", "dna-preview.yml"));
  const dockerfile = await fileExists(join(root, "Dockerfile"));
  const prePushHook = await fileExists(join(root, ".DNA", "hooks", "pre-push"));
  let hooksPathConfigured = false;
  try {
    const { git } = await import("@superhumaan/dna-github");
    const g = git(root);
    if (await g.checkIsRepo()) {
      const hooksPath = await g.getConfig("core.hooksPath");
      hooksPathConfigured = hooksPath.value === ".DNA/hooks";
    }
  } catch {
    // not a git repo
  }
  const githubSignedIn = await isGitHubSignedIn();
  const injection = config
    ? await verifyAiInjection(root, config)
    : { expected: false, complete: true, missing: [], stale: [] };
  const labInstallsReport = reportLabInstalls(root);
  const labInstalls = {
    count: labInstallsReport.installs.length,
    versions: labInstallsReport.versions,
    multiVersion: labInstallsReport.multiVersion,
    staleCount: labInstallsReport.staleCount,
    ok: labInstallsReport.ok || labInstallsReport.installs.length === 0,
    warnings: labInstallsReport.warnings,
  };

  let sourceMaps = { count: 0, scanned: 0 };
  try {
    const { scanAndRegisterSourceMaps } = await import("./lab/scan-sourcemaps.js");
    const { listSourceMapMeta } = await import("./lab/storage.js");
    const scanned = await scanAndRegisterSourceMaps(root);
    const listed = await listSourceMapMeta(root);
    sourceMaps = { count: listed.length, scanned: scanned.registered };
  } catch {
    /* non-fatal */
  }

  return {
    dna: {
      installed: await fileExists(join(root, DNA_CONFIG_FILE)),
      version: config?.version,
    },
    documentation: {
      impressionsCount: scan.docs.filter((d) => d.startsWith("DNA/")).length,
      missing: scan.missingDocs.length,
    },
    behaviour: {
      files: BEHAVIOUR_FILES.length - behaviourMissing.length,
      missing: behaviourMissing,
    },
    immuneSystem: { configured: immuneConfigured },
    cellularMemory: { configured: memoryConfigured },
    github: {
      enabled: config?.github?.enabled ?? false,
      configured: !!(config?.github?.owner && config?.github?.repo),
      signedIn: githubSignedIn,
    },
    ai: {
      enabled: config?.ai?.enabled ?? false,
      provider: config?.ai?.provider,
      connected: isRealAiProvider(config?.ai?.provider),
    },
    runtime: {
      enabled: config?.runtime?.enabled ?? false,
      configured: runtimeConfigured,
    },
    ci: {
      enabled: config?.ci?.enabled ?? false,
      workflowInstalled: ciWorkflow,
    },
    docker: { dockerfileInstalled: dockerfile },
    hooks: { prePushInstalled: prePushHook, hooksPathConfigured },
    preview: {
      enabled: config?.ci?.pushToPreview ?? false,
      workflowInstalled: previewWorkflow,
      provider: config?.ci?.previewProvider ?? "vercel",
    },
    injection: {
      expected: injection.expected,
      complete: injection.complete,
      missing: injection.missing,
      stale: injection.stale,
    },
    labInstalls,
    sourceMaps,
    validation: {
      valid: validation.valid,
      issueCount: validation.errors.length,
    },
  };
}

/**
 * Fast doctor snapshot for Lab `/data` polling.
 * Skips GitHub auth, full scan, and injection verify — those hang or take seconds under watch.
 */
export async function runDoctorLite(root: string): Promise<DoctorReport> {
  const config = await loadDnaConfig(root);
  const dnaInstalled = await fileExists(join(root, DNA_CONFIG_FILE));

  const behaviourMissing: string[] = [];
  for (const file of BEHAVIOUR_FILES) {
    if (!(await fileExists(join(root, ".DNA", "behaviour", file)))) {
      behaviourMissing.push(file);
    }
  }

  const immuneConfigured = await fileExists(join(root, ".DNA", "immuneSystem", "rules.json"));
  const memoryConfigured = await fileExists(
    join(root, ".DNA", "CellularMemory", "hippocampus", "project-summary.md"),
  );
  const runtimeDb = await fileExists(join(root, DNA_RUNTIME_DB));
  const runtimeJsonl = await fileExists(join(root, ".DNA", "runtime", "events.jsonl"));
  const ciWorkflow = await fileExists(join(root, ".github", "workflows", "dna-ci.yml"));
  const previewWorkflow = await fileExists(join(root, ".github", "workflows", "dna-preview.yml"));
  const dockerfile = await fileExists(join(root, "Dockerfile"));
  const prePushHook = await fileExists(join(root, ".DNA", "hooks", "pre-push"));
  const labInstallsReport = reportLabInstalls(root);
  const labInstalls = {
    count: labInstallsReport.installs.length,
    versions: labInstallsReport.versions,
    multiVersion: labInstallsReport.multiVersion,
    staleCount: labInstallsReport.staleCount,
    ok: labInstallsReport.ok || labInstallsReport.installs.length === 0,
    warnings: labInstallsReport.warnings,
  };

  return {
    dna: { installed: dnaInstalled, version: config?.version },
    documentation: { impressionsCount: 0, missing: 0 },
    behaviour: {
      files: BEHAVIOUR_FILES.length - behaviourMissing.length,
      missing: behaviourMissing,
    },
    immuneSystem: { configured: immuneConfigured },
    cellularMemory: { configured: memoryConfigured },
    github: {
      enabled: config?.github?.enabled ?? false,
      configured: !!(config?.github?.owner && config?.github?.repo),
      signedIn: false,
    },
    ai: {
      enabled: config?.ai?.enabled ?? false,
      provider: config?.ai?.provider,
      connected: isRealAiProvider(config?.ai?.provider),
    },
    runtime: {
      enabled: config?.runtime?.enabled ?? false,
      configured: runtimeDb || runtimeJsonl,
    },
    ci: {
      enabled: config?.ci?.enabled ?? false,
      workflowInstalled: ciWorkflow,
    },
    docker: { dockerfileInstalled: dockerfile },
    hooks: { prePushInstalled: prePushHook, hooksPathConfigured: false },
    preview: {
      enabled: config?.ci?.pushToPreview ?? false,
      workflowInstalled: previewWorkflow,
      provider: config?.ci?.previewProvider ?? "vercel",
    },
    injection: { expected: false, complete: true, missing: [], stale: [] },
    labInstalls,
    sourceMaps: { count: 0, scanned: 0 },
    validation: {
      valid: dnaInstalled && behaviourMissing.length === 0,
      issueCount: behaviourMissing.length + (dnaInstalled ? 0 : 1),
    },
  };
}

export function formatDoctorReport(report: DoctorReport): string {
  const status = (ok: boolean) => (ok ? "✓" : "✗");
  const labLine = report.labInstalls.count
    ? `${status(report.labInstalls.ok)} Lab package installs (${report.labInstalls.count} path(s), ${report.labInstalls.versions.join("|") || "none"})${
        report.labInstalls.ok ? "" : " — run dna lab installs --fix"
      }`
    : `${status(true)} Lab package installs (none scanned)`;
  const lines = [
    "DNA Doctor",
    "==========",
    "",
    `${status(report.dna.installed)} DNA installed${report.dna.version ? ` (v${report.dna.version})` : ""}`,
    `${status(report.documentation.missing === 0)} Documentation (${report.documentation.missing} missing Impressions)`,
    `${status(report.behaviour.missing.length === 0)} Behaviour (${report.behaviour.files}/${BEHAVIOUR_FILES.length} files)`,
    `${status(report.immuneSystem.configured)} Immune System`,
    `${status(report.cellularMemory.configured)} CellularMemory`,
    `${status(report.github.configured && (!report.github.enabled || report.github.signedIn))} GitHub integration${
      report.github.enabled
        ? report.github.configured
          ? report.github.signedIn
            ? ""
            : " (run dna github login)"
          : " (run dna github connect)"
        : " (disabled)"
    }`,
    `${status(!report.ai.enabled || report.ai.connected)} AI integration${
      report.ai.enabled
        ? report.ai.connected
          ? ` (${report.ai.provider})`
          : " (run dna ai connect)"
        : " (disabled)"
    }`,
    `${status(report.runtime.configured || !report.runtime.enabled)} Runtime storage${report.runtime.enabled ? "" : " (disabled)"}`,
    `${status(!report.ci.enabled || report.ci.workflowInstalled)} CI pipeline${report.ci.enabled ? "" : " (disabled)"}`,
    `${status(report.docker.dockerfileInstalled || !report.ci.enabled)} Docker scaffold`,
    `${status(report.hooks.prePushInstalled && report.hooks.hooksPathConfigured)} Git hooks (pre-push quality gate)`,
    `${status(!report.preview.enabled || report.preview.workflowInstalled)} Preview deploy${report.preview.enabled ? ` (${report.preview.provider})` : " (disabled)"}`,
    `${status(!report.injection.expected || report.injection.complete)} AI injection (Cursor + Claude always-on)${
      report.injection.expected && !report.injection.complete
        ? ` (${report.injection.missing.length} missing, ${report.injection.stale.length} stale — run dna doctor)`
        : report.injection.expected
          ? ""
          : " (disabled)"
    }`,
    labLine,
    `${status(report.sourceMaps.count > 0)} Source maps (${report.sourceMaps.count} registered${report.sourceMaps.scanned ? `, scanned ${report.sourceMaps.scanned}` : ""})`,
    "",
    `${status(report.validation.valid)} Validation (${report.validation.issueCount} issues)`,
  ];
  if (!report.labInstalls.ok && report.labInstalls.warnings.length) {
    for (const w of report.labInstalls.warnings) lines.push(`  · ${w}`);
  }
  return lines.join("\n");
}
