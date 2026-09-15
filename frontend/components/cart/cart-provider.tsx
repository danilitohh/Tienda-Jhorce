"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { StoreProduct } from "@backend/catalog/catalog-data";

export type CartItem = { product: StoreProduct; quantity: number };

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: StoreProduct) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

// Persist the lightweight cart locally while keeping server recalculation as the checkout authority.
export function CartProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Hydrate only on the client to avoid server/client markup mismatches.
  useEffect(() => {
    const stored = window.localStorage.getItem("jhorce-cart");
    if (stored) {
      // This one-time hydration is intentionally stateful; it runs after the server markup is committed.
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate external localStorage once after mount.
        setItems(JSON.parse(stored) as CartItem[]);
      } catch { window.localStorage.removeItem("jhorce-cart"); }
    }
  }, []);

  // Save changes for anonymous shopping continuity between visits.
  useEffect(() => { window.localStorage.setItem("jhorce-cart", JSON.stringify(items)); }, [items]);

  // Add one unit or increment the existing line without exceeding a practical cart limit.
  const addItem = (product: StoreProduct) => setItems((current) => {
    const existing = current.find((item) => item.product.id === product.id);
    if (existing) return current.map((item) => item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, 20) } : item);
    return [...current, { product, quantity: 1 }];
  });

  // Keep quantity controls predictable and remove a line when it reaches zero.
  const updateQuantity = (productId: string, quantity: number) => setItems((current) => current.map((item) => item.product.id === productId ? { ...item, quantity: Math.max(0, Math.min(quantity, 20)) } : item).filter((item) => item.quantity > 0));

  // Remove one product line from the local cart.
  const removeItem = (productId: string) => setItems((current) => current.filter((item) => item.product.id !== productId));

  // Reset the local cart after an order is successfully created.
  const clearCart = () => setItems([]);

  const value = useMemo(() => ({
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Expose the cart context with a helpful error if a component is mounted outside the provider.
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
