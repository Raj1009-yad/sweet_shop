// src/components/Sweets/SweetsList.tsx
import React, { useCallback, useEffect, useMemo, useState, useContext } from "react";
import {
  listSweets,
  searchSweets,
  deleteSweet,
  restockSweet,
  purchaseSweet,
} from "../../api/sweets";
import SweetCard from "./SweetCard";
import { useCart } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

/** debounce util */
function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let t: any;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export default function SweetsList({ onEditSelected }: { onEditSelected?: (s: any) => void }) {
  const [sweets, setSweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const auth = useContext(AuthContext)!;
  const cart = useCart();
  const isAdmin = auth?.user?.role === "admin";

  /** Load all sweets */
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listSweets();
      setSweets(res.data ?? []);
    } catch (err: any) {
      toast.error("Failed to load sweets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  /** Categories */
  const categories = useMemo(
    () => Array.from(new Set(sweets.map((s) => s.category))).filter(Boolean),
    [sweets]
  );

  /** Search */
  const doSearch = useCallback(async (params: any = {}) => {
    setLoading(true);
    try {
      const res =
        Object.keys(params).length > 0 ? await searchSweets(params) : await listSweets();
      setSweets(res.data ?? []);
    } catch (err) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const debounced = useMemo(() => debounce(doSearch, 350), [doSearch]);

  useEffect(() => {
    const p: any = {};
    if (q) p.q = q;
    if (category) p.category = category;
    if (minPrice) p.minPrice = Number(minPrice);
    if (maxPrice) p.maxPrice = Number(maxPrice);
    debounced(p);
  }, [q, category, minPrice, maxPrice, debounced]);

  /**
   * PURCHASE — fixed (NO Infinity)
   */
  const handlePurchase = useCallback(
    async (sweet: any) => {
      const currentStock = Number(sweet.stock);

      if (isNaN(currentStock) || currentStock <= 0) {
        toast.error("Out of stock");
        return;
      }

      // Optimistic update (safe)
      setSweets((prev) =>
        prev.map((s) =>
          s._id === sweet._id ? { ...s, stock: currentStock - 1 } : s
        )
      );

      // Add to cart
      cart.addItem({
        id: sweet._id,
        name: sweet.name,
        price: sweet.price,
        qty: 1,
      });

      try {
        const res = await purchaseSweet(sweet._id, 1);

        // Use server-updated sweet to avoid UI desync
        if (res?.data?._id) {
          setSweets((prev) =>
            prev.map((s) => (s._id === sweet._id ? res.data : s))
          );
        }

        toast.success("Added to cart");
      } catch (err) {
        // Rollback UI
        setSweets((prev) =>
          prev.map((s) =>
            s._id === sweet._id ? { ...s, stock: currentStock } : s
          )
        );
        toast.error("Purchase failed");
      }
    },
    [cart]
  );

  /**
   * RESTOCK — uses server-updated sweet
   */
  const handleRestock = useCallback(async (id: string) => {
    const answer = window.prompt("Restock quantity", "10");
    if (!answer) return;

    const qty = Number(answer);
    if (isNaN(qty) || qty <= 0) {
      toast.error("Enter valid number");
      return;
    }

    try {
      const res = await restockSweet(id, qty);

      if (res?.data?._id) {
        setSweets((prev) =>
          prev.map((s) => (s._id === res.data._id ? res.data : s))
        );
      } else {
        await loadAll();
      }

      toast.success("Restocked");
    } catch (err) {
      toast.error("Restock failed");
    }
  }, [loadAll]);

  /**
   * DELETE
   */
  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm("Delete this sweet?")) return;
      try {
        await deleteSweet(id);
        toast.success("Deleted");
        loadAll();
      } catch {
        toast.error("Delete failed");
      }
    },
    [loadAll]
  );

  return (
    <div>
      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-4 flex flex-col md:flex-row gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
          className="p-2 border rounded flex-1"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          type="number"
          value={minPrice}
          placeholder="Min price"
          onChange={(e) => setMinPrice(e.target.value)}
          className="p-2 border rounded w-28"
        />

        <input
          type="number"
          value={maxPrice}
          placeholder="Max price"
          onChange={(e) => setMaxPrice(e.target.value)}
          className="p-2 border rounded w-28"
        />

        <button
          onClick={() => {
            setQ("");
            setCategory("");
            setMinPrice("");
            setMaxPrice("");
            loadAll();
          }}
          className="p-2 bg-gray-200 rounded"
        >
          Reset
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-8">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sweets.map((sweet) => (
            <SweetCard
              key={sweet._id}
              sweet={sweet}
              onPurchase={handlePurchase}
              onEdit={isAdmin ? () => onEditSelected?.(sweet) : undefined}
              onDelete={isAdmin ? () => handleDelete(sweet._id) : undefined}
              onRestock={isAdmin ? () => handleRestock(sweet._id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
