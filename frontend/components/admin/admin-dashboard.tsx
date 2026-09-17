import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { AdminDashboardData } from "@backend/admin/admin-types";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { AdminWorkspace } from "@/components/admin/admin-workspace";
import { BrandLogo } from "@/components/brand/brand-logo";
import { AdminRealtimeSync } from "@/components/realtime/admin-realtime-sync";

// The owner shell keeps authentication controls and the operational workspace visually separate.
export function AdminDashboard({ data, ownerUsername }: Readonly<{ data: AdminDashboardData; ownerUsername: string }>) {
  const dataVersion = `${data.products.map((product) => `${product.id}:${product.updatedAt}:${product.status}`).join("|")}:${data.recentOrders.map((order) => `${order.id}:${order.status}`).join("|")}`;
  return <main className="min-h-screen bg-paper">
    <header className="border-b border-ink/10 bg-white">
      <div className="site-shell flex min-h-20 items-center justify-between gap-5"><Link href="/" aria-label="Ir a la tienda byjhor"><BrandLogo className="h-10 w-28 sm:h-11 sm:w-32" priority /></Link><div className="flex items-center gap-3"><AdminRealtimeSync enabled={Boolean(process.env.ABLY_API_KEY)} /><div className="text-right"><p className="text-xs font-semibold text-ink">Panel admin</p><p className="mt-1 hidden text-xs text-muted sm:block">Usuario: {ownerUsername}</p></div><AdminLogoutButton /></div></div>
    </header>
    <div className="site-shell py-9 sm:py-12 lg:py-16">
      <div className="flex flex-col justify-between gap-6 border-b border-ink/15 pb-7 sm:flex-row sm:items-end"><div><p className="eyebrow">Operación de byjhor</p><h1 className="mt-3 font-display text-4xl font-semibold leading-none tracking-[-.03em] sm:text-5xl">Todo bajo control.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted">Administra catálogo, inventario y pedidos desde una sola vista.</p></div><Link href="/" className="button-secondary shrink-0">Ver tienda <ArrowUpRight size={17} /></Link></div>
      <AdminWorkspace key={dataVersion} data={data} />
    </div>
  </main>;
}
