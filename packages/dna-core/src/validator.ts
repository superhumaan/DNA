import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import fg from "fast-glob";
import type { DnaConfig, NeuralNetwork, ScanResult, ValidationResult } from "@superhumaan/dna-config";
import {
  BEHAVIOUR_FILES,
  DNA_CONFIG_FILE,
  IMPRESSIONS_PATHS,
  NEURAL_NETWORK_ALT,
  NEURAL_NETWORK_FILE,
} from "@superhumaan/dna-config";
import { fileExists, readJsonFile } from "./fs.js";
import { scanProject } from "./scanner.js";
import { DnaConfigSchema, NeuralNetworkSchema } from "@superhumaan/dna-config";
import { validateStackCompatibility } from "./stack/validate.js";
import { runQualityAnalysis } from "./quality/analyze.js";

const execAsync = promisify(exec);

const DANGEROUS_DEPS = ["eval", "node-eval", "vm2"];

const ARCHITECTURE_DOCS = [
  "architecture/solution-architecture.md",
  "architecture/system-boundaries.md",
  "architecture/data-flow.md",
];

const SECURITY_DOCS = ["security/security-baseline.md", "security/threat-model.md"];

const QA_DOCS = ["qa/qa-strategy.md", "qa/test-plan.md"];

async function findDuplicateDependencies(root: string): Promise<string[]> {
  const pkgPath = join(root, "package.json");
  if (!(await fileExists(pkgPath))) return [];

  const raw = await readFile(pkgPath, "utf-8");
  const pkg = JSON.parse(raw) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  const duplicates: string[] = [];
  const prod = pkg.dependencies ?? {};
  const dev = pkg.devDependencies ?? {};

  for (const name of Object.keys(prod)) {
    if (dev[name] && prod[name] !== dev[name]) {
      duplicates.push(`${name} (prod: ${prod[name]}, dev: ${dev[name]})`);
    }
  }

  return duplicates;
}

async function runProjectTests(
  root: string,
  scripts: Record<string, string>,
  pm: string | undefined,
): Promise<{ success: boolean; output: string }> {
  if (!scripts.test && !scripts["test:unit"]) {
    return { success: false, output: "No test script in package.json" };
  }

  const script = scripts.test ? "test" : "test:unit";
  const cmd =
    pm === "pnpm"
      ? `pnpm run ${script}`
      : pm === "yarn"
        ? `yarn ${script}`
        : `npm run ${script}`;

  try {
    const { stdout, stderr } = await execAsync(cmd, {
      cwd: root,
      maxBuffer: 4 * 1024 * 1024,
      timeout: 120_000,
    });
    return { success: true, output: (stdout + stderr).trim().slice(0, 2000) };
  } catch (err) {
    const e = err as { stdout?: string; stderr?: string; message?: string };
    const output = [e.stdout, e.stderr, e.message].filter(Boolean).join("\n").slice(0, 2000);
    return { success: false, output };
  }
}

function parseUncheckedCriteria(content: string): string[] {
  const unchecked: string[] = [];
  const inCriteria =
    content.includes("## Success Criteria") || content.includes("Success Criteria");
  if (!inCriteria) return unchecked;

  const lines = content.split("\n");
  let inSection = false;
  for (const line of lines) {
    if (line.startsWith("## Success Criteria")) {
      inSection = true;
      continue;
    }
    if (inSection && line.startsWith("## ") && !line.includes("Success Criteria")) {
      break;
    }
    if (inSection && /^- \[ \]/.test(line.trim())) {
      unchecked.push(line.trim().replace(/^- \[ \]\s*/, ""));
    }
  }
  return unchecked;
}

async function hasActiveFeatureRequest(root: string): Promise<boolean> {
  const reqPath = join(root, "ai/feature-request.md");
  if (!(await fileExists(reqPath))) return false;
  const content = await readFile(reqPath, "utf-8");
  return !content.includes("Waiting for your first feature request");
}

