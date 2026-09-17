import { isMongoAuthConfigured } from "@/lib/auth-data";
import { isAdminAuthConfigured } from "@/lib/admin-config";
import { getCurrentAdminSession } from "@/lib/admin-session";

export type AdminAccess =
  | Readonly<{ state: "configured"; username: string }>
  | Readonly<{ state: "not-configured" }>
  | Readonly<{ state: "signed-out" }>;

// Resolve the separate HttpOnly admin session before allowing access to the owner's operations.
export async function getAdminAccess(): Promise<AdminAccess> {
  if (!isMongoAuthConfigured() || !isAdminAuthConfigured()) return { state: "not-configured" };

  const session = await getCurrentAdminSession();
  if (!session) return { state: "signed-out" };

  return { state: "configured", username: session.username };
}
