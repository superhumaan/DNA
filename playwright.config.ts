import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Chromium smoke for the DNA Lab.
 *
 * Boots the real Lab HTTP server (see e2e/lab-server.mjs) and exercises the
 * critical route, the health endpoint, and the overview — the journeys that
 * must never silently break. Kept intentionally small and deterministic so it
 * can gate every push.
 */
const PORT = Number(process.env.DNA_LAB_E2E_PORT || 3210);
const HOST = "127.0.0.1";
const BASE_URL = `http://${HOST}:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "node e2e/lab-server.mjs",
    url: `${BASE_URL}/api/dna/labs/health`,
    timeout: 60_000,
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
    env: { DNA_LAB_E2E_PORT: String(PORT) },
  },
});
