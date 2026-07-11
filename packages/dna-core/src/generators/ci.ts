import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { DnaConfig, ScanResult } from "@superhumaan/dna-config";
import { ensureDir, fileExists, writeFileEnsured } from "../fs.js";
import { scanProject } from "../scanner.js";

export interface InstallCiOptions {
  root: string;
  config: DnaConfig;
  scan?: ScanResult;
  /** Skip when project already has CI workflows */
  skipIfExists?: boolean;
}

export interface InstallCiResult {
  created: string[];
  skipped: string[];
}

function pmInstallCommand(pm: string | undefined): string {
  switch (pm) {
    case "pnpm":
      return "pnpm install --frozen-lockfile";
    case "yarn":
      return "yarn install --frozen-lockfile";
    default:
      return "npm ci";
  }
}

function pmRun(pm: string | undefined, script: string): string {
  switch (pm) {
    case "pnpm":
      return `pnpm run ${script}`;
    case "yarn":
      return `yarn ${script}`;
    default:
      return `npm run ${script}`;
  }
}

function pmCache(pm: string | undefined): string | undefined {
  switch (pm) {
    case "pnpm":
      return "pnpm";
    case "yarn":
      return "yarn";
    default:
      return "npm";
  }
}

function scriptStep(
  name: string,
  script: string,
  pm: string | undefined,
  continueOnError: boolean,
): string {
  const cmd = pmRun(pm, script);
  return `      - name: ${name}
        run: ${cmd}
        continue-on-error: ${continueOnError}`;
}


export function generateCleanupFailedRunsWorkflow(): string {
  return `# DNA cleanup — delete failed workflow runs after completion
# Inline delete jobs cannot remove the current run (GitHub returns 403 while in progress).

name: Cleanup failed runs

on:
  workflow_run:
    workflows:
      - DNA CI
      - DNA Preview
      - DNA Security
    types: [completed]
  workflow_dispatch:
  schedule:
    - cron: "0 */6 * * *"

permissions:
  actions: write

jobs:
  delete-failed-run:
    if: >-
      github.event_name != 'workflow_run' ||
      (
        (github.event.workflow_run.conclusion == 'failure' ||
          github.event.workflow_run.conclusion == 'cancelled') &&
        github.event.workflow_run.name != 'Cleanup failed runs'
      )
    runs-on: ubuntu-latest
    steps:
      - name: Delete failed workflow runs
        uses: actions/github-script@v7
        with:
          script: |
            const owner = context.repo.owner;
            const repo = context.repo.repo;
            const cleanupName = "Cleanup failed runs";

            async function deleteRun(runId) {
              try {
                await github.rest.actions.deleteWorkflowRun({
                  owner,
                  repo,
                  run_id: runId,
                });
                console.log(\`Deleted run \${runId}\`);
              } catch (error) {
                console.log(\`Skip run \${runId}: \${error.message}\`);
              }
            }

            if (context.eventName === "workflow_run") {
              await deleteRun(context.payload.workflow_run.id);
              return;
            }

            const perPage = 100;
            for (let page = 1; ; page++) {
              const { data } = await github.rest.actions.listWorkflowRunsForRepo({
                owner,
                repo,
                status: "completed",
                per_page: perPage,
                page,
              });

              for (const run of data.workflow_runs) {
                if (
                  (run.conclusion === "failure" || run.conclusion === "cancelled") &&
                  run.name !== cleanupName
                ) {
                  await deleteRun(run.id);
                }
              }

              if (data.workflow_runs.length < perPage) break;
            }
`;
}

