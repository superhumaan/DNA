import { describe, it, expect, afterEach } from "vitest";
import { mkdir, writeFile, rm, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { runDoctor, formatDoctorReport } from "./doctor.js";
import { BEHAVIOUR_FILES } from "@superhumaan/dna-config";

async function scaffoldProject(): Promise<string> {
  const root = join(tmpdir(), `dna-doctor-${randomUUID()}`);
  await mkdir(join(root, ".DNA", "behaviour"), { recursive: true });
  await mkdir(join(root, ".DNA", "immuneSystem"), { recursive: true });
  await mkdir(join(root, ".DNA", "CellularMemory", "hippocampus"), { recursive: true });
  await mkdir(join(root, ".DNA", "hooks"), { recursive: true });
  await mkdir(join(root, ".github", "workflows"), { recursive: true });

  for (const file of BEHAVIOUR_FILES) {
    await writeFile(join(root, ".DNA", "behaviour", file), `# ${file}\n`);
  }
  await writeFile(join(root, ".DNA", "immuneSystem", "rules.json"), "{}");
  await writeFile(
    join(root, ".DNA", "CellularMemory", "hippocampus", "project-summary.md"),
    "# Summary\n",
  );
  await writeFile(join(root, ".DNA", "hooks", "pre-push"), "#!/bin/sh\necho ok\n");
  await writeFile(join(root, ".github", "workflows", "dna-ci.yml"), "name: DNA CI\n");
  await writeFile(join(root, "Dockerfile"), "FROM node:22-alpine\n");
  await writeFile(
    join(root, ".DNA", "config.dna.json"),
    JSON.stringify({
      version: "0.1.0",
      projectId: "doctor-test",
      projectName: "doctor-test",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stack: {},
      compliance: "none",
      stage: "new",
      aiTools: [],
      autoUpdate: true,
      channel: "stable",
      knowledgePacks: [],
      platformFeatures: [],
      github: { enabled: true, owner: "acme", repo: "app" },
      runtime: { enabled: true, storage: "json" },
      ci: { enabled: true, strict: false, perFileCoverage: true, owasp: true, pushToPreview: true, previewProvider: "vercel", coverageThreshold: 80 },
    }),
  );
  await mkdir(join(root, ".DNA", "data"), { recursive: true });
  await writeFile(join(root, ".DNA", "data", "runtime.db"), '{"version":1,"events":[],"issues":[]}\n');

  return root;
}

describe("doctor", () => {
  let root: string;

  afterEach(async () => {
    if (root) await rm(root, { recursive: true, force: true });
  });

  it("reports CI, docker, hooks, and runtime storage status", async () => {
    root = await scaffoldProject();
    const report = await runDoctor(root);
    const formatted = formatDoctorReport(report);

    expect(report.ci.workflowInstalled).toBe(true);
    expect(report.docker.dockerfileInstalled).toBe(true);
    expect(report.hooks.prePushInstalled).toBe(true);
    expect(report.runtime.configured).toBe(true);
    expect(report.github.configured).toBe(true);
    expect(formatted).toContain("CI pipeline");
    expect(formatted).toContain("Docker scaffold");
    expect(formatted).toContain("Git hooks");
    expect(formatted).toContain("Runtime storage");
  });

  it("prompt local testing hint when AI uses mock provider", async () => {
    root = await scaffoldProject();
    const configPath = join(root, ".DNA", "config.dna.json");
    const config = JSON.parse(await readFile(configPath, "utf-8"));
    config.ai = { enabled: true, provider: "mock" };
    await writeFile(configPath, JSON.stringify(config));

    const report = await runDoctor(root);
    const formatted = formatDoctorReport(report);

    expect(report.ai.connected).toBe(false);
    expect(formatted).toContain("AI integration (run dna ai connect)");
    expect(formatted).not.toContain("(mock)");
  });

  it("reports incomplete AI injection when workbench files are missing", async () => {
    root = await scaffoldProject();
    const configPath = join(root, ".DNA", "config.dna.json");
    const config = JSON.parse(await readFile(configPath, "utf-8"));
    config.aiWorkbench = { enabled: true };
    config.featureFactory = { enabled: true };
    await writeFile(configPath, JSON.stringify(config));

    const report = await runDoctor(root);
    const formatted = formatDoctorReport(report);

    expect(report.injection.expected).toBe(true);
    expect(report.injection.complete).toBe(false);
    expect(report.injection.missing.length).toBeGreaterThan(0);
    expect(formatted).toContain("AI injection");
  });

  it("shows provider name when a real AI provider is configured", async () => {
    root = await scaffoldProject();
    const configPath = join(root, ".DNA", "config.dna.json");
    const config = JSON.parse(await readFile(configPath, "utf-8"));
    config.ai = { enabled: true, provider: "openai" };
    await writeFile(configPath, JSON.stringify(config));

    const report = await runDoctor(root);
    const formatted = formatDoctorReport(report);

    expect(report.ai.connected).toBe(true);
    expect(formatted).toContain("AI integration (openai)");
  });
});
