import { describe, it, expect, afterEach } from "vitest";
import { mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { DNA_AGENTS_DB } from "@superhumaan/dna-config";
import { runDoctorOrchestrator } from "./doctor-orchestrator.js";
import {
  stripLabFromSource,
  stripRuntimeFromSource,
  uninstallLab,
  uninstallRuntime,
} from "./observer-opt-out.js";
import { fileExists } from "./fs.js";

const EXPRESS = `import express from "express";
import { dnaRuntime } from "@superhumaan/dna-by-humaan/runtime";
import { createLabMiddleware } from "@superhumaan/dna-by-humaan/lab";

dnaRuntime.start({
  projectId: "app",
  projectRoot: process.cwd(),
});
const app = express();
app.use(dnaRuntime.express());
app.use(createLabMiddleware({ root: process.cwd(), config: { projectId: "app" } }));
app.use(dnaRuntime.errorHandler());

app.listen(3000);
`;

function configJson(): string {
  return JSON.stringify({
    version: "0.1.0",
    projectId: "opt-out",
    projectName: "opt-out",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stack: { backend: "express" },
    compliance: "none",
    stage: "new",
    aiTools: [],
    autoUpdate: false,
    channel: "stable",
    knowledgePacks: [],
    platformFeatures: [],
    runtime: { enabled: true, storage: "json", watchBackend: true, watchFrontend: true },
    lab: {
      enabled: true,
      path: "/labs",
      requireAuthInProduction: true,
      openLocalWithoutAuth: true,
    },
    github: { enabled: false },
    ai: { enabled: false, provider: "mock" },
    ci: { enabled: false },
    featureFactory: { enabled: false },
  });
}

describe("observer opt-out", () => {
  let root: string;

  afterEach(async () => {
    if (root) await rm(root, { recursive: true, force: true });
  });

  it("strips runtime and lab injections from an entry file", () => {
    const stripped = stripLabFromSource(stripRuntimeFromSource(EXPRESS));
    expect(stripped).not.toContain("dnaRuntime");
    expect(stripped).not.toContain("createLabMiddleware");
    expect(stripped).toContain("app.listen(3000)");
    expect(stripped).toContain('from "express"');
  });

  it("removes runtime files, keeps Agent Mesh, and doctor does not restore them", async () => {
    root = join(tmpdir(), `dna-opt-out-${randomUUID()}`);
    await mkdir(join(root, ".DNA", "runtime"), { recursive: true });
    await mkdir(join(root, ".DNA", "data"), { recursive: true });
    await mkdir(join(root, "src"), { recursive: true });
    await writeFile(join(root, ".DNA", "config.dna.json"), configJson());
    await writeFile(join(root, ".DNA", "runtime", "install-snippet.ts"), "export {};\n");
    await writeFile(join(root, ".DNA", "runtime", "agents.db"), "mesh");
    await writeFile(join(root, ".DNA", "data", "runtime.db"), "{}");
    await writeFile(join(root, "src", "server.ts"), EXPRESS);
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({
        dependencies: { express: "^4.0.0", "@superhumaan/dna-by-humaan": "^0.6.29" },
      }),
    );

    const removed = await uninstallRuntime(root);
    expect(removed.some((item) => item.includes("install-snippet"))).toBe(true);
    expect(await fileExists(join(root, ".DNA", "runtime", "install-snippet.ts"))).toBe(false);
    expect(await fileExists(join(root, ".DNA", "data", "runtime.db"))).toBe(false);
    expect(await readFile(join(root, DNA_AGENTS_DB), "utf-8")).toBe("mesh");

    const server = await readFile(join(root, "src", "server.ts"), "utf-8");
    expect(server).not.toContain("dnaRuntime");
    expect(server).toContain("createLabMiddleware");

    const saved = JSON.parse(await readFile(join(root, ".DNA", "config.dna.json"), "utf-8")) as {
      runtime: { enabled: boolean; removed: boolean };
    };
    expect(saved.runtime.enabled).toBe(false);
    expect(saved.runtime.removed).toBe(true);

    await runDoctorOrchestrator({ root, checkOnly: false });
    expect(await fileExists(join(root, ".DNA", "runtime", "install-snippet.ts"))).toBe(false);
    const after = JSON.parse(await readFile(join(root, ".DNA", "config.dna.json"), "utf-8")) as {
      runtime: { enabled: boolean; removed: boolean };
    };
    expect(after.runtime.removed).toBe(true);
    expect(after.runtime.enabled).toBe(false);
  });

  it("removes lab files and doctor does not restore them", async () => {
    root = join(tmpdir(), `dna-lab-opt-out-${randomUUID()}`);
    await mkdir(join(root, ".DNA", "lab"), { recursive: true });
    await mkdir(join(root, ".DNA", "data"), { recursive: true });
    await mkdir(join(root, "src"), { recursive: true });
    await writeFile(join(root, ".DNA", "config.dna.json"), configJson());
    await writeFile(join(root, ".DNA", "lab", "install-snippet.ts"), "export {};\n");
    await writeFile(join(root, ".DNA", "data", "lab-store.json"), "{}");
    await writeFile(join(root, "src", "server.ts"), EXPRESS);
    await writeFile(join(root, "package.json"), JSON.stringify({ dependencies: { express: "^4.0.0" } }));

    await uninstallLab(root);
    expect(await fileExists(join(root, ".DNA", "lab"))).toBe(false);
    expect(await fileExists(join(root, ".DNA", "data", "lab-store.json"))).toBe(false);
    const server = await readFile(join(root, "src", "server.ts"), "utf-8");
    expect(server).not.toContain("createLabMiddleware");
    expect(server).toContain("dnaRuntime");

    await runDoctorOrchestrator({ root, checkOnly: false });
    expect(await fileExists(join(root, ".DNA", "lab", "install-snippet.ts"))).toBe(false);
    const after = JSON.parse(await readFile(join(root, ".DNA", "config.dna.json"), "utf-8")) as {
      lab: { enabled: boolean; removed: boolean };
    };
    expect(after.lab.removed).toBe(true);
    expect(after.lab.enabled).toBe(false);
  });
});
