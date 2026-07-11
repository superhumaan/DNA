import { exec } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import {
  DNA_CLI_PACKAGE,
  DNA_CONFIG_FILE,
  DNA_DATA_DIR,
  type CliUpgradeCheckResult,
  type DnaConfig,
} from "@superhumaan/dna-config";
import { ensureDir, readJsonFile, writeJsonFile } from "./fs.js";
import { scanProject } from "./scanner.js";
import { loadDnaConfig } from "./validator.js";

const execAsync = promisify(exec);

const CLI_UPGRADE_STATE_FILE = "cli-upgrade.json";
const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;

export interface CliUpgradeOptions {
  root: string;
  currentVersion: string;
  /** Resolved path to the running CLI entry (import.meta.url file path). */
  cliEntryPath?: string;
  channel?: DnaConfig["channel"];
  /** When true, bypass the 24h throttle. */
  force?: boolean;
  /** When true, run package manager install when an update exists. */
  install?: boolean;
  /** When true, only report — do not install. */
  checkOnly?: boolean;
}

interface CliUpgradeState {
  lastCheckedAt: string;
  lastUpgradeAt?: string;
  currentVersion: string;
  latestVersion?: string;
}

export function compareSemver(a: string, b: string): number {
  const parse = (value: string) =>
    value
      .replace(/^v/, "")
      .split("-")[0]!
      .split(".")
      .map((part) => Number.parseInt(part, 10) || 0);

  const left = parse(a);
  const right = parse(b);
  const length = Math.max(left.length, right.length, 3);

  for (let i = 0; i < length; i += 1) {
    const diff = (left[i] ?? 0) - (right[i] ?? 0);
    if (diff !== 0) return diff > 0 ? 1 : -1;
  }
  return 0;
}

function npmDistTag(channel: DnaConfig["channel"]): string {
  if (channel === "beta") return "beta";
  if (channel === "nightly") return "nightly";
  return "latest";
}

export function isMonorepoDevInstall(cliEntryPath?: string): boolean {
  if (!cliEntryPath) return false;
  const normalized = cliEntryPath.replace(/\\/g, "/");
  return normalized.includes("/packages/dna-cli/") && !normalized.includes("/node_modules/");
}

