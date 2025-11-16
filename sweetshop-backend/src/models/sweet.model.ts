// models/sweet.model.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ISweet extends Document {
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock: number; // inventory
  createdAt: Date;
  updatedAt: Date;
}

const SweetSchema = new Schema<ISweet>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, default: 0 },
    category: { type: String },
    stock: { type: Number, required: true, default: 0 }, // using `stock`
  },
  { timestamps: true }
);

export default mongoose.models.Sweet || mongoose.model<ISweet>("Sweet", SweetSchema);
