import api from "../axios";

export const walletApi = {
  getBalance: () => api.get("/wallet/balance"),

  getAgentBalance: () => api.get("/wallet/honourworld/balance"),

  getHistory: (params: { page?: number; limit?: number; type?: string }) =>
    api.get("/wallet/transactions", { params }),

  transferCommission: (type: "commission") =>
    api.post("/wallet/transfer/commission", { type }),

  virtualAccount: () => api.get("/wallet/virtual-account"),

  cardPayment: () => api.post("/wallet/card-initiate"),

  manualFunding: (data: {
    amount: string;
    reference?: string;
    type: string;
    user_id: number;
  }) => api.post("/wallet/transfer/manual", data),
};
