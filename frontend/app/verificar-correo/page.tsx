import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailCard } from "@/components/auth/verify-email-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Confirmar cuenta", description: "Confirma tu cuenta byjhor.", robots: { index: false, follow: false } };

// Render confirmation as a focused public surface that consumes only the opaque token from the email link.
export default function VerifyEmailPage() {
  return <><SiteHeader /><main className="site-shell grid min-h-[65vh] place-items-center py-14 sm:py-20"><Suspense fallback={<div className="min-h-80" aria-busy="true" />}><VerifyEmailCard /></Suspense></main><SiteFooter /></>;
}
