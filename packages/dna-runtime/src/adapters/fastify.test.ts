import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { dnaRuntime } from "../index.js";
import type { ClassifiedIssue, RuntimeEvent } from "@humaan/dna-config";

async function setupRuntimeProject(): Promise<string> {
  const root = join(tmpdir(), `dna-fastify-${randomUUID()}`);
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

describe("fastify plugin", () => {
  let app: FastifyInstance;
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

    app = Fastify();
    dnaRuntime.attachFastify(app);

    app.get("/error", async () => {
      throw new Error("Fastify test error");
    });

    app.get("/fail", async (_req, reply) => {
      return reply.status(500).send({ error: "fail" });
    });
  });

  afterEach(async () => {
    await app.close();
    await rm(projectRoot, { recursive: true, force: true });
  });

  it("captures route errors", async () => {
    const response = await app.inject({ method: "GET", url: "/error" });
    expect(response.statusCode).toBeGreaterThanOrEqual(500);

    await new Promise((r) => setTimeout(r, 200));
    expect(
      issues.some((i) => i.summary.includes("Fastify test error")) ||
        events.some((e) => e.message.includes("Fastify test error")),
    ).toBe(true);
  });

  it("captures 500 responses", async () => {
    const response = await app.inject({ method: "GET", url: "/fail" });
    expect(response.statusCode).toBe(500);

    await new Promise((r) => setTimeout(r, 150));
    expect(
      events.some((e) => e.statusCode === 500 || e.type === "request_error") ||
        issues.some((i) => i.endpoint === "/fail"),
    ).toBe(true);
  });
});
