"use client";

import Link from "next/link";
import { ArrowRight, Check, LockKey } from "@phosphor-icons/react";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

// Login form delegates credential handling to Supabase Auth and stays usable in demo mode without env values.
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sign in securely through Supabase Auth without handling passwords in application code.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) { setStatus("Configura Supabase para activar el acceso. La tienda demo sigue disponible."); setLoading(false); return; }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setStatus(error ? "No pudimos iniciar sesión. Revisa tus datos e inténtalo de nuevo." : "Sesión iniciada. Ya puedes continuar con tu compra.");
    setLoading(false);
  };

  return <div className="grid gap-12 lg:grid-cols-[.8fr_1fr] lg:gap-24"><div><div className="flex h-11 w-11 items-center justify-center bg-accent text-white"><LockKey size={21} weight="light" /></div><h1 className="mt-7 font-display text-4xl font-bold tracking-[-.06em] sm:text-5xl">Vuelve a lo que te mueve.</h1><p className="mt-5 max-w-sm text-sm leading-7 text-slate-500">Accede a tus pedidos, favoritos y direcciones guardadas.</p><div className="mt-10 grid gap-4 text-sm text-slate-600"><p className="flex items-center gap-3"><Check size={17} className="text-accent" /> Seguimiento de tus pedidos</p><p className="flex items-center gap-3"><Check size={17} className="text-accent" /> Checkout más rápido</p><p className="flex items-center gap-3"><Check size={17} className="text-accent" /> Wishlist y recomendaciones</p></div></div><form onSubmit={handleSubmit} className="border border-ink/10 bg-white p-6 sm:p-9"><h2 className="font-display text-2xl font-semibold">Iniciar sesión</h2><p className="mt-2 text-sm text-slate-500">¿Primera vez aquí? <Link href="/registro" className="font-medium text-accent hover:underline">Crea tu cuenta</Link></p><div className="mt-8 grid gap-5"><label className="grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Correo electrónico<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="border-b border-ink/20 bg-transparent px-0 py-3 text-sm font-normal normal-case tracking-normal outline-none placeholder:text-slate-300 focus:border-accent" placeholder="tu@correo.com" /></label><label className="grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Contraseña<input required type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="border-b border-ink/20 bg-transparent px-0 py-3 text-sm font-normal normal-case tracking-normal outline-none placeholder:text-slate-300 focus:border-accent" placeholder="••••••••" /></label></div><div className="mt-3 text-right"><Link href="/recuperar" className="text-xs text-slate-500 underline underline-offset-4 hover:text-accent">¿Olvidaste tu contraseña?</Link></div><button disabled={loading} className="mt-8 flex w-full items-center justify-center gap-2 bg-ink px-5 py-3.5 text-sm font-semibold text-white hover:bg-accent disabled:cursor-wait disabled:opacity-60">{loading ? "Entrando..." : "Entrar"} {!loading && <ArrowRight size={17} />}</button>{status && <p role="status" className="mt-5 bg-mist/60 px-4 py-3 text-xs leading-5 text-slate-600">{status}</p>}<p className="mt-6 text-center text-[11px] leading-5 text-slate-400">Al continuar aceptas nuestros términos y política de privacidad.</p></form></div>;
}

