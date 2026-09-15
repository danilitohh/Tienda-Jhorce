import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Iniciar sesión", description: "Accede a tu cuenta Jhorce." };

// Keep auth focused, lightweight and free of the animated marketing layer.
export default function LoginPage() {
  return <><SiteHeader /><main className="mx-auto min-h-[65vh] max-w-[1100px] px-5 py-14 sm:px-8 lg:py-24"><LoginForm /></main><SiteFooter /></>;
}

