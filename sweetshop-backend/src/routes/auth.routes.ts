import express from "express";
import { register, login } from "../controllers/auth.controller";
import { me } from "../controllers/me.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me); // protected - returns user from token
export default router;
