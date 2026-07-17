#!/usr/bin/env node
/**
 * DNA Lab load test — 200 concurrent dashboard viewers (live-event scenario).
 *
 * The Lab dashboard is poll-based (no sockets). This harness compares:
 *   BEFORE  the raw per-request cost the server used to pay (`collectLabData`
 *           called once per request, no cache, no coalescing);
 *   AFTER   the real HTTP path (`startLabServer`) with the micro-cache,
 *           single-flight coalescing, and ETag/304 revalidation.
 *
 * Usage:
 *   node scripts/lab-load-test.mjs [--users 200] [--polls 5] [--events 2000]
 *     [--after-only] [--max-p95 1500] [--min-throughput 500]
 *     [--json <path>]   Emit a machine-readable result document (default:
 *                       .dna-reports/load-test.json). Consumed by the canonical
 *                       health report composer (scripts/health-report.mjs).
 */
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import http from "node:http";
import { performance } from "node:perf_hooks";
import { collectLabData, startLabServer } from "@superhumaan/dna-by-humaan/lab";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? Number(process.argv[i + 1]) : fallback;
}

function strArg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? String(process.argv[i + 1]) : fallback;
}

const USERS = arg("users", 200);
const POLLS = arg("polls", 5);
const EVENTS = arg("events", 2000);
const ISSUES = Math.min(EVENTS, 400);
const AFTER_ONLY = process.argv.includes("--after-only");
const MAX_P95_MS = arg("max-p95", Number.POSITIVE_INFINITY);
const MIN_THROUGHPUT_RPS = arg("min-throughput", 0);
const JSON_OUT = resolve(process.cwd(), strArg("json", ".dna-reports/load-test.json"));

function pct(sorted, p) {
  if (!sorted.length) return 0;
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

function summarise(label, latencies, wallMs, extra = {}) {
  const sorted = [...latencies].sort((a, b) => a - b);
  const total = latencies.length;
  const sum = latencies.reduce((a, b) => a + b, 0);
  return {
    label,
    requests: total,
    throughputRps: Math.round((total / wallMs) * 1000),
    avgMs: Math.round((sum / total) * 100) / 100,
    p50Ms: Math.round(pct(sorted, 50) * 100) / 100,
    p95Ms: Math.round(pct(sorted, 95) * 100) / 100,
    p99Ms: Math.round(pct(sorted, 99) * 100) / 100,
    maxMs: Math.round(sorted[sorted.length - 1] * 100) / 100,
    wallMs: Math.round(wallMs),
    ...extra,
  };
}

async function seed(root) {
  const dir = join(root, ".DNA", "data");
  await mkdir(dir, { recursive: true });
  const now = Date.now();
  const types = ["request", "slow_request", "uncaught_exception", "third_party_response", "memory_spike"];
  const events = Array.from({ length: EVENTS }, (_, i) => ({
    id: `evt_${i}`,
    timestamp: new Date(now - (i % 1440) * 60_000).toISOString(),
    type: types[i % types.length],
    message: `Event ${i} with a reasonably long message to mimic real payloads and stack context`,
    endpoint: `/api/resource/${i % 40}`,
    method: ["GET", "POST", "PUT"][i % 3],
    statusCode: [200, 200, 500, 503][i % 4],
    durationMs: 20 + (i % 900),
    fingerprint: `fp_${i % 60}`,
    environment: "production",
    release: "v1.2.3",
    stack: "Error: boom\n  at handler (/app/src/x.ts:12:5)\n  at next (/app/node_modules/express/x.js:1:1)",
  }));
  const issues = Array.from({ length: ISSUES }, (_, i) => ({
    id: `iss_${i}`,
    eventId: `evt_${i}`,
    fingerprint: `fp_${i % 60}`,
    severity: ["critical", "high", "medium", "low"][i % 4],
    category: "runtime_error",
    title: `Issue ${i}`,
    summary: `Summary for issue ${i}`,
    repeatCount: 1 + (i % 12),
    firstSeen: new Date(now - 3_600_000).toISOString(),
    lastSeen: new Date(now - (i % 60) * 60_000).toISOString(),
  }));
  await writeFile(join(dir, "runtime.db"), JSON.stringify({ version: 1, events, issues, fingerprints: [] }));
}

// ---- BEFORE: raw per-request cost, 200-way concurrency, no cache ----
async function runBefore(root) {
  const latencies = [];
  const start = performance.now();
  for (let round = 0; round < POLLS; round++) {
    await Promise.all(
      Array.from({ length: USERS }, async () => {
        const t0 = performance.now();
        await collectLabData(root);
        latencies.push(performance.now() - t0);
      }),
    );
  }
  const wall = performance.now() - start;
  return summarise("BEFORE  collectLabData per request (no cache)", latencies, wall);
}

// ---- AFTER: real HTTP server with micro-cache + ETag/304 ----
function poll(port, path, etag) {
  return new Promise((resolve, reject) => {
    const headers = { Host: `127.0.0.1:${port}`, Connection: "keep-alive" };
    if (etag) headers["If-None-Match"] = etag;
    const t0 = performance.now();
    const req = http.request({ host: "127.0.0.1", port, path, method: "GET", headers, agent: keepAlive }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () =>
        resolve({ status: res.statusCode, etag: res.headers.etag, bytes: Buffer.concat(chunks).length, ms: performance.now() - t0 }),
      );
    });
    req.on("error", reject);
    req.end();
  });
}

