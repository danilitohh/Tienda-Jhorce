import { StoreCareIcon, StoreLengthIcon, StoreToneIcon } from "@/components/ui/store-icons";

const benefits = [
  { title: "Explora largos", description: "Encuentra el estilo que imaginas.", Icon: StoreLengthIcon },
  { title: "Elige tu tono", description: "Descubre opciones para verte a tu manera.", Icon: StoreToneIcon },
  { title: "Cuida tu peluca", description: "Accesorios para tu ritual diario.", Icon: StoreCareIcon },
] as const;

// This compact strip reinforces discovery without adding promotional claims that the store cannot verify.
export function BenefitStrip() {
  return (
    <section className="border-b border-ink/10 bg-paper" aria-label="Cómo explorar byjhor">
      <div className="site-shell grid divide-y divide-ink/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {benefits.map(({ title, description, Icon }) => (
          <article key={title} className="flex items-center gap-4 py-5 sm:px-6 sm:first:pl-0 sm:last:pr-0 lg:py-7">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/25 bg-gold-pale text-gold-deep" aria-hidden="true"><Icon size={23} /></span>
            <div>
              <h2 className="font-display text-xl font-semibold leading-none">{title}</h2>
              <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
