// lib/api/data.ts
import api from "../axios";

export interface dataPayload {
  network: "MTN" | "GLO" | "AIRTEL" | "9MOBILE";
  planId: string;
  phone: string;
  amount: number; // Changed to number to match backend expectations
  plan_name: string;
}

export const dataApi = {
  getPlans: () => api.get("/services/data/plans"),

  buy: (data: dataPayload) => api.post("/services/data/buy", data),

  toggleStatus: (code: string) =>
    api.patch(`/services/data/plans/${code}/toggle`),

  updatePlan: (code: string, data: { reseller_price: string | number }) =>
    api.patch(`/services/data/plans/${code}`, data),
};
