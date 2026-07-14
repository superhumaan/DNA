/** Collect CI, coverage, and quality artifacts for Lab Quality tab. */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join } from "node:path";
import { readFile, stat } from "node:fs/promises";
import { glob } from "../glob.js";
import { fileExists } from "../fs.js";

const execFileAsync = promisify(execFile);

export interface LabQualityReportRow {
  name: string;
  mtime: string;
  score?: number;
  gate?: "pass" | "fail" | "unknown";
  scope?: string;
  blockers?: number;
  critical?: number;
  major?: number;
  filesScanned?: number;
  summary?: string;
}

export interface LabCoverageSummary {
  lines?: number;
  statements?: number;
  functions?: number;
  branches?: number;
  path?: string;
  mtime?: string;
}

export interface LabCiRun {
  databaseId?: number;
  displayTitle: string;
  status: string;
  conclusion?: string;
  workflowName?: string;
  headBranch?: string;
  event?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function listQualityReports(root: string): Promise<LabQualityReportRow[]> {
  const dir = join(root, ".DNA", "reports", "quality");
  if (!(await fileExists(dir))) return [];

  const files = await glob("*.{md,json}", { cwd: dir, onlyFiles: true });
  const byStem = new Map<string, LabQualityReportRow>();

  for (const name of files) {
    const full = join(dir, name);
    const st = await stat(full);
    const stem = name.replace(/\.(md|json)$/i, "");
    const existing = byStem.get(stem) ?? {
      name: `${stem}.md`,
      mtime: st.mtime.toISOString(),
    };

    if (name.endsWith(".json")) {
      try {
        const raw = JSON.parse(await readFile(full, "utf-8")) as {
          gate?: string;
          scope?: string;
          filesScanned?: number;
          summary?: { blocker?: number; critical?: number; major?: number };
          generatedAt?: string;
        };
        existing.gate = raw.gate === "pass" || raw.gate === "fail" ? raw.gate : "unknown";
        existing.scope = raw.scope;
        existing.filesScanned = raw.filesScanned;
        existing.blockers = raw.summary?.blocker ?? 0;
        existing.critical = raw.summary?.critical ?? 0;
        existing.major = raw.summary?.major ?? 0;
        existing.score = existing.gate === "pass" ? 100 : existing.gate === "fail" ? 0 : undefined;
        existing.summary = `gate=${existing.gate} blocker=${existing.blockers} critical=${existing.critical}`;
        if (raw.generatedAt) existing.mtime = raw.generatedAt;
      } catch {
        // ignore bad json
      }
    } else {
      const raw = await readFile(full, "utf-8").catch(() => "");
      const gateMatch = raw.match(/\*\*Quality gate\*\*\s*\|\s*\*\*(PASS|FAIL)\*\*/i)
        ?? raw.match(/Quality gate:\s*(PASS|FAIL)/i)
        ?? raw.match(/\| \*\*Quality gate\*\* \| \*\*(PASS|FAIL)\*\* \|/i);
      const gate = gateMatch?.[1]?.toLowerCase() as "pass" | "fail" | undefined;
      if (gate) {
        existing.gate = gate;
        existing.score = gate === "pass" ? 100 : 0;
      }
      const blocker = Number(raw.match(/\|\s*Blocker\s*\|\s*(\d+)\s*\|/i)?.[1] ?? NaN);
      const critical = Number(raw.match(/\|\s*Critical\s*\|\s*(\d+)\s*\|/i)?.[1] ?? NaN);
      const major = Number(raw.match(/\|\s*Major\s*\|\s*(\d+)\s*\|/i)?.[1] ?? NaN);
      if (Number.isFinite(blocker)) existing.blockers = blocker;
      if (Number.isFinite(critical)) existing.critical = critical;
      if (Number.isFinite(major)) existing.major = major;
      existing.mtime = st.mtime.toISOString();
      existing.name = name;
      existing.summary =
        existing.gate != null
          ? `gate=${existing.gate} blocker=${existing.blockers ?? "—"} critical=${existing.critical ?? "—"}`
          : undefined;
    }

    if (parseTime(st.mtime.toISOString()) >= parseTime(existing.mtime)) {
      existing.mtime = st.mtime.toISOString();
    }
    byStem.set(stem, existing);
  }

  return [...byStem.values()].sort((a, b) => a.mtime.localeCompare(b.mtime));
}

function parseTime(value?: string): number {
  if (!value) return 0;
  const ms = new Date(value).getTime();
  return Number.isFinite(ms) ? ms : 0;
}

export async function readCoverageSummary(root: string): Promise<LabCoverageSummary | null> {
  const candidates = [
    join(root, "coverage", "coverage-summary.json"),
    join(root, "coverage", "coverage-final.json"),
    ...(await glob("**/coverage/coverage-summary.json", { cwd: root, onlyFiles: true }))
      .slice(0, 8)
      .map((p) => join(root, p)),
  ];

  for (const path of candidates) {
    if (!(await fileExists(path))) continue;
    try {
      const raw = JSON.parse(await readFile(path, "utf-8")) as {
        total?: {
          lines?: { pct?: number };
          statements?: { pct?: number };
          functions?: { pct?: number };
          branches?: { pct?: number };
        };
      };
      const total = raw.total;
      if (!total) continue;
      const st = await stat(path);
      return {
        lines: total.lines?.pct,
        statements: total.statements?.pct,
        functions: total.functions?.pct,
        branches: total.branches?.pct,
        path: path.replace(root + "/", ""),
        mtime: st.mtime.toISOString(),
      };
    } catch {
      continue;
    }
  }
  return null;
}

export async function listCiRuns(root: string): Promise<LabCiRun[]> {
  try {
    const { stdout } = await execFileAsync(
      "gh",
      [
        "run",
        "list",
        "--limit",
        "15",
        "--json",
        "databaseId,displayTitle,status,conclusion,workflowName,headBranch,event,url,createdAt,updatedAt",
      ],
      { cwd: root, timeout: 8000, maxBuffer: 2_000_000 },
    );
    const parsed = JSON.parse(stdout) as LabCiRun[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
