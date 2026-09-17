"use client";

import Link from "next/link";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { postAuth } from "@/lib/auth-client";

// Consume an email confirmation token once when the customer lands from the transactional email.
export function VerifyEmailCard() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const missingToken = !token;
  const [state, setState] = useState<"loading" | "success" | "error">(missingToken ? "error" : "loading");
  const [message, setMessage] = useState("Estamos confirmando tu cuenta.");

  useEffect(() => {
    if (!token) return;
    let active = true;
    postAuth<{ message: string }>("/api/auth/verify-email", { token }).then((result) => {
      if (!active) return;
      if (result.error) { setState("error"); setMessage(result.error.message); return; }
      setState("success");
      setMessage(result.data.message);
    });
    return () => { active = false; };
  }, [token]);

  const success = state === "success";
  const displayMessage = missingToken ? "El enlace de confirmación no es válido." : message;
  return <div className="mx-auto max-w-lg"><div className="surface-panel p-6 text-center sm:p-9"><span className={`mx-auto grid h-12 w-12 place-items-center rounded-[10px] ${success ? "bg-success/15 text-success" : state === "error" ? "bg-error/10 text-error" : "bg-gold-pale text-gold-deep"}`}>{success ? <CheckCircle size={25} /> : <WarningCircle size={25} />}</span><h1 className="mt-7 font-display text-4xl font-semibold leading-none tracking-[-.03em]">{success ? "Cuenta confirmada." : state === "error" ? "No pudimos confirmar tu cuenta." : "Confirmando tu cuenta."}</h1><p role="status" className="mt-4 text-sm leading-6 text-muted">{displayMessage}</p>{state !== "loading" && <Link href="/login" className="button-primary mt-8">Ir a iniciar sesión</Link>}</div></div>;
}
