import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { collectDashboardData, formatDashboardStart, startDashboard } from "./server.js";

describe("legacy dashboard compatibility", () => {
  let root = "";

  afterEach(async () => {
    if (root) await rm(root, { recursive: true, force: true });
  });

  it("delegates data collection to the Lab shape", async () => {
    root = await mkdtemp(join(tmpdir(), "dna-dashboard-compat-"));
    const data = await collectDashboardData(root);
    expect(data.doctor).toBeDefined();
    expect(data.runtimeEvents).toEqual([]);
    expect(data.runtimeIssues).toEqual([]);
  });

  it("starts the Lab server at /labs", async () => {
    root = await mkdtemp(join(tmpdir(), "dna-dashboard-server-"));
    const port = 4500 + Math.floor(Math.random() * 200);
    const server = await startDashboard({ root, host: "127.0.0.1", port });
    try {
      expect(server.url).toBe(`http://127.0.0.1:${port}/labs`);
      const response = await fetch(server.url);
      expect(response.status).toBe(200);
      expect(await response.text()).toContain("DNA Lab");
      expect(formatDashboardStart(server.url)).toContain("deprecated");
    } finally {
      server.close();
    }
  });
});
