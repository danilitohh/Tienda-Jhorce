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

  return <div className="grid gap-12 lg:grid-cols-[.8fr_1fr] lg:gap-24"><div><div className="flex h-11 w-11 items-center justify-center rounded-[9px] bg-ink text-white"><LockKey size={21} weight="light" /></div><h1 className="mt-7 max-w-md font-display text-5xl font-semibold leading-[.92] tracking-[-.03em] sm:text-6xl">Vuelve a lo que te mueve.</h1><p className="mt-5 max-w-sm text-sm leading-7 text-muted">Accede a tus pedidos, favoritos y direcciones guardadas.</p><div className="mt-10 grid gap-4 text-sm text-muted"><p className="flex items-center gap-3"><Check size={17} className="text-success" /> Seguimiento de tus pedidos</p><p className="flex items-center gap-3"><Check size={17} className="text-success" /> Checkout más rápido</p><p className="flex items-center gap-3"><Check size={17} className="text-success" /> Wishlist y recomendaciones</p></div></div><form onSubmit={handleSubmit} className="surface-panel p-6 sm:p-9"><h2 className="font-display text-3xl font-semibold leading-none">Iniciar sesión</h2><p className="mt-3 text-sm text-muted">¿Primera vez aquí? <Link href="/registro" className="font-medium text-accent-deep hover:underline">Crea tu cuenta</Link></p><div className="mt-8 grid gap-5"><label className="grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Correo electrónico<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field-input font-normal normal-case tracking-normal placeholder:text-muted/60" placeholder="tu@correo.com" /></label><label className="grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Contraseña<input required type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="field-input font-normal normal-case tracking-normal placeholder:text-muted/60" placeholder="••••••••" /></label></div><div className="mt-3 text-right"><Link href="/recuperar" className="text-xs text-muted underline underline-offset-4 transition-colors hover:text-accent-deep">¿Olvidaste tu contraseña?</Link></div><button disabled={loading} className="button-primary mt-8 w-full disabled:cursor-wait disabled:opacity-60">{loading ? "Entrando..." : "Entrar"} {!loading && <ArrowRight size={17} />}</button>{status && <p role="status" className="mt-5 rounded-[8px] bg-sand/60 px-4 py-3 text-xs leading-5 text-muted">{status}</p>}<p className="mt-6 text-center text-[11px] leading-5 text-muted">Al continuar aceptas nuestros términos y política de privacidad.</p></form></div>;
}
