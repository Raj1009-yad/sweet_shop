import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import sweetRoutes from "./routes/sweets.routes";
import inventoryRoutes from "./routes/inventory.routes";
import { errorHandler } from "./middleware/error.middleware";
import sweetsRoutes from "./routes/sweets";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/sweets", sweetsRoutes);

// global error handler
app.use(errorHandler);

export default app;