function shouldSkipAutoUpgrade(): boolean {
  if (process.env.DNA_SKIP_CLI_UPDATE === "1") return true;
  if (process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true") return true;
  return false;
}

async function readUpgradeState(root: string): Promise<CliUpgradeState | null> {
  return readJsonFile<CliUpgradeState>(join(root, DNA_DATA_DIR, CLI_UPGRADE_STATE_FILE));
}

async function writeUpgradeState(root: string, state: CliUpgradeState): Promise<void> {
  await ensureDir(join(root, DNA_DATA_DIR));
  await writeJsonFile(join(root, DNA_DATA_DIR, CLI_UPGRADE_STATE_FILE), state);
}

/**
 * When the running CLI is newer than the last recorded install, turn auto-update back on.
 * Covers manual `npm install @superhumaan/dna-by-humaan@latest` as well as DNA-driven upgrades.
 */
export async function syncAutoUpdateForCliVersion(
  root: string,
  installedCliVersion: string,
): Promise<boolean> {
  const config = await loadDnaConfig(root);
  if (!config) return false;

  const state = await readUpgradeState(root);
  const recordedVersion = state?.currentVersion ?? "0.0.0";
  if (compareSemver(installedCliVersion, recordedVersion) <= 0) {
    return false;
  }

  config.autoUpdate = true;
  config.updatedAt = new Date().toISOString();
  await writeJsonFile(join(root, DNA_CONFIG_FILE), config);
  await writeUpgradeState(root, {
    lastCheckedAt: state?.lastCheckedAt ?? new Date().toISOString(),
    lastUpgradeAt: new Date().toISOString(),
    currentVersion: installedCliVersion,
    latestVersion: state?.latestVersion,
  });
  return true;
}

async function persistAutoUpdateAfterInstall(
  root: string,
  installedVersion: string,
  config: DnaConfig | null,
): Promise<void> {
  if (config) {
    config.autoUpdate = true;
    config.updatedAt = new Date().toISOString();
    await writeJsonFile(join(root, DNA_CONFIG_FILE), config);
  }

  const state = await readUpgradeState(root);
  await writeUpgradeState(root, {
    lastCheckedAt: state?.lastCheckedAt ?? new Date().toISOString(),
    lastUpgradeAt: new Date().toISOString(),
    currentVersion: installedVersion,
    latestVersion: installedVersion,
  });
}

export async function fetchLatestCliVersion(
  channel: DnaConfig["channel"] = "stable",
): Promise<string | null> {
  const url = `https://registry.npmjs.org/${encodeURIComponent(DNA_CLI_PACKAGE)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json", "User-Agent": "DNA-by-Humaan/cli-upgrade" },
    });
    if (!response.ok) return null;

    const data = (await response.json()) as { "dist-tags"?: Record<string, string> };
    const tag = npmDistTag(channel);
    return data["dist-tags"]?.[tag] ?? data["dist-tags"]?.latest ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function projectHasCliDependency(root: string): Promise<boolean> {
  try {
    const raw = await readFile(join(root, "package.json"), "utf-8");
    const pkg = JSON.parse(raw) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    return Boolean(
      pkg.dependencies?.[DNA_CLI_PACKAGE] || pkg.devDependencies?.[DNA_CLI_PACKAGE],
    );
  } catch {
    return false;
  }
}

async function bumpProjectDependency(root: string, version: string): Promise<void> {
  const pkgPath = join(root, "package.json");
  const raw = await readFile(pkgPath, "utf-8");
  const pkg = JSON.parse(raw) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  const range = `^${version}`;
  if (pkg.dependencies?.[DNA_CLI_PACKAGE]) {
    pkg.dependencies[DNA_CLI_PACKAGE] = range;
  }
  if (pkg.devDependencies?.[DNA_CLI_PACKAGE]) {
    pkg.devDependencies[DNA_CLI_PACKAGE] = range;
  }

  await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf-8");
}

function installCommand(
  packageManager: "npm" | "pnpm" | "yarn",
  version: string,
  mode: "project" | "global",
): string {
  const spec = `${DNA_CLI_PACKAGE}@${version}`;
  if (mode === "global") {
    switch (packageManager) {
      case "pnpm":
        return `pnpm add -g ${spec}`;
      case "yarn":
        return `yarn global add ${spec}`;
      default:
        return `npm install -g ${spec}`;
    }
  }

  switch (packageManager) {
    case "pnpm":
      return `pnpm add ${spec}`;
    case "yarn":
      return `yarn add ${spec}`;
    default:
      return `npm install ${spec}`;
  }
}

async function installCliPackage(
  root: string,
  version: string,
  mode: "project" | "global",
): Promise<void> {
  const scan = await scanProject(root);
  const pm = scan.packageManager;
  const packageManager: "npm" | "pnpm" | "yarn" =
    pm === "pnpm" || pm === "yarn" ? pm : "npm";
  const command = installCommand(packageManager, version, mode);

  if (mode === "project") {
    await bumpProjectDependency(root, version);
  }

  await execAsync(command, {
    cwd: root,
    timeout: 180_000,
    env: { ...process.env, npm_config_yes: "true" },
  });
}

export async function checkAndUpgradeCli(
  options: CliUpgradeOptions,
): Promise<CliUpgradeCheckResult> {
  const {
    root,
    currentVersion,
    cliEntryPath,
    channel: channelOverride,
    force = false,
    install = false,
    checkOnly = false,
  } = options;

  const base: CliUpgradeCheckResult = {
    currentVersion,
    latestVersion: null,
    updateAvailable: false,
    skipped: false,
    installed: false,
  };

  if (shouldSkipAutoUpgrade() && !force) {
    return { ...base, skipped: true, skipReason: "CI or DNA_SKIP_CLI_UPDATE" };
  }

  if (isMonorepoDevInstall(cliEntryPath)) {
    return { ...base, skipped: true, skipReason: "monorepo development build" };
  }

  await syncAutoUpdateForCliVersion(root, currentVersion);

  const config = await loadDnaConfig(root);
  if (config && config.autoUpdate === false && !force) {
    return { ...base, skipped: true, skipReason: "autoUpdate disabled in config.dna.json" };
  }

  const channel = channelOverride ?? config?.channel ?? "stable";
  const state = await readUpgradeState(root);
  if (!force && state?.lastCheckedAt) {
    const elapsed = Date.now() - new Date(state.lastCheckedAt).getTime();
    if (elapsed < CHECK_INTERVAL_MS) {
      return {
        ...base,
        skipped: true,
        skipReason: "checked recently",
        latestVersion: state.latestVersion ?? null,
        updateAvailable: Boolean(
          state.latestVersion && compareSemver(state.latestVersion, currentVersion) > 0,
        ),
      };
    }
  }

  const latestVersion = await fetchLatestCliVersion(channel);
  await writeUpgradeState(root, {
    lastCheckedAt: new Date().toISOString(),
    currentVersion,
    latestVersion: latestVersion ?? undefined,
  });

  if (!latestVersion) {
    return {
      ...base,
      latestVersion: null,
      message: "Could not reach npm registry — try again later.",
    };
  }

  const updateAvailable = compareSemver(latestVersion, currentVersion) > 0;
  if (!updateAvailable) {
    return {
      ...base,
      latestVersion,
      updateAvailable: false,
      message: `DNA CLI is up to date (${currentVersion}).`,
    };
  }

  if (checkOnly || !install) {
    return {
      ...base,
      latestVersion,
      updateAvailable: true,
      message: `DNA CLI update available: ${currentVersion} → ${latestVersion}. Run \`dna update\` to install.`,
    };
  }

  const hasProjectDep = await projectHasCliDependency(root);
  const installMode: "project" | "global" = hasProjectDep ? "project" : "global";

  try {
    await installCliPackage(root, latestVersion, installMode);
    await persistAutoUpdateAfterInstall(root, latestVersion, config);

    return {
      currentVersion,
      latestVersion,
      updateAvailable: true,
      skipped: false,
      installed: true,
      installMode,
      message:
        installMode === "project"
          ? `Installed ${DNA_CLI_PACKAGE}@${latestVersion} in this project. Re-run your command to use the new version.`
          : `Installed ${DNA_CLI_PACKAGE}@${latestVersion} globally. Re-run your command to use the new version.`,
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return {
      ...base,
      latestVersion,
      updateAvailable: true,
      message: `Update available (${currentVersion} → ${latestVersion}) but install failed: ${detail}`,
    };
  }
}

