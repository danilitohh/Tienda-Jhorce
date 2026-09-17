"use client";

import Link from "next/link";
import { ArrowRight, Check, LockKey } from "@phosphor-icons/react";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { postAuth } from "@/lib/auth-client";

// Complete a one-use password reset link with a new password handled only by the server endpoint.
export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const token = searchParams.get("token") ?? "";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmation) { setStatus("Las contraseñas no coinciden."); return; }
    setLoading(true);
    setStatus(null);
    const result = await postAuth<{ message: string }>("/api/auth/reset-password", { token, password });
    if (result.error) { setStatus(result.error.message); setLoading(false); return; }
    router.replace("/login?reset=1");
    router.refresh();
  };

  if (!token) return <div className="surface-panel p-6 sm:p-9"><h1 className="font-display text-4xl font-semibold leading-none">Enlace incompleto.</h1><p className="mt-4 text-sm leading-6 text-muted">Solicita un nuevo enlace para recuperar tu contraseña.</p><Link href="/recuperar" className="button-primary mt-7">Recuperar acceso <ArrowRight size={17} /></Link></div>;

  return <div className="mx-auto max-w-lg"><div className="surface-panel p-6 sm:p-9"><div className="flex h-11 w-11 items-center justify-center rounded-[9px] bg-ink text-white"><LockKey size={21} weight="light" /></div><h1 className="mt-7 font-display text-4xl font-semibold leading-none tracking-[-.03em]">Crea una nueva contraseña.</h1><p className="mt-3 text-sm leading-6 text-muted">Elige una contraseña de al menos ocho caracteres.</p><form onSubmit={handleSubmit} className="mt-8"><div className="grid gap-5"><label className="grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Nueva contraseña<input required minLength={8} maxLength={128} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="field-input font-normal normal-case tracking-normal" /></label><label className="grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Confirmar contraseña<input required minLength={8} maxLength={128} type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="field-input font-normal normal-case tracking-normal" /></label></div><button disabled={loading} className="button-primary mt-8 w-full disabled:cursor-wait disabled:opacity-60">{loading ? "Actualizando..." : "Actualizar contraseña"} {!loading && <ArrowRight size={17} />}</button></form>{status && <p role="status" className="mt-5 rounded-[8px] bg-sand/60 px-4 py-3 text-xs leading-5 text-muted">{status}</p>}<p className="mt-6 flex gap-2 text-[11px] leading-5 text-muted"><Check size={15} className="shrink-0 text-success" /> El enlace se puede usar una sola vez y vence en una hora.</p></div></div>;
}
