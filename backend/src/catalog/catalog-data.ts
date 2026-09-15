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
export const PRODUCTS: StoreProduct[] = [
  {
    id: "p-001",
    slug: "camiseta-aire-negra",
    name: "Camiseta Aire",
    category: "Esenciales",
    price: 89000,
    compareAtPrice: 109000,
    description: "Algodón pesado, caída limpia y una silueta que acompaña todos tus días.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85",
    badge: "Más elegido",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Negro", "Blanco humo"],
    rating: 4.9,
    reviewCount: 128,
  },
  {
    id: "p-002",
    slug: "pantalon-ruta-cobalto",
    name: "Pantalón Ruta",
    category: "Movimiento",
    price: 189000,
    description: "Tela flexible, bolsillo seguro y una línea estructurada para moverte sin pensar.",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
    badge: "Nuevo",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Cobalto", "Grafito"],
    rating: 4.8,
    reviewCount: 76,
  },
  {
    id: "p-003",
    slug: "chaqueta-norte-ligera",
    name: "Chaqueta Norte",
    category: "Movimiento",
    price: 279000,
    description: "Una capa ligera para el cambio de clima, con textura mate y volumen preciso.",
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=85",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Verde bosque", "Negro"],
    rating: 4.7,
    reviewCount: 42,
  },
  {
    id: "p-004",
    slug: "bolso-trazo-diario",
    name: "Bolso Trazo",
    category: "Accesorios",
    price: 149000,
    description: "Organiza lo esencial en un diseño compacto, resistente y fácil de llevar.",
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
    name: "Camisa Línea",
    category: "Esenciales",
    price: 139000,
    description: "Una camisa amplia, fresca y lista para combinarse con todo el armario.",
    image: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=1200&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=1200&q=85",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blanco", "Azul lavado"],
    rating: 4.8,
    reviewCount: 63,
  },
  {
    id: "p-006",
    slug: "gorra-punto-azul",
    name: "Gorra Punto",
    category: "Accesorios",
    price: 79000,
    description: "Visera curva y algodón lavado para completar el look con naturalidad.",
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85",
    badge: "Edición limitada",
    colors: ["Azul tinta", "Marfil"],
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
