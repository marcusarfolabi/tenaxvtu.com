import api from "../axios";

export interface IdentityData {
  first_name: string;
  last_name: string;
  middle_name?: string;
  dob: string;
  mobile_phone: string;
  bvn?: string;
  nin?: string;
}

export const profileApi = {
  logout: () => api.post("/profile/logout"),

  update: (data: { name: string; lastname?: string; phone: string }) =>
    api.post("/profile/update", data),

  getProfile: () => api.get("/profile/me"),

  changePassword: (data: any) => api.post("/profile/change-password", data),

  verifyIdentity: (data: IdentityData) =>
    api.post("/profile/verify-identity", data),

  getNotifications: () => api.get("/profile/notifications"),

  getUsers: (params: { limit: number; page: number }) =>
    api.get("/user/all", { params }),

  updateStatus: (params: { user_id: number | string; status: string }) =>
    api.get(`/user/status`, { params }),

  getStats: (params: { from: string; to: string }) =>
    api.get("/user/sales-stats", { params }),

  deleteUser: (params: { user_id: number | string }) =>
    api.delete("/user/delete", { params }),
};
