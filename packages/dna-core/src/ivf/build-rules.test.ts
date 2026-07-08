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
});
