"use client";

import Link from "next/link";
import { ArrowRight, LockKey } from "@phosphor-icons/react";
import { FormEvent, useState } from "react";
import { postAuth } from "@/lib/auth-client";

// Request a one-use reset link without revealing whether a customer email exists.
export function RecoverForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Start the server-owned email recovery flow and keep the generic response safe against enumeration.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    const result = await postAuth<{ message: string }>("/api/auth/request-password-reset", { email });
    setStatus(result.error ? result.error.message : result.data.message);
    setLoading(false);
  };

  return <div className="mx-auto max-w-lg"><div className="surface-panel p-6 sm:p-9"><div className="flex h-11 w-11 items-center justify-center rounded-[9px] bg-ink text-white"><LockKey size={21} weight="light" /></div><h1 className="mt-7 font-display text-4xl font-semibold leading-none tracking-[-.03em]">Recupera el acceso.</h1><p className="mt-3 text-sm leading-6 text-muted">Te enviaremos un enlace seguro para crear una nueva contraseña.</p><form onSubmit={handleSubmit} className="mt-8"><label className="grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Correo electrónico<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field-input font-normal normal-case tracking-normal placeholder:text-muted/60" placeholder="tu@correo.com" /></label><button disabled={loading} className="button-primary mt-8 w-full disabled:cursor-wait disabled:opacity-60">{loading ? "Enviando..." : "Enviar enlace"} {!loading && <ArrowRight size={17} />}</button></form>{status && <p role="status" className="mt-5 rounded-[8px] bg-sand/60 px-4 py-3 text-xs leading-5 text-muted">{status}</p>}<Link href="/login" className="mt-7 block text-center text-xs text-muted underline underline-offset-4 transition-colors hover:text-accent-deep">Volver a iniciar sesión</Link></div></div>;
}
