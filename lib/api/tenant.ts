import api from "../axios";

export interface TenantInfo {
  airtime_commission?: string;
  data_commission?: string;
  cable_tv_commission?: string;
}

export const tenantApi = {
  updateTenant: (data: TenantInfo) => api.post("/tenant/update", data),
  
  getTenantInfo: () => api.get("/tenant/info"),
};
