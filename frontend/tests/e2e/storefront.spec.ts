import { expect, test } from "@playwright/test";

// Smoke-test the critical discovery path before deeper auth and payment E2E cases are added.
test("customer can browse catalog and add a product", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Tu esencia/ })).toBeVisible();
  await page.waitForLoadState("networkidle");
  await page.locator('a[href="/catalogo"]').filter({ hasText: "Ver las pelucas" }).first().click();
  await page.waitForURL("**/catalogo", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /Encuentra tu/ })).toBeVisible();
  await page.getByRole("link", { name: "Elegir opciones" }).first().click();
  await page.waitForURL("**/producto/**", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Añadir al carrito" }).click();
  await expect(page.getByRole("link", { name: /Carrito con 1 productos/ })).toBeVisible();
});