async function runNeuralValidationChecks(
  root: string,
  neuralNetwork: NeuralNetwork,
  scan: ScanResult,
): Promise<ValidationResult["errors"]> {
  const errors: ValidationResult["errors"] = [];
  const checks = new Set<string>();

  for (const intent of Object.values(neuralNetwork.intents)) {
    intent.validationChecks.forEach((c) => checks.add(c));
  }

  const files = await fg(["**/*.{ts,tsx,js,jsx}"], {
    cwd: root,
    ignore: ["node_modules/**", "dist/**", ".DNA/**"],
  });

  const componentNames = files
    .filter((f) => f.includes("/components/") || f.endsWith("Component.tsx"))
    .map((f) => f.split("/").pop() ?? f);
  const dupComponents = componentNames.filter(
    (n, i) => componentNames.indexOf(n) !== i,
  );
  if (checks.has("no_duplicate_components") && dupComponents.length > 0) {
    errors.push({
      code: "DUPLICATE_COMPONENTS",
      message: `Possible duplicate components: ${[...new Set(dupComponents)].join(", ")}`,
      severity: "warning",
    });
  }

  if (checks.has("has_tests")) {
    const hasTests = files.some((f) => f.includes(".test.") || f.includes(".spec."));
    if (!hasTests) {
      errors.push({
        code: "NEURAL_CHECK_TESTS",
        message: "neuralNetwork requires tests but none found",
        severity: "warning",
      });
    }
  }

  if (checks.has("has_env_example")) {
    const hasExample = await fileExists(join(root, ".env.example"));
    if (!hasExample) {
      errors.push({
        code: "NEURAL_CHECK_ENV",
        message: "neuralNetwork validation: missing .env.example",
        severity: "warning",
      });
    }
  }

  if (checks.has("architecture_documented")) {
    for (const doc of ARCHITECTURE_DOCS) {
      const path = join(root, "DNA", "Impressions", doc);
      if (!(await fileExists(path))) {
        errors.push({
          code: "MISSING_ARCHITECTURE_DOC",
          message: `Missing architecture doc: ${doc}`,
          severity: "warning",
        });
      }
    }
  }

  if (checks.has("feature_request_exists")) {
    const reqPath = join(root, "ai/feature-request.md");
    if (!(await fileExists(reqPath))) {
      errors.push({
        code: "NEURAL_CHECK_FEATURE_REQUEST",
        message: "Missing ai/feature-request.md for active feature",
        severity: "warning",
      });
    } else {
      const content = await readFile(reqPath, "utf-8");
      if (content.includes("Waiting for your first feature request")) {
        errors.push({
          code: "NEURAL_CHECK_FEATURE_REQUEST",
          message: "feature-request.md has no active feature request",
          severity: "info",
        });
      }
    }
  }

  if (checks.has("qa_checklist_completed") && (await hasActiveFeatureRequest(root))) {
    const reqPath = join(root, "ai/feature-request.md");
    if (await fileExists(reqPath)) {
      const content = await readFile(reqPath, "utf-8");
      const unchecked = parseUncheckedCriteria(content);
      if (unchecked.length > 0) {
        errors.push({
          code: "NEURAL_CHECK_QA_CHECKLIST",
          message: `Feature success criteria incomplete: ${unchecked.slice(0, 3).join("; ")}${unchecked.length > 3 ? "…" : ""}`,
          severity: "warning",
        });
      }
    }
  }

  if (checks.has("tests_pass") && (await hasActiveFeatureRequest(root))) {
    const result = await runProjectTests(root, scan.scripts, scan.packageManager);
    if (!scan.scripts.test && !scan.scripts["test:unit"]) {
      errors.push({
        code: "NEURAL_CHECK_TESTS_PASS",
        message: "tests_pass required but no test script configured",
        severity: "warning",
      });
    } else if (!result.success) {
      errors.push({
        code: "NEURAL_CHECK_TESTS_PASS",
        message: `Test suite failed: ${result.output.slice(0, 300)}`,
        severity: "error",
      });
    }
  }

  if (checks.has("quality_gate_pass") && (await hasActiveFeatureRequest(root))) {
    try {
      const config = await loadDnaConfig(root);
      const report = await runQualityAnalysis({
        root,
        projectName: config?.projectName ?? "project",
        featureScope: true,
        runToolchain: true,
      });
      if (report.gate === "fail") {
        errors.push({
          code: "NEURAL_CHECK_QUALITY_GATE",
          message: `Quality gate FAIL — ${report.summary.blocker} blocker(s), ${report.summary.critical} critical issue(s)`,
          severity: "error",
        });
      }
    } catch {
      errors.push({
        code: "NEURAL_CHECK_QUALITY_GATE",
        message: "Quality analysis failed to run",
        severity: "warning",
      });
    }
  }

  return errors;
}

