import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { ProductCategory, StoreProduct } from "@backend/catalog/catalog-data";

const categoryLinks: ReadonlyArray<{ name: ProductCategory; label: string }> = [
  { name: "Esenciales", label: "Esenciales" },
  { name: "Movimiento", label: "Movimiento" },
  { name: "Accesorios", label: "Accesorios" },
];

// Build category navigation from the real catalog images instead of introducing placeholder content.
export function CategoryGrid({ products }: Readonly<{ products: StoreProduct[] }>) {
  const availableCategories = categoryLinks
    .map((category) => ({ ...category, product: products.find((product) => product.category === category.name) }))
    .filter((category): category is typeof category & { product: StoreProduct } => Boolean(category.product));

  return <section aria-labelledby="categorias-title" className="site-shell py-16 sm:py-20 lg:py-24">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow">Encuentra tu forma</p>
        <h2 id="categorias-title" className="section-title mt-3">Compra por categoría</h2>
      </div>
      <p className="max-w-xs text-sm leading-6 text-muted sm:text-right">Piezas para acompañar lo que ya haces todos los días.</p>
    </div>
    <div className="mt-9 grid gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-12">
      {availableCategories.map(({ name, label, product }) => <Link key={name} href={`/catalogo?category=${name}`} className="group">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-sand">
          <Image src={product.image} alt={`Explorar ${label}`} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        </div>
        <div className="flex items-center justify-between border-b border-ink/15 py-4">
          <span className="font-display text-2xl font-semibold text-ink">{label}</span>
          <ArrowUpRight aria-hidden="true" size={20} className="text-gold-deep transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>)}
    </div>
  </section>;
}
