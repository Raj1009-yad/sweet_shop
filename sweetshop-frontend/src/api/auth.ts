// src/api/auth.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const client = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

export const login = (payload: { email: string; password: string; admin?: boolean }) => {
  return client.post("/auth/login", payload);
};

export const register = (data: { name?: string; email: string; password: string }) => {
  return client.post("/auth/register", data);
};
