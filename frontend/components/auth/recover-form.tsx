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

  return <div className="mx-auto max-w-lg"><div className="border border-ink/10 bg-white p-6 sm:p-9"><div className="flex h-11 w-11 items-center justify-center bg-accent text-white"><LockKey size={21} weight="light" /></div><h1 className="mt-7 font-display text-3xl font-bold tracking-[-.06em]">Recupera el acceso.</h1><p className="mt-3 text-sm leading-6 text-slate-500">Te enviaremos un enlace seguro para crear una nueva contraseña.</p><form onSubmit={handleSubmit} className="mt-8"><label className="grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Correo electrónico<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="border-b border-ink/20 bg-transparent px-0 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-accent" placeholder="tu@correo.com" /></label><button className="mt-8 flex w-full items-center justify-center gap-2 bg-ink px-5 py-3.5 text-sm font-semibold text-white hover:bg-accent">Enviar enlace <ArrowRight size={17} /></button></form>{status && <p role="status" className="mt-5 bg-mist/60 px-4 py-3 text-xs leading-5 text-slate-600">{status}</p>}<Link href="/login" className="mt-7 block text-center text-xs text-slate-500 underline underline-offset-4 hover:text-accent">Volver a iniciar sesión</Link></div></div>;
}

