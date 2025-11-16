import { Request, Response } from "express";
import Sweet from "../models/sweet.model";

// Purchase Sweet
export const purchaseSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const qty = Math.max(1, Number(req.body.quantity) || 1);

    const sweet = await Sweet.findById(id);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });

    if (sweet.quantity < qty) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    sweet.quantity -= qty;
    await sweet.save();

    res.json({ message: "Purchase successful", sweet });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Restock Sweet (Admin Only)
export const restockSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const qty = Math.max(1, Number(req.body.quantity) || 1);

    const sweet = await Sweet.findById(id);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });

    sweet.quantity += qty;
    await sweet.save();

    res.json({ message: "Restock successful", sweet });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
