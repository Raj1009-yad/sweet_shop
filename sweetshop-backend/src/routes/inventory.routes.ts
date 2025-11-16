import express from "express";
import { purchaseSweet, restockSweet } from "../controllers/inventory.controller";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authenticate);

router.post("/:id/purchase", purchaseSweet);
router.post("/:id/restock", requireAdmin, restockSweet);

export default router;
