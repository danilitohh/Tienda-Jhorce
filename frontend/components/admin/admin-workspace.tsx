"use client";

import Link from "next/link";
import { ArrowUpRight, Check, ClipboardText, MagnifyingGlass, Package, PencilSimple, Plus, Storefront, WarningCircle } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import type { AdminDashboardData, AdminOrder, AdminOrderStatus, AdminProduct } from "@backend/admin/admin-types";
import { ADMIN_ORDER_STATUSES } from "@backend/admin/admin-types";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { formatCop } from "@/lib/format";

type WorkspaceTab = "overview" | "catalog" | "orders";
type ApiResponse = Readonly<{ data?: { product?: AdminProduct; order?: AdminOrder }; error?: { message?: string } }>;
const statusCopy: Record<AdminProduct["status"], string> = { ACTIVE: "Publicado", DRAFT: "Borrador", ARCHIVED: "Archivado" };
const orderStatusCopy: Record<AdminOrderStatus, string> = { CREATED: "Creado", CONFIRMED: "Confirmado", PAID: "Pagado", PREPARING: "Preparando", SHIPPED: "Enviado", DELIVERED: "Entregado", CANCELLED: "Cancelado", RETURNED: "Devuelto" };

// Format dates only at the presentation boundary so the server projection remains serializable and locale-aware.
function formatDate(value: string) { return value ? new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)) : "Sin fecha"; }

// Keep visual status treatment consistent across products and orders without coupling it to authorization.
function statusClass(status: AdminProduct["status"]) { return status === "ACTIVE" ? "bg-success/10 text-success" : status === "ARCHIVED" ? "bg-ink/8 text-muted" : "bg-gold-pale text-gold-deep"; }

