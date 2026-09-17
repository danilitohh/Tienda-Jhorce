import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAdminAccess } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Acceso administrativo", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// Keep an already authenticated owner out of the login screen and inside the dashboard.
export default async function AdminLoginPage() {
  const access = await getAdminAccess();
  if (access.state === "configured") redirect("/admin");

  return <><SiteHeader /><main className="site-shell min-h-[65vh] py-14 sm:py-20 lg:py-24"><AdminLoginForm /></main><SiteFooter /></>;
}
