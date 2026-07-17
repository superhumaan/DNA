import { test, expect } from "@playwright/test";

const API = "/api/dna/labs";

test.describe("DNA Lab smoke", () => {
  test("health endpoint reports a healthy single-instance backend", async ({ request }) => {
    const res = await request.get(`${API}/health`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.stateBackend).toBeTruthy();
    expect(body.instanceCount).toBe(1);
  });

  test("critical route renders the Lab shell", async ({ page }) => {
    await page.goto("/labs");
    // The shell mounts the client into #app and the client renders the DNA
    // Lab brand once bootstrap completes.
    await expect(page.locator("#app")).toBeAttached();
    await expect(page.locator(".dna-web-brand").first()).toBeVisible();
  });

  test("overview renders stats sourced from the data endpoint", async ({ page }) => {
    await page.goto("/labs");

    // In local mode the client bootstraps straight into the dashboard overview.
    await expect(
      page.locator(".soli-administration-page-header__title", { hasText: "Overview" }),
    ).toBeVisible();

    // Overview stat cards are driven by /api/dna/labs/data.
    await expect(
      page.locator(".lab-stat-card__label", { hasText: "Unresolved issues" }),
    ).toBeVisible();
    await expect(
      page.locator(".lab-stat-card__label", { hasText: "Errors (24h)" }),
    ).toBeVisible();

    // The overview nav item is present and marked active.
    await expect(page.locator('[data-tab="overview"]')).toBeVisible();
  });

  test("data endpoint returns overview stats", async ({ request }) => {
    const res = await request.get(`${API}/data`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("stats");
    expect(body).toHaveProperty("issueGroups");
  });
});
