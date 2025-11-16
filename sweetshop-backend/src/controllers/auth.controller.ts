// controllers/auth.controller.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; // if you store users in DB with hashed pw
import User from "../models/user.model"; // if you have a user model

const JWT_SECRET = process.env.JWT_SECRET || "change_this";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";

const signToken = (payload: object) => {
  // choose expiration as you like
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // avoid registering admin email via public register
  if (email === ADMIN_EMAIL) {
    return res.status(403).json({ message: "Cannot register admin email" });
  }

  // Example if you have User model (Mongo)
  try {
    // check existing user
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    // hash password and create user
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: "user" });

    // optionally sign token and return
    const token = signToken({ id: user._id, role: user.role, email: user.email, name: user.name });
    return res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Register failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // If login matches admin env, validate against ADMIN_PASSWORD and issue admin token
  if (email === ADMIN_EMAIL) {
    if (password === ADMIN_PASSWORD) {
      const payload = { id: "admin", role: "admin", email: ADMIN_EMAIL, name: "Administrator" };
      const token = signToken(payload);
      return res.json({ token, user: { id: payload.id, email: payload.email, role: payload.role, name: payload.name } });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  }

  // Otherwise normal user login (example with DB)
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ id: user._id, role: user.role ?? "user", email: user.email, name: user.name });
    return res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login failed" });
  }
};
