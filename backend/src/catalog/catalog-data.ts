export type ProductCategory = "Esenciales" | "Movimiento" | "Accesorios";

export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  description: string;
  image: string;
  secondaryImage: string;
  badge?: string;
  sizes?: string[];
  colors?: string[];
  rating: number;
  reviewCount: number;
};

// Demo catalog data keeps the first storefront increment reviewable before Supabase is connected.
// Product IDs, slugs, prices and variant field names remain stable while the visible assortment
// is written for byjhor's wig and hair-care offer.
// TODO: replace the inherited apparel image URLs with authorized wig photography before launch.
export const PRODUCTS: StoreProduct[] = [
  {
    id: "p-001",
    slug: "camiseta-aire-negra",
    name: "Peluca Aura",
    category: "Esenciales",
    price: 89000,
    compareAtPrice: 109000,
    description: "Una silueta versátil con caída natural para cambiar de look sin perder tu esencia.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85",
    badge: "Más elegida",
    sizes: ["12\"", "14\"", "16\"", "18\"", "20\""],
    colors: ["Negro natural", "Castaño suave"],
    rating: 4.9,
    reviewCount: 128,
  },
  {
    id: "p-002",
    slug: "pantalon-ruta-cobalto",
    name: "Peluca Ruta",
    category: "Movimiento",
    price: 189000,
    description: "Fibra sintética de acabado suave, ligera y fácil de peinar para el día a día.",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
    badge: "Nuevo",
    sizes: ["12\"", "14\"", "16\"", "18\"", "20\""],
    colors: ["Castaño oscuro", "Negro azabache"],
    rating: 4.8,
    reviewCount: 76,
  },
  {
    id: "p-003",
    slug: "chaqueta-norte-ligera",
    name: "Peluca Norte",
    category: "Movimiento",
    price: 279000,
    description: "Volumen definido y movimiento natural para una presencia que se siente tuya.",
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=85",
    sizes: ["18\"", "20\"", "22\"", "24\""],
    colors: ["Chocolate", "Negro natural"],
    rating: 4.7,
    reviewCount: 42,
  },
  {
    id: "p-004",
    slug: "bolso-trazo-diario",
    name: "Kit Trazo",
    category: "Accesorios",
    price: 149000,
    description: "Peine, gorro y cepillo para preparar, ajustar y cuidar tu peluca.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
    badge: "Últimas unidades",
    colors: ["Arena", "Negro"],
    rating: 4.9,
    reviewCount: 91,
  },
  {
    id: "p-005",
    slug: "camisa-linea-blanca",
    name: "Peluca Línea",
    category: "Esenciales",
    price: 139000,
    description: "Línea recta y brillo sutil para un look pulido, cómodo y fácil de llevar.",
    image: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=1200&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=1200&q=85",
    sizes: ["12\"", "14\"", "16\"", "18\""],
    colors: ["Rubio miel", "Castaño claro"],
    rating: 4.8,
    reviewCount: 63,
  },
  {
    id: "p-006",
    slug: "gorra-punto-azul",
    name: "Kit Punto",
    category: "Accesorios",
    price: 79000,
    description: "Accesorios esenciales para guardar, desenredar y prolongar la vida de tu peluca.",
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85",
    badge: "Edición limitada",
    colors: ["Marfil", "Negro"],
    rating: 4.6,
    reviewCount: 34,
  },
];

// Expose a safe catalog read boundary that can later be replaced by a repository query.
export function listProducts(input?: { query?: string; category?: string; sort?: "featured" | "price-asc" | "price-desc" }): StoreProduct[] {
  const query = input?.query?.trim().toLowerCase();
  const category = input?.category;
  const filtered = PRODUCTS.filter((product) => {
    const matchesQuery = !query || `${product.name} ${product.category} ${product.slug}`.toLowerCase().includes(query);
    const matchesCategory = !category || category === "Todos" || product.category === category;
    return matchesQuery && matchesCategory;
  });

  return [...filtered].sort((left, right) => {
    if (input?.sort === "price-asc") return left.price - right.price;
    if (input?.sort === "price-desc") return right.price - left.price;
    return 0;
  });
}

// Resolve one product by its public, SEO-friendly slug.
export function getProductBySlug(slug: string): StoreProduct | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}
