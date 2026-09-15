"use client";

import Link from "next/link";
import { ArrowRight, Check } from "@phosphor-icons/react";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

// Signup delegates password hashing and email verification to Supabase Auth.
export function SignupForm() {
  const [values, setValues] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Create an account with metadata for the commerce profile to consume later.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) { setStatus("Configura Supabase para activar el registro."); setLoading(false); return; }
    const { error } = await supabase.auth.signUp({ email: values.email, password: values.password, options: { data: { first_name: values.firstName, last_name: values.lastName } } });
    setStatus(error ? "No pudimos crear tu cuenta. Revisa los datos e inténtalo de nuevo." : "Revisa tu correo para confirmar la cuenta antes de comprar.");
    setLoading(false);
  };

  return <form onSubmit={handleSubmit} className="border border-ink/10 bg-white p-6 sm:p-9"><h1 className="font-display text-3xl font-bold tracking-[-.06em]">Crea tu cuenta</h1><p className="mt-2 text-sm text-slate-500">¿Ya tienes cuenta? <Link href="/login" className="font-medium text-accent hover:underline">Inicia sesión</Link></p><div className="mt-8 grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Nombre<input required value={values.firstName} onChange={(event) => setValues({ ...values, firstName: event.target.value })} className="border-b border-ink/20 bg-transparent px-0 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-accent" /></label><label className="grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Apellido<input required value={values.lastName} onChange={(event) => setValues({ ...values, lastName: event.target.value })} className="border-b border-ink/20 bg-transparent px-0 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-accent" /></label></div><label className="mt-5 grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Correo electrónico<input required type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} className="border-b border-ink/20 bg-transparent px-0 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-accent" /></label><label className="mt-5 grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Contraseña<input required minLength={8} type="password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} className="border-b border-ink/20 bg-transparent px-0 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-accent" /></label><button disabled={loading} className="mt-8 flex w-full items-center justify-center gap-2 bg-ink px-5 py-3.5 text-sm font-semibold text-white hover:bg-accent disabled:opacity-60">{loading ? "Creando..." : "Crear cuenta"}{!loading && <ArrowRight size={17} />}</button>{status && <p role="status" className="mt-5 bg-mist/60 px-4 py-3 text-xs leading-5 text-slate-600">{status}</p>}<p className="mt-6 flex gap-2 text-[11px] leading-5 text-slate-400"><Check size={15} className="shrink-0 text-accent" /> Te enviaremos un correo de verificación para proteger tu cuenta.</p></form>;
}

