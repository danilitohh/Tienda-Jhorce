import { afterEach, describe, expect, it } from "vitest";
import { isAdminAuthConfigured, verifyAdminCredentials } from "@/lib/admin-config";

const previousUsername = process.env.ADMIN_USERNAME;
const previousPassword = process.env.ADMIN_PASSWORD;

// Restore deployment-like environment values so credential tests do not leak state into other suites.
afterEach(() => {
  if (previousUsername === undefined) delete process.env.ADMIN_USERNAME;
  else process.env.ADMIN_USERNAME = previousUsername;
  if (previousPassword === undefined) delete process.env.ADMIN_PASSWORD;
  else process.env.ADMIN_PASSWORD = previousPassword;
});

// Verify the private admin boundary without requiring a live MongoDB connection.
describe("admin credentials", () => {
  it("accepts the configured username case-insensitively and exact password", () => {
    process.env.ADMIN_USERNAME = "ByJhorAdmin";
    process.env.ADMIN_PASSWORD = "una-clave-segura";

    expect(isAdminAuthConfigured()).toBe(true);
    expect(verifyAdminCredentials(" byjhoradmin ", "una-clave-segura")).toBe(true);
    expect(verifyAdminCredentials("byjhoradmin", "otra-clave")).toBe(false);
  });

  it("rejects incomplete configuration", () => {
    process.env.ADMIN_USERNAME = "admin";
    process.env.ADMIN_PASSWORD = "corta";

    expect(isAdminAuthConfigured()).toBe(false);
    expect(verifyAdminCredentials("admin", "corta")).toBe(false);
  });
});
