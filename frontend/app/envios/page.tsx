import { InfoPage } from "@/components/layout/info-page";

// Shipping page explains the manual carrier integration honestly until admin tracking is connected.
export default function ShippingPage() {
  return <InfoPage title="Envíos"><p>Enviamos a Colombia con seguimiento manual de Interrapidísimo. Cuando tu pedido salga, recibirás el número de guía y podrás rastrearlo en el portal público de la transportadora.</p></InfoPage>;
}
