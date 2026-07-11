import { glob } from "../glob.js";
import { exec } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join, relative, basename, extname } from "node:path";
import { promisify } from "node:util";
import { git } from "@superhumaan/dna-github";
import { scanProject } from "../scanner.js";
import { writeFileEnsured } from "../fs.js";
import {
  isVendorPath,
  LARGE_FILE_LINE_THRESHOLD,
  SOURCE_GLOBS,
  SOURCE_IGNORE,
  STATIC_PATTERNS,
} from "./patterns.js";
import { formatQualityReportMarkdown } from "./report.js";
import type {
  QualityIssue,
  QualityReport,
  QualitySeverity,
  RunQualityAnalysisOptions,
  ToolchainResult,
  WriteQualityReportResult,
} from "./types.js";

const execAsync = promisify(exec);

const SEVERITY_ORDER: QualitySeverity[] = ["blocker", "critical", "major", "minor", "info"];

const TOOLCHAIN_SCRIPTS: { script: string; command: string }[] = [
  { script: "lint", command: "lint" },
  { script: "typecheck", command: "typecheck" },
  { script: "check", command: "check" },
  { script: "test", command: "test" },
  { script: "test:coverage", command: "test:coverage" },
];

export function slugifyFeature(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "feature"
  );
}

function emptySummary(): Record<QualitySeverity, number> {
  return { blocker: 0, critical: 0, major: 0, minor: 0, info: 0 };
}

function summarize(issues: QualityIssue[]): Record<QualitySeverity, number> {
  const summary = emptySummary();
  for (const issue of issues) {
    summary[issue.severity]++;
  }
  return summary;
}

function computeGate(summary: Record<QualitySeverity, number>): "pass" | "fail" {
  return summary.blocker > 0 || summary.critical > 0 ? "fail" : "pass";
}

function shouldSkipFile(filePath: string, skipPaths?: RegExp[]): boolean {
  if (!skipPaths?.length) return false;
  return skipPaths.some((re) => re.test(filePath));
}

async function resolveFeaturePaths(root: string): Promise<string[]> {
  const g = git(root);
  if (!(await g.checkIsRepo())) return [];

  const branches = await g.branchLocal();
  const defaultBranch = ["main", "master", "develop"].find((b) =>
    branches.all.includes(b),
  );

  try {
    const diffArgs = defaultBranch
      ? ["--name-only", `${defaultBranch}...HEAD`]
      : ["--name-only", "--cached"];
    const diff = await g.diff(diffArgs);
    return diff
      .split("\n")
      .map((line) => line.trim())
      .filter(
        (line) =>
          line.length > 0 &&
          /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(line) &&
          !isVendorPath(line),
      );
  } catch {
    const status = await g.status();
    return [...status.modified, ...status.created, ...status.staged].filter(
      (f) => /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(f) && !isVendorPath(f),
    );
  }
}

async function listSourceFiles(root: string, paths?: string[]): Promise<string[]> {
  if (paths?.length) {
    const expanded = new Set<string>();
    for (const p of paths) {
      const matches = await glob([p], { cwd: root, onlyFiles: true, dot: false });
      if (matches.length === 0 && !p.includes("*")) {
        expanded.add(p);
      } else {
        matches.forEach((m) => expanded.add(m));
      }
    }
    return [...expanded].filter(
      (f) => /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(f) && !isVendorPath(f),
    );
  }

  return glob(SOURCE_GLOBS, { cwd: root, ignore: SOURCE_IGNORE, onlyFiles: true });
}

const DEFAULT_FEATURE_SCOPE_GLOBS = ["packages/**/*.{ts,tsx,js,jsx,mjs,cjs}"];

function scanLinePatterns(content: string, filePath: string): QualityIssue[] {
  const issues: QualityIssue[] = [];
  const lines = content.split("\n");

  for (const rule of STATIC_PATTERNS) {
    if (shouldSkipFile(filePath, rule.skipPaths)) continue;

    lines.forEach((line, index) => {
      if (rule.pattern.test(line)) {
        issues.push({
          rule: rule.id,
          category: rule.category,
          severity: rule.severity,
          message: rule.message,
          file: filePath,
          line: index + 1,
        });
      }
    });
  }

  if (lines.length > LARGE_FILE_LINE_THRESHOLD) {
    issues.push({
      rule: "large-file",
      category: "maintainability",
      severity: "minor",
      message: `File exceeds ${LARGE_FILE_LINE_THRESHOLD} lines — consider splitting`,
      file: filePath,
      line: 1,
    });
  }

  return issues;
}

