import api from "../axios";

// 1. Types & Interfaces
export interface CableType {
  id: string;
  name: string; // e.g. "DSTV"
  description?: string;
}

export interface CablePackage {
  productsCode: string; // e.g. "COMPLE36"
  name: string;  // e.g. "DStv Compact Plus"
  price: number;        // e.g. 12500
}

export interface CableValidationPayload {
  type: string;        // e.g. "DSTV"
  smartCardNo: string;
}

export interface CablePurchasePayload extends CableValidationPayload {
  productsCode: string;
  packagename: string;
  amount: number;      // Required for wallet decrement on backend
}

// 2. API Object
export const cableApi = {
  /**
   * Fetch cable providers (DSTV, GOTV, Startimes, etc)
   * Route: GET /services/cable/types
   */
  getTypes: () => api.get("/services/cable/types"),

  /**
   * Fetch packages for a selected provider
   * Route: GET /services/cable/packages?type=DSTV
   */
  getPackages: (type: string) => 
    api.get("/services/cable/packages", { params: { type } }),

  /**
   * Validate Smart Card / Decoder Number
   * Route: POST /services/cable/validate
   */
  validateDecoder: (data: CableValidationPayload) => 
    api.post("/services/cable/validate", data),

  /**
   * Purchase cable subscription
   * Route: POST /services/cable/purchase
   */
  buy: (data: CablePurchasePayload) => 
    api.post("/services/cable/purchase", data),
};