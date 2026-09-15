import { expect, test } from "@playwright/test";

// Smoke-test the critical discovery path before deeper auth and payment E2E cases are added.
test("customer can browse catalog and add a product", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Viste lo que/ })).toBeVisible();
  await page.waitForLoadState("networkidle");
  await page.locator('a[href="/catalogo"]').filter({ hasText: "Explorar la colección" }).click();
  await page.waitForURL("**/catalogo", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /Piezas para/ })).toBeVisible();
  await page.getByRole("button", { name: /Añadir Camiseta Aire/ }).click();
  await expect(page.getByRole("link", { name: /Carrito con 1 productos/ })).toBeVisible();
});
