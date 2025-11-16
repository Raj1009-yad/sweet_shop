// routes/sweets.ts
import express from "express";
import {
  listSweets,
  createSweet,
  updateSweet,
  deleteSweet,
  restockSweet,
  purchaseSweet,
} from "../controllers/sweets.controller";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", listSweets);
router.get("/search", async (req, res) => {
  // basic search implementation (optional - if you already have one, keep it)
  // forwarded to controller in your project if you have a dedicated search controller
  res.status(501).json({ message: "Implement /sweets/search in controller" });
});

// Admin-only operations
router.post("/", authenticate, requireAdmin, createSweet);
router.put("/:id", authenticate, requireAdmin, updateSweet);
router.delete("/:id", authenticate, requireAdmin, deleteSweet);
router.post("/:id/restock", authenticate, requireAdmin, restockSweet);

// Purchase (public or protected as per app choice) — here kept public
router.post("/:id/purchase", purchaseSweet);

export default router;
