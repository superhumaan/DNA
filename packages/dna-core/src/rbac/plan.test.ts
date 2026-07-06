import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { runWizard } from "../wizard.js";
import { generateRbacPlan, parseRolesInput } from "./plan.js";

describe("rbac plan", () => {
  it("parses role lists", () => {
    expect(parseRolesInput("manager, hr, admin")).toEqual(["manager", "hr", "admin"]);
  });

  it("generates plan and permission matrix", async () => {
    const root = join(tmpdir(), `dna-rbac-${randomUUID()}`);
    await mkdir(join(root, "src"), { recursive: true });
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({ name: "dash-test", dependencies: { react: "^18", express: "^4" } }),
    );
    await writeFile(
      join(root, "src", "App.tsx"),
      `const menuItems = [{ label: "Dashboard", path: "/dashboard" }];
<Route path="/admin" />`,
    );

    await runWizard({
      root,
      answers: {
        projectDescription: "Manager dashboard",
        acceptRecommendation: true,
        aiTools: ["cursor"],
        compliance: "none",
        stage: "mvp",
        installRuntime: false,
        configureGithub: false,
        configureAi: false,
      },
    });

    const result = await generateRbacPlan({
      root,
      quote:
        "No employee should access unless I give them access. Roles: manager, hr, operations, admin",
      roles: ["manager", "hr", "operations", "admin"],
      feature: "dashboard",
      denyByDefault: true,
      zeroTrust: true,
    });

    expect(result.context).toContain("dashboard");
    expect(result.context).toContain("Phase 4");
    expect(result.context).toContain("menus, notifications");
    expect(result.planPath).toContain("rbac-dashboard.md");

    await rm(root, { recursive: true, force: true });
  });
});
