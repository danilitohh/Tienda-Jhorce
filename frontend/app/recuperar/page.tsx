import type { Metadata } from "next";
import { RecoverForm } from "@/components/auth/recover-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Recuperar contraseña", description: "Recupera tu acceso a byjhor." };

// Password recovery remains a focused, low-distraction account surface.
export default function RecoverPage() { return <><SiteHeader /><main className="site-shell grid min-h-[65vh] place-items-center py-14 sm:py-20"><RecoverForm /></main><SiteFooter /></>; }
