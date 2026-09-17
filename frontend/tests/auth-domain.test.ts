import { describe, expect, it } from "vitest";
import { signUpSchema } from "@backend/auth/auth-validation";
import { hashPassword, verifyPassword } from "@backend/auth/password-service";
import { createOpaqueToken, hashOpaqueToken } from "@backend/auth/token-service";

// Verify the security-critical pure domain pieces without requiring a live MongoDB connection.
describe("MongoDB auth domain", () => {
  it("normalizes the customer email at the validation boundary", () => {
    const parsed = signUpSchema.parse({ firstName: "Jhor", lastName: "Cliente", email: " CLIENTE@BYJHOR.COM ", password: "contrasena-segura" });
    expect(parsed.email).toBe("cliente@byjhor.com");
  });

  it("hashes passwords with a salt and verifies only the original value", async () => {
    const hash = await hashPassword("contrasena-segura");
    expect(hash).not.toContain("contrasena-segura");
    await expect(verifyPassword("contrasena-segura", hash)).resolves.toBe(true);
    await expect(verifyPassword("otra-contrasena", hash)).resolves.toBe(false);
  });

  it("persists only one-way digests of opaque session and email tokens", () => {
    const token = createOpaqueToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]{40,}$/);
    expect(hashOpaqueToken(token)).not.toBe(token);
    expect(hashOpaqueToken(token)).toBe(hashOpaqueToken(token));
  });
});
