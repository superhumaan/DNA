import type { SkeletorPullResult } from "./pull.js";

const MAX_PROJECTS = 40;
const MAX_HOT = 8;

function ago(ms: number | undefined): string {
  if (!ms || !Number.isFinite(ms)) return "unknown";
  const delta = Date.now() - ms;
  if (delta < 60_000) return "just now";
  if (delta < 3_600_000) return `${Math.round(delta / 60_000)}m ago`;
  if (delta < 86_400_000) return `${Math.round(delta / 3_600_000)}h ago`;
  return `${Math.round(delta / 86_400_000)}d ago`;
}

/** Markdown section for `dna context` and CellularMemory feed. */
export function formatSkeletorContextSection(pull: SkeletorPullResult): string | null {
  if (!pull.enabled || !pull.detection.installed) return null;

  const lines: string[] = [
    "## Skeletor fleet",
    "",
    "_Pulled from local Skeletor (default when installed). Use for cross-lab coordination — sibling apps, DNA version drift, doctor/care signals._",
    "",
    `- Prefs: \`${pull.detection.prefsDir}\``,
  ];

  if (pull.settings?.projectsContainer) {
    lines.push(`- Projects container: \`${pull.settings.projectsContainer}\``);
  }
  if (pull.kit?.dnaVersion) {
    lines.push(
      `- Kit DNA: ${pull.kit.dnaVersion}` +
        (pull.kit.stemCount != null ? ` · stems ${pull.kit.stemCount}` : ""),
    );
  }

  const fleet = pull.fleet;
  if (!fleet) {
    lines.push(
      "",
      "_No fleet bridge yet — open Skeletor and refresh the fleet once to write `bridge/fleet.json`._",
      "",
    );
    return lines.join("\n");
  }

  lines.push(`- Fleet scanned: ${ago(fleet.scannedAt)} (\`${fleet.containerPath}\`)`);
  const a = fleet.analytics ?? {};
  lines.push(
    `- Labs: ${a.total ?? fleet.projects?.length ?? 0} total · ${a.withDna ?? "—"} with DNA · ${a.doctorFailing ?? 0} doctor failing · ${a.labIssues ?? 0} issues · ${a.dirtyRepos ?? 0} dirty`,
  );
  lines.push("");

  const projects = (fleet.projects ?? []).slice(0, MAX_PROJECTS);
  if (projects.length > 0) {
    lines.push("### Projects");
    lines.push("");
    lines.push("| Name | DNA | Doctor | Issues | Dirty | Path |");
    lines.push("|------|-----|--------|--------|-------|------|");
    for (const p of projects) {
      const dna = p.hasDna ? p.dnaVersion || "yes" : "—";
      const doctor =
        p.labDoctorTotal && p.labDoctorTotal > 0
          ? `${p.labDoctorOk ?? 0}/${p.labDoctorTotal}`
          : "—";
      const issues = String(p.labIssueCount ?? 0);
      const dirty = p.gitDirty ? "yes" : "";
      lines.push(
        `| ${p.name} | ${dna} | ${doctor} | ${issues} | ${dirty} | \`${p.path}\` |`,
      );
    }
    if ((fleet.projects?.length ?? 0) > MAX_PROJECTS) {
      lines.push("");
      lines.push(`_…and ${(fleet.projects!.length - MAX_PROJECTS)} more_`);
    }
    lines.push("");
  }

  const hot = (fleet.hotIssues ?? []).slice(0, MAX_HOT) as Array<{
    title?: string;
    severity?: string;
    projectName?: string;
    count?: number;
  }>;
  if (hot.length > 0) {
    lines.push("### Hot issues");
    lines.push("");
    for (const issue of hot) {
      const sev = issue.severity ?? "unknown";
      const title = issue.title ?? "untitled";
      const proj = issue.projectName ? ` (${issue.projectName})` : "";
      const count = issue.count != null ? ` ×${issue.count}` : "";
      lines.push(`- **${sev}** ${title}${proj}${count}`);
    }
    lines.push("");
  }

  lines.push(
    "**Agent rule:** When the user asks about other labs, fleet health, DNA versions, or cross-project work — use this section. Prefer sibling paths listed above over guessing.",
    "",
  );

  return lines.join("\n");
}

export function formatSkeletorStatus(pull: SkeletorPullResult): string {
  if (!pull.enabled) {
    return "Skeletor pull disabled (config.skeletor.enabled = false).";
  }
  if (!pull.detection.installed) {
    return "Skeletor not detected on this machine.";
  }
  const parts = [
    "Skeletor: installed",
    pull.detection.hasSettings ? "settings ✓" : "settings —",
    pull.detection.hasKit ? "kit ✓" : "kit —",
    pull.detection.hasFleetBridge ? "fleet bridge ✓" : "fleet bridge —",
  ];
  if (pull.kit?.dnaVersion) parts.push(`kit DNA ${pull.kit.dnaVersion}`);
  if (pull.fleet?.analytics?.total != null) {
    parts.push(`fleet ${pull.fleet.analytics.total} labs`);
  }
  return parts.join(" · ");
}
