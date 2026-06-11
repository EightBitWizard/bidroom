import { expect, test } from "@playwright/test";

/**
 * UI smoke tests for the Phase 0 shell. These run against `next start`, where the Cloudflare
 * backend (D1/KV) is not bound, so the API responds 503: the test verifies the marketing and
 * login UI render and that the login form posts and surfaces an outcome. The live
 * sign-up-to-workspace flow runs against `wrangler dev` / the OpenNext preview locally and is
 * covered end to end by the backend integration tests (src/server/flow.test.ts).
 */

test("landing page renders with the tagline and the SIMAP disclaimer", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByTestId("source-disclaimer")).toContainText("www.simap.ch");
});

test("the root redirects to the default locale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
});

test("login form posts and surfaces an outcome", async ({ page }) => {
  await page.goto("/en/login");
  await expect(page.getByTestId("login-email")).toBeVisible();
  await page.getByTestId("login-email").fill("founder@acme.ch");
  await page.getByTestId("login-submit").click();
  // The backend is unconfigured under `next start`, so the form shows a message either way.
  await expect(page.getByTestId("login-message")).toBeVisible();
});

test("the company profile form renders", async ({ page }) => {
  // The form falls back to empty fields when the backend is unconfigured, so it renders under
  // `next start`. The live save and tenant scoping are covered by the integration tests.
  await page.goto("/en/app/any-workspace-id/profile");
  await expect(page.getByTestId("profile-form")).toBeVisible();
  await expect(page.getByTestId("profile-capabilityTags")).toBeVisible();
});
