import { glob } from "../glob.js";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { join } from "node:path";
import { readFile, stat } from "node:fs/promises";
import { runDoctor, type DoctorReport } from "../doctor.js";
import { readRuntimeRecords } from "../storage/runtime-db.js";
import { fileExists } from "../fs.js";

export interface DashboardOptions {
  root: string;
  port?: number;
  host?: string;
}

export interface DashboardData {
  doctor: DoctorReport;
  runtimeIssues: unknown[];
  runtimeEvents: unknown[];
  qualityReports: { name: string; mtime: string; score?: number }[];
  impressions: string[];
  cellularMemory: string[];
}

async function listMarkdownFiles(dir: string, prefix: string): Promise<string[]> {
  if (!(await fileExists(dir))) return [];
  const files = await glob("**/*.md", { cwd: dir, onlyFiles: true });
  return files.map((f) => `${prefix}/${f}`);
}

async function listQualityReports(root: string): Promise<{ name: string; mtime: string; score?: number }[]> {
  const dir = join(root, ".DNA", "reports", "quality");
  if (!(await fileExists(dir))) return [];
  const files = await glob("*.md", { cwd: dir, onlyFiles: true });
  const reports = await Promise.all(
    files.map(async (name) => {
      const full = join(dir, name);
      const st = await stat(full);
      const raw = await readFile(full, "utf-8").catch(() => "");
      const scoreMatch = raw.match(/Overall coverage:\s*([\d.]+)%/i) ?? raw.match(/Gate:\s*(\w+)/i);
      const score = scoreMatch?.[1] && !Number.isNaN(Number(scoreMatch[1])) ? Number(scoreMatch[1]) : undefined;
      return { name, mtime: st.mtime.toISOString(), score };
    }),
  );
  return reports.sort((a, b) => a.mtime.localeCompare(b.mtime));
}

export async function collectDashboardData(root: string): Promise<DashboardData> {
  const [doctor, runtimeIssues, runtimeEvents, qualityReports, impressions, cellularMemory] =
    await Promise.all([
      runDoctor(root),
      readRuntimeRecords(root, "issues"),
      readRuntimeRecords(root, "events"),
      listQualityReports(root),
      listMarkdownFiles(join(root, "DNA", "Impressions"), "DNA/Impressions"),
      listMarkdownFiles(join(root, ".DNA", "CellularMemory"), ".DNA/CellularMemory"),
    ]);

  return { doctor, runtimeIssues, runtimeEvents, qualityReports, impressions, cellularMemory };
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(body));
}

function renderHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>DNA Dashboard</title>
  <style>
    :root { font-family: system-ui, sans-serif; color: #111; background: #f6f7f9; }
    body { margin: 0; padding: 24px; }
    h1 { margin: 0 0 8px; font-size: 1.5rem; }
    .sub { color: #555; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    .card { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 16px; }
    .card h2 { margin: 0 0 12px; font-size: 1rem; }
    .stat { font-size: 2rem; font-weight: 700; }
    .ok { color: #0a7; }
    .warn { color: #c80; }
    .bad { color: #c22; }
    ul { margin: 0; padding-left: 18px; max-height: 200px; overflow: auto; font-size: 0.875rem; }
    pre { background: #f0f0f0; padding: 12px; border-radius: 6px; overflow: auto; font-size: 0.75rem; max-height: 240px; }
    .refresh { margin-top: 24px; font-size: 0.875rem; color: #666; }
    canvas { width: 100%; height: 120px; }
  </style>
</head>
<body>
  <h1>DNA Dashboard</h1>
  <p class="sub">Live local view — auto-refreshes every 5s</p>
  <div id="root" class="grid"></div>
  <p class="refresh" id="status">Loading…</p>
  <script>
    function esc(t) {
      return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    }
    function drawTrend(canvas, reports) {
      const ctx = canvas.getContext("2d");
      const w = canvas.width = canvas.offsetWidth * 2;
      const h = canvas.height = 240;
      ctx.clearRect(0, 0, w, h);
      const scores = reports.map((r) => r.score ?? 0);
      if (!scores.length) {
        ctx.fillStyle = "#888";
        ctx.fillText("No quality history", 12, 24);
        return;
      }
      const max = 100;
      ctx.strokeStyle = "#0a7";
      ctx.lineWidth = 3;
      ctx.beginPath();
      scores.forEach((s, i) => {
        const x = 12 + (i * (w - 24)) / Math.max(scores.length - 1, 1);
        const y = h - 12 - (s / max) * (h - 24);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
    function render(data) {
      const issueCount = data.runtimeIssues.length;
      const eventCount = data.runtimeEvents.length;
      const valid = data.doctor.validation.valid;
      const reports = data.qualityReports || [];
      document.getElementById("root").innerHTML = \`
        <div class="card"><h2>Doctor</h2><div class="stat \${valid ? "ok" : "bad"}">\${valid ? "Healthy" : "Issues"}</div>
          <ul>
            <li>DNA: \${data.doctor.dna.installed ? "installed" : "missing"}</li>
            <li>GitHub: \${data.doctor.github.signedIn ? "signed in" : "not signed in"}</li>
            <li>Runtime: \${data.doctor.runtime.configured ? "configured" : "not configured"}</li>
          </ul></div>
        <div class="card"><h2>Runtime issues</h2><div class="stat \${issueCount ? "warn" : "ok"}">\${issueCount}</div>
          <pre>\${esc(JSON.stringify(data.runtimeIssues.slice(-5), null, 2))}</pre></div>
        <div class="card"><h2>Runtime events</h2><div class="stat">\${eventCount}</div>
          <pre>\${esc(JSON.stringify(data.runtimeEvents.slice(-5), null, 2))}</pre></div>
        <div class="card"><h2>Quality trend</h2><canvas id="trend"></canvas>
          <ul>\${reports.slice(-8).map(r => "<li>" + esc(r.name) + (r.score != null ? " — " + r.score + "%" : "") + "</li>").join("") || "<li>None yet</li>"}</ul></div>
        <div class="card"><h2>Impressions</h2><div class="stat">\${data.impressions.length}</div>
          <ul>\${data.impressions.slice(0, 12).map(f => "<li>" + esc(f) + "</li>").join("")}</ul></div>
        <div class="card"><h2>CellularMemory</h2><div class="stat">\${data.cellularMemory.length}</div>
          <ul>\${data.cellularMemory.slice(0, 12).map(f => "<li>" + esc(f) + "</li>").join("")}</ul></div>\`;
      const canvas = document.getElementById("trend");
      if (canvas) drawTrend(canvas, reports);
    }
    async function refresh() {
      try {
        const res = await fetch("/api/data");
        const data = await res.json();
        render(data);
        document.getElementById("status").textContent = "Updated " + new Date().toLocaleTimeString();
      } catch (e) {
        document.getElementById("status").textContent = "Refresh failed";
      }
    }
    refresh();
    setInterval(refresh, 5000);
  </script>
</body>
</html>`;
}

export async function startDashboard(options: DashboardOptions): Promise<{ url: string; close: () => void }> {
  const port = options.port ?? 3200;
  const host = options.host ?? "127.0.0.1";

  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url ?? "/", `http://${host}:${port}`);

    if (url.pathname === "/api/data") {
      const data = await collectDashboardData(options.root);
      sendJson(res, 200, data);
      return;
    }

    if (url.pathname === "/" || url.pathname === "/index.html") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(renderHtml());
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  });

  await new Promise<void>((resolve) => server.listen(port, host, resolve));
  const url = `http://${host}:${port}`;

  return {
    url,
    close: () => server.close(),
  };
}

export function formatDashboardStart(url: string): string {
  return [
    "DNA Dashboard",
    "=============",
    "",
    `Open: ${url}`,
    `API:  ${url}/api/data`,
    "",
    "Press Ctrl+C to stop.",
  ].join("\n");
}
