import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import type { Server } from "node:http";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { dnaRuntime } from "./index.js";
import type { ClassifiedIssue, RuntimeEvent } from "@humaan/dna-config";

async function setupRuntimeProject(): Promise<string> {
  const root = join(tmpdir(), `dna-runtime-${randomUUID()}`);
  await mkdir(join(root, ".DNA", "runtime"), { recursive: true });
  await mkdir(join(root, ".DNA", "immuneSystem"), { recursive: true });
  await writeFile(join(root, ".DNA", "immuneSystem", "rules.json"), '{"rules":[]}');
  await writeFile(
    join(root, ".DNA", "immuneSystem", "issue-classifier.json"),
    '{"classifiers":[]}',
  );
  await writeFile(
    join(root, ".DNA", "immuneSystem", "severity-model.json"),
    '{"levels":{}}',
  );
  return root;
}

describe("express middleware", () => {
  let app: express.Application;
  let server: Server;
  let port: number;
  let projectRoot: string;
  const events: RuntimeEvent[] = [];
  const issues: ClassifiedIssue[] = [];

  beforeEach(async () => {
    projectRoot = await setupRuntimeProject();
    dnaRuntime._resetForTests();
    events.length = 0;
    issues.length = 0;

    dnaRuntime.start({
      projectId: "test",
      projectRoot,
      environment: "test",
      onEvent: (e) => events.push(e),
      onIssue: (i) => issues.push(i),
    });

    app = express();
    app.use(dnaRuntime.express());

    app.get("/ok", (_req, res) => res.json({ ok: true }));
    app.get("/error", () => {
      throw new Error("Test error");
    });
    app.get("/slow", async (_req, res) => {
      await new Promise((r) => setTimeout(r, 50));
      res.status(500).json({ error: "fail" });
    });

    app.use(dnaRuntime.errorHandler());

    server = await new Promise<Server>((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });
    port = (server.address() as { port: number }).port;
  });

  afterEach(async () => {
    server?.close();
    await rm(projectRoot, { recursive: true, force: true });
  });

  it("captures middleware errors", async () => {
    await fetch(`http://localhost:${port}/error`);
    await new Promise((r) => setTimeout(r, 200));

    expect(
      issues.some((i) => i.summary.includes("Test error")) ||
        events.some((e) => e.message.includes("Test error")),
    ).toBe(true);
  });

  it("captures 500 responses", async () => {
    await fetch(`http://localhost:${port}/slow`);
    await new Promise((r) => setTimeout(r, 100));
    expect(events.some((e) => e.statusCode === 500 || e.type === "request_error")).toBe(true);
  });
});
