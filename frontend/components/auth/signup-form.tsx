"use client";

import Link from "next/link";
import { ArrowRight, Check } from "@phosphor-icons/react";
import { FormEvent, useState } from "react";
import { postAuth } from "@/lib/auth-client";

// Create an unverified MongoDB account and wait for the email confirmation before allowing a session.
export function SignupForm() {
  const [values, setValues] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Send only validated customer fields to the signup route; password hashing remains server-side.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    const result = await postAuth<{ message: string }>("/api/auth/sign-up", values);
    setStatus(result.error ? result.error.message : result.data.message);
    setLoading(false);
  };

  return <form onSubmit={handleSubmit} className="surface-panel p-6 sm:p-9"><h1 className="font-display text-4xl font-semibold leading-none tracking-[-.03em]">Crea tu cuenta</h1><p className="mt-3 text-sm text-muted">¿Ya tienes cuenta? <Link href="/login" className="font-medium text-accent-deep hover:underline">Inicia sesión</Link></p><div className="mt-8 grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Nombre<input required maxLength={80} value={values.firstName} onChange={(event) => setValues({ ...values, firstName: event.target.value })} className="field-input font-normal normal-case tracking-normal" /></label><label className="grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Apellido<input required maxLength={80} value={values.lastName} onChange={(event) => setValues({ ...values, lastName: event.target.value })} className="field-input font-normal normal-case tracking-normal" /></label></div><label className="mt-5 grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Correo electrónico<input required type="email" maxLength={320} value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} className="field-input font-normal normal-case tracking-normal" /></label><label className="mt-5 grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Contraseña<input required minLength={8} maxLength={128} type="password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} className="field-input font-normal normal-case tracking-normal" /></label><button disabled={loading} className="button-primary mt-8 w-full disabled:opacity-60">{loading ? "Creando..." : "Crear cuenta"}{!loading && <ArrowRight size={17} />}</button>{status && <p role="status" className="mt-5 rounded-[8px] bg-sand/60 px-4 py-3 text-xs leading-5 text-muted">{status}</p>}<p className="mt-6 flex gap-2 text-[11px] leading-5 text-muted"><Check size={15} className="shrink-0 text-success" /> Te enviaremos un correo de confirmación para activar tu acceso.</p></form>;
}
