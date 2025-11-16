// src/api/sweets.ts
import client from "./client";

export type SearchParams = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
};

/** GET /sweets - list all sweets */
export const listSweets = () => client.get("/sweets");

/** GET /sweets/search */
export const searchSweets = (params: SearchParams = {}) => client.get("/sweets/search", { params });

/** GET /sweets/:id */
export const getSweet = (id: string) => client.get(`/sweets/${id}`);

/** POST /sweets (admin) */
export const createSweet = (data: any) => client.post("/sweets", data);

/** PUT /sweets/:id (admin) */
export const updateSweet = (id: string, data: any) => client.put(`/sweets/${id}`, data);

/** DELETE /sweets/:id (admin) */
export const deleteSweet = (id: string) => client.delete(`/sweets/${id}`);

/**
 * POST /sweets/:id/purchase
 * Body: { qty }
 * Returns updated sweet document (after decrement)
 */
export const purchaseSweet = (id: string, qty = 1) => client.post(`/sweets/${id}/purchase`, { qty });

/**
 * POST /sweets/:id/restock (admin)
 * Body: { qty }
 * Returns updated sweet document (after increment)
 */
export const restockSweet = (id: string, qty = 10) => client.post(`/sweets/${id}/restock`, { qty });
