import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["packages/**/*.test.ts", "packages/**/*.spec.ts"],
    pool: "forks",
    // Filesystem-heavy generator tests contend badly when Vitest 4 fans out
    // across every CPU. Keep CI deterministic without serialising the suite.
    maxWorkers: 4,
    testTimeout: 15_000,
    hookTimeout: 30_000,
    globalSetup: ["./scripts/vitest-global-setup.mjs"],
    coverage: {
      provider: "v8",
      include: ["packages/**/src/**/*.ts"],
      exclude: ["**/*.test.ts", "**/dist/**", "**/node_modules/**"],
    },
  },
});
