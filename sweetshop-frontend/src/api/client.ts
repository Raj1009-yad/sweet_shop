// src/api/client.ts
import axios from "axios";

// Vite: use import.meta.env
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const client = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// Automatically attach token from localStorage
client.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // ignore
  }
  return config;
});

export default client;
