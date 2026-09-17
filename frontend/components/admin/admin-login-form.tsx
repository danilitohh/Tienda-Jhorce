"use client";

import { ArrowRight, LockKey } from "@phosphor-icons/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth-client";

// Keep the admin form independent from customer email authentication and recovery flows.
export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Submit only the private admin credentials, then navigate to the protected dashboard.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    const result = await postAuth<{ admin: { username: string } }>("/api/admin/login", { username, password });
    if (result.error) {
      setStatus(result.error.message);
      setLoading(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="surface-panel mx-auto max-w-lg p-6 sm:p-9">
      <div className="flex h-11 w-11 items-center justify-center rounded-[9px] bg-ink text-white"><LockKey size={21} weight="light" /></div>
      <p className="eyebrow mt-7">Acceso privado</p>
      <h1 className="mt-4 font-display text-4xl font-semibold leading-none tracking-[-.03em] sm:text-5xl">Panel administrativo.</h1>
      <p className="mt-4 text-sm leading-7 text-muted">Ingresa con el usuario y la contraseña configurados para la dueña. El correo se reserva para las cuentas de clientes.</p>
      <div className="mt-8 grid gap-5">
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Usuario<input required minLength={3} maxLength={80} autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder="admin" /></label>
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.12em]">Contraseña<input required minLength={8} maxLength={128} type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder="••••••••" /></label>
      </div>
      <button disabled={loading} className="button-primary mt-8 w-full disabled:cursor-wait disabled:opacity-60">{loading ? "Entrando..." : "Entrar al panel"} {!loading && <ArrowRight size={17} />}</button>
      {status && <p role="alert" className="mt-5 rounded-[8px] bg-error/10 px-4 py-3 text-xs leading-5 text-error">{status}</p>}
      <p className="mt-6 text-center text-[11px] leading-5 text-muted">Para cambiar estas credenciales, actualiza <code className="rounded bg-sand/70 px-1 py-0.5">ADMIN_USERNAME</code> y <code className="rounded bg-sand/70 px-1 py-0.5">ADMIN_PASSWORD</code> en Vercel.</p>
    </form>
  );
}
