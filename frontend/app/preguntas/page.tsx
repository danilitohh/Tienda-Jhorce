import { InfoPage } from "@/components/layout/info-page";

// Frequently asked questions are intentionally static until CMS-backed content is connected.
export default function QuestionsPage() {
  const questions = [["¿Cómo elijo mi peluca?", "En la ficha de cada producto verás los largos y tonos disponibles para comparar antes de añadirlo al carrito."], ["¿Cuánto tarda el envío?", "Los pedidos salen en 1 a 2 días hábiles y el tiempo de entrega depende de la ciudad."], ["¿Puedo hacer un cambio?", "Sí. Tienes 30 días para solicitar un cambio, siempre que el producto conserve sus condiciones originales."], ["¿Cómo sigo mi pedido?", "Cuando el pedido sea enviado recibirás el número de guía. Podrás consultarlo desde el detalle de tu pedido y en el portal de Interrapidísimo."]];
  return <InfoPage title="Preguntas frecuentes"><div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">{questions.map(([title, answer]) => <details key={title} className="py-6"><summary className="cursor-pointer font-display text-xl font-semibold text-ink">{title}</summary><p className="mt-3 max-w-xl text-sm leading-7 text-muted">{answer}</p></details>)}</div></InfoPage>;
}
