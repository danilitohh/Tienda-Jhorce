import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { StoreProduct } from "@backend/catalog/catalog-data";

// The campaign hero uses dedicated responsive editorial imagery so it keeps its intended composition on every screen.
export function StoreHero({ product }: Readonly<{ product: StoreProduct }>) {
  return (
    <section className="border-b border-ink/10 bg-paper py-3 sm:py-5 lg:py-7">
      <div className="site-shell">
        <div className="relative min-h-[34rem] overflow-hidden rounded-[12px] bg-gold-pale sm:min-h-[40rem] lg:min-h-[35rem]">
          <picture className="absolute inset-0">
            <source media="(max-width: 1023px)" srcSet="/campaign/byjhor-hero-mobile.png" />
            <img src="/campaign/byjhor-hero-desktop.png" alt="Mujer usando una peluca negra de ondas largas" fetchPriority="high" className="h-full w-full object-cover object-center" />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-paper/10 via-paper/25 to-paper/95 lg:bg-gradient-to-r lg:from-paper via-paper/85 lg:via-42% lg:to-transparent" aria-hidden="true" />
          <div className="relative z-10 flex min-h-[34rem] max-w-xl flex-col justify-end px-6 pb-9 pt-40 sm:min-h-[40rem] sm:px-10 sm:pb-12 lg:min-h-[35rem] lg:justify-center lg:px-14 lg:py-16">
            <p className="eyebrow">Más que una peluca</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[.88] tracking-[-.055em] text-ink sm:text-7xl lg:text-[5.8rem]">
              Tu esencia,
              <span className="block text-gold-deep">tu estilo.</span>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-ink/75 sm:text-base">Pelucas y accesorios para explorar tu look con libertad, todos los días.</p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <Link href="/catalogo" className="button-primary">Ver las pelucas <ArrowRight size={18} /></Link>
              <Link href={`/producto/${product.slug}`} className="text-link">Ver el look</Link>
            </div>
            <p className="mt-9 text-[0.68rem] font-medium uppercase tracking-[.18em] text-muted">Belleza real, todos los días</p>
          </div>
        </div>
      </div>
    </section>
  );
}
