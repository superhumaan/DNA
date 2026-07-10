import { describe, it, expect, afterEach } from "vitest";
import { mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import type { DnaConfig } from "@superhumaan/dna-config";
import {
  wireExpressContent,
  wireFastifyContent,
  generateNextMiddleware,
  wireRuntimeMiddleware,
} from "./wire-runtime.js";

function testConfig(): DnaConfig {
  return {
    version: "0.1.0",
    projectId: "wire-test",
    projectName: "wire-test",
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
  };
}

const EXPRESS_SOURCE = `import express from "express";

const app = express();
app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(3000);
`;

const FASTIFY_SOURCE = `import Fastify from "fastify";

const fastify = Fastify();
fastify.get("/health", async () => ({ ok: true }));

fastify.listen({ port: 3000 });
`;

describe("wire-runtime", () => {
  let root: string;

  afterEach(async () => {
    if (root) await rm(root, { recursive: true, force: true });
  });

  it("wires Express entry with start, middleware, and error handler", () => {
    const wired = wireExpressContent(EXPRESS_SOURCE, "wire-test");
    expect(wired).toContain("dnaRuntime.start");
    expect(wired).toContain("app.use(dnaRuntime.express())");
    expect(wired).toContain("app.use(dnaRuntime.errorHandler())");
    expect(wired).toMatch(/app\.use\(dnaRuntime\.errorHandler\(\)\)[\s\S]*app\.listen/);
  });

  it("wires Fastify entry with attachFastify", () => {
    const wired = wireFastifyContent(FASTIFY_SOURCE, "wire-test");
    expect(wired).toContain("dnaRuntime.start");
    expect(wired).toContain("dnaRuntime.attachFastify(fastify)");
  });

  it("generates Next.js middleware scaffold", () => {
    const middleware = generateNextMiddleware("wire-test");
    expect(middleware).toContain("dnaRuntime.nextMiddleware()");
    expect(middleware).toContain("export async function middleware");
  });

  it("creates Next middleware file during doctor wire", async () => {
    root = join(tmpdir(), `dna-wire-${randomUUID()}`);
    await mkdir(join(root, "src", "app"), { recursive: true });
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({
        name: "next-app",
        dependencies: { next: "15.0.0" },
        scripts: { dev: "next dev" },
      }),
    );

    const result = await wireRuntimeMiddleware({ root, config: testConfig() });
    expect(result.wired).toContain("src/middleware.ts");
    const content = await readFile(join(root, "src/middleware.ts"), "utf-8");
    expect(content).toContain("dnaRuntime");
  });

  it("patches Express entry file during doctor wire", async () => {
    root = join(tmpdir(), `dna-wire-express-${randomUUID()}`);
    await mkdir(join(root, "src"), { recursive: true });
    await writeFile(join(root, "src/index.ts"), EXPRESS_SOURCE);
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({
        name: "api",
        dependencies: { express: "4.21.0" },
        scripts: { dev: "tsx src/index.ts" },
      }),
    );

    const result = await wireRuntimeMiddleware({ root, config: testConfig() });
    expect(result.wired).toContain("src/index.ts");
    const content = await readFile(join(root, "src/index.ts"), "utf-8");
    expect(content).toContain("dnaRuntime.express()");
  });

  it("adds preload to scripts when no entry file matches", async () => {
    root = join(tmpdir(), `dna-wire-preload-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({
        name: "custom",
        dependencies: { hono: "4.0.0" },
        scripts: { dev: "node server.mjs", start: "node server.mjs" },
      }),
    );

    const result = await wireRuntimeMiddleware({ root, config: testConfig() });
    expect(result.wired.some((w) => w.includes("preload"))).toBe(true);
    const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf-8")) as {
      scripts: Record<string, string>;
    };
    expect(pkg.scripts.dev).toContain("runtime/preload");
  });
});
