// src/context/CartContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  total: number;
  totalCount: number;
  buyAll: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx === -1) return [...prev, item];

      const next = [...prev];
      next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
      return next;
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const clear = () => setItems([]);

  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const totalCount = items.reduce((sum, it) => sum + it.qty, 0);

  const buyAll = () => {
    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    alert(Buying ${items.length} items worth ₹${total});
    clear();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clear,
        total,
        totalCount,
        buyAll
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
