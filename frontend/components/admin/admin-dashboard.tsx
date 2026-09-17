import Link from "next/link";
import { ArrowUpRight, Package, ShoppingBag, Storefront, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import type { AdminDashboardData, AdminProductStatus } from "@backend/admin/admin-types";
import { BrandLogo } from "@/components/brand/brand-logo";
import { formatCop } from "@/lib/format";

const productStatusCopy: Record<AdminProductStatus, string> = { ACTIVE: "Publicado", DRAFT: "Borrador", ARCHIVED: "Archivado" };
const orderStatusCopy: Record<string, string> = { CREATED: "Creado", CONFIRMED: "Confirmado", PAID: "Pagado", PREPARING: "Preparando", SHIPPED: "Enviado", DELIVERED: "Entregado", CANCELLED: "Cancelado", RETURNED: "Devuelto" };

// Keep date rendering consistent for the owner's Colombian operating context.
function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

// Status styles are visual labels only; authorization and state changes remain server-side concerns.
function statusClass(status: AdminProductStatus) {
  return status === "ACTIVE" ? "bg-success/10 text-success" : status === "ARCHIVED" ? "bg-ink/8 text-muted" : "bg-gold-pale text-gold-deep";
}

// The owner dashboard intentionally starts with real operational visibility rather than placeholder controls.
export function AdminDashboard({ data, ownerEmail }: Readonly<{ data: AdminDashboardData; ownerEmail: string | null }>) {
  const activeProducts = data.products.filter((product) => product.status === "ACTIVE").length;
  const lowStockProducts = data.products.filter((product) => product.stock !== null && product.stock <= 3).length;
  const pendingOrders = data.recentOrders.filter((order) => ["CREATED", "CONFIRMED", "PAID", "PREPARING"].includes(order.status)).length;

  const metrics = [
    { label: "Productos publicados", value: activeProducts, detail: "Visibles para clientes", Icon: Storefront },
    { label: "Stock por revisar", value: lowStockProducts, detail: "Con 3 unidades o menos", Icon: WarningCircle },
    { label: "Pedidos en curso", value: pendingOrders, detail: "Pendientes o preparando", Icon: ShoppingBag },
  ] as const;

  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-ink/10 bg-white">
        <div className="site-shell flex min-h-20 items-center justify-between gap-5">
          <Link href="/" aria-label="Ir a la tienda byjhor"><BrandLogo className="h-10 w-28 sm:h-11 sm:w-32" priority /></Link>
          <div className="text-right"><p className="text-xs font-semibold text-ink">Panel admin</p><p className="mt-1 hidden text-xs text-muted sm:block">{ownerEmail ?? "Cuenta administradora"}</p></div>
        </div>
      </header>

      <div className="site-shell py-9 sm:py-12 lg:py-16">
        <div className="flex flex-col justify-between gap-6 border-b border-ink/15 pb-7 sm:flex-row sm:items-end">
          <div><p className="eyebrow">Operación de byjhor</p><h1 className="mt-3 font-display text-4xl font-semibold leading-none tracking-[-.03em] sm:text-5xl">Todo bajo control.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted">Consulta catálogo, inventario y pedidos recientes desde una sola vista.</p></div>
          <Link href="/" className="button-secondary shrink-0">Ver tienda <ArrowUpRight size={17} /></Link>
        </div>

        <section className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-5" aria-label="Resumen de operación">
          {metrics.map(({ label, value, detail, Icon }) => <article key={label} className="surface-panel flex items-start justify-between p-5 sm:p-6"><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-muted">{label}</p><p className="mt-4 font-display text-4xl font-semibold leading-none">{value}</p><p className="mt-3 text-xs text-muted">{detail}</p></div><span className="grid h-10 w-10 place-items-center rounded-[9px] bg-gold-pale text-gold-deep"><Icon size={20} weight="light" /></span></article>)}
        </section>

        <section className="mt-10 grid gap-10 xl:grid-cols-[1.35fr_.85fr] xl:gap-14">
          <div>
            <div className="flex items-end justify-between gap-5 border-b border-ink/15 pb-4"><div><p className="eyebrow">Catálogo</p><h2 className="mt-2 font-display text-3xl font-semibold leading-none">Productos recientes</h2></div><span className="text-xs text-muted">{data.products.length} mostrados</span></div>
            <div className="mt-5 overflow-x-auto rounded-[10px] border border-ink/10 bg-white">
              <table className="min-w-[650px] w-full text-left text-sm"><caption className="sr-only">Productos recientes del catálogo</caption><thead className="border-b border-ink/10 bg-gold-pale/45 text-xs font-semibold uppercase tracking-[.1em] text-muted"><tr><th className="px-5 py-4">Producto</th><th className="px-4 py-4">Estado</th><th className="px-4 py-4">Stock</th><th className="px-4 py-4 text-right">Precio</th><th className="px-5 py-4 text-right"><span className="sr-only">Abrir</span></th></tr></thead><tbody className="divide-y divide-ink/10">{data.products.map((product) => <tr key={product.id} className="transition-colors hover:bg-gold-pale/30"><td className="px-5 py-4"><p className="font-medium text-ink">{product.name}</p><p className="mt-1 text-xs text-muted">/{product.slug}</p></td><td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(product.status)}`}>{productStatusCopy[product.status]}</span></td><td className="px-4 py-4 text-muted">{product.stock === null ? "Sin variantes" : product.stock}</td><td className="px-4 py-4 text-right font-medium tabular-nums">{formatCop(product.price)}</td><td className="px-5 py-4 text-right"><Link href={`/producto/${product.slug}`} className="inline-flex rounded-[7px] p-2 text-ink transition-colors hover:bg-gold-pale hover:text-gold-deep" aria-label={`Ver ${product.name} en la tienda`}><ArrowUpRight size={17} /></Link></td></tr>)}</tbody></table>
              {data.products.length === 0 && <p className="px-5 py-12 text-center text-sm text-muted">Todavía no hay productos registrados.</p>}
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between gap-5 border-b border-ink/15 pb-4"><div><p className="eyebrow">Pedidos</p><h2 className="mt-2 font-display text-3xl font-semibold leading-none">Actividad reciente</h2></div><Package size={21} className="text-gold-deep" weight="light" /></div>
            <div className="mt-5 divide-y divide-ink/10 rounded-[10px] border border-ink/10 bg-white">{data.recentOrders.map((order) => <article key={order.id} className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="font-medium">{order.number}</p><p className="mt-1 text-xs text-muted">{formatDate(order.createdAt)}</p></div><p className="font-semibold tabular-nums">{formatCop(order.total)}</p></div><p className="mt-4 inline-flex rounded-full bg-gold-pale px-2.5 py-1 text-xs font-semibold text-gold-deep">{orderStatusCopy[order.status] ?? order.status}</p></article>)}{data.recentOrders.length === 0 && <p className="p-8 text-center text-sm text-muted">Aún no hay pedidos que mostrar.</p>}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
