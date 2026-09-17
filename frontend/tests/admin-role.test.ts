import { describe, expect, it } from "vitest";
import { ADMIN_ROLE, isAdminRole } from "@backend/admin/admin-role";

// Authorization accepts only the single owner role and never treats client-editable metadata as elevated access.
describe("admin role", () => {
  it("accepts only the configured admin role", () => {
    expect(isAdminRole(ADMIN_ROLE)).toBe(true);
    expect(isAdminRole("superadmin")).toBe(false);
    expect(isAdminRole("ADMIN")).toBe(false);
    expect(isAdminRole(undefined)).toBe(false);
  });
});