export async function validateProject(root: string): Promise<ValidationResult> {
  const errors: ValidationResult["errors"] = [];

  const configPath = join(root, DNA_CONFIG_FILE);
  if (!(await fileExists(configPath))) {
    errors.push({
      code: "DNA_NOT_INSTALLED",
      message: "DNA is not installed. Run `dna init` first.",
      severity: "error",
    });
    return { valid: false, errors };
  }

  const rawConfig = await readJsonFile<unknown>(configPath);
  const parsed = DnaConfigSchema.safeParse(rawConfig);
  if (!parsed.success) {
    errors.push({
      code: "INVALID_CONFIG",
      message: `Invalid config.dna.json: ${parsed.error.message}`,
      severity: "error",
    });
  }

  let neuralPath = join(root, NEURAL_NETWORK_FILE);
  if (!(await fileExists(neuralPath))) {
    neuralPath = join(root, NEURAL_NETWORK_ALT);
  }
  if (!(await fileExists(neuralPath))) {
    errors.push({
      code: "MISSING_NEURAL_NETWORK",
      message: "Missing .DNA/neuralNetwork",
      severity: "error",
    });
  } else {
    const neuralRaw = await readJsonFile<unknown>(neuralPath);
    const neuralParsed = NeuralNetworkSchema.safeParse(neuralRaw);
    if (!neuralParsed.success) {
      errors.push({
        code: "INVALID_NEURAL_NETWORK",
        message: "Invalid neuralNetwork format",
        severity: "error",
      });
    } else {
      const scan = await scanProject(root);
      errors.push(...(await runNeuralValidationChecks(root, neuralParsed.data, scan)));
    }
  }

  for (const file of BEHAVIOUR_FILES) {
    const path = join(root, ".DNA", "behaviour", file);
    if (!(await fileExists(path))) {
      errors.push({
        code: "MISSING_BEHAVIOUR",
        message: `Missing Behaviour file: ${file}`,
        severity: "error",
      });
    } else {
      const content = await readFile(path, "utf-8");
      if (content.length < 100) {
        errors.push({
          code: "EMPTY_BEHAVIOUR",
          message: `Behaviour file appears empty: ${file}`,
          severity: "warning",
        });
      }
    }
  }

  for (const relPath of IMPRESSIONS_PATHS) {
    const path = join(root, "DNA", "Impressions", relPath);
    if (!(await fileExists(path))) {
      errors.push({
        code: "MISSING_IMPRESSION",
        message: `Missing Impression: ${relPath}`,
        severity: "warning",
      });
    }
  }

  for (const doc of SECURITY_DOCS) {
    if (!(await fileExists(join(root, "DNA", "Impressions", doc)))) {
      errors.push({
        code: "MISSING_SECURITY_DOC",
        message: `Missing security documentation: ${doc}`,
        severity: "warning",
      });
    }
  }

  for (const doc of QA_DOCS) {
    if (!(await fileExists(join(root, "DNA", "Impressions", doc)))) {
      errors.push({
        code: "MISSING_QA_DOC",
        message: `Missing QA documentation: ${doc}`,
        severity: "warning",
      });
    }
  }

  const scan = await scanProject(root);

  if (scan.ciCd.length === 0 && !(await fileExists(join(root, ".github", "workflows", "dna-ci.yml")))) {
    errors.push({
      code: "MISSING_CI",
      message: "No CI pipeline detected — run `dna init` or add .github/workflows/dna-ci.yml",
      severity: "warning",
    });
  }

  if (scan.missingTests) {
    errors.push({
      code: "MISSING_TESTS",
      message: "No test framework or test files detected",
      severity: "warning",
    });
  }

  for (const dep of DANGEROUS_DEPS) {
    if (scan.dependencies.includes(dep)) {
      errors.push({
        code: "DANGEROUS_DEPENDENCY",
        message: `Dangerous dependency detected: ${dep}`,
        severity: "error",
      });
    }
  }

  const duplicateDeps = await findDuplicateDependencies(root);
  for (const dup of duplicateDeps) {
    errors.push({
      code: "DUPLICATE_DEPENDENCY",
      message: `Duplicate dependency with conflicting versions: ${dup}`,
      severity: "error",
    });
  }

  const requiredScripts = ["test", "build", "lint"];
  for (const script of requiredScripts) {
    if (!scan.scripts[script] && !scan.scripts[`${script}:unit`]) {
      errors.push({
        code: "MISSING_SCRIPT",
        message: `Missing package script: "${script}"`,
        severity: script === "test" ? "warning" : "info",
      });
    }
  }

  if (scan.envFiles.length > 0) {
    const hasExample = await fileExists(join(root, ".env.example"));
    if (!hasExample) {
      errors.push({
        code: "MISSING_ENV_EXAMPLE",
        message: "Environment files exist but .env.example is missing",
        severity: "error",
      });
    }
  }

  const config = parsed.success ? parsed.data : null;
  errors.push(...validateStackCompatibility(config, scan));

  if (config?.runtime?.enabled) {
    const runtimeDb = join(root, ".DNA", "data", "runtime.db");
    const runtimeJsonl = join(root, ".DNA", "runtime", "events.jsonl");
    if (!(await fileExists(runtimeDb)) && !(await fileExists(runtimeJsonl))) {
      errors.push({
        code: "MISSING_RUNTIME_SETUP",
        message: "Runtime enabled but .DNA/data/runtime.db not configured — run dna doctor",
        severity: "warning",
      });
    }
    const hasRuntimePkg = scan.dependencies.includes("@superhumaan/dna-by-humaan");
    if (!hasRuntimePkg) {
      errors.push({
        code: "MISSING_RUNTIME_PACKAGE",
        message: "Runtime enabled but @superhumaan/dna-by-humaan not in dependencies",
        severity: "warning",
      });
    }
  }

  for (const risk of scan.securityRisks) {
    errors.push({
      code: "SECURITY_RISK",
      message: risk,
      severity: "warning",
    });
  }

  const hasErrors = errors.some((e) => e.severity === "error");
  return { valid: !hasErrors, errors };
}

export function formatValidationResult(result: ValidationResult): string {
  const lines: string[] = [
    result.valid ? "✓ Validation passed" : "✗ Validation failed",
    "",
  ];

  if (result.errors.length === 0) {
    lines.push("No issues found.");
  } else {
    for (const err of result.errors) {
      const icon = err.severity === "error" ? "✗" : err.severity === "warning" ? "⚠" : "ℹ";
      lines.push(`${icon} [${err.code}] ${err.message}`);
    }
  }

  return lines.join("\n");
}

export async function loadDnaConfig(root: string): Promise<DnaConfig | null> {
  const config = await readJsonFile<unknown>(join(root, DNA_CONFIG_FILE));
  if (!config) return null;
  const parsed = DnaConfigSchema.safeParse(config);
  return parsed.success ? parsed.data : null;
}

export async function readProjectFile(root: string, relPath: string): Promise<string | null> {
  const path = join(root, relPath);
  if (!(await fileExists(path))) return null;
  return readFile(path, "utf-8");
}
