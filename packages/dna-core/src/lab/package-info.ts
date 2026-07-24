import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const PKG_NAME = "@superhumaan/dna-by-humaan";

export interface DnaPackageInstall {
  /** Absolute path to the package root (…/node_modules/@superhumaan/dna-by-humaan). */
  packagePath: string;
  /** Absolute path to the nearest package.json that depends on this install (project or workspace). */
  ownerPackageJson: string;
  version: string;
  /** True when dist/lab.js contains the analytics Overview fingerprint. */
  hasAnalyticsUi: boolean;
}

export interface LabRuntimeIdentity {
  dnaVersion: string;
  packagePath: string;
  labUiFingerprint: string;
  hasAnalyticsUi: boolean;
}

function readJson(path: string): Record<string, unknown> | null {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function labJsHasAnalytics(packagePath: string): boolean {
  const labJs = join(packagePath, "dist", "lab.js");
  if (!existsSync(labJs)) return false;
  try {
    const sample = readFileSync(labJs, "utf8");
    return sample.includes("lab-batteries") && sample.includes("System performance");
  } catch {
    return false;
  }
}

function fingerprintLabUi(packagePath: string): string {
  const labJs = join(packagePath, "dist", "lab.js");
  if (!existsSync(labJs)) return "missing";
  try {
    const st = statSync(labJs);
    const hash = createHash("sha1").update(String(st.mtimeMs)).update(String(st.size)).digest("hex").slice(0, 10);
    return hash;
  } catch {
    return "unknown";
  }
}

/** Resolve the DNA package that is actually executing this Lab middleware. */
export function getLabRuntimeIdentity(): LabRuntimeIdentity {
  let packagePath = "";
  let dnaVersion = "unknown";

  try {
    const require = createRequire(import.meta.url);
    const pkgJsonPath = require.resolve(`${PKG_NAME}/package.json`);
    packagePath = dirname(pkgJsonPath);
    const pkg = readJson(pkgJsonPath);
    dnaVersion = typeof pkg?.version === "string" ? pkg.version : "unknown";
  } catch {
    // Running from workspace source / odd layouts — fall back to this module's package.
    try {
      const here = dirname(fileURLToPath(import.meta.url));
      // dist/lab.js → package root; src/lab/*.ts → packages/dna-core (not the published name)
      const candidates = [join(here, "..", "..", ".."), join(here, "..")];
      for (const root of candidates) {
        const pkgPath = join(root, "package.json");
        const pkg = readJson(pkgPath);
        if (pkg?.name === PKG_NAME || pkg?.name === "@superhumaan/dna-core") {
          packagePath = root;
          dnaVersion = typeof pkg.version === "string" ? pkg.version : dnaVersion;
          break;
        }
      }
    } catch {
      /* ignore */
    }
  }

  return {
    dnaVersion,
    packagePath: packagePath || "(unresolved)",
    labUiFingerprint: packagePath ? fingerprintLabUi(packagePath) : "unknown",
    hasAnalyticsUi: packagePath ? labJsHasAnalytics(packagePath) : false,
  };
}

function findOwnerPackageJson(packagePath: string): string {
  // …/node_modules/@superhumaan/dna-by-humaan → climb to consumer package.json
  let dir = dirname(packagePath); // @superhumaan
  dir = dirname(dir); // node_modules
  dir = dirname(dir); // owner root (or nested)
  const pkg = join(dir, "package.json");
  return existsSync(pkg) ? pkg : packagePath;
}

/**
 * Walk a project tree for every physical `@superhumaan/dna-by-humaan` install.
 * Skips deep nests inside other packages except direct project `node_modules`
 * and one-level workspace package `node_modules` (e.g. backend/).
 */
export function findDnaByHumaanInstalls(projectRoot: string): DnaPackageInstall[] {
  const found: DnaPackageInstall[] = [];
  const seen = new Set<string>();

  const visitNodeModules = (nodeModulesDir: string) => {
    const target = join(nodeModulesDir, "@superhumaan", "dna-by-humaan");
    if (!existsSync(join(target, "package.json"))) return;
    if (seen.has(target)) return;
    seen.add(target);
    const pkg = readJson(join(target, "package.json"));
    const version = typeof pkg?.version === "string" ? pkg.version : "unknown";
    found.push({
      packagePath: target,
      ownerPackageJson: findOwnerPackageJson(target),
      version,
      hasAnalyticsUi: labJsHasAnalytics(target),
    });
  };

  const rootNm = join(projectRoot, "node_modules");
  if (existsSync(rootNm)) visitNodeModules(rootNm);

  // One-level children: backend/, apps/web/, packages/*, etc.
  let entries: string[] = [];
  try {
    entries = readdirSync(projectRoot);
  } catch {
    return found;
  }

  for (const name of entries) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const child = join(projectRoot, name);
    try {
      if (!statSync(child).isDirectory()) continue;
    } catch {
      continue;
    }
    const childNm = join(child, "node_modules");
    if (existsSync(childNm)) visitNodeModules(childNm);

    // apps/* and packages/*
    if (name === "apps" || name === "packages" || name === "backend" || name === "server") {
      let nested: string[] = [];
      try {
        nested = readdirSync(child);
      } catch {
        continue;
      }
      for (const n of nested) {
        const nm = join(child, n, "node_modules");
        if (existsSync(nm)) visitNodeModules(nm);
      }
    }
  }

  return found.sort((a, b) => a.packagePath.localeCompare(b.packagePath));
}

export function summarizeDnaInstalls(projectRoot: string, active?: LabRuntimeIdentity) {
  const installs = findDnaByHumaanInstalls(projectRoot);
  const versions = [...new Set(installs.map((i) => i.version))];
  const stale = installs.filter((i) => !i.hasAnalyticsUi);
  const activePath = active?.packagePath;
  const activeMatch = activePath
    ? installs.find((i) => i.packagePath === activePath || activePath.startsWith(i.packagePath + sep))
    : undefined;

  const warnings: string[] = [];
  if (versions.length > 1) {
    warnings.push(
      `Multiple ${PKG_NAME} versions installed (${versions.join(", ")}). Lab uses whichever Node resolves from the API process — upgrade EVERY path and restart the API.`,
    );
  }
  if (stale.length) {
    warnings.push(
      `${stale.length} install(s) lack Lab analytics UI (pre-0.6.14). Paths: ${stale
        .map((s) => relative(projectRoot, s.packagePath) || s.packagePath)
        .join(", ")}`,
    );
  }
  if (active && !active.hasAnalyticsUi) {
    warnings.push(
      `Active Lab runtime is ${active.dnaVersion} without analytics UI. Fix: npm i ${PKG_NAME}@latest in the package that owns the API, then restart that process.`,
    );
  }

  return {
    installs,
    versions,
    multiVersion: versions.length > 1,
    staleCount: stale.length,
    activeVersion: active?.dnaVersion,
    activePackagePath: active?.packagePath,
    activeHasAnalyticsUi: active?.hasAnalyticsUi ?? false,
    activeInstallOwner: activeMatch?.ownerPackageJson,
    warnings,
  };
}
