"use client";

import Image from "next/image";
import { ArrowLeft, FloppyDisk, ImageSquare, UploadSimple } from "@phosphor-icons/react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { AdminProduct, AdminProductStatus } from "@backend/admin/admin-types";

type ProductDraft = Readonly<{ name: string; slug: string; category: AdminProduct["category"]; price: string; compareAtPrice: string; description: string; image: string; secondaryImages: string[]; badge: string; sizes: string; colors: string; status: AdminProductStatus; stock: string }>;
type ApiResponse = Readonly<{ data?: { product: AdminProduct }; error?: { message?: string } }>;
type MediaFile = Readonly<{ id: string; url: string; name: string; size: number; contentType: string }>;
type MediaResponse = Readonly<{ data?: { file?: MediaFile }; error?: { message?: string } }>;

const emptyDraft: ProductDraft = { name: "", slug: "", category: "Esenciales", price: "", compareAtPrice: "", description: "", image: "", secondaryImages: [], badge: "", sizes: "", colors: "", status: "DRAFT", stock: "" };
const supportedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageBytes = 4 * 1024 * 1024;

// Remove duplicate image URLs while preserving the order selected by the owner.
function uniqueImages(images: string[]) { return [...new Set(images.filter((image) => image.trim()))]; }

// Convert the admin row into editable strings without allowing undefined optional fields into form controls.
function draftFromProduct(product: AdminProduct | null): ProductDraft {
  if (!product) return emptyDraft;
  const secondaryImages = uniqueImages(product.secondaryImages?.length ? product.secondaryImages : product.secondaryImage ? [product.secondaryImage] : []).filter((image) => image !== product.image);
  return { name: product.name, slug: product.slug, category: product.category, price: String(product.price), compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "", description: product.description, image: product.image, secondaryImages, badge: product.badge ?? "", sizes: product.sizes?.join(", ") ?? "", colors: product.colors?.join(", ") ?? "", status: product.status, stock: product.stock === null ? "" : String(product.stock) };
}

// Normalize comma-separated option inputs into the arrays consumed by product cards and detail pages.
function parseOptions(value: string) { return value.split(",").map((item) => item.trim()).filter(Boolean); }

// Validate files in the browser for immediate feedback; the API repeats these checks before storage.
function validateImageFile(file: File) {
  if (!supportedImageTypes.has(file.type)) return "Solo aceptamos imágenes JPG, PNG o WebP.";
  if (!file.size || file.size > maxImageBytes) return "Cada imagen debe pesar máximo 4 MB.";
  return null;
}

// Upload one selected image to the protected media endpoint and return its public GridFS URL.
async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/admin/media", { method: "POST", body: formData, cache: "no-store" });
  const result = await response.json() as MediaResponse;
  if (!response.ok || !result.data?.file) throw new Error(result.error?.message ?? "No pudimos subir la imagen.");
  return result.data.file.url;
}

