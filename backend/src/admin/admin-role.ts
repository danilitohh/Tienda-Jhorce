// Only one elevated role exists in this store. Keeping the check here prevents UI code from
// accidentally treating other metadata values as an administrative permission.
export const ADMIN_ROLE = "admin" as const;

// Validate untyped JWT metadata before it is used to authorize administrative access.
export function isAdminRole(role: unknown): role is typeof ADMIN_ROLE {
  return role === ADMIN_ROLE;
}
