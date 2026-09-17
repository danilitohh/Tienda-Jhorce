import Link from "next/link";
import type { ProductCategory, StoreProduct } from "@backend/catalog/catalog-data";
import { ProductCard } from "@/components/product-card";
import { categoryLabels } from "@/lib/catalog-labels";

const categoryOrder: ReadonlyArray<{ value: ProductCategory; eyebrow: string; label: string }> = [
  { value: "Esenciales", eyebrow: "Esenciales", label: categoryLabels.Esenciales },
  { value: "Movimiento", eyebrow: "Movimiento", label: categoryLabels.Movimiento },
  { value: "Accesorios", eyebrow: "Accesorios", label: categoryLabels.Accesorios },
];

// Group the real filtered catalog into clear shopping sections without inventing products or merchandising rules.
export function CatalogSections({ products }: Readonly<{ products: StoreProduct[] }>) {
  return <div className="space-y-16 sm:space-y-20">
    {categoryOrder.map((category) => {
      const categoryProducts = products.filter((product) => product.category === category.value);

      if (categoryProducts.length === 0) return null;

      return <section key={category.value} id={`categoria-${category.value.toLowerCase()}`} aria-labelledby={`categoria-${category.value.toLowerCase()}-title`} className="scroll-mt-28">
        <div className="mb-8 flex flex-col gap-3 border-b border-ink/15 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">{category.eyebrow}</p>
            <h2 id={`categoria-${category.value.toLowerCase()}-title`} className="mt-3 font-display text-4xl font-semibold leading-[.95] tracking-[-.03em] text-ink sm:text-5xl">{category.label}</h2>
          </div>
          <Link href={`/catalogo?category=${category.value}`} className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-ink underline underline-offset-8 transition-colors hover:text-coral">Ver categoría <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {categoryProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>;
    })}
  </div>;
}
