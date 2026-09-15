import type { Metadata } from "next";
import { RecoverForm } from "@/components/auth/recover-form";

export const metadata: Metadata = { title: "Recuperar contraseña", description: "Recupera tu acceso a Jhorce." };

// Password recovery remains a focused, low-distraction account surface.
export default function RecoverPage() { return <main className="grid min-h-[100dvh] place-items-center bg-paper px-5 py-12"><RecoverForm /></main>; }

