import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Iniciar sesión", description: "Accede a tu cuenta byjhor." };

// Keep auth focused, lightweight and free of the animated marketing layer.
export default function LoginPage() {
  return <><SiteHeader /><main className="site-shell min-h-[65vh] py-14 sm:py-20 lg:py-24"><LoginForm /></main><SiteFooter /></>;
}
