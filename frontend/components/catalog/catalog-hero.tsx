import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { ProductCategory, StoreProduct } from "@backend/catalog/catalog-data";
import { getCategoryLabel } from "@/lib/catalog-labels";

const copyByCategory: Record<"Todos" | ProductCategory, { title: string; description: string }> = {
  Todos: { title: "Encuentra tu próxima peluca.", description: "Explora pelucas para cada día, estilos con movimiento y accesorios para cuidarlas." },
  Esenciales: { title: "Pelucas para cada día", description: "Siluetas versátiles para cambiar de look a tu ritmo." },
  Movimiento: { title: "Pelucas con movimiento", description: "Volumen, caída y estilos que acompañan tu expresión." },
  Accesorios: { title: "Cuidado y accesorios", description: "Lo esencial para preparar, guardar y cuidar tu peluca." },
};

// The catalog opener gives every category a clear visual context while leading straight to the existing filters.
export function CatalogHero({ category, product }: Readonly<{ category: "Todos" | ProductCategory; product: StoreProduct }>) {
  const copy = copyByCategory[category];
  const breadcrumb = category === "Todos" ? "Tienda" : getCategoryLabel(category);

  return (
    <section className="border-b border-ink/10 bg-paper py-4 sm:py-6">
      <div className="site-shell">
        <p className="text-sm text-muted"><Link href="/" className="transition-colors hover:text-gold-deep">Inicio</Link><span aria-hidden="true"> / </span><span className="text-ink">{breadcrumb}</span></p>
        <div className="mt-4 grid overflow-hidden rounded-[12px] bg-gold-pale sm:mt-5 lg:grid-cols-[.88fr_1.12fr]">
          <div className="order-2 flex min-h-[18rem] flex-col justify-center p-6 sm:p-10 lg:order-1 lg:min-h-[28rem] lg:p-14">
            <p className="eyebrow">{category === "Todos" ? "La tienda byjhor" : breadcrumb}</p>
            <h1 className="mt-4 max-w-xl font-display text-5xl font-semibold leading-[.9] tracking-[-.045em] sm:text-6xl lg:text-7xl">{copy.title}</h1>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-muted">{copy.description}</p>
            <Link href="#productos" className="button-primary mt-7 w-fit">Explorar <ArrowRight size={17} /></Link>
          </div>
          <div className="relative order-1 aspect-[16/10] min-h-64 bg-gold-soft lg:order-2 lg:aspect-auto">
            <Image src={product.image} alt={`Imagen de ${product.name}`} fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink/10" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
