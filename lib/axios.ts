import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://vtuapi.vaspayment.us/api/v1",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;  
      
      let tenant = "";

      if (process.env.NEXT_PUBLIC_TENANT_DOMAIN) { 
        tenant = process.env.NEXT_PUBLIC_TENANT_DOMAIN;
      } else { 
        const parts = hostname.split('.');
        tenant = parts.length > 1 ? parts[0] : hostname;
      } 

      if (tenant !== "localhost" && tenant !== "www") {
        config.headers["X-Tenant-Domain"] = tenant;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("auth_token"); 
      localStorage.removeItem("user_data");  
      if (typeof window !== "undefined") {
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;