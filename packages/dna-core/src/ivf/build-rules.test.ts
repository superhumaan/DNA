import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { runWizard } from "../wizard.js";
import { fileExists } from "../fs.js";
import {
  analyzeFeaturePatterns,
  ensureFeatureBuildingRules,
  formatFeaturePatternSummary,
} from "./build-rules.js";

describe("IVF feature building rules", () => {
  it("detects MUI list/report page patterns", async () => {
    const root = join(tmpdir(), `dna-fp-analyze-${randomUUID()}`);
    await mkdir(join(root, "src", "pages", "reports"), { recursive: true });
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({
        name: "reports-app",
        dependencies: { "@mui/material": "^6.0.0", react: "^18.0.0" },
      }),
    );
    await writeFile(
      join(root, "src", "pages", "reports", "UsersReportPage.tsx"),
      `import { Box, Stack, Typography, TextField, Paper, Table, TablePagination } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
export function UsersReportPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" component="h1">Users Report</Typography>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField size="small" placeholder="Search users" InputProps={{ startAdornment: <SearchIcon /> }} />
      </Stack>
      <Paper variant="outlined"><Table /></Paper>
      <TablePagination component="div" count={100} page={0} rowsPerPage={10} />
    </Box>
  );
}`,
    );

    const analysis = await analyzeFeaturePatterns(root);
    const summary = formatFeaturePatternSummary(analysis);

    expect(analysis.isWebProject).toBe(true);
    expect(analysis.usesMui).toBe(true);
    expect(analysis.referenceListPage?.path).toContain("UsersReportPage.tsx");
    expect(analysis.referenceListPage?.hasSearch).toBe(true);
    expect(analysis.referenceListPage?.hasPagination).toBe(true);
    expect(analysis.titleVariant).toBe("h5");
    expect(summary).toContain("MUI detected");

    await rm(root, { recursive: true, force: true });
  });

  it("ensureFeatureBuildingRules writes build rules and cursor rule", async () => {
    const root = join(tmpdir(), `dna-fp-ensure-${randomUUID()}`);
    await mkdir(join(root, "src", "features", "orders"), { recursive: true });
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({
        name: "orders-app",
        dependencies: { "@mui/material": "^6.0.0", react: "^18.0.0" },
      }),
    );
    await writeFile(
      join(root, "src", "features", "orders", "OrdersListPage.tsx"),
      `import { Box, Typography, Table, TablePagination } from "@mui/material";
export function OrdersListPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Orders</Typography>
      <Table />
      <TablePagination rowsPerPage={25} />
    </Box>
  );
}`,
    );

    await runWizard({
      root,
      answers: {
        projectDescription: "Orders dashboard",
        acceptRecommendation: true,
        aiTools: ["cursor"],
        compliance: "none",
        stage: "legacy_modernisation",
        installRuntime: false,
        configureGithub: false,
        configureAi: false,
      },
    });

    const result = await ensureFeatureBuildingRules({ root });

    expect(result.skipped).toBe(false);
    expect(await fileExists(result.rulesPath)).toBe(true);
    expect(await fileExists(result.templatesPath)).toBe(true);
    expect(await fileExists(result.projectKnowledgePaths[0]!)).toBe(true);
    expect(await fileExists(result.cursorRulePath!)).toBe(true);

    const rules = await import("node:fs/promises").then((fs) => fs.readFile(result.rulesPath, "utf-8"));
    expect(rules).toContain("Never invent UI layout");
    expect(rules).toContain("OrdersListPage");

    await rm(root, { recursive: true, force: true });
  });

  it("detects domain module structure from monorepo workspace", async () => {
    const root = join(tmpdir(), `dna-fp-monorepo-${randomUUID()}`);
    const cliRoot = join(root, "packages", "cli");
    await mkdir(join(root, "packages", "core", "src", "billing"), { recursive: true });
    await mkdir(join(root, "packages", "core", "src", "compliance"), { recursive: true });
    await mkdir(join(cliRoot, "src"), { recursive: true });
    await writeFile(join(root, "pnpm-workspace.yaml"), "packages:\n  - packages/*\n");
    await writeFile(
      join(cliRoot, "package.json"),
      JSON.stringify({ name: "cli-app", dependencies: { commander: "^12.0.0" } }),
    );
    await writeFile(join(root, "packages", "core", "src", "billing", "plan.ts"), "export function buildPlan() {}");
    await writeFile(join(root, "packages", "core", "src", "billing", "context.ts"), "export function buildContext() {}");
    await writeFile(join(root, "packages", "core", "src", "billing", "plan.test.ts"), "import { describe, it } from 'vitest';");
    await writeFile(join(root, "packages", "core", "src", "compliance", "plan.ts"), "export function buildCompliancePlan() {}");
    await writeFile(join(root, "packages", "core", "src", "compliance", "context.ts"), "export function buildComplianceContext() {}");
    await writeFile(join(root, "packages", "core", "src", "compliance", "plan.test.ts"), "import { describe, it } from 'vitest';");

    await runWizard({
      root: cliRoot,
      answers: {
        projectDescription: "CLI monorepo package",
        acceptRecommendation: true,
        aiTools: ["cursor"],
        compliance: "none",
        stage: "legacy_modernisation",
        installRuntime: false,
        configureGithub: false,
        configureAi: false,
      },
    });

    const analysis = await analyzeFeaturePatterns(cliRoot);

    expect(analysis.structureCaptured).toBe(true);
    expect(analysis.referenceModule?.path).toContain("packages/core/src/");
    expect(analysis.projectKind).toBe("library");
    expect(analysis.featureFolders.length).toBeGreaterThan(0);

    const result = await ensureFeatureBuildingRules({ root: cliRoot });
    expect(result.skipped).toBe(false);

    const rules = await import("node:fs/promises").then((fs) => fs.readFile(result.rulesPath, "utf-8"));
    expect(rules).toContain("Never invent folder or module layout");
    expect(rules).toContain("Reference module");

    await rm(root, { recursive: true, force: true });
  });

  it("detects JSX list/report pages with MUI and ListPageShell", async () => {
    const root = join(tmpdir(), `dna-fp-jsx-${randomUUID()}`);
    await mkdir(join(root, "src", "pages", "surveys"), { recursive: true });
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({
        name: "humaan-app",
        dependencies: { "@mui/material": "^6.0.0", react: "^18.0.0" },
      }),
    );
    await writeFile(
      join(root, "src", "pages", "surveys", "SurveysListPage.jsx"),
      `import { Table, TablePagination, Typography, TextField } from "@mui/material";
import ListPageShell from "../../components/shell/ListPageShell";
import ListPageFilter from "../../components/ListPageFilter";
export default function SurveysListPage() {
  return (
    <ListPageShell title="Surveys" filters={<ListPageFilter />}>
      <Typography variant="h5">Surveys</Typography>
      <TextField size="small" placeholder="Search surveys" />
      <Table />
      <TablePagination rowsPerPage={25} />
    </ListPageShell>
  );
}`,
    );

    const analysis = await analyzeFeaturePatterns(root);

    expect(analysis.referenceListPage?.path).toContain("SurveysListPage.jsx");
    expect(analysis.structureCaptured).toBe(true);
    expect(analysis.projectKind).toBe("web-ui");

    await rm(root, { recursive: true, force: true });
  });
});
