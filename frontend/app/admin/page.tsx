import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminAccessState } from "@/components/admin/admin-access-state";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getAdminAccess } from "@/lib/admin-auth";
import { loadAdminDashboard } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Panel admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// The route verifies the separate admin MongoDB session before any operational data query runs.
export default async function AdminPage() {
  const access = await getAdminAccess();
  if (access.state === "signed-out") redirect("/admin/login");
  if (access.state === "not-configured") return <AdminAccessState state="not-configured" />;

  const dashboard = await loadAdminDashboard();
  if (dashboard.state !== "ready") return <AdminAccessState state={dashboard.state} message={dashboard.message} />;
  return <AdminDashboard data={dashboard.data} ownerUsername={access.username} />;
}
