import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { IMPRESSIONS_DIR } from "@superhumaan/dna-config";
import { fileExists } from "../fs.js";
import { runWizard } from "../wizard.js";
import {
  analyzeProject,
  formatAnalysisSummary,
  documentFromCode,
  generateIvfPlan,
  parseVerticalsInput,
} from "./plan.js";

describe("IVF brownfield integration", () => {
  it("parses vertical lists", () => {
    expect(parseVerticalsInput("behaviour,runtime,rbac")).toEqual([
      "behaviour",
      "runtime",
      "rbac",
    ]);
    expect(parseVerticalsInput("invalid,behaviour")).toEqual(["behaviour"]);
  });

  it("analyzes existing express project structure", async () => {
    const root = join(tmpdir(), `dna-ivf-analyze-${randomUUID()}`);
    await mkdir(join(root, "src", "api"), { recursive: true });
    await mkdir(join(root, "src", "components"), { recursive: true });
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({
        name: "brownfield-api",
        dependencies: { express: "^4.18.0", react: "^18.0.0" },
        devDependencies: { vitest: "^1.0.0" },
      }),
    );
    await writeFile(
      join(root, "src", "api", "routes.ts"),
      `import express from "express";
const app = express();
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.post("/api/users", (req, res) => res.json({}));
export default app;`,
    );
    await writeFile(
      join(root, "src", "components", "Dashboard.tsx"),
      `export function Dashboard() { return <div>Dashboard</div>; }`,
    );

    const analysis = await analyzeProject(root, { verticals: ["runtime", "rbac", "impressions"] });
    const summary = formatAnalysisSummary(analysis);

    expect(analysis.scan.backend).toBe("express");
    expect(analysis.scan.frontend).toBe("react");
    expect(analysis.inventory.apis.length).toBeGreaterThan(0);
    expect(analysis.verticalGaps.length).toBe(3);
    expect(summary).toContain("DNA Deep Analysis");
    expect(summary).toContain("express");

    await rm(root, { recursive: true, force: true });
  });

  it("documents from code and generates IVF plan", async () => {
    const root = join(tmpdir(), `dna-ivf-plan-${randomUUID()}`);
    await mkdir(join(root, "src"), { recursive: true });
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({
        name: "legacy-saas",
        dependencies: { express: "^4.18.0", next: "^14.0.0" },
      }),
    );
    await writeFile(
      join(root, "src", "server.ts"),
      `import express from "express";
import jwt from "jsonwebtoken";
const app = express();
app.get("/api/v1/items", (req, res) => res.json([]));
app.use((req, res, next) => { jwt.verify("token", "secret"); next(); });
export default app;`,
    );

    await runWizard({
      root,
      answers: {
        projectDescription: "Legacy B2B SaaS platform",
        acceptRecommendation: true,
        aiTools: ["cursor"],
        compliance: "gdpr",
        stage: "legacy_modernisation",
        installRuntime: false,
        configureGithub: false,
        configureAi: false,
      },
    });

    const docResult = await documentFromCode({ root, merge: true });
    expect(docResult.filesWritten.length).toBeGreaterThan(0);
    const wroteSolutionArch = docResult.filesWritten.some((f) => f.includes("solution-architecture"));
    const existsFromInit = await fileExists(
      join(root, IMPRESSIONS_DIR, "architecture/solution-architecture.md"),
    );
    expect(wroteSolutionArch || existsFromInit).toBe(true);

    const planResult = await generateIvfPlan({
      root,
      quote: "Integrate DNA without rewrite — RBAC, runtime, compliance",
      verticals: ["behaviour", "runtime", "rbac", "compliance", "impressions"],
      documentFromCode: false,
    });

    expect(planResult.context).toContain("Integrating Vertical Functions");
    expect(planResult.context).toContain("Before (as-is)");
    expect(planResult.context).toContain("After (target)");
    expect(planResult.context).toContain("Vertical function gap matrix");
    expect(planResult.context).toContain("Integrate DNA without rewrite");
    expect(planResult.planPath).toContain("ivf-legacy-saas.md");
    expect(planResult.gapsPath).toContain("ivf-gaps.md");
    expect(planResult.analysis.verticalGaps.some((g) => g.vertical === "rbac")).toBe(true);

    await rm(root, { recursive: true, force: true });
  });
});
