import { isAdminRole } from "@backend/admin/admin-role";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export type AdminAccess =
  | Readonly<{ state: "configured"; email: string | null }>
  | Readonly<{ state: "not-configured" }>
  | Readonly<{ state: "signed-out" }>
  | Readonly<{ state: "forbidden" }>;

// Verify signed claims server-side and read only app_metadata, which an end user cannot edit.
export async function getAdminAccess(): Promise<AdminAccess> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { state: "not-configured" };

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return { state: "signed-out" };

  const appMetadata = data.claims.app_metadata;
  const role = typeof appMetadata === "object" && appMetadata ? Reflect.get(appMetadata, "role") : undefined;
  if (!isAdminRole(role)) return { state: "forbidden" };

  const email = typeof data.claims.email === "string" ? data.claims.email : null;
  return { state: "configured", email };
}
