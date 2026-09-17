import { isStoreAdmin } from "@backend/auth/role-service";
import { isMongoAuthConfigured } from "@/lib/auth-data";
import { getCurrentUser } from "@/lib/auth-session";

export type AdminAccess =
  | Readonly<{ state: "configured"; email: string | null }>
  | Readonly<{ state: "not-configured" }>
  | Readonly<{ state: "signed-out" }>
  | Readonly<{ state: "forbidden" }>;

// Resolve the HttpOnly MongoDB session server-side before allowing access to the owner's operations.
export async function getAdminAccess(): Promise<AdminAccess> {
  if (!isMongoAuthConfigured()) return { state: "not-configured" };

  const user = await getCurrentUser();
  if (!user) return { state: "signed-out" };
  if (!isStoreAdmin(user.role)) return { state: "forbidden" };

  return { state: "configured", email: user.email };
}
