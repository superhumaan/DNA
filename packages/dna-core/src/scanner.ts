import { glob } from "./glob.js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ScanResult } from "@superhumaan/dna-config";
import { DNA_CONFIG_FILE, IMPRESSIONS_PATHS } from "@superhumaan/dna-config";
import { fileExists } from "./fs.js";
import { detectImpressionsDrift } from "./impressions/drift.js";

const FRONTEND_INDICATORS: Record<string, string[]> = {
  react: ["react", "@vitejs/plugin-react"],
  vue: ["vue", "@vitejs/plugin-vue"],
  svelte: ["svelte", "@sveltejs/kit"],
  next: ["next"],
  angular: ["@angular/core"],
  "react-native": ["react-native", "expo"],
  ghost: ["ghost"],
};

const BACKEND_INDICATORS: Record<string, string[]> = {
  express: ["express"],
  fastify: ["fastify"],
  nestjs: ["@nestjs/core"],
  hono: ["hono"],
  koa: ["koa"],
};

const TEST_INDICATORS: Record<string, string[]> = {
  vitest: ["vitest"],
  jest: ["jest"],
  mocha: ["mocha"],
  playwright: ["@playwright/test"],
  cypress: ["cypress"],
};

const DATABASE_INDICATORS: Record<string, string[]> = {
  postgresql: ["pg", "postgres", "@prisma/client", "drizzle-orm"],
  mysql: ["mysql2", "mysql"],
  mongodb: ["mongodb", "mongoose"],
  sqlite: ["better-sqlite3", "sqlite3"],
  redis: ["ioredis", "redis"],
};

function detectFromDeps(
  deps: Record<string, string>,
  indicators: Record<string, string[]>,
): string | undefined {
  const allDeps = Object.keys(deps);
  for (const [name, packages] of Object.entries(indicators)) {
    if (packages.some((pkg) => allDeps.includes(pkg))) {
      return name;
    }
  }
  return undefined;
}

async function readPackageJson(root: string): Promise<Record<string, unknown> | null> {
  const pkgPath = join(root, "package.json");
  if (!(await fileExists(pkgPath))) return null;
  const raw = await readFile(pkgPath, "utf-8");
  return JSON.parse(raw) as Record<string, unknown>;
}

function mergeDeps(target: Record<string, string>, pkg: Record<string, unknown> | null): void {
  if (!pkg) return;
  Object.assign(target, (pkg.dependencies as Record<string, string>) ?? {});
  Object.assign(target, (pkg.devDependencies as Record<string, string>) ?? {});
}

/** Collect deps from root + common monorepo layouts (backend/, apps/*, packages/*). */
async function collectProjectDependencies(root: string): Promise<Record<string, string>> {
  const deps: Record<string, string> = {};
  mergeDeps(deps, await readPackageJson(root));

  const workspacePkgPaths = [
    "backend",
    "server",
    "api",
    "apps/api",
    "apps/backend",
    "apps/web",
    "apps/server",
  ];

  for (const dir of workspacePkgPaths) {
    mergeDeps(deps, await readPackageJson(join(root, dir)));
  }

  try {
    const { readdir } = await import("node:fs/promises");
    for (const parent of [join(root, "apps"), join(root, "packages")]) {
      if (!(await fileExists(parent))) continue;
      const entries = await readdir(parent, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        mergeDeps(deps, await readPackageJson(join(parent, entry.name)));
      }
    }
  } catch {
    // optional workspace scan
  }

  return deps;
}

function detectPackageManager(files: string[]): string | undefined {
  if (files.includes("pnpm-lock.yaml")) return "pnpm";
  if (files.includes("yarn.lock")) return "yarn";
  if (files.includes("package-lock.json")) return "npm";
  if (files.includes("bun.lockb") || files.includes("bun.lock")) return "bun";
  return undefined;
}

