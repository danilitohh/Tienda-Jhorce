import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminAccessState } from "@/components/admin/admin-access-state";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getAdminAccess } from "@/lib/admin-auth";
import { loadAdminDashboard } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Panel admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// The route verifies the authenticated app_metadata role before any service-role data query runs.
export default async function AdminPage() {
  const access = await getAdminAccess();
  if (access.state === "signed-out") redirect("/login?next=/admin");
  if (access.state === "not-configured") return <AdminAccessState state="not-configured" />;
  if (access.state === "forbidden") return <AdminAccessState state="forbidden" />;

  const dashboard = await loadAdminDashboard();
  if (dashboard.state !== "ready") return <AdminAccessState state={dashboard.state} message={dashboard.message} />;
  return <AdminDashboard data={dashboard.data} ownerEmail={access.email} />;
}
