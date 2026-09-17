import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { StoreProduct } from "@backend/catalog/catalog-data";
import { ProductCard } from "@/components/product-card";

// Feature real catalog records rather than manufacturing a bestseller or sale-based merchandising claim.
export function FeaturedProducts({ products }: Readonly<{ products: StoreProduct[] }>) {
  return (
    <section className="border-b border-ink/10 bg-paper py-14 sm:py-20 lg:py-24" aria-labelledby="featured-title">
      <div className="site-shell">
        <div className="flex items-end justify-between gap-6 border-b border-ink/15 pb-5 sm:pb-6">
          <div>
            <p className="eyebrow">La selección byjhor</p>
            <h2 id="featured-title" className="section-title mt-3">Pelucas destacadas</h2>
          </div>
          <Link href="/catalogo" className="text-link shrink-0">Ver tienda <ArrowRight size={16} /></Link>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-10 sm:mt-10 sm:gap-x-5 md:grid-cols-4 lg:gap-x-6">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
