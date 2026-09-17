// These types are the narrow read model needed by the first owner-facing administration screen.
export type AdminProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type AdminProduct = Readonly<{
  id: string;
  name: string;
  slug: string;
  status: AdminProductStatus;
  price: number;
  stock: number | null;
  updatedAt: string;
}>;

export type AdminOrder = Readonly<{
  id: string;
  number: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
}>;

export type AdminDashboardData = Readonly<{
  products: AdminProduct[];
  recentOrders: AdminOrder[];
}>;
