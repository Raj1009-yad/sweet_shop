// src/server.ts
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db"; // Option A: default export function
// NOTE: ensure these route files exist. If your routes live in different paths, update the imports.
import authRoutes from "./routes/auth.routes";
import sweetsRoutes from "./routes/sweets.routes";

const app = express();

// Async IIFE so we can await DB connection before starting routes/listener
(async () => {
  try {
    // Connect to MongoDB (connectDB should console.log success/failure)
    await connectDB();

    // Middleware
    app.use(helmet());
    app.use(
      cors({
        origin: (origin, callback) => {
          // basic allow all in dev; restrict in production
          callback(null, true);
        },
        credentials: true,
      })
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan("dev"));

    // Basic health route
    app.get("/api/health", (_req: Request, res: Response) => {
      return res.json({ ok: true, time: new Date().toISOString() });
    });

    // Mount API routes
    // Auth routes: /api/auth/register, /api/auth/login, (optionally /api/auth/me)
    app.use("/api/auth", authRoutes);

    // Sweets routes (list, create, search, purchase, restock, update, delete)
    app.use("/api/sweets", sweetsRoutes);

    // 404 handler
    app.use((req: Request, res: Response) => {
      res.status(404).json({ message: "Not Found" });
    });

    // Global error handler
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error("Unhandled error:", err);
      const status = err?.status || 500;
      const message = err?.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    // Start server
    const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
    app.listen(PORT, () => {
      // ConnectDB already prints connection status; this indicates server started
      // Use a small timeout to ensure DB connect logs appear first (optional)
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
