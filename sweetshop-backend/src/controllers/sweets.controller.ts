// controllers/sweets.controller.ts
import { Request, Response } from "express";
import Sweet from "../models/sweet.model";
import mongoose from "mongoose";

/** GET /sweets */
export const listSweets = async (req: Request, res: Response) => {
  try {
    const sweets = await Sweet.find({}).lean();
    return res.json(sweets);
  } catch (err: any) {
    console.error("listSweets error:", err);
    return res.status(500).json({ message: "Failed to fetch sweets" });
  }
};

/** POST /sweets - create (admin) */
export const createSweet = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const created = await Sweet.create(payload);
    return res.json(created);
  } catch (err: any) {
    console.error("createSweet error:", err);
    return res.status(500).json({ message: "Create failed" });
  }
};

/** PUT /sweets/:id - update (admin) */
export const updateSweet = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });
  try {
    const updated = await Sweet.findByIdAndUpdate(id, req.body, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.json(updated);
  } catch (err: any) {
    console.error("updateSweet error:", err);
    return res.status(500).json({ message: "Update failed" });
  }
};

/** DELETE /sweets/:id (admin) */
export const deleteSweet = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });
  try {
    await Sweet.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (err: any) {
    console.error("deleteSweet error:", err);
    return res.status(500).json({ message: "Delete failed" });
  }
};

/** POST /sweets/:id/restock (admin) - FIXED: increments stock by +qty */
export const restockSweet = async (req: Request, res: Response) => {
  const id = req.params.id;
  const qtyRaw = req.body?.qty;
  const qty = Number(qtyRaw);

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });
  if (!Number.isFinite(qty) || qty <= 0 || !Number.isInteger(qty)) {
    return res.status(400).json({ message: "Invalid quantity; must be positive integer" });
  }

  try {
    console.debug("restockSweet called", { id, qty });
    const updated = await Sweet.findByIdAndUpdate(id, { $inc: { stock: qty } }, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: "Not found" });
    console.debug("restockSweet updated doc:", updated);
    return res.json(updated);
  } catch (err: any) {
    console.error("restockSweet error:", err);
    return res.status(500).json({ message: "Restock failed" });
  }
};

/** POST /sweets/:id/purchase - atomic decrement if stock >= qty */
export const purchaseSweet = async (req: Request, res: Response) => {
  const id = req.params.id;
  const qty = Number(req.body.qty || 1);
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });
  if (!qty || qty <= 0) return res.status(400).json({ message: "Invalid quantity" });

  try {
    const updated = await Sweet.findOneAndUpdate(
      { _id: id, stock: { $gte: qty } },
      { $inc: { stock: -qty } },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(400).json({ message: "Out of stock or insufficient quantity" });
    }

    // Optionally create order record here

    return res.json(updated);
  } catch (err: any) {
    console.error("purchase error:", err);
    return res.status(500).json({ message: "Purchase failed" });
  }
};