// Render the actual owner workspace with local optimistic updates and server-backed mutations.
export function AdminWorkspace({ data }: Readonly<{ data: AdminDashboardData }>) {
  const [tab, setTab] = useState<WorkspaceTab>("overview");
  const [products, setProducts] = useState<AdminProduct[]>(data.products);
  const [orders, setOrders] = useState<AdminOrder[]>(data.recentOrders);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const visibleProducts = useMemo(() => products.filter((product) => `${product.name} ${product.slug} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase())), [products, query]);
  const metrics = useMemo(() => ({ published: products.filter((product) => product.status === "ACTIVE").length, lowStock: products.filter((product) => product.stock !== null && product.stock <= 3).length, pending: orders.filter((order) => ["CREATED", "CONFIRMED", "PAID", "PREPARING"].includes(order.status)).length }), [orders, products]);

  const openCreate = () => { setEditingProduct(null); setFormOpen(true); setTab("catalog"); setNotice(null); };
  const openEdit = (product: AdminProduct) => { setEditingProduct(product); setFormOpen(true); setTab("catalog"); setNotice(null); };
  const handleSaved = (product: AdminProduct) => { setProducts((current) => [product, ...current.filter((item) => item.id !== product.id)]); setFormOpen(false); setEditingProduct(null); setNotice("Producto guardado. El catálogo público recibirá el cambio en vivo."); };

  // Persist order transitions and only update the visible row after the server accepts the new status.
  const updateOrder = async (order: AdminOrder, status: AdminOrderStatus) => {
    setBusyOrderId(order.id);
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/orders/${encodeURIComponent(order.id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }), cache: "no-store" });
      const result = await response.json() as ApiResponse;
      if (!response.ok || !result.data?.order) { setNotice(result.error?.message ?? "No pudimos actualizar el pedido."); setBusyOrderId(null); return; }
      setOrders((current) => current.map((item) => item.id === order.id ? result.data?.order ?? item : item));
      setNotice(`Pedido ${order.number} actualizado.`);
    } catch { setNotice("No pudimos conectar con el panel. Inténtalo de nuevo."); }
    setBusyOrderId(null);
  };

  const tabs = [{ id: "overview" as const, label: "Resumen", Icon: Storefront }, { id: "catalog" as const, label: "Catálogo", Icon: ClipboardText }, { id: "orders" as const, label: "Pedidos", Icon: Package }];
  return <>
    <nav className="mt-8 flex gap-1 overflow-x-auto border-b border-ink/15" aria-label="Secciones del panel">{tabs.map(({ id, label, Icon }) => <button key={id} type="button" onClick={() => { setTab(id); setFormOpen(false); }} className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${tab === id ? "border-gold-deep text-ink" : "border-transparent text-muted hover:text-ink"}`} aria-current={tab === id ? "page" : undefined}><Icon size={17} weight="light" />{label}</button>)}</nav>
    {notice && <div role="status" className="mt-5 flex items-center gap-2 rounded-[8px] border border-success/20 bg-success/10 px-4 py-3 text-xs font-medium text-success"><Check size={16} />{notice}</div>}
    {tab === "overview" && <section className="mt-8" aria-labelledby="admin-summary-title"><div className="grid gap-3 sm:grid-cols-3 sm:gap-5">{[{ label: "Productos publicados", value: metrics.published, detail: "Visibles para clientes", Icon: Storefront }, { label: "Stock por revisar", value: metrics.lowStock, detail: "Con 3 unidades o menos", Icon: WarningCircle }, { label: "Pedidos en curso", value: metrics.pending, detail: "Pendientes o preparando", Icon: Package }].map(({ label, value, detail, Icon }) => <article key={label} className="surface-panel flex items-start justify-between p-5 sm:p-6"><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-muted">{label}</p><p className="mt-4 font-display text-4xl font-semibold leading-none">{value}</p><p className="mt-3 text-xs text-muted">{detail}</p></div><span className="grid h-10 w-10 place-items-center rounded-[9px] bg-gold-pale text-gold-deep"><Icon size={20} weight="light" /></span></article>)}</div><div className="mt-10 grid gap-10 xl:grid-cols-[1.35fr_.85fr] xl:gap-14"><section aria-labelledby="summary-products-title"><div className="flex items-end justify-between gap-4 border-b border-ink/15 pb-4"><div><p className="eyebrow">Catálogo</p><h2 id="summary-products-title" className="mt-2 font-display text-3xl font-semibold leading-none">Productos recientes</h2></div><button type="button" onClick={openCreate} className="button-primary min-h-10 px-3 py-2 text-xs"><Plus size={15} /> Nuevo</button></div><ProductTable products={products.slice(0, 6)} onEdit={openEdit} /></section><section aria-labelledby="summary-orders-title"><div className="flex items-end justify-between gap-4 border-b border-ink/15 pb-4"><div><p className="eyebrow">Pedidos</p><h2 id="summary-orders-title" className="mt-2 font-display text-3xl font-semibold leading-none">Actividad reciente</h2></div><button type="button" onClick={() => setTab("orders")} className="text-link text-xs">Ver todos <ArrowUpRight size={15} /></button></div><OrderList orders={orders.slice(0, 5)} busyOrderId={busyOrderId} onUpdate={updateOrder} /></section></div></section>}
    {tab === "catalog" && <section className="mt-8" aria-labelledby="catalog-title">{formOpen ? <AdminProductForm product={editingProduct} onSaved={handleSaved} onCancel={() => { setFormOpen(false); setEditingProduct(null); }} /> : <><div className="flex flex-col justify-between gap-5 border-b border-ink/15 pb-5 sm:flex-row sm:items-end"><div><p className="eyebrow">Gestión de productos</p><h2 id="catalog-title" className="mt-2 font-display text-4xl font-semibold leading-none">Tu catálogo, siempre al día.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-muted">Crea productos, ajusta precios y stock, y decide qué queda visible para tus clientes.</p></div><button type="button" onClick={openCreate} className="button-primary shrink-0"><Plus size={17} /> Nuevo producto</button></div><label className="relative mt-5 block max-w-md"><span className="sr-only">Buscar en el catálogo</span><MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} className="field-input w-full pl-10" placeholder="Buscar por nombre o slug" /></label><ProductTable products={visibleProducts} onEdit={openEdit} emptyMessage={query ? "No encontramos productos con esa búsqueda." : "Todavía no hay productos. Crea el primero para activar tu catálogo."} /></>}</section>}
    {tab === "orders" && <section className="mt-8" aria-labelledby="orders-title"><div className="border-b border-ink/15 pb-5"><p className="eyebrow">Seguimiento</p><h2 id="orders-title" className="mt-2 font-display text-4xl font-semibold leading-none">Pedidos y entregas.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-muted">Actualiza el estado operativo; cada cambio queda registrado y visible en el panel.</p></div><OrderList orders={orders} busyOrderId={busyOrderId} onUpdate={updateOrder} /></section>}
  </>;
}

// Keep product rows readable on desktop and transform them into stacked cards on narrow screens.
function ProductTable({ products, onEdit, emptyMessage = "Todavía no hay productos registrados." }: Readonly<{ products: AdminProduct[]; onEdit: (product: AdminProduct) => void; emptyMessage?: string }>) {
  return <div className="mt-5 overflow-x-auto rounded-[10px] border border-ink/10 bg-white"><table className="min-w-[690px] w-full text-left text-sm"><caption className="sr-only">Productos administrables</caption><thead className="border-b border-ink/10 bg-gold-pale/45 text-xs font-semibold uppercase tracking-[.1em] text-muted"><tr><th className="px-5 py-4">Producto</th><th className="px-4 py-4">Estado</th><th className="px-4 py-4">Stock</th><th className="px-4 py-4 text-right">Precio</th><th className="px-5 py-4 text-right"><span className="sr-only">Acciones</span></th></tr></thead><tbody className="divide-y divide-ink/10">{products.map((product) => <tr key={product.id} className="transition-colors hover:bg-gold-pale/30"><td className="px-5 py-4"><p className="font-medium text-ink">{product.name}</p><p className="mt-1 text-xs text-muted">{product.category} · /{product.slug}</p></td><td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(product.status)}`}>{statusCopy[product.status]}</span></td><td className={`px-4 py-4 tabular-nums ${product.stock !== null && product.stock <= 3 ? "font-semibold text-warning" : "text-muted"}`}>{product.stock === null ? "Por variantes" : product.stock}</td><td className="px-4 py-4 text-right font-medium tabular-nums">{formatCop(product.price)}</td><td className="px-5 py-4 text-right"><button type="button" onClick={() => onEdit(product)} className="button-secondary min-h-9 px-3 py-2 text-xs"><PencilSimple size={15} /> Editar</button></td></tr>)}</tbody></table>{products.length === 0 && <p className="px-5 py-12 text-center text-sm text-muted">{emptyMessage}</p>}</div>;
}

// Render order rows with a real status control instead of a decorative badge.
function OrderList({ orders, busyOrderId, onUpdate }: Readonly<{ orders: AdminOrder[]; busyOrderId: string | null; onUpdate: (order: AdminOrder, status: AdminOrderStatus) => void }>) {
  return <div className="mt-5 divide-y divide-ink/10 rounded-[10px] border border-ink/10 bg-white">{orders.map((order) => <article key={order.id} className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center"><div><div className="flex flex-wrap items-center gap-3"><p className="font-medium">{order.number}</p><span className="text-xs text-muted">{formatDate(order.createdAt)}</span></div><p className="mt-2 text-xs text-muted">{order.customerName}{order.customerEmail && ` · ${order.customerEmail}`} · {order.itemCount || "Varios"} {order.itemCount === 1 ? "artículo" : "artículos"}</p></div><div className="flex items-center gap-3 sm:justify-end"><p className="font-semibold tabular-nums">{formatCop(order.total)}</p><label className="sr-only" htmlFor={`order-status-${order.id}`}>Estado de {order.number}</label><select id={`order-status-${order.id}`} value={ADMIN_ORDER_STATUSES.includes(order.status as AdminOrderStatus) ? order.status : "CREATED"} disabled={busyOrderId === order.id} onChange={(event) => onUpdate(order, event.target.value as AdminOrderStatus)} className="field-input min-h-10 py-2 text-xs"><option value="CREATED">Creado</option>{ADMIN_ORDER_STATUSES.filter((status) => status !== "CREATED").map((status) => <option key={status} value={status}>{orderStatusCopy[status]}</option>)}</select></div></article>)}{orders.length === 0 && <p className="p-10 text-center text-sm text-muted">Aún no hay pedidos registrados. Aparecerán aquí cuando el checkout real cree la orden.</p>}</div>;
}
