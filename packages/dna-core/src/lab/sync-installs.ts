import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { spawn } from "node:child_process";
import { findDnaByHumaanInstalls, summarizeDnaInstalls, type DnaPackageInstall } from "./package-info.js";

const PKG = "@superhumaan/dna-by-humaan";

export interface LabInstallsReport {
  installs: DnaPackageInstall[];
  versions: string[];
  multiVersion: boolean;
  staleCount: number;
  warnings: string[];
  ok: boolean;
}

export function reportLabInstalls(projectRoot: string): LabInstallsReport {
  const summary = summarizeDnaInstalls(projectRoot);
  return {
    installs: summary.installs,
    versions: summary.versions,
    multiVersion: summary.multiVersion,
    staleCount: summary.staleCount,
    warnings: summary.warnings,
    ok: !summary.multiVersion && summary.staleCount === 0,
  };
}

export function formatLabInstallsReport(projectRoot: string, report: LabInstallsReport): string {
  const lines = ["DNA Lab installs", "================", ""];
  if (!report.installs.length) {
    lines.push(`No ${PKG} installs found under ${projectRoot}`);
    lines.push(`Install with: npm i ${PKG}@latest`);
    return lines.join("\n");
  }

  for (const inst of report.installs) {
    const rel = relative(projectRoot, inst.packagePath) || inst.packagePath;
    const owner = relative(projectRoot, dirname(inst.ownerPackageJson)) || ".";
    const ui = inst.hasAnalyticsUi ? "analytics-ui" : "STALE-UI";
    lines.push(`  ${inst.version.padEnd(10)} ${ui.padEnd(12)} ${rel}`);
    lines.push(`             owner: ${owner}/package.json`);
  }
  lines.push("");
  if (report.ok) {
    lines.push("✓ All installs share a current Lab UI build.");
  } else {
    for (const w of report.warnings) lines.push(`✗ ${w}`);
    lines.push("");
    lines.push("Fix: npx dna lab installs --fix");
    lines.push("Then restart every API process that mounts Lab (Node keeps the old module until restart).");
  }
  return lines.join("\n");
}

function bumpOwnerDependency(ownerPackageJson: string, version: string): boolean {
  const raw = readFileSync(ownerPackageJson, "utf8");
  const pkg = JSON.parse(raw) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
  };
  let changed = false;
  const range = `^${version.replace(/^v/, "")}`;
  for (const field of ["dependencies", "devDependencies", "optionalDependencies"] as const) {
    const block = pkg[field];
    if (block && PKG in block && block[PKG] !== range) {
      block[PKG] = range;
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(ownerPackageJson, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
  }
  return changed;
}

function runNpmInstall(cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("npm", ["install", `${PKG}@latest`], {
      cwd,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`npm install failed in ${cwd} (exit ${code})`));
    });
  });
}

export interface FixLabInstallsResult {
  ownersTouched: string[];
  installDirs: string[];
  report: LabInstallsReport;
}

/**
 * Run `npm i @superhumaan/dna-by-humaan@latest` in every package that owns an install
 * so nested backends (e.g. backend/node_modules) cannot lag the root.
 */
export async function fixLabInstalls(projectRoot: string): Promise<FixLabInstallsResult> {
  const before = findDnaByHumaanInstalls(projectRoot);
  const owners = [...new Set(before.map((i) => i.ownerPackageJson))];
  const ownersTouched: string[] = [];
  const installDirs = [...new Set(owners.map((o) => dirname(o)))];

  // Always include project root so a root dep that was only nested gets upgraded too.
  if (!installDirs.includes(projectRoot)) installDirs.unshift(projectRoot);

  for (const dir of installDirs) {
    await runNpmInstall(dir);
    const ownerPkg = join(dir, "package.json");
    const installs = findDnaByHumaanInstalls(dir);
    const ver =
      installs.find((i) => i.ownerPackageJson === ownerPkg)?.version ?? installs[0]?.version;
    if (ver && bumpOwnerDependency(ownerPkg, ver)) ownersTouched.push(ownerPkg);
  }

  return {
    ownersTouched,
    installDirs,
    report: reportLabInstalls(projectRoot),
  };
}