export async function scanProject(root: string): Promise<ScanResult> {
  const files = await glob(["**/*"], {
    cwd: root,
    ignore: [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".git/**",
      ".DNA/**",
      "coverage/**",
      ".scannerwork/**",
      ".jscpd-report/**",
      ".local-wiki/**",
      ".vercel/**",
      "**/*.log",
      "**/.tmp-*",
    ],
    dot: true,
    onlyFiles: true,
  });

  const pkg = await readPackageJson(root);
  const deps = await collectProjectDependencies(root);

  const packageManager = detectPackageManager(files);
  const frontend = detectFromDeps(deps, FRONTEND_INDICATORS);
  const backend = detectFromDeps(deps, BACKEND_INDICATORS);
  const database = detectFromDeps(deps, DATABASE_INDICATORS);
  const testFramework = detectFromDeps(deps, TEST_INDICATORS);

  const ciCd: string[] = [];
  if (files.some((f) => f.includes(".github/workflows"))) ciCd.push("github-actions");
  if (files.includes(".gitlab-ci.yml")) ciCd.push("gitlab-ci");
  if (files.includes("Jenkinsfile")) ciCd.push("jenkins");
  if (files.includes(".circleci/config.yml")) ciCd.push("circleci");

  const docker = files.includes("Dockerfile") || files.includes("docker-compose.yml");
  const envFiles = files.filter((f) => f.startsWith(".env") && !f.includes("example"));
  const docs = files.filter(
    (f) =>
      f.endsWith(".md") &&
      (f.startsWith("docs/") || f === "README.md" || f.startsWith("DNA/")),
  );

  const aiRules = files.filter(
    (f) =>
      f.includes(".cursorrules") ||
      f.includes(".cursor/") ||
      f.includes("CLAUDE.md") ||
      f.includes(".github/copilot"),
  );

  const securityRisks: string[] = [];
  if (envFiles.length > 0 && !files.some((f) => f.includes(".env.example"))) {
    securityRisks.push("Missing .env.example while .env files exist");
  }
  if (deps["eval"] || deps["node-eval"]) {
    securityRisks.push("Dangerous dependency: eval");
  }

  const missingDocs: string[] = [];
  for (const doc of IMPRESSIONS_PATHS) {
    if (!(await fileExists(join(root, "DNA", "Impressions", doc)))) {
      missingDocs.push(doc);
    }
  }

  const hasTestFiles = files.some(
    (f) => f.includes(".test.") || f.includes(".spec.") || f.includes("__tests__"),
  );
  const missingTests = !testFramework && !hasTestFiles;

  const hasDna = await fileExists(join(root, DNA_CONFIG_FILE));
  const hasPackageJson = pkg !== null;
  const hasSourceCode =
    files.some((f) =>
      /^(src|app|lib|server|api|backend|packages\/[^/]+\/src|apps\/[^/]+)\//.test(f) ||
      /\.(tsx?|jsx?|vue|svelte|py|go|rs|java|kt|swift|rb|php)$/.test(f),
    ) ||
    files.some((f) =>
      ["pyproject.toml", "go.mod", "Cargo.toml", "pom.xml", "build.gradle", "build.gradle.kts"].includes(f),
    ) ||
    (await fileExists(join(root, "backend", "server.js"))) ||
    (await fileExists(join(root, "backend", "package.json")));

  const baseResult = {
    packageManager,
    frontend,
    backend,
    database,
    testFramework,
    ciCd,
    docker,
    envFiles: envFiles.map((f) => f.replace(/^\.\//, "")),
    docs,
    aiRules,
    securityRisks,
    missingDocs: hasDna ? missingDocs : [],
    missingTests,
    dependencies: Object.keys(deps),
    scripts: (pkg?.scripts as Record<string, string>) ?? {},
    hasDna,
    fileCount: files.length,
    hasPackageJson,
    hasSourceCode,
  };

  if (!hasDna) return baseResult;

  const impressionsDrift = await detectImpressionsDrift(root, baseResult);
  return { ...baseResult, impressionsDrift };
}

export function formatScanSummary(scan: ScanResult): string {
  const lines: string[] = [
    "DNA Scan Summary",
    "================",
    "",
    `Package manager: ${scan.packageManager ?? "unknown"}`,
    `Frontend:        ${scan.frontend ?? "not detected"}`,
    `Backend:         ${scan.backend ?? "not detected"}`,
    `Database:        ${scan.database ?? "not detected"}`,
    `Test framework:  ${scan.testFramework ?? "not detected"}`,
    `CI/CD:           ${scan.ciCd.length ? scan.ciCd.join(", ") : "none detected"}`,
    `Docker:          ${scan.docker ? "yes" : "no"}`,
    `DNA installed:   ${scan.hasDna ? "yes" : "no"}`,
    "",
  ];

  if (scan.envFiles.length) {
    lines.push(`Environment files: ${scan.envFiles.join(", ")}`);
  }
  if (scan.securityRisks.length) {
    lines.push("", "Security risks:");
    scan.securityRisks.forEach((r) => lines.push(`  ⚠ ${r}`));
  }
  if (scan.missingTests) {
    lines.push("", "⚠ No test framework or test files detected");
  }
  if (scan.missingDocs.length) {
    lines.push("", `Missing Impressions: ${scan.missingDocs.length} files`);
  }
  if (scan.impressionsDrift) {
    lines.push(
      "",
      `Impressions drift: ${scan.impressionsDrift.score}/100 (${scan.impressionsDrift.level})`,
    );
    if (scan.impressionsDrift.findings.length) {
      scan.impressionsDrift.findings.slice(0, 5).forEach((f) => lines.push(`  • ${f.message}`));
    }
    if (scan.impressionsDrift.level !== "ok") {
      lines.push("", "Run: dna plan impressions-sync");
    }
  }

  return lines.join("\n");
}
