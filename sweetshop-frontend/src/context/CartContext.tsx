import { createContext, useEffect, useState} from "react";
import type {ReactNode} from "react";

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
  total: () => number;
  buyAll: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error(
      "useCart must be used within a <CartProvider>. Wrap your app with CartProvider."
    );
  }
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx === -1) return [...prev, item];
      const copy = [...prev];
      copy[idx] = { ...copy[idx], qty: copy[idx].qty + item.qty };
      return copy;
    });
  };

  const removeItem = (id: string) => setItems((p) => p.filter((x) => x.id !== id));
  const clear = () => setItems([]);
  const total = () => items.reduce((s, it) => s + it.price * it.qty, 0);

  const buyAll = () => {
    // TODO: replace with actual checkout flow / API call
    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    alert(`Buying ${items.length} items for total ₹${total().toFixed(2)}`);
    clear();
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, total, buyAll }}>
      {children}
    </CartContext.Provider>
  );
};
