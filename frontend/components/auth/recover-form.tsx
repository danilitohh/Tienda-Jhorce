"use client";

import Link from "next/link";
import { ArrowRight, LockKey } from "@phosphor-icons/react";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

// Recovery starts the Supabase email flow without handling reset tokens in the browser manually.
export function RecoverForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  // Request a time-limited password recovery link.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const supabase = createSupabaseBrowserClient();
    if (!supabase) { setStatus("Configura Supabase para activar la recuperación."); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/recuperar` });
    setStatus(error ? "No pudimos enviar el correo. Inténtalo de nuevo." : "Si el correo existe, recibirás un enlace para recuperar tu contraseña.");
  };

  return <div className="mx-auto max-w-lg"><div className="surface-panel p-6 sm:p-9"><div className="flex h-11 w-11 items-center justify-center rounded-[9px] bg-ink text-white"><LockKey size={21} weight="light" /></div><h1 className="mt-7 font-display text-4xl font-semibold leading-none tracking-[-.03em]">Recupera el acceso.</h1><p className="mt-3 text-sm leading-6 text-muted">Te enviaremos un enlace seguro para crear una nueva contraseña.</p><form onSubmit={handleSubmit} className="mt-8"><label className="grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Correo electrónico<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field-input font-normal normal-case tracking-normal placeholder:text-muted/60" placeholder="tu@correo.com" /></label><button className="button-primary mt-8 w-full">Enviar enlace <ArrowRight size={17} /></button></form>{status && <p role="status" className="mt-5 rounded-[8px] bg-sand/60 px-4 py-3 text-xs leading-5 text-muted">{status}</p>}<Link href="/login" className="mt-7 block text-center text-xs text-muted underline underline-offset-4 transition-colors hover:text-accent-deep">Volver a iniciar sesión</Link></div></div>;
}