function checkMissingTests(filePath: string, allFiles: Set<string>): QualityIssue | null {
  if (!/\.(ts|tsx|js|jsx)$/.test(filePath)) return null;
  if (/\.(test|spec)\./.test(filePath) || filePath.includes("__tests__")) return null;

  const base = basename(filePath, extname(filePath));
  const dir = filePath.slice(0, filePath.lastIndexOf("/") + 1);
  const candidates = [
    `${dir}${base}.test.ts`,
    `${dir}${base}.test.tsx`,
    `${dir}${base}.spec.ts`,
    `${dir}${base}.spec.tsx`,
    `${dir}__tests__/${base}.test.ts`,
    `${dir}__tests__/${base}.test.tsx`,
  ];

  if (candidates.some((c) => allFiles.has(c))) return null;

  return {
    rule: "missing-test-file",
    category: "coverage",
    severity: "major",
    message: "No companion test file found for new source file",
    file: filePath,
  };
}

async function runToolchainScripts(
  root: string,
  scripts: Record<string, string>,
  pm: string | undefined,
): Promise<ToolchainResult[]> {
  const results: ToolchainResult[] = [];
  const runner = pm === "yarn" ? "yarn" : pm === "pnpm" ? "pnpm" : "npm run";

  for (const { script, command } of TOOLCHAIN_SCRIPTS) {
    if (!scripts[script]) continue;

    const cmd = pm === "npm" || !pm ? `npm run ${script}` : `${runner} ${script}`;
    try {
      const { stdout, stderr } = await execAsync(cmd, {
        cwd: root,
        maxBuffer: 2 * 1024 * 1024,
      });
      results.push({
        command,
        script,
        success: true,
        output: (stdout + stderr).trim().slice(0, 4000),
      });
    } catch (err) {
      const e = err as { stdout?: string; stderr?: string; message?: string };
      const output = [e.stdout, e.stderr, e.message].filter(Boolean).join("\n").slice(0, 4000);
      results.push({ command, script, success: false, output });
    }
  }

  return results;
}

function toolchainIssues(results: ToolchainResult[]): QualityIssue[] {
  return results
    .filter((r) => !r.success)
    .map((r) => ({
      rule: `toolchain-${r.command}`,
      category: "toolchain" as const,
      severity: "critical" as const,
      message: `${r.script} failed — fix lint/type errors before completing feature`,
      file: undefined,
    }));
}

export async function runQualityAnalysis(
  options: RunQualityAnalysisOptions,
): Promise<QualityReport> {
  const {
    root,
    projectName,
    featureSlug,
    paths,
    featureScope = false,
    runToolchain = true,
  } = options;

  let targetPaths = paths;
  let scope: QualityReport["scope"] = paths?.length ? "paths" : "full";

  if (featureScope && !paths?.length) {
    targetPaths = await resolveFeaturePaths(root);
    scope = "feature";
    if (targetPaths.length === 0) {
      targetPaths = DEFAULT_FEATURE_SCOPE_GLOBS;
    }
  }

  const files = (await listSourceFiles(root, targetPaths)).filter((f) => !isVendorPath(f));
  const fileSet = new Set(files);
  const issues: QualityIssue[] = [];

  for (const file of files) {
    const abs = join(root, file);
    let content: string;
    try {
      content = await readFile(abs, "utf-8");
    } catch {
      continue;
    }

    issues.push(...scanLinePatterns(content, file));

    if (scope === "feature" || scope === "paths") {
      const missing = checkMissingTests(file, fileSet);
      if (missing) issues.push(missing);
    }
  }

  const scan = await scanProject(root);
  let toolchain: ToolchainResult[] = [];
  if (runToolchain && Object.keys(scan.scripts).length > 0) {
    toolchain = await runToolchainScripts(root, scan.scripts, scan.packageManager);
    issues.push(...toolchainIssues(toolchain));
  }

  const summary = summarize(issues);
  issues.sort((a, b) => {
    const sev = SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity);
    if (sev !== 0) return sev;
    return (a.file ?? "").localeCompare(b.file ?? "");
  });

  return {
    generatedAt: new Date().toISOString(),
    projectName,
    featureSlug,
    scope,
    filesScanned: files.length,
    issues,
    toolchain,
    gate: computeGate(summary),
    summary,
  };
}

export async function writeQualityReport(
  root: string,
  report: QualityReport,
): Promise<WriteQualityReportResult> {
  const slug = report.featureSlug ?? "latest";
  const reportDir = join(root, ".DNA", "reports", "quality");
  const reportPath = join(reportDir, `${slug}.md`);
  const markdown = formatQualityReportMarkdown(report);

  await writeFileEnsured(reportPath, markdown);
  if (slug !== "latest") {
    await writeFileEnsured(join(reportDir, "latest.md"), markdown);
  }

  return { reportPath: relative(root, reportPath), report };
}

export async function runAndWriteQualityReport(
  root: string,
  options: Omit<RunQualityAnalysisOptions, "root" | "projectName"> & {
    projectName: string;
  },
): Promise<WriteQualityReportResult> {
  const report = await runQualityAnalysis({ root, ...options });
  return writeQualityReport(root, report);
}
