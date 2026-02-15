import api from "../axios";

// 1. Types & Interfaces
export interface ElectricityCategory {
  id: string;
  name: string; // e.g. "Ikeja Electric"
  disco: string; // e.g. "IKEDC"
}

export interface MeterValidationPayload {
  disco: string;
  meterNo: string;
  type: "PREPAID" | "POSTPAID";
}

export interface ElectricityPurchasePayload extends MeterValidationPayload {
  phoneNumber: string;
  amount: number;
}

// 2. API Object
export const electricityApi = {
  /**
   * Fetch electricity providers/categories
   * Route: GET /services/electricity/types
   */
  getCategories: () => api.get("/services/electricity/types"),

  /**
   * Validate Meter Number before purchase
   * Route: POST /services/electricity/validate
   */
  validateMeter: (data: MeterValidationPayload) => 
    api.post("/services/electricity/validate", data),

  /**
   * Purchase electricity token
   * Route: POST /services/electricity/purchase
   */
  buy: (data: ElectricityPurchasePayload) => 
    api.post("/services/electricity/purchase", data),
};