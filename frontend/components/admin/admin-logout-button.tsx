"use client";

import { SignOut } from "@phosphor-icons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth-client";

// End only the administrative session so the owner can keep a separate customer session if needed.
export function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Revoke the server-side admin session before returning to the admin login screen.
  const handleLogout = async () => {
    setLoading(true);
    setStatus(null);
    const result = await postAuth("/api/admin/logout", {});
    if (result.error) {
      setStatus(result.error.message);
      setLoading(false);
      return;
    }
    router.replace("/admin/login");
    router.refresh();
  };

  return <span className="flex items-center gap-2"><button type="button" onClick={handleLogout} disabled={loading} className="button-secondary shrink-0 disabled:cursor-wait disabled:opacity-60">{loading ? "Saliendo..." : "Cerrar sesión"} <SignOut size={16} /></button>{status && <span role="alert" className="max-w-32 text-[11px] leading-4 text-error">{status}</span>}</span>;
}
