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

// Build category navigation from the real catalog images while keeping the grid visually light and intentional.
export function CategoryGrid({ products }: Readonly<{ products: StoreProduct[] }>) {
  const availableCategories = categoryLinks
    .map((category) => ({ ...category, product: products.find((product) => product.category === category.name) }))
    .filter((category): category is typeof category & { product: StoreProduct } => Boolean(category.product));

  return (
    <section aria-labelledby="categorias-title" className="border-b border-ink/10 bg-paper py-20 sm:py-24 lg:py-32">
      <div className="site-shell">
        <div className="flex flex-col gap-5 border-b border-ink/15 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Explora por intención</p>
            <h2 id="categorias-title" className="section-title mt-4">Encuentra tu peluca</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted sm:text-right">Largos, tonos y accesorios para elegir cómo quieres verte.</p>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {availableCategories.map(({ name, label, tone, product }) => (
            <Link key={name} href={`/catalogo?category=${name}`} className="group">
              <div className={`relative overflow-hidden rounded-[16px] p-2 ${tone}`}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-white">
                  <Image src={product.image} alt={`Explorar ${label}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 34vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-ink/15 py-5">
                <span className="font-display text-2xl font-semibold tracking-[-.02em] text-ink">{label}</span>
                <ArrowUpRight aria-hidden="true" size={20} className="text-gold-deep transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
