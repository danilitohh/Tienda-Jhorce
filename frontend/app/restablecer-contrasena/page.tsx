import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Restablecer contraseña", description: "Crea una nueva contraseña para tu cuenta byjhor.", robots: { index: false, follow: false } };

// Isolate reset-token parsing in a suspense boundary so the public account layout remains responsive.
export default function ResetPasswordPage() {
  return <><SiteHeader /><main className="site-shell grid min-h-[65vh] place-items-center py-14 sm:py-20"><Suspense fallback={<div className="min-h-80" aria-busy="true" />}><ResetPasswordForm /></Suspense></main><SiteFooter /></>;
}
