import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { StoreProduct } from "@backend/catalog/catalog-data";

// The storefront opening pairs one real catalog image with a short, immediately actionable message.
export function StoreHero({ product }: Readonly<{ product: StoreProduct }>) {
  return (
    <section className="border-b border-ink/10 bg-gold-pale/45">
      <div className="site-shell grid items-stretch gap-0 py-5 sm:py-8 lg:grid-cols-[.88fr_1.12fr] lg:py-10">
        <div className="flex min-h-[24rem] flex-col justify-center bg-paper px-6 py-12 sm:px-10 lg:min-h-[35rem] lg:px-14 lg:py-16">
          <p className="eyebrow">Pelucas byjhor</p>
          <h1 className="mt-5 max-w-xl font-display text-5xl font-semibold leading-[.88] tracking-[-.055em] text-ink sm:text-7xl lg:text-[5.6rem]">
            Tu esencia,
            <span className="block text-gold-deep">tu estilo.</span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-muted sm:text-base">
            Pelucas y accesorios para explorar tu look con libertad, todos los días.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="/catalogo" className="button-primary">
              Ver las pelucas
              <ArrowRight size={18} />
            </Link>
            <Link href="/catalogo?category=Accesorios" className="text-link">
              Ver cuidados
            </Link>
          </div>
          <p className="mt-12 border-t border-ink/10 pt-5 text-[0.68rem] font-medium uppercase tracking-[.18em] text-muted">
            Largos, tonos y accesorios para elegir a tu manera
          </p>
        </div>

        <figure className="relative m-0 min-h-[22rem] overflow-hidden bg-gold-soft sm:min-h-[30rem] lg:min-h-0">
          <Image
            src={product.image}
            alt={`Imagen de ${product.name}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 56vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" aria-hidden="true" />
          <figcaption className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 text-paper sm:p-7">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[.18em] text-gold-soft">Con movimiento</p>
              <p className="mt-2 font-display text-2xl font-semibold leading-none">{product.name}</p>
            </div>
            <Link href={`/producto/${product.slug}`} className="shrink-0 text-sm font-semibold underline decoration-paper/55 underline-offset-6 transition-colors hover:text-gold-soft">
              Ver pieza
            </Link>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
