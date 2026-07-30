import { homedir } from "node:os";
import type { DnaConfig } from "@superhumaan/dna-config";
import {
  detectSkeletor,
  loadSkeletorKit,
  loadSkeletorSettings,
  skeletorFleetBridgePath,
  type SkeletorDetection,
  type SkeletorKitManifest,
  type SkeletorSettingsSlice,
} from "./detect.js";
import { fileExists, readJsonFile } from "../fs.js";

export interface SkeletorBridgeProject {
  name: string;
  path: string;
  hasDna?: boolean;
  dnaVersion?: string | null;
  gitDirty?: boolean;
  labIssueCount?: number;
  labCritical?: number;
  labDoctorOk?: number;
  labDoctorTotal?: number;
  stack?: string[];
  activityMs?: number | null;
}

export interface SkeletorBridgeAnalytics {
  total?: number;
  withDna?: number;
  withoutDna?: number;
  dirtyRepos?: number;
  doctorFailing?: number;
  healthyLabs?: number;
  labIssues?: number;
  labCritical?: number;
  shippingRisk?: number;
  slowRequests?: number;
  errors24h?: number;
}

export interface SkeletorFleetBridge {
  version: number;
  scannedAt: number;
  containerPath: string;
  phase?: string;
  kit?: SkeletorKitManifest | null;
  analytics?: SkeletorBridgeAnalytics;
  projects?: SkeletorBridgeProject[];
  hotIssues?: unknown[];
  hotEvents?: unknown[];
  hotSlowEndpoints?: unknown[];
}

export interface SkeletorPullResult {
  enabled: boolean;
  detection: SkeletorDetection;
  settings: SkeletorSettingsSlice | null;
  kit: SkeletorKitManifest | null;
  fleet: SkeletorFleetBridge | null;
}

/** Whether config allows Skeletor pull (default: on). */
export function isSkeletorPullEnabled(config?: Pick<DnaConfig, "skeletor"> | null): boolean {
  return config?.skeletor?.enabled !== false;
}

export async function loadSkeletorFleetBridge(
  home = homedir(),
): Promise<SkeletorFleetBridge | null> {
  const path = skeletorFleetBridgePath(home);
  if (!(await fileExists(path))) return null;
  try {
    const raw = await readJsonFile<SkeletorFleetBridge>(path);
    if (!raw || typeof raw !== "object") return null;
    if (typeof raw.scannedAt !== "number" || typeof raw.containerPath !== "string") {
      return null;
    }
    return {
      ...raw,
      version: typeof raw.version === "number" ? raw.version : 1,
      projects: Array.isArray(raw.projects) ? raw.projects : [],
      hotIssues: Array.isArray(raw.hotIssues) ? raw.hotIssues : [],
      hotEvents: Array.isArray(raw.hotEvents) ? raw.hotEvents : [],
      hotSlowEndpoints: Array.isArray(raw.hotSlowEndpoints) ? raw.hotSlowEndpoints : [],
    };
  } catch {
    return null;
  }
}

/** Pull Skeletor machine data when installed. Silent null-path when absent or disabled. */
export async function pullSkeletorData(options?: {
  home?: string;
  config?: Pick<DnaConfig, "skeletor"> | null;
}): Promise<SkeletorPullResult> {
  const home = options?.home ?? homedir();
  const detection = await detectSkeletor(home);
  const enabled = isSkeletorPullEnabled(options?.config);

  if (!enabled || !detection.installed) {
    return {
      enabled,
      detection,
      settings: null,
      kit: null,
      fleet: null,
    };
  }

  const [settings, kit, fleet] = await Promise.all([
    loadSkeletorSettings(home),
    loadSkeletorKit(home),
    loadSkeletorFleetBridge(home),
  ]);

  return { enabled, detection, settings, kit, fleet };
}
