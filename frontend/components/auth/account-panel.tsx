"use client";

import { SignOut, UserCircle } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AuthenticatedUser } from "@backend/auth/auth-types";
import { postAuth } from "@/lib/auth-client";

// Present the authenticated customer identity and provide a deliberate, server-revoked logout action.
export function AccountPanel({ user }: Readonly<{ user: AuthenticatedUser }>) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const logout = async () => {
    setLoading(true);
    setStatus(null);
    const result = await postAuth<{ signedOut: boolean }>("/api/auth/logout", {});
    if (result.error) { setStatus(result.error.message); setLoading(false); return; }
    router.replace("/");
    router.refresh();
  };

  return <section className="surface-panel max-w-2xl p-6 sm:p-9"><div><span className="grid h-11 w-11 place-items-center rounded-[9px] bg-gold-pale text-gold-deep"><UserCircle size={24} weight="light" /></span><p className="eyebrow mt-7">Mi cuenta</p><h1 className="mt-3 font-display text-4xl font-semibold leading-none tracking-[-.03em]">Hola, {user.firstName}.</h1><p className="mt-3 text-sm text-muted">{user.email}</p></div><div className="mt-8 border-y border-ink/10 py-5 text-sm leading-7 text-muted"><p>Tu sesión está protegida y vinculada a esta cuenta.</p><p className="mt-1">Los pedidos y direcciones aparecerán aquí cuando el checkout real esté conectado.</p></div><button type="button" disabled={loading} onClick={logout} className="button-secondary mt-7 disabled:cursor-wait disabled:opacity-60">{loading ? "Cerrando sesión..." : "Cerrar sesión"} <SignOut size={17} /></button>{status && <p role="status" className="mt-5 rounded-[8px] bg-sand/60 px-4 py-3 text-xs leading-5 text-muted">{status}</p>}</section>;
}