export async function maybeAutoUpgradeCli(options: CliUpgradeOptions): Promise<CliUpgradeCheckResult | null> {
  const config = await loadDnaConfig(options.root);
  if (!config) return null;

  await syncAutoUpdateForCliVersion(options.root, options.currentVersion);

  const refreshed = await loadDnaConfig(options.root);
  if (refreshed?.autoUpdate === false && !options.force) return null;

  return checkAndUpgradeCli({
    ...options,
    install: options.install ?? true,
    force: options.force ?? false,
  });
}

export function formatCliUpgradeResult(result: CliUpgradeCheckResult): string {
  const lines = [
    "DNA CLI Package Update",
    "======================",
    "",
    `Current:  ${result.currentVersion}`,
    `Latest:   ${result.latestVersion ?? "unknown"}`,
    "",
  ];

  if (result.skipped) {
    lines.push(`Skipped: ${result.skipReason ?? "unknown"}`);
    return lines.join("\n");
  }

  if (result.installed) {
    lines.push(`✓ Installed ${result.latestVersion} (${result.installMode ?? "project"})`);
    lines.push("✓ autoUpdate enabled in .DNA/config.dna.json");
    lines.push("");
    lines.push(result.message ?? "Re-run your command to use the new version.");
    return lines.join("\n");
  }

  if (result.updateAvailable) {
    lines.push(`Update available: ${result.currentVersion} → ${result.latestVersion}`);
  } else {
    lines.push("CLI package is up to date.");
  }

  if (result.message) {
    lines.push("");
    lines.push(result.message);
  }

  return lines.join("\n");
}
