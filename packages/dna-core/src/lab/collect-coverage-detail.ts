import { join, relative } from "node:path";
import { readFile, stat } from "node:fs/promises";
import { fileExists } from "../fs.js";
import { glob } from "../glob.js";

export interface LabCoverageMetric {
  pct: number | null;
  covered: number | null;
  total: number | null;
}

export interface LabCoverageFileRow {
  path: string;
  package: string;
  lines: LabCoverageMetric;
  statements: LabCoverageMetric;
  functions: LabCoverageMetric;
  branches: LabCoverageMetric;
}

export interface LabCoveragePackageRow {
  name: string;
  fileCount: number;
  linesPct: number | null;
  uncoveredLines: number;
}

export interface LabCoverageDetail {
  summary: {
    lines: LabCoverageMetric;
    statements: LabCoverageMetric;
    functions: LabCoverageMetric;
    branches: LabCoverageMetric;
  };
  packages: LabCoveragePackageRow[];
  files: LabCoverageFileRow[];
  distribution: Array<{ bucket: string; count: number }>;
  path: string;
  mtime: string;
  fileCount: number;
  capped: boolean;
}

const FILE_CAP = 500;

function metric(raw?: { pct?: number; covered?: number; total?: number }): LabCoverageMetric {
  return {
    pct: typeof raw?.pct === "number" ? raw.pct : null,
    covered: typeof raw?.covered === "number" ? raw.covered : null,
    total: typeof raw?.total === "number" ? raw.total : null,
  };
}

function packageName(relPath: string): string {
  const parts = relPath.split("/");
  if (parts[0] === "packages" && parts[1]) return `packages/${parts[1]}`;
  if (parts[0] === "apps" && parts[1]) return `apps/${parts[1]}`;
  return parts[0] || "root";
}

export async function collectLabCoverageDetail(root: string): Promise<LabCoverageDetail | null> {
  const candidates = [
    join(root, "coverage", "coverage-summary.json"),
    ...(await glob("**/coverage/coverage-summary.json", { cwd: root, onlyFiles: true }))
      .slice(0, 8)
      .map((p) => join(root, p)),
  ];

  for (const path of candidates) {
    if (!(await fileExists(path))) continue;
    try {
      const raw = JSON.parse(await readFile(path, "utf8")) as Record<
        string,
        { lines?: { pct?: number; covered?: number; total?: number }; statements?: { pct?: number; covered?: number; total?: number }; functions?: { pct?: number; covered?: number; total?: number }; branches?: { pct?: number; covered?: number; total?: number } }
      >;
      const total = raw.total;
      if (!total) continue;
      const st = await stat(path);
      const files: LabCoverageFileRow[] = [];
      for (const [abs, metrics] of Object.entries(raw)) {
        if (abs === "total") continue;
        const rel = abs.startsWith(root) ? relative(root, abs).split("\\").join("/") : abs;
        files.push({
          path: rel,
          package: packageName(rel),
          lines: metric(metrics.lines),
          statements: metric(metrics.statements),
          functions: metric(metrics.functions),
          branches: metric(metrics.branches),
        });
      }
      files.sort((a, b) => (a.lines.pct ?? 101) - (b.lines.pct ?? 101));
      const capped = files.length > FILE_CAP;
      const trimmed = files.slice(0, FILE_CAP);

      const pkgMap = new Map<string, { covered: number; total: number; files: number }>();
      for (const f of files) {
        const cur = pkgMap.get(f.package) || { covered: 0, total: 0, files: 0 };
        cur.files += 1;
        cur.covered += f.lines.covered ?? 0;
        cur.total += f.lines.total ?? 0;
        pkgMap.set(f.package, cur);
      }
      const packages: LabCoveragePackageRow[] = [...pkgMap.entries()]
        .map(([name, v]) => ({
          name,
          fileCount: v.files,
          linesPct: v.total ? Math.round((v.covered / v.total) * 1000) / 10 : null,
          uncoveredLines: Math.max(0, v.total - v.covered),
        }))
        .sort((a, b) => (a.linesPct ?? 101) - (b.linesPct ?? 101));

      const distribution = [
        { bucket: "0–50%", count: 0 },
        { bucket: "50–80%", count: 0 },
        { bucket: "80–100%", count: 0 },
      ];
      for (const f of files) {
        const pct = f.lines.pct;
        if (pct == null) continue;
        if (pct < 50) distribution[0]!.count += 1;
        else if (pct < 80) distribution[1]!.count += 1;
        else distribution[2]!.count += 1;
      }

      return {
        summary: {
          lines: metric(total.lines),
          statements: metric(total.statements),
          functions: metric(total.functions),
          branches: metric(total.branches),
        },
        packages,
        files: trimmed,
        distribution,
        path: path.replace(root + "/", "").replace(root + "\\\\", ""),
        mtime: st.mtime.toISOString(),
        fileCount: files.length,
        capped,
      };
    } catch {
      continue;
    }
  }
  return null;
}
