import type { Metadata } from "next";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { getProductBySlug, PRODUCTS } from "@backend/catalog/catalog-data";
import { ProductCard } from "@/components/product-card";
import { ProductDetails } from "@/components/product/product-details";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

// Prebuild demo slugs so Vercel can statically optimize product landing pages.
export function generateStaticParams() { return PRODUCTS.map((product) => ({ slug: product.slug })); }

// Generate product-specific metadata for search and social previews.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = getProductBySlug((await params).slug);
  return { title: product?.name ?? "Producto", description: product?.description };
}

// Product page separates discovery context, selection controls and related products.
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProductBySlug((await params).slug);
  if (!product) return <><SiteHeader /><main className="mx-auto max-w-5xl px-5 py-32 text-center"><h1 className="font-display text-4xl font-bold">Producto no encontrado</h1><Link href="/catalogo" className="mt-6 inline-flex bg-ink px-5 py-3 text-sm font-medium text-white">Volver a la tienda</Link></main><SiteFooter /></>;
  const related = PRODUCTS.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 3);
  return <><SiteHeader /><main className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12"><div className="mb-10 flex items-center gap-2 text-xs text-slate-500"><Link href="/catalogo" className="hover:text-ink">Tienda</Link><CaretRight size={14} /><span>{product.category}</span><CaretRight size={14} /><span className="text-ink">{product.name}</span></div><ProductDetails product={product} /><section className="mt-24 border-t border-ink/10 pt-14"><div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-accent">Sigue explorando</p><h2 className="mt-4 font-display text-3xl font-bold tracking-[-.06em]">También puede gustarte</h2></div><Link href="/catalogo" className="hidden text-sm font-semibold hover:text-accent sm:block">Ver todo</Link></div><div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section></main><SiteFooter /></>;
}

