// src/context/CartContext.tsx
import { createContext, useEffect, useState, useContext } from "react";
import type { ReactNode } from "react";
import { purchaseSweet } from "../api/sweets";

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  totalCount: number;
  total: number; // total price (sum price * qty)
  buyAll: () => Promise<{ success: boolean; detail?: any }>; // attempt to purchase all items
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
        return next;
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clear = () => setItems([]);

  const totalCount = items.reduce((s, it) => s + it.qty, 0);
  const total = items.reduce((s, it) => s + it.qty * it.price, 0);

  /**
   * buyAll:
   * - Tries to purchase each item against backend (purchaseSweet).
   * - If all succeed, clears cart and returns success.
   * - If any fail, it returns failure + details and reloads cart from server might be considered.
   *
   * Note: This is a simple naive implementation. In production you'd want
   * better error handling, per-item rollback, and UX messages.
   */
  const buyAll = async (): Promise<{ success: boolean; detail?: any }> => {
    if (items.length === 0) return { success: true };

    try {
      // perform purchases sequentially to avoid race issues on backend stock updates
      for (const it of items) {
        // call backend purchase endpoint with qty
        await purchaseSweet(it.id, it.qty);
      }
      // if all purchases succeed, clear cart
      setItems([]);
      return { success: true };
    } catch (err) {
      console.error("buyAll error:", err);
      // do not clear cart in case of failure; return detail
      return { success: false, detail: err };
    }
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, totalCount, total, buyAll }}>
      {children}
    </CartContext.Provider>
  );
};
