import type { DoctorReport } from "../doctor.js";
import { collectLabData } from "../lab/collect.js";
import { formatLabStart, startLabServer } from "../lab/local-server.js";

/**
 * @deprecated Use `LabDashboardOptions` and `startLabServer`. The compatibility
 * wrapper remains for existing imports but no longer maintains a second
 * dashboard implementation or API.
 */
export interface DashboardOptions {
  root: string;
  port?: number;
  host?: string;
}

/**
 * @deprecated Use `LabDashboardData`. Kept as the legacy public return shape.
 */
export interface DashboardData {
  doctor: DoctorReport;
  runtimeIssues: unknown[];
  runtimeEvents: unknown[];
  qualityReports: { name: string; mtime: string; score?: number }[];
  impressions: string[];
  cellularMemory: string[];
}

/**
 * @deprecated Use `collectLabData`.
 */
export async function collectDashboardData(root: string): Promise<DashboardData> {
  const data = await collectLabData(root);
  return {
    doctor: data.doctor,
    runtimeIssues: data.runtimeIssues,
    runtimeEvents: data.runtimeEvents,
    qualityReports: data.qualityReports,
    impressions: data.impressions,
    cellularMemory: data.cellularMemory,
  };
}

/**
 * @deprecated Use `startLabServer`. The returned URL now points to `/labs`.
 */
export async function startDashboard(
  options: DashboardOptions,
): Promise<{ url: string; close: () => void }> {
  return startLabServer(options);
}

/**
 * @deprecated Use `formatLabStart`.
 */
export function formatDashboardStart(url: string): string {
  return [
    "DNA Dashboard (deprecated — served by DNA Lab)",
    "===============================================",
    "",
    formatLabStart(url),
  ].join("\n");
}
