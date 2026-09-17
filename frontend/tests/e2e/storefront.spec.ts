import { expect, test } from "@playwright/test";

// Smoke-test the critical discovery path before deeper auth and payment E2E cases are added.
test("customer can browse catalog and add a product", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Tu esencia/ })).toBeVisible();
  await page.locator('a[href="/catalogo"]').filter({ hasText: "Ver las pelucas" }).first().click();
  await page.waitForURL("**/catalogo", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /Encuentra tu/ })).toBeVisible();
  await page.getByRole("link", { name: "Elegir opciones" }).first().click();
  await page.waitForURL("**/producto/**", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Añadir al carrito" }).click();
  await expect(page.getByRole("link", { name: /Carrito con 1 productos/ })).toBeVisible();
});

// Without the required services, the protected route must show setup guidance instead of operational data.
test("admin route keeps data private until its services are configured", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: /Configura el acceso administrativo/ })).toBeVisible();
  await expect(page.getByText("Productos recientes")).toHaveCount(0);
});

// Anonymous customers are redirected to the real login surface instead of seeing account data.
test("customer account stays protected while public auth routes remain reachable", async ({ page }) => {
  await page.goto("/cuenta");
  await page.waitForURL("**/login?next=/cuenta", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Iniciar sesión" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Crea tu cuenta" })).toHaveAttribute("href", "/registro");
  await expect(page.getByRole("link", { name: "¿Olvidaste tu contraseña?" })).toHaveAttribute("href", "/recuperar");
});
