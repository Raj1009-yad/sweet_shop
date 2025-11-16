// src/pages/Admin.tsx
import { useEffect, useState } from "react";
import SweetForm from "../components/Sweets/SweetForm";
import SweetsList from "../components/Sweets/SweetsList";
import toast from "react-hot-toast";
import { createSweet, updateSweet } from "../api/sweets";

export default function Admin() {
  const [editing, setEditing] = useState<any>(null);

  useEffect(() => {
    console.debug("Admin mounted, editing:", editing);
  }, [editing]);

  const handleCreate = async (payload: any) => {
    try {
      await createSweet(payload);
      toast.success("Created");
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Create failed");
    }
  };

  const handleUpdate = async (payload: any) => {
    try {
      if (!editing?._id) throw new Error("No editing item");
      await updateSweet(editing._id, payload);
      toast.success("Updated");
      setEditing(null);
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-2">Create Sweet</h2>
          <SweetForm onSubmit={handleCreate} />
        </div>

        <div>
          <h2 className="font-semibold mb-2">Manage Sweets</h2>
          <SweetsList
            onEditSelected={(s) => {
              console.debug("Admin received onEditSelected:", s?._id);
              setEditing(s);
            }}
          />
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Edit Sweet</h3>
            <SweetForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
