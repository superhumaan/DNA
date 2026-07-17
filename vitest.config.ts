import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["packages/**/*.test.ts", "packages/**/*.spec.ts"],
    // Playwright specs live under e2e/ and run via `@playwright/test`, not Vitest.
    exclude: ["**/node_modules/**", "**/dist/**", "e2e/**"],
    pool: "forks",
    // Filesystem-heavy generator tests contend badly when Vitest 4 fans out
    // across every CPU. Keep CI deterministic without serialising the suite.
    maxWorkers: 4,
    testTimeout: 15_000,
    hookTimeout: 30_000,
    globalSetup: ["./scripts/vitest-global-setup.mjs"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "lcov"],
      reportsDirectory: "coverage",
      // HONEST SCOPE — the enforced coverage gate measures product-critical
      // code we can meaningfully unit test: the generators that produce every
      // scaffold DNA writes (CI, hooks, AI rules, workbench, knowledge, init).
      // The whole monorepo (CLI entrypoints, git/GitHub network I/O, Lab
      // server/storage) is intentionally out of this gate — those surfaces are
      // covered by integration and the Playwright Lab smoke, not line coverage.
      include: ["packages/dna-core/src/generators/**/*.ts"],
      exclude: [
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/dist/**",
        "**/node_modules/**",
        // Generated catalog/content blobs — static data, not logic. Excluded on
        // principle (data, not behaviour), regardless of their line coverage.
        "packages/dna-core/src/generators/neural-network.ts",
        "packages/dna-core/src/generators/ai-command-specs.ts",
        "packages/dna-core/src/generators/intelligence-catalog-build.ts",
        "packages/dna-core/src/generators/prompt-stem-packs/catalog*.ts",
        "packages/dna-core/src/generators/prompt-stem-packs/types.ts",
        // Host-app wiring generators — they mutate a target app's source and are
        // validated by integration tests + the Playwright Lab smoke (e2e/),
        // where their output actually boots, rather than by unit line coverage.
        "packages/dna-core/src/generators/wire-lab.ts",
        "packages/dna-core/src/generators/wire-lab-stack.ts",
        "packages/dna-core/src/generators/wire-runtime.ts",
      ],
      thresholds: {
        // Lines only, per file — matches the CI enforcement script and the
        // canonical health report, which gate on per-file line coverage.
        lines: 80,
        perFile: true,
      },
    },
  },
});
