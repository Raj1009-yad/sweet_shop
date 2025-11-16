// src/routes/sweets.routes.ts
import express from "express";
import Sweet from "../models/sweet.model";
import { authenticate } from "../middleware/auth.middleware"; // keep for protected routes

const router = express.Router();

// PUBLIC: list sweets, no-cache for dev
router.get("/", async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    console.log("[sweets] list requested. authHeader present:", !!req.headers.authorization);
    const sweets = await Sweet.find().sort({ createdAt: -1 }).lean();
    console.log("[sweets] found:", sweets.length);
    return res.json(sweets);
  } catch (err) {
    console.error("[sweets] list error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Add a simple search endpoint (optional)
router.get("/search", async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;
    const filter: any = {};

    if (q) filter.$or = [
      { name: { $regex: String(q), $options: "i" } },
      { description: { $regex: String(q), $options: "i" } }
    ];
    if (category) filter.category = String(category);
    if (minPrice) filter.price = { ...(filter.price || {}), $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...(filter.price || {}), $lte: Number(maxPrice) };

    const sweets = await Sweet.find(filter).sort({ createdAt: -1 }).lean();
    return res.json(sweets);
  } catch (err) {
    console.error("[sweets] search error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Protect following routes
router.use(authenticate);

// create sweet (admin)
router.post("/", async (req, res) => {
  try {
    const { name, category, description, price, quantity, image } = req.body;
    const s = await Sweet.create({ name, category, description, price, quantity, image });
    return res.status(201).json(s);
  } catch (err) {
    console.error("[sweets] create error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const s = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!s) return res.status(404).json({ message: "Not found" });
    return res.json(s);
  } catch (err) {
    console.error("[sweets] update error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const s = await Sweet.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ message: "Not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("[sweets] delete error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/purchase", async (req, res) => {
  try {
    const qty = Number(req.body.qty ?? 1);
    const s = await Sweet.findById(req.params.id);
    if (!s) return res.status(404).json({ message: "Not found" });
    if (s.quantity < qty) return res.status(400).json({ message: "Not enough quantity" });
    s.quantity -= qty;
    await s.save();
    return res.json(s);
  } catch (err) {
    console.error("[sweets] purchase error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/restock", async (req, res) => {
  try {
    const qty = Number(req.body.qty ?? 0);
    const id = req.params.id;
    const s = await Sweet.findById(id);
    if (!s) return res.status(404).json({ message: "Not found" });
    // s.quantity += qty;
    const updated = await Sweet.findOneAndUpdate(
      { _id: id },           // filter
      { $set: { stock : qty } },  // update
      { new: true }          // return updated document
    );
    console.log("Coming here")
    console.log(updated)
    // await s.save();
    return res.json(s);
  } catch (err) {
    console.error("[sweets] restock error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