export function generateCiWorkflow(config: DnaConfig, scan: ScanResult): string {
  const pm = scan.packageManager ?? "npm";
  const cache = pmCache(pm);
  const scripts = scan.scripts;
  const threshold = config.ci?.coverageThreshold ?? 80;
  const strict = config.ci?.strict ?? false;
  const continueOnError = !strict;

  const qualitySteps: string[] = [];
  if (scripts.lint) qualitySteps.push(scriptStep("Lint", "lint", pm, continueOnError));
  if (scripts.typecheck) qualitySteps.push(scriptStep("Typecheck", "typecheck", pm, continueOnError));
  if (scripts.check) qualitySteps.push(scriptStep("Check", "check", pm, continueOnError));
  if (scripts.test) qualitySteps.push(scriptStep("Unit tests", "test", pm, continueOnError));
  if (scripts["test:coverage"]) {
    qualitySteps.push(scriptStep(`Coverage (${threshold}% gate)`, "test:coverage", pm, continueOnError));
    qualitySteps.push(`      - name: Enforce per-file + total coverage >= ${threshold}%
        run: |
          node -e "
            const { readFileSync } = require('node:fs');
            const s = JSON.parse(readFileSync('./coverage/coverage-summary.json', 'utf8'));
            const t = ${threshold};
            const fail = [];
            for (const [file, m] of Object.entries(s)) {
              if (file === 'total') continue;
              if (m.lines.pct < t) fail.push(file + ': lines ' + m.lines.pct + '%');
            }
            if (s.total.lines.pct < t) fail.push('TOTAL: ' + s.total.lines.pct + '%');
            if (fail.length) { console.error(fail.join('\\\\n')); process.exit(1); }
          "
        continue-on-error: ${continueOnError}`);
    qualitySteps.push(`      - name: Upload coverage
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage-report
          path: coverage/
          retention-days: 14`);
  }
  if (scripts.build) qualitySteps.push(scriptStep("Build", "build", pm, continueOnError));

  const cacheBlock = cache ? `          cache: ${cache}` : "";
  const qualityReportFlags = strict ? " --fail" : "";

  return `# DNA CI — generated by DNA by Humaan
# Mode: ${strict ? "strict (fail on gate violations)" : "advisory (report only — safe for public repos)"}
# Quality gates on every push: lint, test, ${threshold}% coverage (per-file + total), OWASP audit.

name: DNA CI

on:
  push:
    branches: ["**"]
  pull_request:

concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  quality:
    name: Quality gate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "22"
${cacheBlock}

      - name: Install dependencies
        run: ${pmInstallCommand(pm)}

${qualitySteps.length > 0 ? qualitySteps.join("\n\n") : `      - name: No test scripts configured
        run: echo "Add test/lint scripts to package.json"`}

      - name: DNA quality report (lint, test, coverage, SAST)
        run: npx --yes @superhumaan/dna-by-humaan quality report${qualityReportFlags}
        continue-on-error: ${continueOnError}

  docker:
    name: Docker build gate
    runs-on: ubuntu-latest
    if: \${{ hashFiles('Dockerfile') != '' }}
    steps:
      - uses: actions/checkout@v4
      - name: Build container image
        run: docker build -t dna-app:ci .
        continue-on-error: ${continueOnError}

  security:
    name: OWASP security gate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "22"
${cacheBlock}

      - name: Install dependencies
        run: ${pmInstallCommand(pm)}

      - name: Dependency audit (OWASP-aligned)
        run: npm audit --audit-level=high
        continue-on-error: ${continueOnError}

`;
}

export function generatePreviewWorkflow(config: DnaConfig, scan: ScanResult): string {
  const pm = scan.packageManager ?? "npm";
  const threshold = config.ci?.coverageThreshold ?? 80;
  const strict = config.ci?.strict ?? false;
  const continueOnError = !strict;
  const qualityReportFlags = strict ? " --fail" : "";
  const previewBranch = config.ci?.previewBranch;
  const branchFilter = previewBranch ? `    branches: ["${previewBranch}"]` : `    branches: ["**"]`;
  const provider = config.ci?.previewProvider ?? "vercel";

  const deployStep =
    provider === "netlify"
      ? `      - name: Deploy to Netlify preview
        run: npx --yes netlify-cli deploy --build --message="DNA preview"
        env:
          NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}`
      : `      - name: Deploy to Vercel preview
        run: npx --yes vercel deploy --token=\${{ secrets.VERCEL_TOKEN }} --yes
        env:
          VERCEL_ORG_ID: \${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: \${{ secrets.VERCEL_PROJECT_ID }}`;

  const deployIf =
    provider === "netlify"
      ? "secrets.NETLIFY_AUTH_TOKEN != '' && secrets.NETLIFY_SITE_ID != ''"
      : "secrets.VERCEL_TOKEN != ''";

  return `# DNA Preview — deploy preview after quality gates pass
# Provider: ${provider}${previewBranch ? ` | branch: ${previewBranch}` : " | all branches"}
# Cursor: always push to preview; CI runs gates on every push.
# Coverage threshold: ${threshold}% per file and overall

name: DNA Preview

on:
  push:
${branchFilter}

permissions:
  contents: read

jobs:
  gate-before-preview:
    name: Pre-preview quality gate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
      - name: Install
        run: ${pmInstallCommand(pm)}
      - name: DNA quality report (${threshold}% gate)
        run: npx --yes @superhumaan/dna-by-humaan quality report${qualityReportFlags}
        continue-on-error: ${continueOnError}

  deploy-preview:
    name: Deploy preview
    needs: gate-before-preview
    if: \${{ ${deployIf} }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
${deployStep}
`;
}

export function generateSecurityWorkflow(): string {
  return `# DNA Security — OWASP ZAP baseline (optional)
# Set repository variable STAGING_URL (e.g. https://staging.example.com) to enable DAST.

name: DNA Security

on:
  workflow_dispatch:
  schedule:
    - cron: "0 6 * * 1"

permissions:
  contents: read

jobs:
  zap-baseline:
    name: OWASP ZAP baseline
    if: \${{ vars.STAGING_URL != '' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: ZAP baseline scan
        uses: zaproxy/action-baseline@v0.14.0
        with:
          target: \${{ vars.STAGING_URL }}
          allow_issue_writing: false
`;
}

