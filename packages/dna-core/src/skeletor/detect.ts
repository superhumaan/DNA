import { homedir } from "node:os";
import { join } from "node:path";
import { fileExists, readJsonFile } from "../fs.js";

/** Skeletor Application Support folder (macOS). */
export function skeletorPrefsDir(home = homedir()): string {
  return join(home, "Library", "Application Support", "app.humaan.skeletor");
}

export function skeletorSettingsPath(home = homedir()): string {
  return join(skeletorPrefsDir(home), "settings.json");
}

export function skeletorKitManifestPath(home = homedir()): string {
  return join(skeletorPrefsDir(home), "kit", "manifest.json");
}

export function skeletorFleetBridgePath(home = homedir()): string {
  return join(skeletorPrefsDir(home), "bridge", "fleet.json");
}

export interface SkeletorDetection {
  installed: boolean;
  prefsDir: string;
  settingsPath: string;
  kitManifestPath: string;
  fleetBridgePath: string;
  hasSettings: boolean;
  hasKit: boolean;
  hasFleetBridge: boolean;
}

/** Detect whether Skeletor is installed on this machine (default-on path). */
export async function detectSkeletor(home = homedir()): Promise<SkeletorDetection> {
  const prefsDir = skeletorPrefsDir(home);
  const settingsPath = skeletorSettingsPath(home);
  const kitManifestPath = skeletorKitManifestPath(home);
  const fleetBridgePath = skeletorFleetBridgePath(home);

  const [hasSettings, hasKit, hasFleetBridge, prefsExist] = await Promise.all([
    fileExists(settingsPath),
    fileExists(kitManifestPath),
    fileExists(fleetBridgePath),
    fileExists(prefsDir),
  ]);

  return {
    installed: prefsExist || hasSettings || hasKit || hasFleetBridge,
    prefsDir,
    settingsPath,
    kitManifestPath,
    fleetBridgePath,
    hasSettings,
    hasKit,
    hasFleetBridge,
  };
}

export interface SkeletorSettingsSlice {
  projectsContainer?: string;
  dnaSetupComplete?: boolean;
  onboardingComplete?: boolean;
}

export async function loadSkeletorSettings(
  home = homedir(),
): Promise<SkeletorSettingsSlice | null> {
  const path = skeletorSettingsPath(home);
  if (!(await fileExists(path))) return null;
  try {
    const raw = await readJsonFile<Record<string, unknown>>(path);
    if (!raw) return null;
    return {
      projectsContainer:
        typeof raw.projectsContainer === "string" ? raw.projectsContainer : undefined,
      dnaSetupComplete: Boolean(raw.dnaSetupComplete),
      onboardingComplete: Boolean(raw.onboardingComplete),
    };
  } catch {
    return null;
  }
}

export interface SkeletorKitManifest {
  channel?: string;
  dnaVersion?: string;
  stemsVersion?: string;
  stemCount?: number;
  installedAt?: string;
  source?: string;
}

export async function loadSkeletorKit(
  home = homedir(),
): Promise<SkeletorKitManifest | null> {
  const path = skeletorKitManifestPath(home);
  if (!(await fileExists(path))) return null;
  try {
    return await readJsonFile<SkeletorKitManifest>(path);
  } catch {
    return null;
  }
}
