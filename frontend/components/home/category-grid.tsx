import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { ProductCategory, StoreProduct } from "@backend/catalog/catalog-data";
import { categoryLabels } from "@/lib/catalog-labels";

const categoryLinks: ReadonlyArray<{ name: ProductCategory; label: string; tone: string }> = [
  { name: "Esenciales", label: categoryLabels.Esenciales, tone: "bg-gold-soft" },
  { name: "Movimiento", label: categoryLabels.Movimiento, tone: "bg-gold-pale" },
  { name: "Accesorios", label: categoryLabels.Accesorios, tone: "bg-sand" },
];

// Build a consistent, fast category entry point from real catalog images and real destination filters.
export function CategoryGrid({ products }: Readonly<{ products: StoreProduct[] }>) {
  const availableCategories = categoryLinks
    .map((category) => ({ ...category, product: products.find((product) => product.category === category.name) }))
    .filter((category): category is typeof category & { product: StoreProduct } => Boolean(category.product));

  return (
    <section aria-labelledby="categorias-title" className="border-b border-ink/10 bg-paper py-14 sm:py-20 lg:py-24">
      <div className="site-shell">
        <div className="flex flex-col gap-4 border-b border-ink/15 pb-5 sm:flex-row sm:items-end sm:justify-between sm:pb-6">
          <div>
            <p className="eyebrow">Explora por intención</p>
            <h2 id="categorias-title" className="section-title mt-3">Compra por estilo</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted sm:text-right">Largos, tonos y accesorios para elegir cómo quieres verte.</p>
        </div>
        <div className="mt-7 grid grid-cols-3 gap-3 sm:mt-9 sm:gap-5">
          {availableCategories.map(({ name, label, tone, product }) => (
            <Link key={name} href={`/catalogo?category=${name}`} className="group">
              <div className={`relative overflow-hidden rounded-[8px] p-1.5 sm:p-2 ${tone}`}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-[5px] bg-white">
                  <Image src={product.image} alt={`Explorar ${label}`} fill sizes="(max-width: 640px) 33vw, (max-width: 1024px) 33vw, 34vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
              </div>
              <div className="flex items-start justify-between gap-2 border-b border-ink/15 py-3 sm:py-4">
                <span className="font-display text-lg font-semibold leading-[.95] tracking-[-.02em] text-ink sm:text-2xl">{label}</span>
                <ArrowUpRight aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-gold-deep transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
