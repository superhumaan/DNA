#!/usr/bin/env node
/**
 * Boots a real DNA Lab server for the Playwright smoke suite.
 *
 * Seeds a throwaway project (runtime.db with representative events/issues) in a
 * temp directory, then starts the actual Lab HTTP server via the published
 * `@superhumaan/dna-by-humaan/lab` entrypoint — the same code path production
 * apps mount. Local mode (no auth) is enabled so the smoke exercises the
 * critical route, health endpoint, and overview without a login flow.
 *
 * Playwright starts this via the `webServer` config and waits on /health.
 */
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { startLabServer } from "@superhumaan/dna-by-humaan/lab";

const PORT = Number(process.env.DNA_LAB_E2E_PORT || 3210);
const HOST = "127.0.0.1";

async function seed(root) {
  const dir = join(root, ".DNA", "data");
  await mkdir(dir, { recursive: true });
  const now = Date.now();
  const types = ["request", "slow_request", "uncaught_exception", "third_party_response"];
  const events = Array.from({ length: 120 }, (_, i) => ({
    id: `evt_${i}`,
    timestamp: new Date(now - (i % 720) * 60_000).toISOString(),
    type: types[i % types.length],
    message: `Smoke event ${i}`,
    endpoint: `/api/resource/${i % 10}`,
    method: ["GET", "POST"][i % 2],
    statusCode: [200, 200, 500][i % 3],
    durationMs: 20 + (i % 400),
    fingerprint: `fp_${i % 12}`,
    environment: "production",
    release: "v1.0.0",
  }));
  const issues = Array.from({ length: 12 }, (_, i) => ({
    id: `iss_${i}`,
    eventId: `evt_${i}`,
    fingerprint: `fp_${i}`,
    severity: ["critical", "high", "medium", "low"][i % 4],
    category: "runtime_error",
    title: `Smoke issue ${i}`,
    summary: `Summary ${i}`,
    repeatCount: 1 + i,
    firstSeen: new Date(now - 3_600_000).toISOString(),
    lastSeen: new Date(now - i * 60_000).toISOString(),
  }));
  await writeFile(
    join(dir, "runtime.db"),
    JSON.stringify({ version: 1, events, issues, fingerprints: [] }),
  );
}

async function main() {
  const root = await mkdtemp(join(tmpdir(), "dna-lab-e2e-"));
  await seed(root);

  const server = await startLabServer({
    root,
    port: PORT,
    host: HOST,
    config: { lab: { enabled: true, path: "/labs", openLocalWithoutAuth: true } },
  });

  console.log(`DNA Lab e2e server ready: ${server.url}`);

  const shutdown = async () => {
    try {
      server.close();
    } finally {
      await rm(root, { recursive: true, force: true });
      process.exit(0);
    }
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
