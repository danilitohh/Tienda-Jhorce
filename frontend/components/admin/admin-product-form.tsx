"use client";

import { ArrowLeft, FloppyDisk } from "@phosphor-icons/react";
import { FormEvent, useState } from "react";
import type { AdminProduct, AdminProductStatus } from "@backend/admin/admin-types";

type ProductDraft = Readonly<{ name: string; slug: string; category: AdminProduct["category"]; price: string; compareAtPrice: string; description: string; image: string; secondaryImage: string; badge: string; sizes: string; colors: string; status: AdminProductStatus; stock: string }>;
type ApiResponse = Readonly<{ data?: { product: AdminProduct }; error?: { message?: string } }>;

const emptyDraft: ProductDraft = { name: "", slug: "", category: "Esenciales", price: "", compareAtPrice: "", description: "", image: "/catalog/peluca-aura.webp", secondaryImage: "", badge: "", sizes: "", colors: "", status: "DRAFT", stock: "" };

// Convert the admin row into editable strings without allowing undefined optional fields into form controls.
function draftFromProduct(product: AdminProduct | null): ProductDraft {
  if (!product) return emptyDraft;
  return { name: product.name, slug: product.slug, category: product.category, price: String(product.price), compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "", description: product.description, image: product.image, secondaryImage: product.secondaryImage === product.image ? "" : product.secondaryImage, badge: product.badge ?? "", sizes: product.sizes?.join(", ") ?? "", colors: product.colors?.join(", ") ?? "", status: product.status, stock: product.stock === null ? "" : String(product.stock) };
}

// Normalize comma-separated option inputs into the arrays consumed by product cards and detail pages.
function parseOptions(value: string) { return value.split(",").map((item) => item.trim()).filter(Boolean); }

// Use one focused editor for both creation and updates so validation and field ownership stay consistent.
export function AdminProductForm({ product, onSaved, onCancel }: Readonly<{ product: AdminProduct | null; onSaved: (product: AdminProduct) => void; onCancel: () => void }>) {
  const [draft, setDraft] = useState<ProductDraft>(() => draftFromProduct(product));
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(product);

  const update = <K extends keyof ProductDraft>(field: K, value: ProductDraft[K]) => setDraft((current) => ({ ...current, [field]: value }));

  // Submit only the fields supported by the protected admin API and report safe validation messages inline.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    const payload = { name: draft.name, slug: draft.slug, category: draft.category, price: Number(draft.price), ...(draft.compareAtPrice.trim() ? { compareAtPrice: Number(draft.compareAtPrice) } : {}), description: draft.description, image: draft.image, ...(draft.secondaryImage.trim() ? { secondaryImage: draft.secondaryImage } : {}), ...(draft.badge.trim() ? { badge: draft.badge } : {}), sizes: parseOptions(draft.sizes), colors: parseOptions(draft.colors), status: draft.status, ...(draft.stock.trim() ? { stock: Number(draft.stock) } : {}) };
    try {
      const response = await fetch(isEditing ? `/api/admin/products/${encodeURIComponent(product?.id ?? "")}` : "/api/admin/products", { method: isEditing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), cache: "no-store" });
      const result = await response.json() as ApiResponse;
      if (!response.ok || !result.data?.product) { setStatus(result.error?.message ?? "No pudimos guardar el producto."); setSaving(false); return; }
      onSaved(result.data.product);
    } catch { setStatus("No pudimos conectar con el panel. Inténtalo de nuevo."); setSaving(false); }
  };

  return <form onSubmit={handleSubmit} className="surface-panel p-5 sm:p-7">
    <div className="flex items-start justify-between gap-5"><div><p className="eyebrow">{isEditing ? "Editar producto" : "Nuevo producto"}</p><h3 className="mt-2 font-display text-3xl font-semibold leading-none">{isEditing ? product?.name : "Añade una pieza al catálogo"}</h3></div><button type="button" onClick={onCancel} className="button-secondary min-h-10 px-3 py-2 text-xs"><ArrowLeft size={15} /> Volver</button></div>
    <div className="mt-7 grid gap-5 sm:grid-cols-2">
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em] sm:col-span-2">Nombre<input required value={draft.name} onChange={(event) => update("name", event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder="Peluca Rizo Natural" /></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em]">Slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={draft.slug} onChange={(event) => update("slug", event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder="peluca-rizo-natural" /></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em]">Categoría<select value={draft.category} onChange={(event) => update("category", event.target.value as ProductDraft["category"])} className="field-input font-normal normal-case tracking-normal"><option value="Esenciales">Pelucas para cada día</option><option value="Movimiento">Pelucas con movimiento</option><option value="Accesorios">Cuidado y accesorios</option></select></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em]">Precio actual<input required min="0" step="1" type="number" value={draft.price} onChange={(event) => update("price", event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder="590000" /></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em]">Precio anterior <span className="font-normal normal-case tracking-normal text-muted">Opcional</span><input min="0" step="1" type="number" value={draft.compareAtPrice} onChange={(event) => update("compareAtPrice", event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder="650000" /></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em] sm:col-span-2">Descripción<textarea required minLength={10} maxLength={2000} rows={4} value={draft.description} onChange={(event) => update("description", event.target.value)} className="field-input py-3 font-normal normal-case tracking-normal" placeholder="Describe el largo, la caída y la sensación de esta pieza." /></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em] sm:col-span-2">Imagen principal<input required value={draft.image} onChange={(event) => update("image", event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder="/catalog/peluca-aura.webp" /><span className="font-normal normal-case tracking-normal text-muted">Ruta local en /public o URL https. El almacenamiento de imágenes se puede conectar después.</span></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em] sm:col-span-2">Imagen secundaria <span className="font-normal normal-case tracking-normal text-muted">Opcional</span><input value={draft.secondaryImage} onChange={(event) => update("secondaryImage", event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder="/catalog/peluca-aura.webp" /></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em]">Stock<input min="0" step="1" type="number" value={draft.stock} onChange={(event) => update("stock", event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder="0" /><span className="font-normal normal-case tracking-normal text-muted">Déjalo vacío si el control se hará por variantes.</span></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em]">Estado<select value={draft.status} onChange={(event) => update("status", event.target.value as AdminProductStatus)} className="field-input font-normal normal-case tracking-normal"><option value="DRAFT">Borrador</option><option value="ACTIVE">Publicado</option><option value="ARCHIVED">Archivado</option></select></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em]">Largos <span className="font-normal normal-case tracking-normal text-muted">Separados por coma</span><input value={draft.sizes} onChange={(event) => update("sizes", event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder={'"14\", "18\", "22\"'} /></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em]">Tonos <span className="font-normal normal-case tracking-normal text-muted">Separados por coma</span><input value={draft.colors} onChange={(event) => update("colors", event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder="Negro natural, Castaño" /></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em] sm:col-span-2">Etiqueta <span className="font-normal normal-case tracking-normal text-muted">Opcional</span><input maxLength={60} value={draft.badge} onChange={(event) => update("badge", event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder="Nueva colección" /></label>
    </div>
    {status && <p role="alert" className="mt-5 rounded-[8px] bg-error/10 px-4 py-3 text-xs leading-5 text-error">{status}</p>}
    <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-ink/10 pt-6"><button type="button" onClick={onCancel} className="button-secondary">Cancelar</button><button disabled={saving} className="button-primary disabled:cursor-wait disabled:opacity-60">{saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear producto"} {!saving && <FloppyDisk size={17} />}</button></div>
  </form>;
}