const keepAlive = new http.Agent({ keepAlive: true, maxSockets: 256 });

async function runAfter(root) {
  const port = 4600 + Math.floor(Math.random() * 300);
  const server = await startLabServer({
    root,
    port,
    host: "127.0.0.1",
    config: { lab: { enabled: true, path: "/labs", openLocalWithoutAuth: true } },
  });
  const dataPath = "/api/dna/labs/data";
  const latencies = [];
  let ok200 = 0;
  let not304 = 0;
  let errors = 0;
  let bytes = 0;
  const etags = new Map();

  const start = performance.now();
  for (let round = 0; round < POLLS; round++) {
    await Promise.all(
      Array.from({ length: USERS }, async (_, u) => {
        try {
          const r = await poll(port, dataPath, etags.get(u));
          latencies.push(r.ms);
          bytes += r.bytes;
          if (r.status === 200) {
            ok200++;
            if (r.etag) etags.set(u, r.etag);
          } else if (r.status === 304) {
            not304++;
          } else {
            errors++;
          }
        } catch {
          errors++;
        }
      }),
    );
  }
  const wall = performance.now() - start;
  server.close();
  return summarise("AFTER   HTTP /data (micro-cache + ETag/304)", latencies, wall, {
    status200: ok200,
    status304: not304,
    errors,
    totalKB: Math.round(bytes / 1024),
  });
}

function printRow(r) {
  console.log(
    `${r.label}\n` +
      `  requests=${r.requests}  throughput=${r.throughputRps} req/s  wall=${r.wallMs}ms\n` +
      `  latency  avg=${r.avgMs}ms  p50=${r.p50Ms}ms  p95=${r.p95Ms}ms  p99=${r.p99Ms}ms  max=${r.maxMs}ms` +
      (r.status200 != null ? `\n  200=${r.status200}  304=${r.status304}  errors=${r.errors}  transferred=${r.totalKB}KB` : ""),
  );
}

async function emitJson(doc) {
  try {
    await mkdir(dirname(JSON_OUT), { recursive: true });
    await writeFile(JSON_OUT, JSON.stringify(doc, null, 2) + "\n");
    console.log(`\nLoad results written to ${JSON_OUT}`);
  } catch (err) {
    console.error(`Could not write load JSON to ${JSON_OUT}: ${err.message}`);
  }
}

async function main() {
  const root = await mkdtemp(join(tmpdir(), "dna-lab-load-"));
  const startedAt = new Date().toISOString();
  try {
    await seed(root);
    console.log(`\nDNA Lab load test — ${USERS} concurrent viewers × ${POLLS} polls`);
    console.log(`Seeded runtime.db: ${EVENTS} events, ${ISSUES} issues @ ${root}\n`);

    const before = AFTER_ONLY ? null : await runBefore(root);
    if (before) {
      printRow(before);
      console.log("");
    }
    const after = await runAfter(root);
    printRow(after);

    if (before) {
      const speedup = before.p95Ms > 0 ? Math.round((before.p95Ms / Math.max(after.p95Ms, 0.01)) * 10) / 10 : 0;
      const tput = after.throughputRps > 0 ? Math.round((after.throughputRps / Math.max(before.throughputRps, 1)) * 10) / 10 : 0;
      console.log(`\nSUMMARY: p95 ${before.p95Ms}ms → ${after.p95Ms}ms (${speedup}× faster)  ·  throughput ${tput}× higher`);
    }
    const changedRate = Math.round((after.status200 / (after.status200 + after.status304)) * 100);
    console.log(`         ${after.status304} of ${after.status200 + after.status304} polls served as 304 (only ${changedRate}% needed a full payload)`);

    const failures = [];
    if (after.errors !== 0) failures.push(`${after.errors} request error(s)`);
    if (after.requests !== USERS * POLLS) {
      failures.push(`expected ${USERS * POLLS} responses, measured ${after.requests}`);
    }
    if (after.p95Ms > MAX_P95_MS) {
      failures.push(`p95 ${after.p95Ms}ms exceeds ${MAX_P95_MS}ms`);
    }
    if (after.throughputRps < MIN_THROUGHPUT_RPS) {
      failures.push(`throughput ${after.throughputRps} req/s is below ${MIN_THROUGHPUT_RPS}`);
    }

    await emitJson({
      tool: "dna-lab-load-test",
      generatedAt: new Date().toISOString(),
      startedAt,
      scenario: {
        users: USERS,
        polls: POLLS,
        events: EVENTS,
        issues: ISSUES,
        afterOnly: AFTER_ONLY,
      },
      thresholds: {
        maxP95Ms: Number.isFinite(MAX_P95_MS) ? MAX_P95_MS : null,
        minThroughputRps: MIN_THROUGHPUT_RPS || null,
      },
      before,
      after,
      gate: {
        passed: failures.length === 0,
        failures,
      },
    });

    if (failures.length) {
      throw new Error(`Load gate failed: ${failures.join("; ")}`);
    }
  } finally {
    keepAlive.destroy();
    await rm(root, { recursive: true, force: true });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
