// src/components/Sweets/SweetCard.tsx


type Props = {
  sweet: any;
  onPurchase?: (sweet: any) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onRestock?: () => void;
};

export default function SweetCard({ sweet, onPurchase, onEdit, onDelete, onRestock }: Props) {
  const stock = typeof sweet.stock !== "undefined" ? Number(sweet.stock) : undefined;

  return (
    <div className="bg-white p-4 rounded shadow relative overflow-hidden">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold">{sweet.name}</h3>
          {sweet.description && <p className="text-sm text-gray-600">{sweet.description}</p>}

          <div className="mt-2 text-sm">
            <span className="font-medium">₹{sweet.price}</span>
            {sweet.category && <span className="ml-2 text-gray-500">· {sweet.category}</span>}
            {typeof stock !== "undefined" && (
              <span className={`ml-3 ${stock <= 0 ? "text-red-500" : "text-gray-500"}`}>
                {stock <= 0 ? "Out of stock" : `Stock: ${stock}`}
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => {
                console.debug("Purchase clicked", sweet._id);
                onPurchase?.(sweet);
              }}
              disabled={typeof stock !== "undefined" && stock <= 0}
              className={`px-2 py-1 rounded text-white text-sm ${
                typeof stock !== "undefined" && stock <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600"
              }`}
            >
              Buy
            </button>

            {onRestock && (
              <button
                onClick={() => {
                  console.debug("Restock clicked", sweet._id);
                  onRestock();
                }}
                className="px-2 py-1 rounded bg-yellow-400 text-sm"
              >
                Restock
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {onEdit && (
            <button
              onClick={() => {
                console.debug("Edit button clicked for", sweet._id);
                onEdit();
              }}
              aria-label="edit"
              className="p-2 rounded hover:bg-gray-100 focus:outline-none"
              style={{ cursor: "pointer", zIndex: 30 }}
            >
              ✏️
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => {
                console.debug("Delete clicked for", sweet._id);
                onDelete();
              }}
              aria-label="delete"
              className="p-2 rounded hover:bg-gray-100 focus:outline-none"
              style={{ cursor: "pointer" }}
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
