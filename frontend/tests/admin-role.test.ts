import { describe, expect, it } from "vitest";
import { getRoleForVerifiedEmail, isStoreAdmin } from "@backend/auth/role-service";

// Authorization accepts only the single owner role and never elevates arbitrary input.
describe("admin role", () => {
  it("accepts only the configured admin role", () => {
    expect(isStoreAdmin("admin")).toBe(true);
    expect(isStoreAdmin("superadmin")).toBe(false);
    expect(isStoreAdmin("ADMIN")).toBe(false);
    expect(isStoreAdmin(undefined)).toBe(false);
  });

  it("elevates only the configured verified owner email", () => {
    const previousOwnerEmail = process.env.ADMIN_EMAIL;
    process.env.ADMIN_EMAIL = "duena@byjhor.com";
    expect(getRoleForVerifiedEmail("duena@byjhor.com")).toBe("admin");
    expect(getRoleForVerifiedEmail("cliente@byjhor.com")).toBe("customer");
    if (previousOwnerEmail === undefined) delete process.env.ADMIN_EMAIL;
    else process.env.ADMIN_EMAIL = previousOwnerEmail;
  });
});
