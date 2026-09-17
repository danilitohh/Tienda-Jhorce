import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountPanel } from "@/components/auth/account-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/lib/auth-session";

export const metadata: Metadata = { title: "Mi cuenta", description: "Gestiona tu acceso a byjhor.", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// Protect the customer account page by resolving the HttpOnly MongoDB session on every request.
export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/cuenta");

  return <><SiteHeader /><main className="site-shell min-h-[65vh] py-14 sm:py-20 lg:py-24"><AccountPanel user={user} /></main><SiteFooter /></>;
}
