import React, { useState } from "react";
import toast from "react-hot-toast";

export default function SweetForm({ initial, onSubmit, onCancel }: any) {
  const [name, setName] = useState(initial?.name || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [price, setPrice] = useState(initial?.price || 0);
  const [quantity, setQuantity] = useState(initial?.quantity || 0);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) {
      toast.error("Name & category required");
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ name, category, price: Number(price), quantity: Number(quantity) });
    } catch (err) {
      // caller handles toasts
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded" />
      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="w-full p-2 border rounded" />
      <input value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Price" type="number" className="w-full p-2 border rounded" />
      <input value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} placeholder="Quantity" type="number" className="w-full p-2 border rounded" />
      <div className="flex gap-2">
        <button disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">{loading ? "Saving..." : "Save"}</button>
        {onCancel && <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>}
      </div>
    </form>
  );
}