export function generateVitestCoverageConfig(): string {
  return `import { defineConfig } from "vitest/config";

/** DNA default — coverage thresholds enforced in CI via \`test:coverage\` */
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "json-summary"],
      include: ["src/**/*.{ts,tsx,js,jsx}"],
      exclude: [
        "**/*.test.{ts,tsx,js,jsx}",
        "**/*.spec.{ts,tsx,js,jsx}",
        "**/node_modules/**",
        "**/dist/**",
      ],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
        perFile: true,
      },
    },
  },
});
`;
}

export async function ensurePackageScripts(
  root: string,
  config: DnaConfig,
  scan: ScanResult,
): Promise<string[]> {
  const pkgPath = join(root, "package.json");
  if (!(await fileExists(pkgPath))) return [];

  const updated: string[] = [];
  const raw = await readFile(pkgPath, "utf-8");
  const pkg = JSON.parse(raw) as {
    scripts?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  const scripts = { ...(pkg.scripts ?? {}) };
  const testFw = config.stack.testing ?? scan.testFramework ?? "vitest";

  if (!scripts.test && testFw === "vitest") {
    scripts.test = "vitest run";
    updated.push('package.json script "test"');
  }
  if (!scripts["test:coverage"] && testFw === "vitest") {
    scripts["test:coverage"] = "vitest run --coverage";
    updated.push('package.json script "test:coverage"');
  }
  if (!scripts.lint) {
    scripts.lint = "eslint .";
    updated.push('package.json script "lint"');
  }
  if (!scripts.typecheck && (await fileExists(join(root, "tsconfig.json")))) {
    scripts.typecheck = "tsc --noEmit";
    updated.push('package.json script "typecheck"');
  }

  if (updated.length > 0) {
    pkg.scripts = scripts;
    await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
  }

  return updated;
}

export async function installCiPipeline(options: InstallCiOptions): Promise<InstallCiResult> {
  const { root, config, skipIfExists = false } = options;
  const scan = options.scan ?? (await scanProject(root));
  const created: string[] = [];
  const skipped: string[] = [];

  const workflowsDir = join(root, ".github", "workflows");
  const ciPath = join(workflowsDir, "dna-ci.yml");
  const securityPath = join(workflowsDir, "dna-security.yml");
  const previewPath = join(workflowsDir, "dna-preview.yml");
  const cleanupPath = join(workflowsDir, "cleanup-failed-runs.yml");

  await ensureDir(workflowsDir);

  const cleanupExists = await fileExists(cleanupPath);
  if (!skipIfExists || !cleanupExists) {
    await writeFileEnsured(cleanupPath, generateCleanupFailedRunsWorkflow());
    created.push(
      cleanupExists
        ? ".github/workflows/cleanup-failed-runs.yml (updated)"
        : ".github/workflows/cleanup-failed-runs.yml",
    );
  }

  const ciExists = await fileExists(ciPath);
  if (!skipIfExists || !ciExists) {
    await writeFileEnsured(ciPath, generateCiWorkflow(config, scan));
    created.push(ciExists ? ".github/workflows/dna-ci.yml (updated)" : ".github/workflows/dna-ci.yml");
  } else {
    skipped.push("dna-ci.yml (already exists — use dna ci install --force)");
  }

  const securityExists = await fileExists(securityPath);
  if (!skipIfExists || !securityExists) {
    await writeFileEnsured(securityPath, generateSecurityWorkflow());
    created.push(
      securityExists ? ".github/workflows/dna-security.yml (updated)" : ".github/workflows/dna-security.yml",
    );
  }

  const previewExists = await fileExists(previewPath);
  if (config.ci?.pushToPreview !== false && (!skipIfExists || !previewExists)) {
    await writeFileEnsured(previewPath, generatePreviewWorkflow(config, scan));
    created.push(
      previewExists ? ".github/workflows/dna-preview.yml (updated)" : ".github/workflows/dna-preview.yml",
    );
  }

  const testFw = config.stack.testing ?? scan.testFramework ?? "vitest";
  const vitestConfigPath = join(root, "vitest.config.ts");
  const hasVitestInVite = await fileExists(join(root, "vite.config.ts"));
  if (
    testFw === "vitest" &&
    !(await fileExists(vitestConfigPath)) &&
    !hasVitestInVite
  ) {
    await writeFileEnsured(vitestConfigPath, generateVitestCoverageConfig());
    created.push("vitest.config.ts (coverage thresholds)");
  }

  const scriptUpdates = await ensurePackageScripts(root, config, scan);
  created.push(...scriptUpdates);

  return { created, skipped };
}