// Use one focused editor for both creation and updates so validation, media uploads and field ownership stay consistent.
export function AdminProductForm({ product, onSaved, onCancel }: Readonly<{ product: AdminProduct | null; onSaved: (product: AdminProduct) => void; onCancel: () => void }>) {
  const [draft, setDraft] = useState<ProductDraft>(() => draftFromProduct(product));
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [secondaryFiles, setSecondaryFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(product);
  const primaryPreview = useMemo(() => primaryFile ? URL.createObjectURL(primaryFile) : null, [primaryFile]);
  const secondaryPreviews = useMemo(() => secondaryFiles.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })), [secondaryFiles]);

  // Release temporary browser object URLs when a new selection replaces them or the form unmounts.
  useEffect(() => () => { if (primaryPreview) URL.revokeObjectURL(primaryPreview); }, [primaryPreview]);
  useEffect(() => () => { secondaryPreviews.forEach(({ url }) => URL.revokeObjectURL(url)); }, [secondaryPreviews]);

  const update = <K extends keyof ProductDraft>(field: K, value: ProductDraft[K]) => setDraft((current) => ({ ...current, [field]: value }));

  // Keep file selection separate from the product payload until the owner saves the complete form.
  const handlePrimaryChange = (file: File | undefined) => {
    if (!file) return;
    const error = validateImageFile(file);
    if (error) { setStatus(error); return; }
    setPrimaryFile(file);
    setStatus(null);
  };

  // Multiple selection replaces the current secondary gallery only after the product is saved successfully.
  const handleSecondaryChange = (files: File[]) => {
    if (files.length > 12) { setStatus("Puedes seleccionar máximo 12 imágenes secundarias."); return; }
    const error = files.map(validateImageFile).find(Boolean);
    if (error) { setStatus(error); return; }
    setSecondaryFiles(files);
    setStatus(null);
  };

  // Upload selected files first, then persist only the resulting safe URLs through the existing product API.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const primaryImage = primaryFile ? await uploadImage(primaryFile) : draft.image;
      if (!primaryImage) throw new Error("Selecciona una imagen principal para continuar.");
      const secondaryImages = secondaryFiles.length ? await Promise.all(secondaryFiles.map(uploadImage)) : draft.secondaryImages;
      const payload = { name: draft.name, slug: draft.slug, category: draft.category, price: Number(draft.price), ...(draft.compareAtPrice.trim() ? { compareAtPrice: Number(draft.compareAtPrice) } : {}), description: draft.description, image: primaryImage, ...(secondaryImages.length ? { secondaryImages, secondaryImage: secondaryImages[0] } : {}), ...(draft.badge.trim() ? { badge: draft.badge } : {}), sizes: parseOptions(draft.sizes), colors: parseOptions(draft.colors), status: draft.status, ...(draft.stock.trim() ? { stock: Number(draft.stock) } : {}) };
      const response = await fetch(isEditing ? `/api/admin/products/${encodeURIComponent(product?.id ?? "")}` : "/api/admin/products", { method: isEditing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), cache: "no-store" });
      const result = await response.json() as ApiResponse;
      if (!response.ok || !result.data?.product) throw new Error(result.error?.message ?? "No pudimos guardar el producto.");
      onSaved(result.data.product);
    } catch (error) { setStatus(error instanceof Error ? error.message : "No pudimos guardar el producto."); setSaving(false); }
  };

  const currentSecondaryImages = draft.secondaryImages;
  return <form onSubmit={handleSubmit} className="surface-panel p-5 sm:p-7">
    <div className="flex items-start justify-between gap-5"><div><p className="eyebrow">{isEditing ? "Editar producto" : "Nuevo producto"}</p><h3 className="mt-2 font-display text-3xl font-semibold leading-none">{isEditing ? product?.name : "Añade una pieza al catálogo"}</h3></div><button type="button" onClick={onCancel} className="button-secondary min-h-10 px-3 py-2 text-xs"><ArrowLeft size={15} /> Volver</button></div>
    <div className="mt-7 grid gap-5 sm:grid-cols-2">
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em] sm:col-span-2">Nombre<input required value={draft.name} onChange={(event) => update("name", event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder="Peluca Rizo Natural" /></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em]">Slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={draft.slug} onChange={(event) => update("slug", event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder="peluca-rizo-natural" /></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em]">Categoría<select value={draft.category} onChange={(event) => update("category", event.target.value as ProductDraft["category"])} className="field-input font-normal normal-case tracking-normal"><option value="Esenciales">Pelucas para cada día</option><option value="Movimiento">Pelucas con movimiento</option><option value="Accesorios">Cuidado y accesorios</option></select></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em]">Precio actual<input required min="0" step="1" type="number" value={draft.price} onChange={(event) => update("price", event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder="590000" /></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em]">Precio anterior <span className="font-normal normal-case tracking-normal text-muted">Opcional</span><input min="0" step="1" type="number" value={draft.compareAtPrice} onChange={(event) => update("compareAtPrice", event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder="650000" /></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em] sm:col-span-2">Descripción<textarea required minLength={10} maxLength={2000} rows={4} value={draft.description} onChange={(event) => update("description", event.target.value)} className="field-input py-3 font-normal normal-case tracking-normal" placeholder="Describe el largo, la caída y la sensación de esta pieza." /></label>

      <fieldset className="grid gap-3 sm:col-span-2"><legend className="text-xs font-semibold uppercase tracking-[.1em]">Imagen principal</legend><div className="grid gap-4 sm:grid-cols-[140px_1fr] sm:items-center"><div className="relative aspect-[4/5] overflow-hidden rounded-[8px] border border-ink/10 bg-sand">{(primaryPreview || draft.image) ? <Image src={primaryPreview ?? draft.image} alt="Vista previa de la imagen principal" fill unoptimized className="object-cover" /> : <div className="grid h-full place-items-center text-muted"><ImageSquare size={28} weight="light" /></div>}</div><div><label htmlFor="primary-image" className="button-secondary inline-flex min-h-11 cursor-pointer"><UploadSimple size={17} /> {primaryFile ? "Cambiar imagen" : "Seleccionar imagen"}<input id="primary-image" required={!isEditing && !primaryFile} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => handlePrimaryChange(event.target.files?.[0])} className="sr-only" /></label><p className="mt-3 text-xs leading-5 text-muted">JPG, PNG o WebP · máximo 4 MB. Esta imagen se mostrará en el inicio y en las tarjetas del catálogo.</p>{primaryFile && <p className="mt-2 truncate text-xs font-medium text-ink">{primaryFile.name}</p>}</div></div></fieldset>

      <fieldset className="grid gap-3 sm:col-span-2"><legend className="text-xs font-semibold uppercase tracking-[.1em]">Imágenes secundarias <span className="font-normal normal-case tracking-normal text-muted">Opcionales · hasta 12</span></legend><label htmlFor="secondary-images" className="button-secondary inline-flex min-h-11 w-fit cursor-pointer"><UploadSimple size={17} /> Seleccionar varias imágenes<input id="secondary-images" type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(event) => { handleSecondaryChange(Array.from(event.target.files ?? [])); event.currentTarget.value = ""; }} className="sr-only" /></label><p className="text-xs leading-5 text-muted">Puedes elegir varias a la vez. Si seleccionas nuevas, reemplazarán la galería secundaria actual al guardar. JPG, PNG o WebP · máximo 4 MB cada una.</p>{(secondaryPreviews.length > 0 || currentSecondaryImages.length > 0) && <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">{currentSecondaryImages.map((source) => <div key={source} className="relative aspect-[4/5] overflow-hidden rounded-[8px] border border-ink/10 bg-sand"><Image src={source} alt="Imagen secundaria actual" fill unoptimized className="object-cover" /></div>)}{secondaryPreviews.map(({ name, url }) => <div key={`${name}-${url}`} className="relative aspect-[4/5] overflow-hidden rounded-[8px] border border-gold-deep/40 bg-sand"><Image src={url} alt={`Vista previa de ${name}`} fill unoptimized className="object-cover" /><span className="absolute inset-x-1 bottom-1 truncate rounded bg-ink/75 px-1 py-0.5 text-[9px] text-white">{name}</span></div>)}</div>}</fieldset>

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em]">Stock<input min="0" step="1" type="number" value={draft.stock} onChange={(event) => update("stock", event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder="0" /><span className="font-normal normal-case tracking-normal text-muted">Déjalo vacío si el control se hará por variantes.</span></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em]">Estado<select value={draft.status} onChange={(event) => update("status", event.target.value as AdminProductStatus)} className="field-input font-normal normal-case tracking-normal"><option value="DRAFT">Borrador</option><option value="ACTIVE">Publicado</option><option value="ARCHIVED">Archivado</option></select></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em]">Largos <span className="font-normal normal-case tracking-normal text-muted">Separados por coma</span><input value={draft.sizes} onChange={(event) => update("sizes", event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder={'"14\", "18\", "22\"'} /></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em]">Tonos <span className="font-normal normal-case tracking-normal text-muted">Separados por coma</span><input value={draft.colors} onChange={(event) => update("colors", event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder="Negro natural, Castaño" /></label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em] sm:col-span-2">Etiqueta <span className="font-normal normal-case tracking-normal text-muted">Opcional</span><input maxLength={60} value={draft.badge} onChange={(event) => update("badge", event.target.value)} className="field-input font-normal normal-case tracking-normal" placeholder="Nueva colección" /></label>
    </div>
    {status && <p role="alert" className="mt-5 rounded-[8px] bg-error/10 px-4 py-3 text-xs leading-5 text-error">{status}</p>}
    <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-ink/10 pt-6"><button type="button" onClick={onCancel} className="button-secondary">Cancelar</button><button disabled={saving} className="button-primary disabled:cursor-wait disabled:opacity-60">{saving ? "Subiendo y guardando..." : isEditing ? "Guardar cambios" : "Crear producto"} {!saving && <FloppyDisk size={17} />}</button></div>
  </form>;
}
