import Link from "next/link";

// Frequently asked questions are intentionally static until CMS-backed content is connected.
export default function QuestionsPage() {
  const questions = [["¿Cuánto tarda el envío?", "Los pedidos salen en 1 a 2 días hábiles y el tiempo de entrega depende de la ciudad."], ["¿Puedo hacer un cambio?", "Sí. Tienes 30 días para solicitar un cambio, siempre que la pieza conserve sus condiciones originales."], ["¿Cómo sigo mi pedido?", "Cuando el pedido sea enviado recibirás el número de guía. Podrás consultarlo desde el detalle de tu pedido y en el portal de Interrapidísimo."]];
  return <main className="mx-auto min-h-[100dvh] max-w-3xl px-5 py-16 sm:px-8 lg:py-24"><Link href="/" className="text-sm text-slate-500 hover:text-ink">← Volver a Jhorce</Link><h1 className="mt-16 font-display text-5xl font-bold tracking-[-.08em]">Preguntas frecuentes</h1><div className="mt-12 divide-y divide-ink/10 border-y border-ink/10">{questions.map(([title, answer]) => <details key={title} className="py-6"><summary className="cursor-pointer font-display text-lg font-semibold">{title}</summary><p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">{answer}</p></details>)}</div></main>;
}

